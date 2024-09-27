import 'flowbite';
import React from 'react';
import { useEffect, useState } from 'react';

export default function TeachingAssignment() {
  return (
    <div id="root" className="grid grid-flow-row gap-4 p-4 px-10 max-h-full overflow-auto relative">
      <div className="pb-5">
        <span className="text-lg font-medium flex items-center justify-start gap-1">Phân công giảng dạy</span>
        <span className="text-sm text-gray-500 font-normal flex items-center justify-start gap-1">
          Chức năng này giúp bạn phân công giáo viên giảng dạy môn học
        </span>
      </div>
      <div>
        <span className="font-medium">1. Chọn môn học*</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        <div>
          <label htmlFor="khoiLop">Khối lớp</label>
          <select name="khoiLop" id="khoiLop" className="w-full p-2 border border-gray-300 rounded">
            <option value="" selected></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
          <label htmlFor="tenMonHoc">Môn học</label>
          <select name="khoiLop" id="khoiLop" className="w-full p-2 border border-gray-300 rounded">
            <option value="" selected></option>
            <option value="Tiếng việt">Tiếng việt</option>
            <option value="Toán">Toán</option>
          </select>
        </div>
      </div>
    </div>
  );
}
