const router = require('express').Router()
const controller = require('../controllers/validatorsController')

router.post('/signup', controller.signup)
router.post('/signin', controller.login)

module.exports = router
