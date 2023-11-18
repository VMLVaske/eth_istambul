// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "./TransactionGuard.sol";

contract GuardFactory {
    mapping(address => address) private guards;

    function createGuard(
        address safeAddress
    ) public {
        RestrictedTransactionGuard guard = new RestrictedTransactionGuard();
        guards[safeAddress] = address(guard);
    }

    function getGuard(address safeAddress) public view returns (address) {
        return guards[safeAddress];
    }
}