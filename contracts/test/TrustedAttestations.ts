import { expect } from "chai";
import { ethers } from "hardhat";

describe("TrustedAttestations", () => {
  it("registers an attestation as owner", async () => {
    const [, entity] = await ethers.getSigners();
    const TrustedAttestations = await ethers.getContractFactory(
      "TrustedAttestations"
    );
    const contract = await TrustedAttestations.deploy();
    await contract.waitForDeployment();

    const domain = "example.com";
    const orgName = "Example Org";
    const signature = ethers.toUtf8Bytes("dummy-signature");

    await contract.registerTrustedEntity(
      entity.address,
      signature,
      orgName,
      domain
    );

    const has = await contract.hasAttestation(domain);
    expect(has).to.equal(true);
  });
});



