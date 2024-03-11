import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);
