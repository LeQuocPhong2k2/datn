const express = require('express')
const router = express.Router()

const AttendanceController = require('../app/controllers/AttendanceController')

router.post('/createAttendance', AttendanceController.createAttendance)
module.exports = router
