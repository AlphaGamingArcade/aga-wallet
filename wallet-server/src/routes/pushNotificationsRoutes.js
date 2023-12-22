const router = require('express').Router()
const controller = require('../controllers/pushNotificationsController')

router.post('/register', controller.registerPushNotificationToken)
router.post('/test', controller.testPushNotification)

module.exports = router
