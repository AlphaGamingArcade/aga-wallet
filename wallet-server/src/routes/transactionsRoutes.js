const router = require('express').Router()
const controller = require('../controllers/transactionsController')
const utils = require('../helpers/utils')

router.post('/', utils.verifyToken, controller.sendTransaction)

module.exports = router
