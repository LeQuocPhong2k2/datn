import React from 'react';
import 'flowbite';
import { FiSearch } from 'react-icons/fi';

export default function QuanLyGiaoVien({ functionType }) {
  return (
    <>
      {functionType === 'add-classRoom' && (
        <div className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto">
          <div>
            <span className="font-medium">1. Thông tin chung</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Năm học*</label>
              <input type="text" id="name1" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="relative">
              <label htmlFor="name1">Giáo viên chủ nhiệm*</label>
              <input
                type="text"
                id="name1"
                value="Nguyễn Văn Cao"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <FiSearch className="absolute right-2 top-9 cursor-pointer" />
            </div>
            <div>
              <label htmlFor="name1">Ngày bắt đầu lớp học*</label>
              <input
                type="date"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name1">Khối lớp*</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                name="gioi-tinh"
                id="gioi-tinh"
              >
                <option value="" selected></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label htmlFor="name2">Tên Lớp*</label>
              <input type="text" id="name2" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="gioi-tinh">Buổi*</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                name="gioi-tinh"
                id="gioi-tinh"
              >
                <option value="" selected></option>
                <option value="Nu">Sáng</option>
                <option value="Nam">Chiều</option>
              </select>
            </div>
          </div>

          <div>
            <span className="font-medium">2. Import danh sách học sinh</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <input type="file" id="name1" className="w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <button
              type="button"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Thêm lớp học
            </button>
          </div>
        </div>
      )}
    </>
  );
}
