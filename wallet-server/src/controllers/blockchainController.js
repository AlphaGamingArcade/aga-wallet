const { Expo } = require('expo-server-sdk')

const expo = new Expo()
module.exports = class blockchainController {
    static blockNotify = async (req, res) => {
      const utxos = req.body.utxos;
      const stxos = req.body.stxos;
      const txs = req.body.block.transactions;
      
      let senderWallets = stxos.map((stxo) => stxo.address)
      console.log(senderWallets)

      res.status(200).json({
        message: "Ok"
      })
    }
}
