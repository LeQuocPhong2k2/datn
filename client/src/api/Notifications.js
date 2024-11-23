import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
// Add axios configuration
axios.defaults.maxContentLength = 50 * 1024 * 1024; // 50MB limit
axios.defaults.maxBodyLength = 50 * 1024 * 1024;
// async function createNotification(sender_id, receiver_ids, notification_time, subject, text, link, imageBase64) {
//   try {
//     const response = await axios.post(
//       `${API_URL}/notification/createNotification`,
//       {
//         sender_id,
//         receiver_ids,
//         subject,
//         text,
//         link,
//         imageBase64,
//         notification_time,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response;
//   } catch (error) {
//     console.error('Error creating notification:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }// Remove async arrow function syntax error
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
export { createNotification, getAllNotifications };
