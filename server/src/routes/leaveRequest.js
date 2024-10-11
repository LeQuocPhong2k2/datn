const express = require('express')
const router = express.Router()
const LeaveRequestController = require('../app/controllers/LeaveRequestController')

router.post('/createLeaveRequest', LeaveRequestController.createLeaveRequest)
router.post('/getAllLeaveRequests', LeaveRequestController.getAllLeaveRequests)
module.exports = router
