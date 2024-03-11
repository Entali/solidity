import { HDNodeWallet } from 'ethers'

// Generating seed phrase
const mnemonic = HDNodeWallet.createRandom().mnemonic.phrase
console.log('mnemonic::: ', mnemonic)


// Creating wallet
const wallet = HDNodeWallet.fromPhrase(mnemonic)
console.log('wallet.privateKey::: ', wallet.privateKey)
console.log('wallet.address::: ', wallet.address)


async function sign () {
  const withNameAndDate = "Nata Entali " + new Date()
  const signature = await wallet.signMessage(withNameAndDate)
  console.log('signature::: ', signature)
}

void sign()

// public address::: 0x61E2060204CEc3f605b27F27F7E430E2399f14Bd
// signature:::  0xc2cf6dc65b9620515c60bb89e01f0df86ab053464ff28dd1ed579e2ff09fac5e0b23edf11eceae9d40c4d76ef64843d1bada485593dc750cc554c964f0b1c1021b

