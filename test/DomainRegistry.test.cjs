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

  describe("Registration", function () {
    it("Should register a domain and emit an event", async function () {
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

    it("Should fail for insufficient funds", async function () {
      await expect(domainRegistry.connect(addr1).registerDomain(
        "fail",
        { value: ethers.parseEther("0.001")
      })).to.be.revertedWith("Insufficient funds for registration.");
    });

    it("Should not allow registering an already registered domain", async function () {
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
})
