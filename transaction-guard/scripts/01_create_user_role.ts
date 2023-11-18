import { ethers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import * as transactionGuardArtifact from "../artifacts/contracts/TransactionGuard.sol/RestrictedTransactionGuard.json";
import constants from "./constants";

require("dotenv").config();

async function main() {
  const provider = ethers.getDefaultProvider(process.env.SEPOLIA_NODE_URL);
  const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  const gnosisServiceUrl = (() => {
    switch (process.env.NETWORK) {
      case "goerli":
        return "https://safe-transaction-goerli.safe.global/";
      case "mainnet":
        return "https://safe-transaction-mainnet.safe.global/";
      case "sepolia":
        return "https://safe-transaction-sepolia.safe.global/";
      default:
        return "";
    }
  })();

  if (gnosisServiceUrl === "") {
    console.log("Gnosis service url not found, probably wrong network in .env");
    return;
  }
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });
  const safeService = new SafeApiKit({
    txServiceUrl: gnosisServiceUrl,
    ethAdapter,
  });

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: constants.SAFE_ADDRESS,
  });

  console.log("sdks initialized");
  const transactionGuard = new ethers.Contract(
    constants.GUARD_ADDRESS,
    transactionGuardArtifact.abi,
    provider
  );

  console.log("transaction guard initialized");

  const data = transactionGuard.interface.encodeFunctionData(
    "createRoleGroup",
    [
      "dex users",
      ["0xd8e38cfe245210836AC43c3A8BBc147bd2Ea69d5"],
      [["uniswap ETH/wETH", "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"]],
    ]
  );

  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData: {
      to: constants.GUARD_ADDRESS,
      data,
      value: "0",
      // nonce: 5,
    },
  });

  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

  console.log("transaction prepared");
  await safeService.proposeTransaction({
    safeAddress: constants.SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: ethers.utils.getAddress(process.env.DEPLOYER_PUBLIC_KEY!!),
    senderSignature: senderSignature.data,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
