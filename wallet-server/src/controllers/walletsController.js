const sqlFunction = require('../helpers/sqlFunction')
const globalFunction = require('../helpers/globalFunction')
const blockchainFunction = require('../helpers/blockchainFunction')
const { createWalletSchema } = require('../helpers/schema')

module.exports = class WalletController {
    static createWallet = async (req, res) => {
        const { error } = createWalletSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: 'Invalid payload' })
        }

        const { user_id: userId } = req.body

        try {
            const isUserIdExists = await sqlFunction.isUserIdExists(userId)
            if (!isUserIdExists) {
                return res.status(400).json({ message: 'User does not exist' })
            }

            const { privateKeyHex, publicKeyHex } =
                globalFunction.generateKeyPairSync()
            const walletAddress =
                globalFunction.generateWalletAddress(publicKeyHex)

            const createWalletParams = {
                tablename: 'wallets',
                column: 'user_id, public_key, private_key, wallet_address',
                values: `'${userId}', '${publicKeyHex}', '${privateKeyHex}', '${walletAddress}'`,
            }

            const sqlCreateWallet =
                await sqlFunction.createWallet(createWalletParams)
            const { data } = sqlCreateWallet

            res.status(200).json({
                ...data,
            })
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    static getWallet = async (req, res) => {
        const { walletAddress } = req.params

        try {
            const isWalletAddressExists =
                await sqlFunction.isWalletAddressExists(walletAddress)
            if (!isWalletAddressExists) {
                return res
                    .status(404)
                    .json({ message: 'This wallet does not exists' })
            }

            const walletUtxos =
                await blockchainFunction.getWalletUnspentTxOuts(walletAddress)

            const balance = walletUtxos
                .filter((utxo) => utxo.status === 'unspent')
                .reduce((balance, currenValue) => {
                    return balance + currenValue.amount
                }, 0)

            res.status(200).json({
                wallet_address: walletAddress,
                balance: balance,
            })
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    static getWalletExists = async (req, res) => {
        const { walletAddress } = req.params

        try {
            const isWalletExists =
                await sqlFunction.isWalletAddressExists(walletAddress)
            res.status(200).json({ exists: isWalletExists })
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}
