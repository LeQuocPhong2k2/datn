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
        <span className="font-medium">1. Chọn lớp học*</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <div>
          <label htmlFor="name2">Năm học*</label>
          <input
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            type="text"
            value="2024-2025"
            disabled
          />
        </div>
        <div>
          <label htmlFor="name2">Lớp học*</label>
          <select name="tenLop" id="tenLop" className="w-full p-2 border border-gray-300 rounded">
            <option value=""></option>
            <option value="1A1" selected>
              1A1
            </option>
            <option value="1A2">1A2</option>
            <option value="1A3">1A3</option>
            <option value="1A4">1A4</option>
            <option value="1A5">1A5</option>
            <option value="2A1">2A1</option>
            <option value="2A2">2A2</option>
            <option value="2A3">2A3</option>
            <option value="2A4">2A4</option>
            <option value="2A5">2A5</option>
            <option value="3A1">1A1</option>
            <option value="3A2">1A2</option>
            <option value="3A3">1A3</option>
            <option value="3A4">1A4</option>
            <option value="3A5">3A5</option>
            <option value="4A1">4A1</option>
            <option value="4A2">4A2</option>
            <option value="4A3">4A3</option>
            <option value="4A4">4A4</option>
            <option value="4A5">4A5</option>
            <option value="5A1">5A1</option>
            <option value="5A2">5A2</option>
            <option value="5A3">5A3</option>
            <option value="5A4">5A4</option>
            <option value="5A5">5A5</option>
          </select>
        </div>
        <div>
          <label htmlFor="name2">Giáo viên chủ nhiệm</label>
          <input
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            type="text"
            value="Nguyễn Thị A"
            disabled
          />
        </div>
        <div>
          <div></div>
          <br />
          <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tìm kiếm</button>
        </div>
      </div>
      <div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-14">STT</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-60">Môn học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Nhóm môn học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Giáo viên</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-32">Học kỳ 1</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-32">Học kỳ 2</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-20"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">1</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">Toán</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <select name="tenGiaoVien" id="tenGiaoVien" className="w-full p-2 border border-gray-300 rounded">
                  <option value="" selected></option>
                  <option value="GV001">Cơ bản</option>
                  <option value="GV002">Nghệ thuật</option>
                  <option value="GV003">Ngoại ngữ</option>
                  <option value="GV003">Thể chẩt</option>
                </select>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <select name="tenGiaoVien" id="tenGiaoVien" className="w-full p-2 border border-gray-300 rounded">
                  <option value="" selected></option>
                  <option value="GV001">Nguyễn Thị A</option>
                  <option value="GV002">Nguyễn Thị B</option>
                  <option value="GV003">Nguyễn Thị C</option>
                </select>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <input type="checkbox" />
                </div>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <input type="checkbox" />
                </div>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Lưu</button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">2</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">Văn</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <select name="tenGiaoVien" id="tenGiaoVien" className="w-full p-2 border border-gray-300 rounded">
                  <option value="" selected></option>
                  <option value="GV001">Cơ bản</option>
                  <option value="GV002">Năng khiếu</option>
                  <option value="GV003">Ngoại ngữ</option>
                  <option value="GV003">Thể chẩt</option>
                </select>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <select name="tenGiaoVien" id="tenGiaoVien" className="w-full p-2 border border-gray-300 rounded">
                  <option value="" selected></option>
                  <option value="GV001">Nguyễn Thị A</option>
                  <option value="GV002">Nguyễn Thị B</option>
                  <option value="GV003">Nguyễn Thị C</option>
                </select>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <input type="checkbox" />
                </div>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <input type="checkbox" />
                </div>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Lưu</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
