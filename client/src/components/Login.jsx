import React from 'react'
import 'flowbite'
import imgLogin from '../assets/backtoschool.2024.png'
import Cookies from 'cookie-universal'
import { useEffect } from 'react'
import loginApi from '../api/Login'
import { useState } from 'react'
export default function Login() {
  useEffect(() => {
    document.title = 'Đăng nhập'
  }, [])
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const cookies = new Cookies()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (userName === '' || password === '') {
      alert('Vui lòng nhập tên tài khoản và mật khẩu')
      return
    }
    // gửi dữ liệu lên server
    try {
      const response = await loginApi(userName, password)
      console.log('Login successful:', response)
      alert('Đăng nhập thành công')
      // lưu token vào cookie và cookie có thời gian sống là 1 ngày
      cookies.set('token', response.token, {
        path: '/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      // lưu _id vào local storage
      localStorage.setItem('_id', response.account.id)

      window.location.href = '/admin'

      // chuyển hướng đến trang Admin
      // window.location.href = '/admin'
    } catch (error) {
      console.error('Login failed:', error)
      alert(
        'Đăng nhập thất bại: ' +
          (error.response?.data?.message || error.message)
      )
    }
  }

  return (
    <div className="w-screen h-screen grid grid-cols-12 login-wrapper">
      <div className="col-span-8 img-logo">
        <div className="w-full h-full bg-blue-50">
          <img className="w-10/12 h-10/12" src={imgLogin} alt="img-login" />
        </div>
      </div>
      <div className="col-span-4 grid items-start form-login">
        <div className="flex-col">
          <div className="w-full flex justify-start items-center mt-40">
            <div className="w-full flex flex-col items-center">
              <span className="text-title-login w-3/4 font-medium text-4xl">
                Đăng nhập
              </span>
            </div>
          </div>
          <div className="w-full flex justify-start items-center mt-10">
            <div className="w-full flex flex-col items-center">
              <span className="text-subtitle-login w-3/4 font-medium text-xl">
                Tên tài khoản
              </span>
              <input
                className="w-3/4 border border-gray-300 rounded-lg px-4 mt-2"
                type="text"
                placeholder="Nhập tên tài khoản do nhà trường cung cấp"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin()
                  }
                }}
              />
              <span className="text-subtitle-login w-3/4 font-medium text-xl pt-5">
                Mật khẩu
              </span>
              <input
                className="w-3/4 h-12 border border-gray-300 rounded-lg px-4 mt-2"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin()
                  }
                }}
              />

              <div className="w-3/4 flex justify-end items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  value="remember"
                />
                <label className="text-subtitle-login" htmlFor="remember">
                  Ghi nhớ tài khoản
                </label>
              </div>

              <button
                className="w-3/4 h-12 btn-login rounded-lg mt-4"
                onClick={handleLogin}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin(e)
                  }
                }}
                type="submit"
              >
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
  )
}
