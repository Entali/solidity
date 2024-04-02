const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SimpleStorage', function () {
  let SimpleStorage, simpleStorage, owner, addr1;

  beforeEach(async () => {
    SimpleStorage = await ethers.getContractFactory('SimpleStorage');
    [owner, addr1] = await ethers.getSigners();
    simpleStorage = await SimpleStorage.deploy();
  });

  it('Should set the right value', async function () {
    await simpleStorage.connect(owner).set(50);
    expect(await simpleStorage.get()).to.equal(50);
  });

  it('Should return the correct value after changing it', async function () {
    await simpleStorage.connect(owner).set(100);
    expect(await simpleStorage.get()).to.equal(100);
    await simpleStorage.connect(owner).set(200);
    expect(await simpleStorage.get()).to.equal(200);
  });
});
