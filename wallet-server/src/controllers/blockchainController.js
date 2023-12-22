const { Expo } = require('expo-server-sdk')

const expo = new Expo()
module.exports = class blockchainController {
    static blockNotify = async (req, res) => {
      const transactions = req.body.transactions
      
      transactions.forEach(tx => {
        console.log(tx.tx_ins)
      })

      res.status(200).json({
        message: "Ok"
      })
    }
}
