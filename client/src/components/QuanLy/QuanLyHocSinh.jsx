import React from 'react';
import 'flowbite';
import { FiSearch } from 'react-icons/fi';

export default function QuanLyHocSinh({ functionType }) {
  return (
    <>
      {functionType === 'add-student' && (
        <div className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto">
          <div>
            <span className="font-medium">1. Thông tin cá nhân</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Mã số sinh viên*</label>
              <input
                disabled
                type="text"
                id="name1"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
                placeholder="Sinh mã tự động"
              />
            </div>
            <div>
              <label htmlFor="name1">Họ và tên*</label>
              <input type="text" id="name1" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name2">Năm sinh*</label>
              <input type="date" id="name2" className="w-full p-2 border border-gray-300 rounded" />
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
              <label htmlFor="name4">Ngày vào trường*</label>
              <input type="date" id="name4" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name5">SĐT liên lạc*</label>
              <input type="text" id="name5" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name5">Địa chỉ thường trú*</label>
              <input type="text" id="name5" className="w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>
          <div>
            <span className="font-medium">2. Thông tin gia đình</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Họ tên cha*</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name1">Năm sinh cha*</label>
              <input
                type="date"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="relative">
              <label htmlFor="name1">Nghề nghiệp cha*</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="relative">
              <label htmlFor="name1">Số điện thoại cha*</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Họ tên mẹ*</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2  border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name1">Năm sinh mẹ*</label>
              <input
                type="date"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="relative">
              <label htmlFor="name1">Nghề nghiệp mẹ*</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="relative">
              <label htmlFor="name1">Số điện thoại mẹ*</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <span className="font-medium">3. Thông tin người giám hộ</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Mối quan hệ</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                name="gioi-tinh"
                id="gioi-tinh"
              >
                <option value="" selected></option>
                <option value="Nu">Ông bà</option>
                <option value="Nam">Anh chị</option>
                <option value="Nam">Họ hàng</option>
              </select>
            </div>
            <div>
              <label htmlFor="name1">Họ tên người giám hộ</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name1">Năm sinh người giám hộ</label>
              <input
                type="date"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="relative">
              <label htmlFor="name1">Nghề nghiệp người giám hộ</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="relative">
              <label htmlFor="name1">Số điện thoại người giám hộ</label>
              <input
                type="text"
                id="name1"
                value=""
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <span className="font-medium">4. Thêm vào lớp học</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Năm học*</label>
              <input
                disabled
                type="text"
                id="name1"
                value="2024 - 2025"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
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
            <div className="relative">
              <label htmlFor="name1">Lớp học*</label>
              <input
                disabled
                type="text"
                id="name1"
                value="1A2"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
              <FiSearch className="absolute right-2 top-9 cursor-pointer" />
            </div>
            <div className="relative">
              <label htmlFor="name1">Giáo viên chủ nhiệm</label>
              <input
                disabled
                type="text"
                id="name1"
                value=""
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
            </div>

            <div className="relative">
              <label htmlFor="name1">Sỉ số lớp hiện tại</label>
              <input
                disabled
                type="text"
                id="name1"
                value=""
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <button
              type="button"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Thêm học sinh
            </button>
          </div>
        </div>
      )}
    </>
  );
}
