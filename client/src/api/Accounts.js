import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Lấy URL từ biến môi trường giá tị của nó là http://localhost:3000
async function changePassword(userName, oldPassword, newPassword) {
  console.log('API_URL:', API_URL); // In ra giá trị của API_URL để kiểm tra
  try {
    const response = await axios.post(
      'http://localhost:3000/accounts/changePassword', // Sử dụng URL tuyệt đối
      { userName, oldPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Change password response:', response);
    return response;
  } catch (error) {
    console.error('Change password error:', error.response ? error.response.data : error.message);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
  }
}
export { changePassword };
