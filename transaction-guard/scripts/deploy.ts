import { ethers } from "hardhat";

async function main() {
  const GuardFactory = await ethers.getContractFactory("GuardFactory");
  const guardFactory = await GuardFactory.deploy();
  await guardFactory.deployed();
  // const guardFactory = await ethers.deployContract("GuardFactory", [], {});

  // await guardFactory.waitForDeployment();

  console.log(`guardFactory deployed to ${guardFactory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
