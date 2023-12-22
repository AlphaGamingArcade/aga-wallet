const jwt = require('jsonwebtoken')
const sqlFunction = require('../helpers/sqlFunction')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { user_id } = jwt.verify(token, process.env.SECRET)

        const findParams = {
            column: 'user_id',
            tablename: 'users',
            condition: `user_id = '${user_id}'`,
        }

        const sqlFind = await sqlFunction.findOne(findParams)

        req.user = sqlFind.data.user_id

        next()
    } catch (error) {
        res.status(400).json({ error: 'Request is not authorized' })
    }
}

module.exports = requireAuth
