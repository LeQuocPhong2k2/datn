import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
async function login(userName, password) {
  try {
    const response = await axios.post(
      `${API_URL}/accounts/login`, // Đảm bảo port này đúng với port server của bạn
      {
        userName,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Login response:', response);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getAccountById(id) {
  const response = await axios.post(
    API_URL + '/accounts/findAccountById', // Đảm bảo port này đúng với port server của bạn
    {
      account_id: id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('Get account by id response:', response);
  return response.data;
}

export { login, getAccountById };
