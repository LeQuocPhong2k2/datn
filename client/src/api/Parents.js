import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

async function getFullParentInfo(parent_id) {
  try {
    const response = await axios.post(
      `${API_URL}/parents/getFullParentInfo`,
      { parent_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching parent and students:', error.response ? error.response.data : error.message);
    throw error;
  }
}
export { getFullParentInfo };
