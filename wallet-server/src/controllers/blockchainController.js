const { Expo } = require('expo-server-sdk')
const sqlFunction = require('../helpers/sqlFunction')

const expo = new Expo()
module.exports = class blockchainController {
    static blockNotify = async (req, res) => {
        const utxos = req.body.utxos
        const stxos = req.body.stxos
        const txs = req.body.block.transactions

        const txsMap = new Map();

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

        const receiverAddressList = receiverUtxos.flatMap((utxo) => utxo.address)
        
        try {
            const wallets = await sqlFunction.getWalletByAddress(receiverAddressList);
            const walletMap = new Map();

            for (let wallet of wallets) {
                if (!walletMap.get(wallet.wallet_address)) {
                    delete wallet.private_key;
                    delete wallet.public_key;
                    walletMap.set(wallet.wallet_address, wallet)
                }
            }

            for (let utxo of receiverUtxos) {
                if (walletMap.get(utxo.address)) {
                    const wallet = walletMap.get(utxo.address);
                    walletMap.set(wallet.wallet_address, {...wallet, ...utxo})
                }
            }

            const notifications = Array.from(walletMap.values()).flatMap((data) => {
            
                console.log("TX ID", txsMap.get(data.tx_id))

                return {
                    userId: data.user_id,
                    type: "RECEIVED_ASSETS",
                    title: "Received asset",
                    description: `You received ${data.amount} of AGA Coin from ${"Heheheheheh"}`,
                    // data: data,
                    txHash: data.tx_id
                }
            })

        } catch (error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }

        res.status(200).json({
            message: 'Ok',
        })
    }
}
