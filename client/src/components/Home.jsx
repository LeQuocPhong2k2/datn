import React from 'react';
import 'flowbite';
import { useEffect, useState } from 'react';
import imgAvatar from '../assets/avatar.jpg';
import imgBanner from '../assets/img-banner.png';
import { AiOutlineTeam } from 'react-icons/ai';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { BsPersonVideo3 } from 'react-icons/bs';
import { SiGoogleclassroom } from 'react-icons/si';
import { FaBars } from 'react-icons/fa6';
import { FaAnglesRight } from 'react-icons/fa6';
import { FaCaretLeft } from 'react-icons/fa';

import QuanLyHocSinh from './Manager/Student/QuanLyHocSinh';
import QuanLyGiaoVien from './Manager/Teacher/QuanLyGiaoVien';
import AddClass from './Manager/Class/AddClass';
import ListClass from './Manager/Class/ListClass';
import Cookies from 'js-cookie'; // Thêm import để sử dụng
// import { jwtDecode } from 'jwt-decode'; // Sửa import thành jwtDecode

export default function Home() {
  useEffect(() => {
    document.title = 'Home';
  }, []);
  useEffect(() => {
    const admin_token = Cookies.get('admin_token'); // Lấy token từ cookie
    if (!admin_token) {
      window.location.href = '/login'; // Nếu không có token, chuyển hướng về trang login
    }
  }, []);

  const [activeBody, setActiveBody] = useState({
    navbar: true,
    body: true,
  });

  const [selectedFunction, setSelectedFunction] = useState(null);
  const [showSubMenus, setShowSubMenus] = useState({
    hocSinh: false,
    lopHoc: false,
    giaoVien: false,
  });

  const [activeMenus, setActiveMenus] = useState({
    hocSinh: false,
    lopHoc: false,
    giaoVien: false,
  });

  const toggleSubMenu = (menu) => {};
  const handleFunctionSelect = (func) => {
    setSelectedFunction(func);
    setShowSubMenus({
      ...showSubMenus,
      hocSinh: false,
      lopHoc: false,
      giaoVien: false,
    });
  };
  return (
    <div className="wrapper w-screen h-screen grid grid-cols-1">
      {/*
        Left side
      */}
      <div className="header fixed z-50 bg-white shadow-md h-full border-r md:shadow-md py-1">
        {/*
          Banner
        */}
        <div className="border-b">
          <div className="h-full flex items-center justify-start sm:justify-start px-3">
            <div className="flex items-center justify-start gap-2">
              <div className="flex items-center gap-4">
                <img className="w-16 h-16 rounded-full" src={imgAvatar} alt="Rounded avatar" />
                <div className="font-medium">
                  <div>Jese Leos</div>
                  <div className="text-sm text-gray-500">Joined in August 2014</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
          Navbar
        */}
        <div className="w-full">
          <ul>
            <li
              onMouseLeave={() => setShowSubMenus({ hocSinh: false })}
              onMouseEnter={() => setShowSubMenus({ hocSinh: true })}
              className={`group relative py-2 border-l-4 border-l-white hover:border-l-blue-700  ${activeMenus.hocSinh ? 'bg-blue-300' : 'hover:bg-slate-400'}`}
            >
              <div
                className="px-3 flex justify-start items-center gap-2 cursor-pointer"
                onClick={() => toggleSubMenu('hocSinh')}
              >
                <AiOutlineTeam className="" />
                <span className="font-medium">Quản lý học sinh</span>
              </div>
              {!showSubMenus.hocSinh && (
                <div className="absolute top-2 -right-[0.6rem] font-medium text-2xl text-white">
                  <FaCaretLeft />
                </div>
              )}
              {showSubMenus.hocSinh && (
                <ul className="dropdown-list w-[13.4rem] absolute z-50 -right-[13.45rem] px-2 top-0 bg-slate-300">
                  <li
                    className={`py-1 px-2 border-l-4 border-l-slate-300 hover:border-l-blue-700 hover:text-blue-700 ${selectedFunction === 'add-student' ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      handleFunctionSelect('add-student');
                      setActiveMenus({ hocSinh: true, lopHoc: false, giaoVien: false });
                    }}
                  >
                    <div className="absolute top-2 -left-[0.9rem] font-medium text-2xl text-slate-300">
                      <FaCaretLeft />
                    </div>
                    <a href="#add-student" className="">
                      Thêm mới hồ sơ học sinh
                    </a>
                  </li>
                  <li
                    className={`py-1 px-2 border-l-4 border-l-slate-300 hover:border-l-blue-700 hover:text-blue-700 ${selectedFunction === 'add-student-import' ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      handleFunctionSelect('add-student-import');
                      setActiveMenus({ hocSinh: true, lopHoc: false, giaoVien: false });
                    }}
                  >
                    <a href="#add-student-import" className="">
                      Import hồ sơ học sinh
                    </a>
                  </li>
                  <li
                    className={`py-1 px-2 border-l-4 border-l-slate-300 hover:border-l-blue-700 hover:text-blue-700 ${selectedFunction === 'edit-student' ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      handleFunctionSelect('list-student');
                      setActiveMenus({ hocSinh: true, lopHoc: false, giaoVien: false });
                    }}
                  >
                    <a href="#list-student" className="">
                      Danh sách học sinh
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li
              onMouseLeave={() => setShowSubMenus({ giaoVien: false })}
              onMouseEnter={() => setShowSubMenus({ giaoVien: true })}
              className={`group relative py-2 border-l-4 border-l-white hover:border-l-blue-700  ${activeMenus.giaoVien ? 'bg-blue-300' : 'hover:bg-slate-400'}`}
            >
              <div
                className="px-3 flex justify-start items-center gap-2 cursor-pointer"
                onClick={() => toggleSubMenu('giaoVien')}
              >
                <BsPersonVideo3 />
                <span className="font-medium">Quản lý giáo viên</span>
              </div>
              {!showSubMenus.giaoVien && (
                <div className="absolute top-2 -right-[0.6rem] font-medium text-2xl text-white">
                  <FaCaretLeft />
                </div>
              )}
              {showSubMenus.giaoVien && (
                <ul className="dropdown-list w-[13.4rem] absolute z-50 -right-[13.45rem] px-2 top-0 bg-slate-300">
                  <li
                    className={`py-1 px-2 border-l-4 border-l-slate-300 hover:border-l-blue-700 hover:text-blue-700 ${selectedFunction === 'add-teacher' ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      handleFunctionSelect('add-teacher');
                      setActiveMenus({ hocSinh: false, lopHoc: false, giaoVien: true });
                    }}
                  >
                    <div className="absolute top-2 -left-[0.9rem] font-medium text-2xl text-slate-300">
                      <FaCaretLeft />
                    </div>
                    <a href="#add-teacher" className="">
                      Thêm giáo viên
                    </a>
                  </li>
                  <li
                    className={`py-1 px-2 border-l-4 border-l-slate-300 hover:border-l-blue-700 hover:text-blue-700 ${selectedFunction === 'edit-teacher' ? 'bg-gray-300' : ''}`}
                    onClick={() => handleFunctionSelect('edit-teacher')}
                  >
                    <a href="#edit-teacher" className="">
                      Danh sách giáo viên
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li
              onMouseLeave={() => setShowSubMenus({ lopHoc: false })}
              onMouseEnter={() => setShowSubMenus({ lopHoc: true })}
              className={`group relative py-2 border-l-4 border-l-white hover:border-l-blue-700  ${activeMenus.lopHoc ? 'bg-blue-300' : 'hover:bg-slate-400'}`}
            >
              <div className="px-3 flex justify-start items-center gap-2 cursor-pointer">
                <SiGoogleclassroom />
                <span className="font-medium">Quản lý lớp học</span>
              </div>
              {!showSubMenus.lopHoc && (
                <div className="absolute top-2 -right-[0.6rem] font-medium text-2xl text-white">
                  <FaCaretLeft />
                </div>
              )}
              {showSubMenus.lopHoc && (
                <ul className="dropdown-list w-[13.4rem] absolute z-50 -right-[13.45rem] px-2 top-0 bg-slate-300">
                  <li
                    className={`py-1 px-2 border-l-4 border-l-slate-300 hover:border-l-blue-700 hover:text-blue-700 ${selectedFunction === 'add-classRoom' ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      handleFunctionSelect('add-classRoom');
                      setActiveMenus({ hocSinh: false, lopHoc: true, giaoVien: false });
                    }}
                  >
                    <div className="absolute top-2 -left-[0.9rem] font-medium text-2xl text-slate-300">
                      <FaCaretLeft />
                    </div>
                    <a href="#add-classRoom">Thêm lớp học</a>
                  </li>
                  <li
                    className={`py-1 px-2 border-l-4 border-l-slate-300 hover:border-l-blue-700 hover:text-blue-700 ${selectedFunction === 'list-classRoom' ? 'bg-gray-300' : ''}`}
                    onClick={() => {
                      handleFunctionSelect('list-classRoom');
                      setActiveMenus({ hocSinh: false, lopHoc: true, giaoVien: false });
                    }}
                  >
                    <a href="#list-classRoom">Danh sách lớp học</a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
      {/*
        Right side
      */}
      <div className="body w-full h-screen">
        {selectedFunction === null ? (
          <div className="flex items-center justify-center h-full w-full">
            <img className="scale-150" src={imgBanner} alt="Rounded avatar" />
          </div>
        ) : (
          <>
            {selectedFunction === 'add-student' && <QuanLyHocSinh functionType="add-student" />}
            {selectedFunction === 'add-student-import' && <QuanLyHocSinh functionType="add-student-import" />}
            {selectedFunction === 'add-teacher' && <QuanLyGiaoVien functionType="add-teacher" />}
            {selectedFunction === 'edit-teacher' && <QuanLyGiaoVien functionType="edit-teacher" />}
            {selectedFunction === 'add-classRoom' && <AddClass functionType="add-classRoom" />}
            {selectedFunction === 'list-classRoom' && <ListClass functionType="list-classRoom" />}
            {selectedFunction === 'list-student' && <QuanLyHocSinh functionType="list-student" />}
          </>
        )}
      </div>
    </div>
  );
}
