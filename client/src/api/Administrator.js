import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

// api cho getAdministratorsbyAccountId
async function getAdministratorsbyAccountId(account_id) {
  try {
    const response = await axios.post(
      `${API_URL}/administrator/getAdministratorsbyAccountId`,
      { account_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching administrators:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export { getAdministratorsbyAccountId };
