import axios from 'axios';
import Cookies from 'cookie-universal';
const API_URL = process.env.REACT_APP_API_URL;

const cookies = new Cookies();
const apiClient = axios.create({
  baseURL: API_URL,
});

// Thêm interceptor để đính kèm access token vào mỗi request
apiClient.interceptors.request.use(async (config) => {
  const accessToken = sessionStorage.getItem('accessToken');
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = cookies.getItem('refresh_token');

      // Gửi yêu cầu làm mới token
      const { data } = await axios.post(`${API_URL}/accounts/refreshToken`, { refreshToken });

      // Cập nhật token
      cookies.setItem('access_token', data.accessToken);
      cookies.setItem('refresh_token', data.refreshToken);

      // Thử lại request ban đầu
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
