import { ethers } from "hardhat";

async function main() {
  const guardFactory = await ethers.deployContract("GuardFactory", [], {});

  await guardFactory.waitForDeployment();

  console.log(`guardFactory deployed to ${guardFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
