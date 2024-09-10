import React from "react";
import "flowbite";
import imgLogin from "../assets/backtoschool.2024.png";

import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

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
              <span className="text-title-login w-3/4 font-medium text-4xl">Đăng nhập</span>
            </div>
          </div>
          <div className="w-full flex justify-start items-center mt-10">
            <div className="w-full flex flex-col items-center">
              <span className="text-subtitle-login w-3/4 font-medium text-xl">Tên tài khoản</span>
              <input className="w-3/4 border border-gray-300 rounded-lg px-4 mt-2" type="text" placeholder="Nhập tên tài khoản do nhà trường cung cấp" />
              <span className="text-subtitle-login w-3/4 font-medium text-xl pt-5">Mật khẩu</span>
              <input className="w-3/4 h-12 border border-gray-300 rounded-lg px-4 mt-2" type="password" placeholder="Nhập mật khẩu" />

              <div className="w-3/4 flex justify-end items-center gap-2 mt-4">
                <input type="checkbox" id="remember" name="remember" value="remember" />
                <label className="text-subtitle-login" htmlFor="remember">
                  Ghi nhớ tài khoản
                </label>
              </div>

              <button className="w-3/4 h-12 btn-login rounded-lg mt-4">Đăng nhập</button>
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
