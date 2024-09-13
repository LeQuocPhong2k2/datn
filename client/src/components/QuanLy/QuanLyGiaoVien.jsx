import React from 'react';
import 'flowbite';
import { GoPersonAdd } from 'react-icons/go';
import { MdOutlineBookmarkAdd } from 'react-icons/md';

export default function QuanLyGiaoVien({ functionType }) {
  return (
    <>
      {functionType === 'add-teacher' && (
        <div className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto">
          <div>
            <span className="font-medium">1. Thông tin cá nhân</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Họ và tên*</label>
              <input type="text" id="name1" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name2">Năm sinh*</label>
              <input type="date" id="name2" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name2">Số CCCD*</label>
              <input type="text" id="name2" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="gioi-tinh">Giới tính*</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                name="gioi-tinh"
                id="gioi-tinh"
              >
                <option value="" selected></option>
                <option value="Nu">Nữ</option>
                <option value="Nam">Nam</option>
              </select>
            </div>
            <div>
              <label htmlFor="name4">Trình độ chuyên môn*</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                name="gioi-tinh"
                id="gioi-tinh"
              >
                <option value="" selected></option>
                <option value="">Cử nhân</option>
                <option value="">Thạc sĩ</option>
                <option value="">Tiến sĩ</option>
              </select>
            </div>

            <div>
              <label htmlFor="name5">SĐT liên lạc*</label>
              <input type="text" id="name5" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name5">Địa chỉ thường trú*</label>
              <input type="text" id="name5" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name5">Ngày bắt đầu công tác*</label>
              <input type="date" id="name5" className="w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <button
              type="button"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Thêm giáo viên
            </button>
          </div>
        </div>
      )}
    </>
  );
}
