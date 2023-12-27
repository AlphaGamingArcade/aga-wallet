const sqlFunction = require('../helpers/sqlFunction')
const blockchainFunction = require('../helpers/blockchainFunction')
const globalFunction = require('../helpers/globalFunction')
const bcrypt = require('bcryptjs')
const {
    userSchema,
    emailSchema,
    phoneNumberSchema,
    userIdSchema,
} = require('../helpers/schema')

module.exports = class useController {
    static signup = async (req, res) => {
        const { error } = userSchema.validate(req.body)

        if (error) {
            return res.status(401).json({ message: 'Invalid payload.' })
        }

        const {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email,
            password,
            passcode,
        } = req.body

        try {
            const isPhoneNumberExists =
                await sqlFunction.isPhoneNumberExists(phoneNumber)
            if (isPhoneNumberExists) {
                return res.status(409).json({
                    message: 'Phone number is used by different user.',
                })
            }

            const isEmailExists = await sqlFunction.isEmailExists(email)
            if (isEmailExists) {
                return res.status(409).json({ message: 'Email already exist.' })
            }

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            const { privateKey, publicKey } =
                await blockchainFunction.getKeypair()

            const walletAddress =
                globalFunction.generateWalletAddress(publicKey)

            const params = {
                firstName: firstName.toUpperCase(),
                lastName: lastName.toUpperCase(),
                phoneNumber,
                email: email.toLowerCase(),
                hashPassword,
                passcode,
                privateKey: privateKey,
                publicKey: publicKey,
                walletAddress: walletAddress,
            }

            const walletUtxos =
                await blockchainFunction.getWalletUnspentTxOuts(walletAddress)

            const balance = walletUtxos
                .filter((utxo) => utxo.status === 'unspent')
                .reduce((balance, currenValue) => {
                    return balance + currenValue.amount
                }, 0)

            const sqlSignup = await sqlFunction.signup(params)
            const user = sqlSignup.data
            delete user.password
            delete user.passcode

            const token = sqlFunction.createToken(user.id)

            res.status(200).json({
                user,
                token,
                wallets: [
                    {
                        publicKey: publicKey,
                        wallet_address: walletAddress,
                        balance,
                    },
                ],
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static login = async (req, res) => {
        const { phone_number: phoneNumber, password: _password } = req.body

        const findUser = {
            column: '*',
            tablename: 'users',
            condition: `phone_number = '${phoneNumber}'`,
        }

        try {
            const sqlLogin = await sqlFunction.login(findUser)
            const match = await bcrypt.compare(
                _password,
                sqlLogin.data.password
            )

            if (!match) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }

            const { password, passcode, ...user } = sqlLogin.data

            const { public_key, wallet_address } =
                await sqlFunction.getWalletKeysByUserId(user.id)

            const walletUtxos =
                await blockchainFunction.getWalletUnspentTxOuts(wallet_address)

            const balance = walletUtxos
                .filter((utxo) => utxo.status === 'unspent')
                .reduce((balance, currenValue) => {
                    return balance + currenValue.amount
                }, 0)

            res.status(200).json({
                user: user,
                token: sqlLogin.token,
                wallets: [{ public_key, wallet_address, balance }],
            })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    static isEmailAvailable = async (req, res) => {
        const { error } = emailSchema.validate(req.params)

        if (error) {
            return res.status(401).json({ message: 'Invalid email' })
        }

        const { email } = req.params

        try {
            const isEmailExists = await sqlFunction.isEmailExists(email)
            res.status(200).json({
                available: !isEmailExists,
            })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    static isPhoneNumberAvailable = async (req, res) => {
        const { error } = phoneNumberSchema.validate(req.params)

        if (error) {
            return res.status(401).json({ message: 'Invalid email' })
        }

        const { phone_number: phoneNumber } = req.params

        try {
            const isPhoneNumberExists =
                await sqlFunction.isPhoneNumberExists(phoneNumber)
            res.status(200).json({
                available: !isPhoneNumberExists,
            })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    static getWallets = async (req, res) => {
        const { error } = userIdSchema.validate(req.params)

        if (error) {
            return res.status(401).json({ message: 'Invalid params' })
        }

        const { user_id: userId } = req.params

        try {
            const isUserExists = await sqlFunction.isUserIdExists(userId)
            if (!isUserExists) {
                return res.status(404).json({ message: 'User not found' })
            }

            const { public_key, wallet_address } =
                await sqlFunction.getWalletKeysByUserId(userId)

            const walletUtxos =
                await blockchainFunction.getWalletUnspentTxOuts(wallet_address)

            const balance = walletUtxos
                .filter((utxo) => utxo.status === 'unspent')
                .reduce((balance, currenValue) => {
                    return balance + currenValue.amount
                }, 0)

            res.status(200).json({
                wallets: [{ public_key, wallet_address, balance }],
            })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
    static getUser = async (req, res) => {
        const { error } = userIdSchema.validate(req.params)
        if (error) {
            return res.status(401).json({ message: 'Invalid params' })
        }

        const { user_id: userId } = req.params

        try {
            const isUserExists = await sqlFunction.isUserIdExists(userId)
            if (!isUserExists) {
                return res.status(404).json({ message: 'User not found' })
            }

            const user = await sqlFunction.getUserById(userId)
            const { password, passcode, ...userData } = user.data
            const { public_key, wallet_address } =
                await sqlFunction.getWalletKeysByUserId(userId)

            const walletUtxos =
                await blockchainFunction.getWalletUnspentTxOuts(wallet_address)

            const balance = walletUtxos
                .filter((utxo) => utxo.status === 'unspent')
                .reduce((balance, currenValue) => {
                    return balance + currenValue.amount
                }, 0)

            res.status(200).json({
                user: userData,
                wallets: [{ public_key, wallet_address, balance }],
            })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
    static getNotifications = async ( req , res ) => {
        const data = [
            {
              "user_id": "1",
              "type": "receive",
              "source": "You have received a $100 deposit from John Doessss.",
              "is_viewed": false,
              "is_archived": false,
              "created_at": "2023-12-23T10:00:00Z",
              "updated_at": null
            },
            {
              "user_id": "2",
              "type": "update",
              "source": "New message from Jane Doe: Hey, how are you?",
              "is_viewed": false,
              "is_archived": false,
              "created_at": "2023-12-23T10:15:00Z",
              "updated_at": null
            },
            {
              "user_id": "3",
              "type": "receive",
              "source": "Your payment of $50 to XYZ Co. has been processed.",
              "is_viewed": true,
              "is_archived": false,
              "created_at": "2023-12-23T10:30:00Z",
              "updated_at": null
            },
            {
              "user_id": "4",
              "type": "update",
              "source": "New message from John Smith: Regarding our upcoming meeting.",
              "is_viewed": false,
              "is_archived": false,
              "created_at": "2023-12-23T10:45:00Z",
              "updated_at": null
            },
            {
              "user_id": "5",
              "type": "receive",
              "source": "A document has been shared with you by Alex Johnson.",
              "is_viewed": false,
              "is_archived": false,
              "created_at": "2023-12-23T11:00:00Z",
              "updated_at": null
            },
            {
              "user_id": "6",
              "type": "update",
              "source": "New message from Sarah White: Important update regarding the project.",
              "is_viewed": true,
              "is_archived": false,
              "created_at": "2023-12-23T11:15:00Z",
              "updated_at": null
            },
            {
              "user_id": "7",
              "type": "receive",
              "source": "Congratulations! You've earned a reward for your recent purchase.",
              "is_viewed": false,
              "is_archived": false,
              "created_at": "2023-12-23T11:30:00Z",
              "updated_at": null
            },
            {
              "user_id": "8",
              "type": "update",
              "source": "New message from Michael Brown: Quick question about the report.",
              "is_viewed": false,
              "is_archived": false,
              "created_at": "2023-12-23T11:45:00Z",
              "updated_at": null
            },
            {
              "user_id": "9",
              "type": "receive",
              "source": "Your subscription renewal is due soon. Click to renew now.",
              "is_viewed": true,
              "is_archived": false,
              "created_at": "2023-12-23T12:00:00Z",
              "updated_at": null
            },
            {
              "user_id": "10",
              "type": "update",
              "source": "New message from Emily Davis: Exciting news about the upcoming event!",
              "is_viewed": false,
              "is_archived": false,
              "created_at": "2023-12-23T12:15:00Z",
              "updated_at": null
            }
          ];
          
          
        res.status(200).json({
           data:data
        })
    }
}
