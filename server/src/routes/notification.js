const express = require('express')
const router = express.Router()
const NotificationController = require('../app/controllers/NotificationController')

router.post('/createNotification', NotificationController.createNotification)
router.post('/getAllNotifications', NotificationController.getAllNotifications)
router.post(
  '/getNotificationsByReceiverId',
  NotificationController.getNotificationsByReceiverId
)
router.post('/updateNotification', NotificationController.updateNotification)
router.post('/deleteNotification', NotificationController.deleteNotification)
router.post(
  '/getNotificationsBySenderId',
  NotificationController.getNotificationsBySenderId
)
router.post('/editNotification2', NotificationController.editNotification2)

module.exports = router
