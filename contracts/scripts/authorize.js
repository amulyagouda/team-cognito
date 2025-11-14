const hre = require("hardhat");

async function main() {
  const [issuer] = await hre.ethers.getSigners();
  
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const contract = await hre.ethers.getContractAt("DIDCertificate", contractAddress);

  const tx = await contract.authorizeIssuer(issuer.address, true);
  await tx.wait();

  console.log("AUTHORIZED:", issuer.address);
}

main();

