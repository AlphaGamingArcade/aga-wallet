const sqlFunction = require('../helpers/sqlFunction')
const globalFunction = require('../helpers/globalFunction')
const bcrypt = require('bcryptjs')

module.exports = class validatorController {
    static signup = async (req, res) => {
        const { username, email, password } = req.body

        try {
            const { privateKeyHex, publicKeyHex } =
                globalFunction.generateKeyPairSync()
            const walletAddress =
                globalFunction.generateWalletAddress(publicKeyHex)
            let newWallet = await globalFunction.register_wallet(
                publicKeyHex,
                walletAddress
            )

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const signupParams = {
                tablename: 'validators',
                column: 'username, email, password, public_key, private_key, wallet_address',
                values: `'${username}', '${email.toLowerCase()}', '${hash}', '${
                    newWallet.public_key
                }', '${privateKeyHex}', '${newWallet.wallet_address}'`,
            }

            const isUserParams = {
                tablename: 'validators',
                column: '*',
                condition: `username = '${username}' or email = '${email}'`,
            }

            const isEmailExist = await sqlFunction.isUserExists(isUserParams)

            if (isEmailExist) {
                return res.status(401).json({ error: 'User already exists' })
            }

            const sqlSignup = await sqlFunction.signup(signupParams)
            res.status(200).json({
                data: sqlSignup.data,
                token: sqlSignup.token,
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // login validator
    static login = async (req, res) => {
        const { email, password } = req.body

        const findUser = {
            column: '*',
            tablename: 'validators',
            condition: `email = '${email}' or username = '${email}'`,
        }

        try {
            const sqlLogin = await sqlFunction.login(findUser)
            const match = await bcrypt.compare(password, sqlLogin.data.password)

            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            return res
                .status(200)
                .json({ data: sqlLogin.data, token: sqlLogin.token })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }
}
