import React from 'react';
import 'flowbite';
import { useEffect, useState } from 'react';
import imgAvatar from '../assets/avatar.jpg';
import imgBanner from '../assets/img-banner.png';
import { AiOutlineTeam } from 'react-icons/ai';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { BsPersonVideo3 } from 'react-icons/bs';
import { SiGoogleclassroom } from 'react-icons/si';

import QuanLyHocSinh from './Manager/Student/QuanLyHocSinh';
import QuanLyGiaoVien from './Manager/Teacher/QuanLyGiaoVien';
import AddClass from './Manager/Class/AddClass';
import ListClass from './Manager/Class/ListClass';

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
        <div className="w-full 2xl:w-2/12 lg:w-3/12 border-r">
          <div className="border-b">
            <div className="h-full flex items-center justify-center text-lg">
              <div className="w-4/5 flex items-center justify-start gap-2">
                <div className="flex items-center gap-4">
                  <img className="w-16 h-16 rounded-full" src={imgAvatar} alt="Rounded avatar" />
                  <div className="font-medium dark:text-white">
                    <div>Jese Leos</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
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
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'add-student-import' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('add-student-import')}
                    >
                      <a href="#add-student-import" className="text-gray-700">
                        Import hồ sơ học sinh
                      </a>
                    </li>
                    <li
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'edit-student' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('list-student')}
                    >
                      <a href="#list-student" className="text-gray-700">
                        Danh sách học sinh
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
                        Danh sách giáo viên
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
                      className={`py-1 hover:bg-gray-200 ${selectedFunction === 'list-classRoom' ? 'bg-gray-300' : ''}`}
                      onClick={() => handleFunctionSelect('list-classRoom')}
                    >
                      <a href="#list-classRoom" className="text-gray-700">
                        Danh sách lớp học
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
        <div className="w-full 2xl:w-10/12 lg:w-10/12 sm:w-full flex md:items-start md:justify-start sm:items-center sm:justify-center">
          {selectedFunction === null ? (
            <div className="flex items-center justify-center h-full w-full">
              <img className="scale-150" src={imgBanner} alt="Rounded avatar" />
            </div>
          ) : (
            <>
              {selectedFunction === 'add-student' && <QuanLyHocSinh functionType="add-student" />}
              {selectedFunction === 'add-student-import' && <QuanLyHocSinh functionType="add-student-import" />}
              {selectedFunction === 'add-teacher' && <QuanLyGiaoVien functionType="add-teacher" />}
              {selectedFunction === 'add-classRoom' && <AddClass functionType="add-classRoom" />}
              {selectedFunction === 'list-classRoom' && <ListClass functionType="list-classRoom" />}
              {selectedFunction === 'list-student' && <QuanLyHocSinh functionType="list-student" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
