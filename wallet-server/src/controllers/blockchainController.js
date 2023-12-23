const { Expo } = require('expo-server-sdk');
const sqlFunction = require('../helpers/sqlFunction');

const expo = new Expo()
module.exports = class blockchainController {
    static blockNotify = async (req, res) => {
      const utxos = req.body.utxos;
      const stxos = req.body.stxos;
      const txs = req.body.block.transactions;
      
      let senderWallets = stxos.map((stxo) => stxo.address)

      let receiverUtxos = utxos.reduce((accumulator, utxo) => {
        const isSenderUtxo = senderWallets.find((address) => address === utxo.address)
        if (!isSenderUtxo) {
          accumulator.push(utxo)
        }
        return accumulator;
      }, [])
      
      console.log(utxos)

      const receiverAddress = receiverUtxos.map(utxo => utxo.address)
      
      if (receiverAddress.length > 0) {
        const joinedAddress = receiverAddress.join("','");
        try {
          const pushTokens = await sqlFunction.getWalletPushTokens(joinedAddress)
          let notifications = pushTokens.map(pushToken => (
            {
              to: pushToken,
              title: 'Aga Wallet',
              body: 'You received $20.00',
            }
          ))

          expo.sendPushNotificationsAsync(notifications)

          return res.status(200).json({
            message: "Ok"
          })
        } catch (error) {
          return res.status(200).json({
            message: "Internal server error"
          })
        }
      }

      res.status(200).json({
        message: "Ok"
      })
    }
}
