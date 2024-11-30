import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
// Add axios configuration
axios.defaults.maxContentLength = 50 * 1024 * 1024; // 50MB limit
axios.defaults.maxBodyLength = 50 * 1024 * 1024;
async function createNotification(sender_id, receiver_ids, content, notification_time) {
  try {
    const response = await axios.post(
      `${API_URL}/notification/createNotification`,
      {
        sender_id,
        receiver_ids,
        ...content,
        notification_time,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

async function getAllNotifications() {
  try {
    const response = await axios.post(
      `${API_URL}/notification/getAllNotifications`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
    throw error;
  }
}
async function getNotificationsByReceiverId(receiver_id) {
  try {
    const response = await axios.post(
      `${API_URL}/notification/getNotificationsByReceiverId`,
      { receiver_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
    throw error;
  }
}
// thêm 2 hàm updateNotification và deleteNotification
async function updateNotification(_id, notification) {
  try {
    const response = await axios.post(
      `${API_URL}/notification/updateNotification`,
      { _id, ...notification },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error.response ? error.response.data : error.message);
    throw error;
  }
}
async function deleteNotification(_id) {
  try {
    const response = await axios.post(
      `${API_URL}/notification/deleteNotification`,
      { _id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export {
  createNotification,
  getAllNotifications,
  getNotificationsByReceiverId,
  updateNotification,
  deleteNotification,
};
