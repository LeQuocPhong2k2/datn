import axios from 'axios';

async function login(userName, password) {
  try {
    const response = await axios.post(
      'http://localhost:3000/accounts/login', // Đảm bảo port này đúng với port server của bạn
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
    'http://localhost:3000/accounts/findAccountById', // Đảm bảo port này đúng với port server của bạn
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
