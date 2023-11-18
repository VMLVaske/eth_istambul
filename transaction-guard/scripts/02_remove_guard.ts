import { ethers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";

require("dotenv").config();

async function main() {
  const safeAddress = ethers.utils.getAddress(
    "0xE19541611E9B73Fed62ac70179F37b6b8c4adE37"
  );

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

  const provider = ethers.getDefaultProvider(process.env.SEPOLIA_NODE_URL);
  const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

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
    safeAddress,
  });

  const abi = ["function setGuard(address)"];
  const contractInterface = new ethers.utils.Interface(abi);
  const data = contractInterface.encodeFunctionData("setGuard", [
    "0x0000000000000000000000000000000000000000",
  ]);

  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData: {
      to: safeAddress,
      data,
      value: "0",
    },
  });

  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: ethers.utils.getAddress(process.env.DEPLOYER_PUBLIC_KEY!),
    senderSignature: senderSignature.data,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
