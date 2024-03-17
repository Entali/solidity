const hre = require('hardhat');

async function main() {
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy()

  await simpleStorage.waitForDeployment();

  console.log(`SimpleStorage deployed to ${simpleStorage.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Contract address::: 0x0a117D67AD46D1CC173D416148Aa396e87D44fA9
