const { connectDb } = require('./dbConfig')
const jwt = require('jsonwebtoken')

module.exports = class sqlFunction {
    static createToken = (user_id) => {
        return jwt.sign(user_id, process.env.SECRET, {})
    }

    static getWalletByAddress = async (wallets_list) => {
        if (wallets_list.length <= 0) {
            return []
        }
        const db = await connectDb()
        try {
            const formattedAddresses = wallets_list
                .map((address) => `'${address}'`)
                .join(', ')
            const query = await db
                .request()
                .query(
                    `select * from wallets where wallet_address in (${formattedAddresses})`
                )
            const result = Object.values(query.recordset)
            return result
        } catch (error) {
            const message =
                'An error occurred while getting wallets by address.'
            throw new Error(message)
        }
    }
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
            const message = error?.message ?? 'Internal server error.'
            throw new Error(message)
        }
    }

    static getUserById = async (userId) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(`select * from users where id = '${userId}'`)
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
                IF NOT EXISTS(SELECT * FROM push_tokens WHERE user_id = '${params.userId}' AND platform = '${params.platform}')
                BEGIN
                    INSERT INTO push_tokens (user_id, token, platform)
                    OUTPUT INSERTED.*
                    VALUES ('${params.userId}', '${params.token}', '${params.platform}')
                END
                ELSE
                BEGIN
                    UPDATE push_tokens SET token = '${params.token}', updated_at = GETDATE()
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

    /**
     * Represents a wallets addresses.
     * @property {string[]} wallet_address - An array of wallet addresses.
     */
    static getWalletPushTokens = async (wallet_address) => {
        const db = await connectDb()
        try {
            const query = await db.request().query(
                `
                    SELECT 
                        wallets.wallet_address,
                        users.id AS user_id,
                        push_tokens.token AS push_token
                    FROM 
                        users
                    INNER JOIN 
                        wallets ON users.id = wallets.user_id
                    INNER JOIN 
                        push_tokens ON wallets.user_id = push_tokens.user_id
                    WHERE 
                        wallets.wallet_address IN ('${wallet_address}');

                    `
            )

            const resultArray = Object.values(query.recordset)
            return resultArray
        } catch (error) {
            console.log(error)
            throw new Error('Internal Server Error')
        }
    }
    static isPushTokenExists = async (token) => {
        const db = await connectDb()

        try {
            const query = await db
                .request()
                .query(`select * from push_tokens where token = '${token}'`)
            return query.recordset.length > 0
        } catch (error) {
            const message = 'An error occurred while registering push token'
            throw new Error(message)
        }
    }

    static updatePushTokenUser = async (userId, platform, token) => {
        const db = await connectDb()
        try {
            const query = await db
                .request()
                .query(
                    `UPDATE push_tokens SET user_id = '${userId}', platform = '${platform}' OUTPUT INSERTED.* WHERE token = '${token}'`
                )

            return query
        } catch (error) {
            const message = 'An error occurred while updating push token ss'
            throw new Error(message)
        }
    }

    static createPushToken = async (userId, platform, token) => {
        const db = await connectDb()

        try {
            const query = await db.request().query(`
                    INSERT INTO push_tokens (user_id, token, platform)
                    OUTPUT INSERTED.*
                    VALUES ('${userId}', '${token}', '${platform}')
                `)

            return query.recordset.length > 0
        } catch (error) {
            const message = 'An error occurred while registering push token'
            throw new Error(message)
        }
    }

    static registerNotifications = async (notificationList) => {
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

    static insertBulkNotifications = async (notificationList) => {
        if (notificationList.length === 0) {
            return []
        }
        const db = await connectDb()
        try {
            const valuesString = notificationList
                .map(
                    (notification) =>
                        `('${notification.userId}', '${notification.type}', '${notification.title}', '${notification.description}')`
                )
                .join(', ')
            const result = await db.query(
                `INSERT INTO notifications (user_id, type, title, description) OUTPUT INSERTED.* VALUES ${valuesString}`
            )

            const returnedArray = Object.values(result.recordset)
            return returnedArray
        } catch (error) {
            const message = 'An error occurred while inserting notifications.'
            throw new Error(message)
        } finally {
            // Close the database connection if necessary
            await db.close()
        }
    }

    static getPushTokens = async (userIdList) => {
        if (userIdList.length === 0) {
            return []
        }

        const db = await connectDb()
        try {
            const valuesString = userIdList
                .map((userId) => `'${userId}'`)
                .join(', ')
            const result = await db.query(
                `SELECT * FROM PUSH_TOKENS WHERE user_id in (${valuesString})`
            )
            const returnedArray = Object.values(result.recordset)
            return returnedArray
        } catch (error) {
            const message = 'An error occurred while retrieving push tokens.'
            throw new Error(message)
        } finally {
            // Close the database connection if necessary
            await db.close()
        }
    }
}
