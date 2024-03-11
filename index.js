import { ethers } from 'ethers'

// Генеруємо seed-фразу
const mnemonic12 = ethers.Wallet.createRandom().mnemonic.phrase
console.log('mnemonic12', mnemonic12)

const mnemonic24 = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(32))
console.log('mnemonic24', mnemonic24)

