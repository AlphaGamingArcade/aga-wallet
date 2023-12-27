const sql = require('mssql/msnodesqlv8')
const dbConn = process.env.CONNECTION_STRING
const config = {
    driver: 'msnodesqlv8',
    connectionString: dbConn,
}

const pool = new sql.ConnectionPool(config)

const connectDb = async () => {
    try {
        return await pool.connect()
    } catch (error) {
        console.log('Database connection failed', error)
        return error
    }
}

module.exports = {
    connectDb,
}
