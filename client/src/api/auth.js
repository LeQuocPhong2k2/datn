import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const refreshAccessToken = async (refreshToken) => {
  // const refreshToken = cookies.get('refresh_token');
  if (!refreshToken) {
    throw new Error('Không tìm thấy refresh token');
  }

  try {
    const response = await axios.post('http://localhost:3000/accounts/refreshToken', { refreshToken }); // Sửa URL
    const tokenName = response.data.account.role === 'Admin' ? 'admin_token' : 'student_token'; // Cập nhật theo vai trò
    cookies.set(tokenName, response.data.token, {
      // Sửa response
      path: '/',
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 giờ
    });
    return tokenName; // Sửa để trả về tokenName
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error; // Ném lại lỗi để có thể xử lý trong catch
  }
};
export { refreshAccessToken };
