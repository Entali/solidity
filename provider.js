require('dotenv').config();
const ethers = require('ethers');

const endpoint = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;

// const provider = new ethers.getDefaultProvider(5) // 5 is goerli
const provider = new ethers.JsonRpcProvider(endpoint);

async function main() {
  const blockNumber = await provider.getBlockNumber();
  console.log('Current block number::: ', blockNumber);

  const network = await provider.getNetwork();
  console.log('Network::: ', network.toJSON());

  const balance = await provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  console.log('Balance::: ', ethers.formatEther(balance));
}

main().catch(console.error);


