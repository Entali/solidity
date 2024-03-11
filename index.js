import { HDNodeWallet } from 'ethers'

// Generating seed pharse
const mnemonic = HDNodeWallet.createRandom().mnemonic.phrase
console.log('mnemonic::: ', mnemonic)


// Creating wallet
const wallet = HDNodeWallet.fromPhrase(mnemonic)
console.log('wallet.privateKey::: ', wallet.privateKey)
console.log('wallet.address::: ', wallet.address)


async function sign () {
  const withNameAndDate = "Nata Entali " + new Date()
  const signature = await wallet.signMessage(withNameAndDate)
  console.log('Signature::: ', signature)
}

void sign()
