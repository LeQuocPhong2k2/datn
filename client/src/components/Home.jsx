import React from 'react';
import 'flowbite';
import { useEffect, useState } from 'react';
import imgAvatar from '../assets/avatar.jpg';
import imgBanner from '../assets/img-banner.png';
import { AiOutlineTeam } from 'react-icons/ai';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { BsPersonVideo3 } from 'react-icons/bs';
import { SiGoogleclassroom } from 'react-icons/si';

import QuanLyHocSinh from './QuanLy/QuanLyHocSinh';
import QuanLyGiaoVien from './QuanLy/QuanLyGiaoVien';
import QuanLyLopHoc from './QuanLy/QuanLyLopHoc';

export default function Home() {
  useEffect(() => {
    document.title = 'Home';
  }, []);

  const [selectedFunction, setSelectedFunction] = useState(null);
  const [showSubMenus, setShowSubMenus] = useState({
    hocSinh: false,
    lopHoc: false,
    giaoVien: false,
  });

  const toggleSubMenu = (menu) => {
    setShowSubMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };
  const handleFunctionSelect = (func) => {
    setSelectedFunction(func);
  };
  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full flex flex-col lg:flex-row">
        {/* navbar */}
        <div className="w-full lg:w-3/12 border-r-2">
          <div className="border-b-2">
            <div className="h-full flex items-center justify-center text-lg">
              <div className="w-4/5 flex items-center justify-start gap-2">
                <div className="flex items-center gap-4">
                  <img className="w-16 h-16 rounded-full" src={imgAvatar} alt="Rounded avatar" />
                  <div className="font-medium dark:text-white">
                    <div>Jese Leos</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Joined in August 2014
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-h-full flex items-start justify-center text-base md:text-lg pt-4">
            <ul className="w-4/5">
              <li className="py-2">
                <div
                  className="flex justify-start items-center gap-2 cursor-pointer"
                  onClick={() => toggleSubMenu('hocSinh')}
                >
                  <AiOutlineTeam className="text-2xl text-gray-500" />
                  <span className="font-medium">Quản lý học sinh</span>
                  {showSubMenus.hocSinh ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {showSubMenus.hocSinh && (
                  <ul className="ml-10 mt-2 slide-down">
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'add-student' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('add-student')}
                    >
                      <a href="#add-student" className="text-gray-700">
                        Thêm mới hồ sơ học sinh
                      </a>
                    </li>
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'edit-student' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('edit-student')}
                    >
                      <a href="#edit-student" className="text-gray-700">
                        Chỉnh sửa học sinh
                      </a>
                    </li>
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'delete-student' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('delete-student')}
                    >
                      <a href="#delete-student" className="text-gray-700">
                        Xóa học sinh
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li className="py-2">
                <div
                  className="flex justify-start items-center gap-2 cursor-pointer"
                  onClick={() => toggleSubMenu('giaoVien')}
                >
                  <BsPersonVideo3 className="text-2xl text-gray-500" />
                  <span className="font-medium">Quản lý giáo viên</span>
                  {showSubMenus.giaoVien ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {showSubMenus.giaoVien && (
                  <ul className="ml-10 mt-2 slide-down">
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'add-teacher' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('add-teacher')}
                    >
                      <a href="#add-teacher" className="text-gray-700">
                        Thêm giáo viên
                      </a>
                    </li>
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'edit-teacher' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('edit-teacher')}
                    >
                      <a href="#edit-teacher" className="text-gray-700">
                        Chỉnh sửa giáo viên
                      </a>
                    </li>
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'delete-teacher' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('delete-teacher')}
                    >
                      <a href="#delete-teacher" className="text-gray-700">
                        Xóa giáo viên
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li className="py-2">
                <div
                  className="flex justify-start items-center gap-2 cursor-pointer"
                  onClick={() => toggleSubMenu('lopHoc')}
                >
                  <SiGoogleclassroom className="text-2xl text-gray-500" />
                  <span className="font-medium">Quản lý lớp học</span>
                  {showSubMenus.lopHoc ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {showSubMenus.lopHoc && (
                  <ul className="ml-10 mt-2 slide-down">
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'add-classRoom' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('add-classRoom')}
                    >
                      <a href="#add-classRoom" className="text-gray-700">
                        Thêm lớp học
                      </a>
                    </li>
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'edit-classRoom' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('edit-classRoom')}
                    >
                      <a href="#edit-classRoom" className="text-gray-700">
                        Chỉnh sửa lớp học
                      </a>
                    </li>
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'delete-classRoom' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('delete-classRoom')}
                    >
                      <a href="#delete-classRoom" className="text-gray-700">
                        Xóa lớp học
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* body */}
        <div className="w-full lg:w-9/12 flex items-start justify-start">
          {selectedFunction === null ? (
            <div className="flex items-center justify-center h-full w-full">
              <img className="scale-150" src={imgBanner} alt="Rounded avatar" />
            </div>
          ) : (
            <>
              {selectedFunction === 'add-student' && <QuanLyHocSinh functionType="add-student" />}
              {selectedFunction === 'add-teacher' && <QuanLyGiaoVien functionType="add-teacher" />}
              {selectedFunction === 'add-classRoom' && (
                <QuanLyLopHoc functionType="add-classRoom" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
