const { ethers } = require("hardhat");

async function main() {
  const Registry = await ethers.getContractFactory("DIDRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log("DID Registry deployed to:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
