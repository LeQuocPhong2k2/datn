const express = require('express')
const router = express.Router()
const ParentController = require('../app/controllers/ParentController')

router.post('/getFullParentInfo', ParentController.getFullParentInfo)

module.exports = router
