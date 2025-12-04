import { ethers } from "hardhat";

async function main() {
  const TrustedAttestations = await ethers.getContractFactory(
    "TrustedAttestations"
  );
  const contract = await TrustedAttestations.deploy();

  await contract.waitForDeployment();

  console.log("TrustedAttestations deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


