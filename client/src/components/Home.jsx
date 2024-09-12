import React from "react";
import "flowbite";
import { useEffect, useState } from "react";
import imgAvatar from "../assets/avatar.jpg";
import imgBanner from "../assets/img-banner.png";
import { AiOutlineTeam } from "react-icons/ai";
import { FaAngleDown, FaAngleUp, FaChalkboardTeacher } from "react-icons/fa";

export default function Home() {
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [showSubMenus, setShowSubMenus] = useState({
    hocSinh: false,
    lopHoc: false,
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
      <div className="h-full w-full flex flex-col md:flex-row">
        {/* navbar */}
        <div className="w-full md:w-2/12 border-r-2">
          <div className="border-b-2">
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
          <div className="h-92pt">
            <div className="flex items-start justify-center text-lg pt-4">
              <ul className="w-4/5">
                <li className="py-2">
                  <div className="flex justify-start items-center gap-2 cursor-pointer" onClick={() => toggleSubMenu("hocSinh")}>
                    <AiOutlineTeam className="text-3xl text-gray-500" />
                    <span className="font-medium">Quản lý học sinh</span>
                    {showSubMenus.hocSinh ? <FaAngleUp /> : <FaAngleDown />}
                  </div>
                  {showSubMenus.hocSinh && (
                    <ul className="ml-10 mt-2 slide-down">
                      <li className="py-1 hover:bg-gray-200" onClick={() => handleFunctionSelect("add-student")}>
                        <a href="#add-student" className="text-gray-700">
                          Thêm học sinh
                        </a>
                      </li>
                      <li className="py-1 hover:bg-gray-200" onClick={() => handleFunctionSelect("edit-student")}>
                        <a href="#edit-student" className="text-gray-700">
                          Chỉnh sửa học sinh
                        </a>
                      </li>
                      <li className="py-1 hover:bg-gray-200" onClick={() => handleFunctionSelect("delete-student")}>
                        <a href="#delete-student" className="text-gray-700">
                          Xóa học sinh
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
                <li className="py-2">
                  <div className="flex justify-start items-center gap-2 cursor-pointer" onClick={() => toggleSubMenu("lopHoc")}>
                    <FaChalkboardTeacher className="text-3xl text-gray-500" />
                    <span className="font-medium">Quản lý lớp học</span>
                    {showSubMenus.lopHoc ? <FaAngleUp /> : <FaAngleDown />}
                  </div>
                  {showSubMenus.lopHoc && (
                    <ul className="ml-10 mt-2 slide-down">
                      <li className="py-1 hover:bg-gray-200" onClick={() => handleFunctionSelect("add-class")}>
                        <a href="#add-class" className="text-gray-700">
                          Thêm lớp học
                        </a>
                      </li>
                      <li className="py-1 hover:bg-gray-200" onClick={() => handleFunctionSelect("edit-class")}>
                        <a href="#edit-class" className="text-gray-700">
                          Chỉnh sửa lớp học
                        </a>
                      </li>
                      <li className="py-1 hover:bg-gray-200" onClick={() => handleFunctionSelect("delete-class")}>
                        <a href="#delete-class" className="text-gray-700">
                          Xóa lớp học
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* body */}
        <div className="w-full md:w-10/12 flex items-center justify-center">
          {selectedFunction === null ? (
            <div className="h-95pt w-97pt flex items-center justify-center rounded-xl border-solid border-2 border-gray-200">
              <img className="w-7/12" src={imgBanner} alt="Rounded avatar" />
            </div>
          ) : (
            <div className="h-full h-95pt md:h-95pt w-97pt flex items-start justify-start rounded-xl border-solid border-2 border-gray-200">
              <div className="grid grid-flow-row gap-4 p-4">
                <div>
                  <span>1. Thông tin cá nhân</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <div>
                    <label htmlFor="name1">Họ và tên</label>
                    <input type="text" id="name1" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="name2">Năm sinh</label>
                    <input type="text" id="name2" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="name3">Giới tính</label>
                    <input type="text" id="name3" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="name4">Dân tộc</label>
                    <input type="text" id="name4" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="name5">Nhóm máu</label>
                    <input type="text" id="name5" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="name5">SĐT liên lạc</label>
                    <input type="text" id="name5" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="name5">Địa chỉ thường trú</label>
                    <input type="text" id="name5" className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
