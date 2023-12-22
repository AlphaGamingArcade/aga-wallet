const router = require('express').Router()
const controller = require('../controllers/walletsController')

router.post('/', controller.createWallet)
router.get('/:walletAddress/balance', controller.getWallet)
router.get('/:walletAddress/exists', controller.getWalletExists)

module.exports = router
