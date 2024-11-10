// import axios from 'axios';
// import Cookies from 'cookie-universal';

// const API_URL = process.env.REACT_APP_API_URL;

// function getAccessToken() {
//   const cookies = new Cookies();
//   return cookies.get('access_token');
// }

// function getRefreshToken() {
//   const cookies = new Cookies();
//   return cookies.get('refresh_token');
// }

// async function refreshToken() {
//   const cookies = new Cookies();
//   const refreshToken = getRefreshToken();
//   const response = await axios({
//     method: 'post',
//     url: `${API_URL}/accounts/refreshToken`,
//     data: {
//       refreshToken,
//     },
//   });

//   if (response.status === 200) {
//     cookies.set('access_token', response.token, {
//       path: '/',
//       expires: new Date(Date.now() + 60 * 60 * 1000),
//     });
//     cookies.set('refresh_token', response.account.refreshToken, {
//       path: '/',
//       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });
//   }

//   return;
// }

// async function verifyAccessToken() {
//   const accessToken = getAccessToken();
//   try {
//     await axios.post(API_URL + 'accounts/verifyAccessToken', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return true;
//   } catch (error) {
//     console.error('Verify access token error:', error);
//     if (error.status === 401 && error.data.message === 'Token is invalid') {
//       window.location.href = '/login';
//     }
//     if (error.status === 403 && error.data.message === 'Token has expired') {
//       await refreshToken();
//     }
//     if (error.status === 403 && error.data.message === 'Token is invalid') {
//       window.location.href = '/login';
//     }
//     return false;
//   }
// }

// export { getAccessToken, getRefreshToken };
