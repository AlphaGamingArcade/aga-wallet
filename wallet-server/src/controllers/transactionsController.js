const globalFunction = require('../helpers/globalFunction')
const { sendTransactionSchema } = require('../helpers/schema')
const blockchainFunction = require('../helpers/blockchainFunction')
const sqlFunction = require('../helpers/sqlFunction')
const axios = require('axios')

module.exports = class TransactionController {
    static sendTransaction = async (req, res) => {
        const { error } = sendTransactionSchema.validate(req.body)

        if (error) {
            return res.status(400).json({ message: 'Invalid transaction' })
        }

        const {
            sender_address: senderAddress,
            receiver_address: receiverAddress,
            amount,
        } = req.body
        
        try {
            const isSenderAddressExists =
                await sqlFunction.isWalletAddressExists(senderAddress)
            if (!isSenderAddressExists) {
                return res
                    .status(400)
                    .json({ message: 'Sender address does not exists' })
            }

            const isReceiverAddressExists =
                await sqlFunction.isWalletAddressExists(receiverAddress)
            if (!isReceiverAddressExists) {
                return res
                    .status(400)
                    .json({ message: 'Receiver address does not exists' })
            }

            if (!isSenderAddressExists) {
                return res
                    .status(400)
                    .json({ message: 'Sender address does not exists' })
            }

            const isAmountValid = globalFunction.isAmountValid(amount)
            if (!isAmountValid) {
                return res
                    .status(400)
                    .json({ message: 'Invalid transaction amount' })
            }

            const sender_utxos =
                await blockchainFunction.getWalletUnspentTxOuts(senderAddress)
            const balance = sender_utxos
                .filter((utxo) => utxo.status === 'unspent')
                .reduce((balance, currenValue) => {
                    return balance + currenValue.amount
                }, 0)

            if (balance <= amount) {
                return res.status(400).json({ message: 'Not enough balance' })
            }

            let senderWallet = await sqlFunction.getWalletKeys(senderAddress)
            let receiverWallet =
                await sqlFunction.getWalletKeys(receiverAddress)

            const signedTxPayload = globalFunction.signTransaction(
                senderWallet,
                receiverWallet,
                amount
            )

            await blockchainFunction.sendTransaction(signedTxPayload)
            return res.status(200).json({
                message:
                    'Your transaction is awaiting inclusion in the next block.',
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
}
