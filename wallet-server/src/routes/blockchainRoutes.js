const router = require('express').Router()
const controller = require('../controllers/blockchainController')

router.post('/block-notify', controller.blockNotify)

module.exports = router
