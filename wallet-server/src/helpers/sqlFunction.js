const { connectDb } = require('./dbConfig')
const jwt = require('jsonwebtoken')
const axios = require('axios')

module.exports = class sqlFunction {
    static createToken = (user_id) => {
        return jwt.sign(user_id, process.env.SECRET, {})
    }

    // static getWalletKeys = async () => {
    //     try {
    //         const walletRes = await axios.get(`${ process.env.BLOCKCHAIN_URL }/wallet`);
    //         const { secret_key, public_key, public_address } = walletRes.data;
    //         return {
    //             secretKey: secret_key,
    //             publicKey: public_key,
    //             publicAddress: public_address
    //         };
    //     } catch (error) {
    //         throw new Error("Internal Server Error");
    //     }
    // }
    static isWalletAddressExists = async (wallet_address) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `select * from wallets where wallet_address = '${wallet_address}'`
                )
            return query.recordset.length > 0
        } catch (error) {
            const message = 'Error retrieving wallet.'
            throw new Error(message)
        }
    }
    static isUsernameExists = async (username) => {
        const db = await connectDb()

        try {
            const query = await db
                .request()
                .query(`select * from users where username = '${username}'`)
            return query.recordset.length > 0
        } catch (error) {
            const message = 'An error occurred while signing up.'
            throw new Error(message)
        }
    }

    static isUserIdExists = async (uid) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(`select * from users where id = '${uid}'`)
            return query.recordset.length > 0
        } catch (error) {
            return false
        }
    }

    static isEmailExists = async (email) => {
        const db = await connectDb()

        try {
            const query = await db
                .request()
                .query(`select * from users where email = '${email}'`)
            return query.recordset.length > 0
        } catch (error) {
            const message = 'An error occurred while signing up.'
            throw new Error(message)
        }
    }

    static isPhoneNumberExists = async (phoneNumber) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `select * from users where phone_number = '${phoneNumber}'`
                )
            return query.recordset.length > 0
        } catch (error) {
            const message = 'An error occurred while signing up.'
            throw new Error(message)
        }
    }

    // static signup = async (params) => {
    //     const db = await connectDb()
    //     try {
    //         const query = await db.request().query(`insert into ${ params.tablename } (${ params.column }) output inserted.* values (${ params.values })`)
    //         const { password, passcode, ...user } = query.recordset[0]
    //         return { data: user }
    //     } catch (error) {
    //         const message = 'An error occurred while signing up.'
    //         throw new Error(message)
    //     }
    // }

    static signup = async (params) => {
        const db = await connectDb()
        try {
            const query = await db.request().query(`
                    DECLARE @InsertedUser TABLE (
                        id VARCHAR(255)
                    );
    
                    INSERT INTO users (first_name, last_name, phone_number, email, password, passcode)
                    OUTPUT inserted.id INTO @InsertedUser
                    VALUES ('${params.firstName}', '${params.lastName}', '${params.phoneNumber}', '${params.email}', '${params.hashPassword}', ${params.passcode});
    
                    INSERT INTO wallets (user_id, public_key, private_key, wallet_address)
                    VALUES ((SELECT id FROM @InsertedUser), '${params.publicKey}', '${params.privateKey}', '${params.walletAddress}');
                    SELECT * FROM users WHERE id = (SELECT id FROM @InsertedUser);
                `)

            return { data: query.recordset[0] }
        } catch (error) {
            console.log(error)
            const message = 'An error occurred while signing up.'
            throw new Error(message)
        }
    }

    static createWallet = async (params) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `insert into ${params.tablename} (${params.column}) output inserted.* values (${params.values})`
                )
            return { data: query.recordset[0] }
        } catch (error) {
            const message = 'An error occurred while signing up.'
            throw new Error(message)
        }
    }

    static login = async (params) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `select ${params.column} from ${params.tablename} where ${params.condition}`
                )
            if (query.recordset.length <= 0) {
                const message = 'Invalid credentials'
                throw new Error(message)
            }
            // create token
            const token = this.createToken(query.recordset[0].id)
            return { responsecode: 0, data: query.recordset[0], token }
        } catch (error) {
            const message =  error?.message ?? 'Internal server error.'
            throw new Error(message)
        }
    }

    static getUserById = async (userId) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `select * from users where id = '${userId}'`
                )
            // create token
            return { data: query.recordset[0] }
        } catch (error) {
            const message = 'Internal server error.'
            console.log(error)
            throw new Error(message)
        }
    }

    static updateUser = async (email) => {
        const db = await connectDb()
        const { secretKey, publicKey, publicAddress } =
            await this.getWalletKeys()

        const params = {
            tablename: 'users',
            newvalues: `public_key = '${publicKey}', private_key = '${secretKey}', public_address = '${publicAddress}'`,
            condition: `email = '${email}'`,
        }

        try {
            const query = await db
                .request()
                .query(
                    `update ${params.tablename} set ${params.newvalues} output inserted.* where ${params.condition}`
                )

            return { responsecode: 0, data: query.recordset[0] }
        } catch (error) {
            const message = 'Invalid Keys.'
            throw new Error(message)
        }
    }

    static selectQuery = async (params) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `select ${params.columns} from ${params.tablename} where ${params.condition}`
                )
            return query.recordset
        } catch (error) {
            const message = 'Invalid select'
            console.log(error)
            throw Error(message)
        }
    }
    static registerPushNotifToken = async (params) => {
        const db = await connectDb()
        try {
            const query = await db.request().query(
                `
                IF NOT EXISTS(SELECT * FROM push_notifications WHERE user_id = '${params.userId}' AND platform = '${params.platform}')
                BEGIN
                    INSERT INTO push_notifications (user_id, token, platform)
                    OUTPUT INSERTED.*
                    VALUES ('${params.userId}', '${params.token}', '${params.platform}')
                END
                ELSE
                BEGIN
                    UPDATE push_notifications SET token = '${params.token}', updated_at = GETDATE()
                    OUTPUT INSERTED.*
                    WHERE user_id = '${params.userId}' AND platform = '${params.platform}';
                END
                `
            )
            return { ...query.recordset[0] }
        } catch (error) {
            console.log(error)
            const message =
                'An error occurred while registering notification token.'
            throw new Error(message)
        }
    }
    static getWalletKeys = async (wallet_address) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `SELECT TOP 1 * FROM WALLETS WHERE wallet_address = '${wallet_address}'`
                )
            return { ...query.recordset[0] }
        } catch (error) {
            throw new Error('Internal Server Error')
        }
    }
    static getWalletKeysByUserId = async (userId) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `SELECT TOP 1 * FROM WALLETS WHERE user_id = '${userId}'`
                )
            return { ...query.recordset[0] }
        } catch (error) {
            console.log(error)
            throw new Error('Internal Server Error')
        }
    }
}
