const bs58 = require('bs58')
const crypto = require('node:crypto')
const axios = require('axios')
const secp256k1 = require('secp256k1')

module.exports = class globalFunction {
    static isAmountValid = (amount) => {
        return typeof amount === 'number' && amount >= 0
    }

    static generateWalletAddress = (publicKeyHex) => {
        const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex')

        // Step 2: Hash the public key using SHA-256
        const sha256Hash = crypto
            .createHash('sha256')
            .update(publicKeyBuffer)
            .digest()

        // Step 3: Hash the SHA-256 result using RIPEMD-160
        const ripemd160Hash = crypto
            .createHash('ripemd160')
            .update(sha256Hash)
            .digest()

        // Step 4: Add the mainnet version byte (0x00)
        const versionByte = Buffer.from('00', 'hex')
        const extendedRipemd160Hash = Buffer.concat([
            versionByte,
            ripemd160Hash,
        ])

        // Step 5: Double-hash the result
        const doubleSHA256Hash = crypto
            .createHash('sha256')
            .update(extendedRipemd160Hash)
            .digest()
        const doubleSHA256HashAgain = crypto
            .createHash('sha256')
            .update(doubleSHA256Hash)
            .digest()

        // Step 6: Take the first 4 bytes as the checksum
        const checksum = doubleSHA256HashAgain.subarray(0, 4)

        // Step 7: Append the checksum to the extended RIPEMD-160 hash
        const addressBytes = Buffer.concat([extendedRipemd160Hash, checksum])

        // Step 8: Base58 encode the entire data
        const walletAddress = bs58.encode(addressBytes)
        return walletAddress
    }

    static signTransaction = (sender_wallet, receiver_wallet, amount) => {
        const transactionData = {
            sender_address: sender_wallet.wallet_address,
            receiver_address: receiver_wallet.wallet_address,
            amount,
        }

        const privateKeyHex = sender_wallet.private_key
        const privateKey = Buffer.from(privateKeyHex, 'hex')

        const dataToSign = `${sender_wallet.wallet_address}/${receiver_wallet.wallet_address}/${amount}`
        const buffer = Buffer.from(dataToSign, 'utf-8')

        const hashedMessage = crypto
            .createHash('sha256')
            .update(buffer)
            .digest()

        const signatureObj = secp256k1.ecdsaSign(hashedMessage, privateKey)
        const signature = signatureObj.signature

        const derSignature = secp256k1.signatureExport(signature)

        return {
            ...transactionData,
            message: Buffer.from(hashedMessage).toString('hex'),
            signature: Buffer.from(derSignature).toString('hex'),
            public_key: sender_wallet.public_key,
        }
    }

    static register_wallet = async (publicKey, walletAddress) => {
        const payload = {
            public_key: publicKey,
            wallet_address: walletAddress,
        }
        try {
            const res = await axios.post(
                `${process.env.BLOCKCHAIN_URL}/wallets`,
                payload
            )
            return res.data
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
