const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiver_ids: [
      {
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
    content: {
      text: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: false,
      },
      image: {
        type: String,
        required: false,
      },
      subject: {
        type: String,
        required: true,
      },
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    notification_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
    collection: 'Notification',
  }
)

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification
