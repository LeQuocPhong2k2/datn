import React from 'react';
import 'flowbite';
import imgLogin from '../assets/backtoschool.2024.png';
import { login } from '../api/Login';
import { useEffect, useState } from 'react';
import Cookies from 'cookie-universal';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';

export default function Login() {
  useEffect(() => {
    document.title = 'Đăng nhập';
  }, []);

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const cookies = new Cookies();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userName === '' || password === '') {
      toast.dismiss();
      toast.error('Vui lòng nhập đầy đủ tên tài khoản và mật khẩu ');
      return;
    }

    try {
      const response = await login(userName, password);
      toast.dismiss();
      toast.success('Đăng nhập thành công');
      cookies.set('access_token', response.token, {
        path: '/',
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      cookies.set('refresh_token', response.account.refreshToken, {
        path: '/',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      localStorage.setItem('_id', response.account.id);
      localStorage.setItem('role', response.account.role);
      if (response.account.role === 'Admin') {
        window.location.href = '/';
      } else if (response.account.role === 'Student' || response.account.role === 'Parent') {
        window.location.href = '/student';
      } else if (response.account.role === 'Teacher') {
        window.location.href = '/teacher';
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.dismiss();
        toast.error('Tài khoản không tồn tại');
      } else if (error.response.status === 402) {
        toast.dismiss();
        toast.error('Mật khẩu không chính xác');
      }
    }
  };

  return (
    <div className="w-screen h-screen grid grid-cols-12 login-wrapper">
      <div className="col-span-8 img-logo">
        <div className="w-full h-full bg-blue-50">
          <img className="w-10/12 h-10/12" src={imgLogin} alt="img-login" />
        </div>
      </div>
      {/* thư viện thông báo Toaster */}
      <Toaster toastOptions={{ duration: 2200 }} />
      <div className="col-span-4 grid items-start form-login">
        <div className="flex-col">
          <div className="w-full flex justify-start items-center mt-40">
            <div className="w-full flex flex-col items-center">
              <span className="text-title-login w-3/4 font-medium text-4xl">Đăng nhập</span>
            </div>
          </div>
          <div className="w-full flex justify-start items-center mt-10">
            <div className="w-full flex flex-col items-center">
              <span className="text-subtitle-login w-3/4 font-medium text-xl">Tên tài khoản</span>
              <input
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-3/4 border border-gray-300 rounded-lg px-4 mt-2"
                type="text"
                placeholder="Nhập tên tài khoản do nhà trường cung cấp"
              />
              <span className="text-subtitle-login w-3/4 font-medium text-xl pt-5">Mật khẩu</span>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-3/4 h-12 border border-gray-300 rounded-lg px-4 mt-2"
                type="password"
                placeholder="Nhập mật khẩu"
              />

              <div className="w-3/4 flex justify-end items-center gap-2 mt-4">
                <input type="checkbox" id="remember" name="remember" value="remember" />
                <label className="text-subtitle-login" htmlFor="remember">
                  Ghi nhớ tài khoản
                </label>
              </div>

              <button onClick={handleLogin} className="w-3/4 h-12 btn-login rounded-lg mt-4">
                Đăng nhập
              </button>
              <div className="w-3/4 flex justify-start items-center gap-2 mt-4">
                <a className="text-blue-500" href="/forgot-password">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
