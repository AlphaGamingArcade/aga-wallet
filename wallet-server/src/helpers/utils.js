const crypto = require('node:crypto')
const bs58 = require('bs58')
const Joi = require('joi')
const { verify } = require('jsonwebtoken')

module.exports = {
    isAmountValid: function (amount) {
        return typeof amount === 'number' && amount >= 0
    },
    generateWalletAddress: function (publicKeyHex) {
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
    },
    verifyToken: (req, res, next) => {
        let token = req.get('authorization')

        if (token) {
            token = token.slice(7)

            verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        message: 'Invalid token.',
                    })
                } else {
                    next()
                }
            })
        } else {
            res.status(401).json({
                message: 'Access denied, unauthorized user.',
            })
        }
    },
}
