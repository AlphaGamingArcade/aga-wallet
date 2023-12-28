const { Expo } = require('expo-server-sdk')
const sqlFunction = require('../helpers/sqlFunction')

const expo = new Expo()
module.exports = class blockchainController {
    static blockNotify = async (req, res) => {
        this.proccessNotifications(req)
        res.status(200).json({
            message: 'Ok',
        })
    }

    static proccessNotifications = async (req) => {
        const utxos = req.body.utxos
        const stxos = req.body.stxos
        const txs = req.body.block.transactions

        const txsMap = new Map()

        for (let tx of txs) {
            if (!txsMap.get(tx.tx_id)) {
                txsMap.set(tx.tx_id, tx)
            }
        }

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

        const receiverAddressList = receiverUtxos.flatMap(
            (utxo) => utxo.address
        )

        try {
            const wallets =
                await sqlFunction.getWalletByAddress(receiverAddressList)
            const walletMap = new Map()

            for (let wallet of wallets) {
                if (!walletMap.get(wallet.wallet_address)) {
                    delete wallet.private_key
                    delete wallet.public_key
                    walletMap.set(wallet.wallet_address, wallet)
                }
            }

            for (let utxo of receiverUtxos) {
                if (walletMap.get(utxo.address)) {
                    const wallet = walletMap.get(utxo.address)
                    walletMap.set(wallet.wallet_address, { ...wallet, ...utxo })
                }
            }

            const notifications = Array.from(walletMap.values()).flatMap(
                (data) => {
                    const firstTxIn = txsMap.get(data.tx_id).tx_ins[0]
                    const txInTxOutId = firstTxIn.tx_out_id
                    const txInTxOutIndex = firstTxIn.tx_out_index

                    let stxo = stxos.find(
                        (stxo) =>
                            stxo.tx_out_id === txInTxOutId &&
                            stxo.tx_out_index === txInTxOutIndex
                    )
                    const receiverAddr = data.address

                    return {
                        userId: data.user_id,
                        type: 'RECEIVED_ASSETS',
                        title: 'Received Asset',
                        description: `Your wallet ${
                            receiverAddr ? receiverAddr : ''
                        } received ${data.amount} of AGA Coin from ${
                            stxo ? stxo.address : ''
                        }`,
                    }
                }
            )

            const notificationResult =
                await sqlFunction.insertBulkNotifications(notifications)
            const userIdList = notificationResult.map((user) => user.user_id)
            //Make sure the the payload is an array of user id.
            const usersPushTokens = await sqlFunction.getPushTokens(userIdList)

            let pushNotifications = []
            for (let notification of notificationResult) {
                const userPushToken = usersPushTokens.find(
                    (userPushToken) =>
                        userPushToken.user_id === notification.user_id
                )
                const intialPushNotification = {
                    ...userPushToken,
                    ...notification,
                }
                pushNotifications.push({
                    to: intialPushNotification.token,
                    title: intialPushNotification.title,
                    body: intialPushNotification.description,
                })
            }
            
            try {
                expo.sendPushNotificationsAsync(pushNotifications ?? [])
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }
}
