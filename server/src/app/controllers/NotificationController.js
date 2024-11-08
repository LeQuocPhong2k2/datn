require('dotenv').config({ path: '../../../../.env' })
const Notification = require('../models/Notification')

const NotificationController = {
  createNotification: async (req, res) => {
    try {
      const { sender_id, receiver_ids, content, notification_time } = req.body

      const newNotification = new Notification({
        sender_id,
        receiver_ids,
        content,
        notification_time,
      })

      const savedNotification = await newNotification.save()

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: savedNotification,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating notification',
        error: error.message,
      })
    }
  },

  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({})
      res.json(notifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  getNotificationsByReceiverId: async (req, res) => {
    try {
      const { receiver_id } = req.body
      const notifications = await Notification.find({
        receiver_ids: receiver_id,
      })
      res.json(notifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}

module.exports = NotificationController
