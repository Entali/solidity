require('dotenv').config()
const { HDNodeWallet } = require('ethers')

// Generating seed phrase
const mnemonic = process.env.MNEMONIC || HDNodeWallet.createRandom().mnemonic.phrase
console.log('mnemonic::: ', mnemonic)

// Creating wallet
const wallet = HDNodeWallet.fromPhrase(mnemonic)
console.log('wallet.privateKey::: ', wallet.privateKey)
console.log('wallet.address::: ', wallet.address)


async function sign () {
  const withNameAndDate = "Nata Entali, 13 March 2024"
  const signature = await wallet.signMessage(withNameAndDate)
  console.log('signature::: ', signature)
}

void sign()





