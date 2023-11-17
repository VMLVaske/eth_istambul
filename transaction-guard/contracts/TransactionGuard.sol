// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "@gnosis.pm/safe-contracts/contracts/base/GuardManager.sol";
import "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";
import "@gnosis.pm/safe-contracts/contracts/common/SignatureDecoder.sol";
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@gnosis.pm/safe-contracts/contracts/interfaces/IERC165.sol";
import "@gnosis.pm/safe-contracts/contracts/interfaces/ISignatureValidator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseGuard
 * @notice The BaseGuard implements support for ERC165, since gnosis safe v1.3.0 doesn't implement it.
 *         At time of writing this contract, it is implemented in their repo, but not released with v1.3.0
 */
abstract contract BaseGuard is Guard {
    function supportsInterface(bytes4 interfaceId) external view virtual returns (bool) {
        return
            interfaceId == type(Guard).interfaceId || // 0xe6d7a83a
            interfaceId == type(IERC165).interfaceId; // 0x01ffc9a7
    }
}

/**
 * @title Restricted Transaction Guard
 * @author Jörg Kiesewetter
 * @notice This contract is a transaction guard for gnosis save ^1.3.0
 *         It allows the safe to exclude particular owners from signing a transaction
 */
contract RestrictedTransactionGuard is BaseGuard, ISignatureValidatorConstants, SignatureDecoder, Ownable {

    /**
     * this struct represents a user role group for the transaction guard.
     * It is used to group users and contracts together to allow them to execute transactions.
     * The name is just for better readability.
     * The users array contains all the users which are allowed to execute transactions.
     * The whitelistedContracts array contains all the contracts which are allowed to get signed by the users.
     */
    struct UserRoleGroup {
        string name;
        bool enabled;
        address[] users;
        address[] whitelistedContracts;
    }

    /**
     * @dev Emit an event whenever the configuration for a user group was set or changed.
     *
     * @param id            The id of the user group that has changed
     * @param group         the group that was set
     */
    event UserRoleGroupSet(uint256 indexed id, UserRoleGroup group);

    /**
     * @dev Emit an event whenever a user group was deleted.
     * @param id            The id of the user group that was deleted
     */
    event UserRoleGroupDeleted(uint256 indexed id);

    /**
     * @dev stores the setted restrictions for all user groups
     */
    mapping(uint256 => UserRoleGroup) public userGroups;
    uint256 public numUserRoleGroups = 0;
    
    /**
     * @dev taken from a guard example from the gnosis repo.
     *      To prevent a revert on fallback, we define it empty. This will avoid issues in case of a Safe upgrade
     *      E.g. the expected check method might change and theen the Safe would be locked.
     */
    // solhint-disable-next-line payable-fallback
    fallback() external {}

    function createRoleGroup(
        string memory name,
        address[] memory users,
        address[] memory whitelistedContracts
    ) external onlyOwner {
        userGroups[numUserRoleGroups] = UserRoleGroup(name, true, users, whitelistedContracts);
        emit UserRoleGroupSet(numUserRoleGroups, userGroups[numUserRoleGroups]);
        numUserRoleGroups += 1;
    }

    function updateRoleGroup(
        uint256 id,
        string memory name,
        address[] memory users,
        address[] memory whitelistedContracts
    ) external onlyOwner {
        require(id < numUserRoleGroups, "id is out of bounds");

        userGroups[id] = UserRoleGroup(name, true, users, whitelistedContracts);
        emit UserRoleGroupSet(id, userGroups[id]);
    }

    function deleteRoleGroup(uint256 id) external onlyOwner {
        require(id < numUserRoleGroups, "id is out of bounds");

        userGroups[id].enabled = false;
        emit UserRoleGroupDeleted(id);
    }

    // Used to avoid stack too deep error
    struct CheckData {
        uint256 numOwner;
        uint256 requiredSignatures;
        uint256 validSignatures;
        uint256 restrictedSignatures;
        address targetContract;
    }

    /**
     * @dev This function is an implementation of the Guard interface from the @gnosis.pm package.
     *      It calculates the public keys from the signatures and checks if they are restricted. When we remove the
     *      restricted signers and don't meet the safe threshold, the transaction gets reverted. This function is
     *      getting called by the Safe.
     *
     *      The whole part of extracting the signature is directly copied from GnosisSafe.sol (see comments in the code).
     *
     * @param to                 the contract which is getting called by the transaction
     * @param value              the value field of the transaction
     * @param data               the data field of the transaction
     * @param operation          transaction type: DIRECT_CALL or DELEGATE
     * @param safeTxGas          used by the safe
     * @param baseGas            used by the safe
     * @param gasPrice           used by the safe
     * @param gasToken           used by the safe
     * @param refundReceiver     used by the safe
     * @param signatures         the signatures from all the signers
     */
    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address
    ) external view override {
        /*
         * This part is directly copied from: https://github.com/safe-global/safe-contracts/blob/186a21a74b327f17fc41217a927dea7064f74604/contracts/GnosisSafe.sol#L125
         *
         * We need to calculate the transaction hash to restore the public keys from the signers
         */
        GnosisSafe safe = GnosisSafe(payable(msg.sender));

        CheckData memory checkData;
        checkData.numOwner = safe.getOwners().length;
        checkData.requiredSignatures = safe.getThreshold();
        checkData.validSignatures = 0;
        checkData.restrictedSignatures = 0;
        checkData.targetContract = to;

        /*
         * This part is copied from: https://github.com/safe-global/safe-contracts/blob/186a21a74b327f17fc41217a927dea7064f74604/contracts/GnosisSafe.sol#L247
         * We removed the additional signature check, because this is already done by the Safe itself.
         *
         * Based on the given signatures, we restore the public keys and match them against our restrictedSigners mapping
         */
        {
            bytes memory txHashData = safe.encodeTransactionData(
                // Transaction info
                to,
                value,
                data,
                operation,
                safeTxGas,
                // Payment info
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                // Signature info
                safe.nonce() - 1
            );
            bytes32 txHash = keccak256(txHashData);
            address currentOwner;
            uint8 v;
            bytes32 r;
            bytes32 s;
            for (uint256 i = 0; i < checkData.numOwner; i++) {
                (v, r, s) = signatureSplit(signatures, i);

                /*
                 * Modification of the original code.
                 * The original code can just check as much signatures as the threshold is. Unfortunately, we cannot do
                 * this, since some signatures might not be valid. So we need to find a way to abort the signature
                 * check. When there is no signature left to check, the value of r is just 0. This means this can be
                 * our abort condition to leave the for loop.
                 */
                if (uint256(r) == 0) {
                    break;
                }

                if (v == 0) {
                    // If v is 0 then it is a contract signature
                    // When handling contract signatures the address of the contract is encoded into r
                    currentOwner = address(uint160(uint256(r)));

                } else if (v == 1) {
                    // If v is 1 then it is an approved hash
                    // When handling approved hashes the address of the approver is encoded into r
                    currentOwner = address(uint160(uint256(r)));
                } else if (v > 30) {
                    // If v > 30 then default va (27,28) has been adjusted for eth_sign flow
                    // To support eth_sign and similar we adjust v and hash the messageHash with the Ethereum message prefix before applying ecrecover
                    currentOwner = ecrecover(
                        keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", txHash)),
                        v - 4,
                        r,
                        s
                    );
                } else {
                    // Default is the ecrecover flow with the provided data hash
                    // Use ecrecover with the messageHash for EOA signatures
                    currentOwner = ecrecover(txHash, v, r, s);
                }

                bool allowedToExecute = false;
                bool ownerFound = false;
                for (uint256 j = 0; j < numUserRoleGroups; j++) {

                    // when the user group is already deleted, skip iteration
                    if (!userGroups[j].enabled) {
                        continue;
                    }

                    bool ownerInGroup = false;
                    for (uint256 k = 0; k < userGroups[j].users.length; k++) {
                        if (userGroups[j].users[k] == currentOwner) {
                            ownerInGroup = true;
                            break;
                        }
                    }

                    // if the owner is in this group, check if the called contract is whitelisted
                    if (ownerInGroup) {

                        ownerFound = true;

                        for (uint256 l = 0; l < userGroups[j].whitelistedContracts.length; l++) {
                            if (userGroups[j].whitelistedContracts[l] == checkData.targetContract) {
                                allowedToExecute = true;
                                break;
                            }
                        }
                    }
                    
                }

                // if the owner is not in any group, this means there are no restrictions for this owner
                if (!ownerFound) {
                    allowedToExecute = true;
                }

                if (allowedToExecute) {
                    checkData.validSignatures += 1;
                } else {
                    checkData.restrictedSignatures += 1;
                }

                // we can do this check in each iteration, to speed up exection in case we have much more signatures
                // then the threshold is and we never terminate the loop early.
                if (checkData.validSignatures >= checkData.requiredSignatures) {
                    return;
                }
            }
        }

        require (checkData.validSignatures >= checkData.requiredSignatures, "not enough valid signatures");
    }

    struct Set {
        address[] values;
        mapping (address => bool) contains;
    }

    Set private restrictedSigners;

    /**
     * @dev This function is also part of the Gnosis Guard Interface. It is getting called after the transaction
     *      was executed to add additional checks.
     */
    function checkAfterExecution(bytes32, bool) external override {
        /*
         * Deadlock prevention:
         * When the transaction changes the configuration, like modifying the threshold, removing an owner or
         * something like this. This could lead to a situation in that we cannot sign transactions anymore because
         * too much of them are restricted. This check should prevent this.
         *
         * I.e.  we have a 3/6 multisig with 3 restricted owners.
         * When we remove one unrestricted owner, we would have threshold of 3, and only 2 owner left who could sign.
         */
        GnosisSafe safe = GnosisSafe(payable(msg.sender));

        address[] memory owner = safe.getOwners();
        uint256 requiredSignatures = safe.getThreshold();

        for (uint256 j = 0; j < numUserRoleGroups; j++) {

            if (!userGroups[j].enabled) {
                continue;
            }

            for (uint256 k = 0; k < userGroups[j].users.length; k++) {

                if (!restrictedSigners.contains[userGroups[j].users[k]]) {
                    restrictedSigners.values.push(userGroups[j].users[k]);
                    restrictedSigners.contains[userGroups[j].users[k]] = true;
                }
            }
        }

        require(
            restrictedSigners.values.length <= (owner.length - requiredSignatures),
            "too much restricted owner, preventing potential deadlock"
        );
    }
}
