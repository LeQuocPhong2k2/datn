const express = require('express')
const router = express.Router()

const AccountController = require('../app/controllers/AccountController')

router.get('/getAllAccounts', AccountController.getAllAccounts)
router.post('/login', AccountController.login)
router.post('/findAccountById', AccountController.findAccountById)
router.post('/refreshToken', AccountController.refreshToken)
router.post('/changePassword', AccountController.changePassword)

module.exports = router
