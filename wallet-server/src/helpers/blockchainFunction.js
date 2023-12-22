const axios = require('axios')

module.exports = class {
    static getWalletUnspentTxOuts = async (walletAddress) => {
        try {
            const res = await axios.get(
                `${process.env.BLOCKCHAIN_URL}/utxos/${walletAddress}`
            )
            return res.data
        } catch (error) {
            const message =
                error?.response?.data?.message ?? 'Failed retrieving utxos'
            throw new Error(message)
        }
    }
    static getWalletUnconfirmedtxos = async (walletAddress) => {}
    static sendTransaction = async (payload) => {
        try {
            const res = await axios.post(
                `${process.env.BLOCKCHAIN_URL}/transactions/send`,
                payload
            )

            return res.data
        } catch (error) {
            const message =
                error?.response?.data?.message ?? 'Failed creating transaction'
            throw new Error(message)
        }
    }
    static getKeypair = async () => {
        try {
            const res = await axios.get(`${process.env.BLOCKCHAIN_URL}/keypair`)
            return {
                privateKey: res.data.private_key,
                publicKey: res.data.public_key,
            }
        } catch (error) {
            const message =
                error?.response?.data?.message ?? 'Failed retrieving utxos'
            throw new Error(message)
        }
    }
}
