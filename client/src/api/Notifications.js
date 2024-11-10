import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

async function createNotification(sender_id, receiver_ids, content, notification_time) {
  try {
    const response = await axios.post(
      `${API_URL}/notification/createNotification`,
      {
        sender_id,
        receiver_ids,
        content,
        notification_time,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating notification:', error.response ? error.response.data : error.message);
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
export { createNotification, getAllNotifications };
