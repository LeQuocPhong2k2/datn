import 'flowbite';
import React from 'react';
import { useEffect, useState } from 'react';

export default function AddSubject() {
  return (
    <div id="root" className="grid grid-flow-row gap-4 p-4 px-10 max-h-full overflow-auto relative">
      <div className="pb-5">
        <span className="text-lg font-medium flex items-center justify-start gap-1">Thêm mới môn học</span>
        <span className="text-sm text-gray-500 font-normal flex items-center justify-start gap-1">
          Chức năng này giúp bạn thêm mới môn học vào hệ thống
        </span>
      </div>
      <div>
        <span className="font-medium">1. Thông tin môn học</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        <div>
          <label htmlFor="tenMonHoc">Tên môn học*</label>
          <input type="text" id="tenMonHoc" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label htmlFor="khoiLop">Khối lớp*</label>
          <input type="text" id="khoiLop" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label htmlFor="soTiet">Số tiết học*</label>
          <input type="text" id="soTiet" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label htmlFor="loaiMonHoc">Loại môn học*</label>
          <select name="loaiMonHoc" id="loaiMonHoc" className="w-full p-2 border border-gray-300 rounded">
            <option value="" selected></option>
            <option value="Cơ bản">Cơ bản</option>
            <option value="Năng khiếu">Năng khiếu</option>
            <option value="Ngoại ngữ">Ngoại ngữ</option>
            <option value="Thể chất">Thể chất</option>
          </select>
        </div>
        <div>
          <label htmlFor="moTa">Mô tả</label>
          <input type="text" id="moTa" className="w-full p-2 border border-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}
