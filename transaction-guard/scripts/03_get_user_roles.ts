import { ethers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import * as transactionGuardArtifact from "../artifacts/contracts/TransactionGuard.sol/RestrictedTransactionGuard.json";
import constants from "./constants";

require("dotenv").config();

async function main() {
  const provider = ethers.getDefaultProvider(process.env.SEPOLIA_NODE_URL);
  const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  const transactionGuard = new ethers.Contract(
    constants.GUARD_ADDRESS,
    transactionGuardArtifact.abi,
    provider
  );

  // const userRoles = await transactionGuard.numUserRoleGroups();
  const userRoles = await transactionGuard.getRoleGroups();
  console.log("user roles", userRoles);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
