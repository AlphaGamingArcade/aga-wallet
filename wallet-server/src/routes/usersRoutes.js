const router = require('express').Router()
const controller = require('../controllers/usersController')
const { verifyToken } = require('../helpers/utils')

router.post('/signin', controller.login)
router.post('/signup', controller.signup)
router.get('/notification', controller.getNotifications)
router.get('/emails/:email', controller.isEmailAvailable)
router.get('/phone-numbers/:phone_number', controller.isPhoneNumberAvailable)
router.get('/:user_id', verifyToken, controller.getUser)
router.get('/:user_id/wallets', verifyToken, controller.getWallets)

module.exports = router
