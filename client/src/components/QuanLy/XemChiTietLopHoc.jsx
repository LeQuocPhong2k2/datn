import React from 'react';
import { useEffect, useState } from 'react';
import 'flowbite';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

import DanhSachLopHoc from './DanhSachLopHoc';

export default function XemChiTietLopHoc({ idClass }) {
  const [iBackDanhSachLopHoc, setBackDanhSachLopHoc] = useState(false);

  const handleBackDsLopHoc = () => {
    setBackDanhSachLopHoc(true);
  };

  return (
    <>
      {iBackDanhSachLopHoc && <DanhSachLopHoc />}
      {!iBackDanhSachLopHoc && (
        <div
          id="root"
          className="grid grid-flow-row gap-4 p-4 max-h-full w-full overflow-auto relative"
        >
          <div className="flex items-center justify-start gap-2">
            <span
              onClick={handleBackDsLopHoc}
              className="font-medium flex items-center justify-start gap-1 text-blue-500 cursor-pointer"
            >
              <IoMdArrowRoundBack /> Quay lại danh sách lớp học
            </span>
            <span className="font-medium">/ Xem thông tin chi tiết lớp học {idClass}</span>
          </div>
          <div>
            <span className="font-medium">1. Thông tin chung</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Năm học</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Khối lớp</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Tên lớp học
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Gv Chủ nhiệm
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Buổi học</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Ngày bắt đầu lớp học
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Sỉ số tối đa
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Sỉ số hiện tại
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">SLHS Nam</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">SLHS Nữ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">2024-2025</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1A1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    Nguyễn Văn Nghĩa
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">Sáng</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    15/09/2024
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">42</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">40</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">25</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">15</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <span className="font-medium">2. Danh sách học sinh</span>
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
            <div className="flex items-center relative">
              <input
                type="text"
                id="namHoc"
                className="w-full p-2  border border-gray-300 rounded"
                placeholder="Tìm kiếm tên học sinh..."
              />
              <IoSearch className="absolute right-4" />
            </div>

            <button className="w-fit flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded">
              Xuất danh sách học sinh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">STT</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Mã số học sinh
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Họ và tên</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Năm sinh</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Giới tính</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Lớp</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Ngày vào trường
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Số điện thoại
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">200300024</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    Võ Văn Ngân
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    17/01/2002
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">Nữ</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1A1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    15/09/2024
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    0329347405
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
