const express = require('express')
const router = express.Router()
const NotificationController = require('../app/controllers/NotificationController')

router.post('/createNotification', NotificationController.createNotification)
router.post('/getAllNotifications', NotificationController.getAllNotifications)
router.post(
  '/getNotificationsByReceiverId',
  NotificationController.getNotificationsByReceiverId
)

module.exports = router
