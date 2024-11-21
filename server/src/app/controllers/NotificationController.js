require('dotenv').config({ path: '../../../../.env' })
const Notification = require('../models/Notification')

const AWS = require('aws-sdk')
require('dotenv').config()

// Cấu hình AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  // Cấu hình CORS
  corsConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        AllowedOrigins: ['*'],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000,
      },
    ],
  },
})
const NotificationController = {
  // createNotification: async (req, res) => {
  //   try {
  //     const { sender_id, receiver_ids, content, notification_time } = req.body

  //     const newNotification = new Notification({
  //       sender_id,
  //       receiver_ids,
  //       content,
  //       notification_time,
  //     })

  //     const savedNotification = await newNotification.save()

  //     res.status(201).json({
  //       success: true,
  //       message: 'Notification created successfully',
  //       data: savedNotification,
  //     })
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: 'Error creating notification',
  //       error: error.message,
  //     })
  //   }
  // },

  createNotification: async (req, res) => {
    try {
      const { sender_id, receiver_ids, subject, text, link, imageBase64 } =
        req.body
      let imageUrl = null

      // Upload ảnh lên S3 nếu có
      if (imageBase64) {
        const buffer = Buffer.from(
          imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        )
        const type = imageBase64.split(';')[0].split('/')[1]

        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: `uploads/${Date.now()}.${type}`,
          Body: buffer,
          ContentType: `image/${type}`,
          ACL: 'public-read',
        }

        const uploadResult = await s3.upload(params).promise()
        imageUrl = uploadResult.Location
      }

      // Tạo content object
      const content = {
        subject,
        text,
        link,
        image: imageUrl,
      }

      const newNotification = new Notification({
        sender_id,
        receiver_ids,
        content,
        notification_time: new Date(),
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
