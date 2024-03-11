import { ethers } from 'ethers'

const randomMnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16))
console.log('randomMnemonic', randomMnemonic)