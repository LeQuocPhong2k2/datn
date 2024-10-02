import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const refreshAccessToken = async () => {
  const refreshToken = cookies.get('refresh_token');
  if (!refreshToken) {
    throw new Error('Không tìm thấy refresh token');
  }

  try {
    const response = await axios.post('/http://localhost:3000/accounts/refreshToken', { refreshToken });
    const tokenName = response.account.role === 'Admin' ? 'admin_token' : 'student_token'; // Cập nhật theo vai trò
    cookies.set(tokenName, response.token, {
      path: '/',
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 giờ
    });
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Xử lý lỗi, có thể chuyển hướng về trang đăng nhập
  }
};
export { refreshAccessToken };
