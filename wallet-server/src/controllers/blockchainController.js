const { Expo } = require('expo-server-sdk')
const sqlFunction = require('../helpers/sqlFunction')

const expo = new Expo()
module.exports = class blockchainController {
    static blockNotify = async (req, res) => {
        const utxos = req.body.utxos
        const stxos = req.body.stxos
        const txs = req.body.block.transactions

        let senderWallets = stxos.map((stxo) => stxo.address)

        let receiverUtxos = utxos.reduce((accumulator, utxo) => {
            const isSenderUtxo = senderWallets.find(
                (address) => address === utxo.address
            )
            if (!isSenderUtxo) {
                accumulator.push(utxo)
            }
            return accumulator
        }, [])

        const receiverAddress = receiverUtxos.map((utxo) => utxo.address)

        if (receiverAddress.length > 0) {
           
            try {
                const joinedAddress = receiverAddress.join("','")
                // const pushTokens =
                //     await sqlFunction.getWalletPushTokens(joinedAddress)
                //     let notifications = pushTokens.map(pushToken => (
                //       {
                //         to: pushToken.push_token,
                //         title: 'Aga Wallet',
                //         body: 'You received $20.00',
                //       }
                //     ))
                //     expo.sendPushNotificationsAsync(notifications)
                return res.status(200).json({
                    message: 'Ok',
                })
            } catch (error) {
                console.log(error)
                return res.status(200).json({
                    message: 'Internal server error',
                })
            }
        }

        res.status(200).json({
            message: 'Ok',
        })
    }
}
