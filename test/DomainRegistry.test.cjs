const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("DomainRegistry", function () {
  let DomainRegistry;
  let domainRegistry;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    DomainRegistry = await ethers.getContractFactory("DomainRegistry");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    domainRegistry = await DomainRegistry.deploy(ethers.parseEther("0.01"));
    await domainRegistry.deploymentTransaction().wait()
  });

  describe("Domain Validation", function () {
    it("Should reject registering a domain with invalid format", async () => {
      await expect(domainRegistry.connect(addr1).registerDomain(
          "invalid.com",
          { value: ethers.parseEther("0.01") }
      )).to.be.revertedWith("Invalid domain format.");
    });
  });

  describe("Registration", function () {
    it("Should register a domain and emit an event", async () => {
      const registerTx = await domainRegistry.connect(addr1).registerDomain(
          "example",
          { value: ethers.parseEther("0.01") }
      );

      await registerTx.wait();

      const txReceipt = await ethers.provider.getTransactionReceipt(registerTx.hash);
      const block = await ethers.provider.getBlock(txReceipt.blockNumber);
      const timestamp = block.timestamp;

      await expect(registerTx).to.emit(domainRegistry, "DomainRegistered").withArgs(
          "example",
          addr1.address,
          timestamp
      );
    });

    it("Should fail for insufficient funds", async () => {
      await expect(domainRegistry.connect(addr1).registerDomain(
        "fail",
        { value: ethers.parseEther("0.001")
      })).to.be.revertedWith("Insufficient funds for registration.");
    });

    it("Should not allow registering an already registered domain", async () => {
      await domainRegistry.connect(addr1).registerDomain(
        "taken",
        { value: ethers.parseEther("0.01")
      });
      await expect(domainRegistry.connect(addr2).registerDomain(
        "taken",
        { value: ethers.parseEther("0.01")
      })).to.be.revertedWith("Domain is already registered.");
    });
  });

  describe("Fee Management", function () {
    it("Should allow the owner to update the registration fee", async () => {
      const newFee = ethers.parseEther("0.02");
      await expect(domainRegistry.updateRegistrationFee(newFee))
        .to.emit(domainRegistry, "RegistrationFeeUpdated").withArgs(newFee);
    });

    it("Should prevent non-owners from updating the registration fee", async () => {
      const newFee = ethers.parseEther("0.02");
      await expect(domainRegistry.connect(addr1).updateRegistrationFee(newFee))
        .to.be.reverted;
    });
  });

  describe("Domain Ownership", function () {
    it("Should correctly return the domains owned by an address", async () => {
      await domainRegistry.connect(addr1).registerDomain(
        "example",
        { value: ethers.parseEther("0.01")
      });
      await domainRegistry.connect(addr1).registerDomain(
        "example2",
        { value: ethers.parseEther("0.01")
      });

      const ownedDomains = await domainRegistry.getDomainsByOwner(addr1.address);
      expect(ownedDomains).to.include("example");
      expect(ownedDomains).to.include("example2");
    });
  });
})
