async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const DIDCertificate = await ethers.getContractFactory("DIDCertificate");
  const contract = await DIDCertificate.deploy();

  console.log("DIDCertificate deployed to:", contract.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
