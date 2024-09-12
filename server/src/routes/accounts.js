const express = require('express')
const router = express.Router()

const AccountController = require('../app/controllers/AccountController')

router.get('/getAllAccounts', AccountController.getAllAccounts)
router.post('/login', AccountController.login)

module.exports = router
