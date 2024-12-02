const Notification = require("../models/Notification");
const socket = require("../../socket");
const socketInit = require("../../socket");
const AWS = require("aws-sdk");

// Cấu hình AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  // Cấu hình CORS
  corsConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE"],
        AllowedOrigins: ["*"],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3000,
      },
    ],
  },
});
const NotificationController = {
  // createNotification: async (req, res) => {

  createNotification: async (req, res) => {
    try {
      const { sender_id, receiver_ids, subject, text, link, imageBase64, notification_time } = req.body;
      let imageUrl = null;
      // console.log(
      //   'data được truyền qua là ',
      //   sender_id,
      //   receiver_ids,
      //   subject,
      //   text,
      //   link,
      //   imageBase64,
      //   notification_time
      // )

      // Upload ảnh lên S3 nếu có
      if (imageBase64) {
        const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const type = imageBase64.split(";")[0].split("/")[1];

        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: `uploads/${Date.now()}.${type}`,
          Body: buffer,
          ContentType: `image/${type}`,
          ACL: "public-read",
        };

        const uploadResult = await s3.upload(params).promise();
        imageUrl = uploadResult.Location;
      }

      // Tạo content object
      const content = {
        subject,
        text,
        link,
        image: imageUrl,
      };

      const newNotification = new Notification({
        sender_id,
        receiver_ids,
        content,
        notification_time,
      });

      const savedNotification = await newNotification.save();

      // Lấy io và emit event
      const io = socket.getIO();
      io.emit("newNotification", savedNotification);

      res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: savedNotification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating notification",
        error: error.message,
      });
    }
  },
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({});
      const io = socketInit.getIO(); // Thay vì socket.getIO()
      io.emit("getAllNotifications", notifications);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getNotificationsByReceiverId: async (req, res) => {
    try {
      const { receiver_id } = req.body;
      const notifications = await Notification.find({
        receiver_ids: receiver_id,
      });
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // viết lại hàm updateNotification từ req.body
  updateNotification: async (req, res) => {
    try {
      const { _id } = req.body;
      const notification = await Notification.findById(_id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }
      const updatedNotification = await Notification.findByIdAndUpdate(_id, req.body, { new: true });
      res.json({
        success: true,
        message: "Notification updated successfully",
        data: updatedNotification,
      });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // viếT hàm xóa delete notification
  deleteNotification: async (req, res) => {
    try {
      const { _id } = req.body;
      const notification = await Notification.findById(_id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }
      await Notification.findByIdAndDelete(_id);
      res.json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getNotificationsBySenderId: async (req, res) => {
    try {
      const { sender_id } = req.body;
      const notifications = await Notification.find({
        sender_id: sender_id,
      });
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = NotificationController;
