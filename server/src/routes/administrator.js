const express = require('express')
const router = express.Router()

const AdministratorController = require('../app/controllers/AdministratorController')

router.post(
  '/getAdministratorsbyAccountId',
  AdministratorController.getAdministratorsbyAccountId
)
module.exports = router
