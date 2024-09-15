import { RiExpandLeftRightFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';

import XemChiTietLopHoc from './XemChiTietLopHoc';

export default function DanhSachLopHoc() {
  const [iShowClassDetail, setShowClassDetail] = useState(false);
  const [iShowExport, setShowExport] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const handleFilter = () => {
    // Thực hiện lọc lớp học dựa trên academicYear và grade
  };

  const handleExport = () => {
    setShowExport(!iShowExport);
    console.log('Export danh sách lớp học');
  };

  const handleEdit = (classId) => {
    // Thực hiện chỉnh sửa lớp học
    console.log('Chỉnh sửa lớp học:', classId);
  };

  const handleViewDetails = (classId) => {
    // Thực hiện xem chi tiết lớp học
    console.log('Xem chi tiết lớp học:', classId);
    setShowClassDetail(true);
  };

  //handle selected all
  const handleSelectAll = (e) => {
    const checkboxes = document.querySelectorAll('input[name="checkedExport"]');
    if (e.target.checked) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  };

  const handleCheckedItem = () => {
    const checkboxes = document.querySelectorAll('input[name="checkedExport"]');
    const checkedExportAll = document.getElementById('checkedExportAll');
    let count = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        count++;
      }
    });

    if (count === checkboxes.length) {
      checkedExportAll.checked = true;
    } else {
      checkedExportAll.checked = false;
    }
  };

  return (
    <>
      {iShowClassDetail && <XemChiTietLopHoc idClass="1A1" />}
      {!iShowClassDetail && (
        <div
          id="root"
          className="grid grid-flow-row gap-4 p-4 max-h-full w-full overflow-auto relative"
        >
          <div>
            <span className="font-medium">Bộ lọc tìm kiếm</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div className="grid grid-cols-10 items-center gap-2">
              <label htmlFor="name1" className="col-span-3">
                Năm học*
              </label>
              <select
                name="khoiLop"
                id="khoiLop"
                className="col-span-7 p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="2020-2021">2020-2021</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>
            <div className="grid grid-cols-10 items-center gap-2">
              <label htmlFor="name1" className="col-span-3">
                Khối lớp*
              </label>
              <select
                name="khoiLop"
                id="khoiLop"
                className="col-span-7 p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="grid grid-cols-10 items-center gap-2">
              <label htmlFor="name1" className="col-span-3">
                Tên lớp
              </label>
              <input type="text" className="col-span-7 p-2 border border-gray-300 rounded" />
            </div>
            <div className="grid grid-cols-10 items-center gap-2">
              <label htmlFor="name1" className="col-span-3">
                Buổi học*
              </label>
              <select
                name="khoiLop"
                id="khoiLop"
                className="col-span-7 p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="Sáng">Sáng</option>
                <option value="Chiều">Chiều</option>
              </select>
            </div>
            <div className="grid grid-flow-col items-center gap-2">
              <button
                onClick={handleFilter}
                className="item bg-blue-500 text-white px-4 py-2 rounded"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="flex items-center justify-start gap-2">
            <span className="font-medium">Danh sách lớp học</span>
            <div className="relative">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Xuất danh sách
                <RiExpandLeftRightFill className="rotate-90" />
              </button>
              {iShowExport && (
                <ul className="w-full absolute z-50 bg-white border rounded mt-1 p-2 slide-down">
                  <li className="px-1 hover:bg-gray-200 ">
                    <a href="#add-student" className="text-gray-700">
                      Xuất danh sách lớp học
                    </a>
                  </li>
                  <li className="px-1 hover:bg-gray-200 ">
                    <a href="#list-student" className="text-gray-700">
                      Xuất danh sách học sinh
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-b border-gray-300 text-center">
                    <input id="checkedExportAll" type="checkbox" onChange={handleSelectAll} />
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">STT</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Tên lớp học
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Năm học</th>

                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Buổi học</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Khối lớp</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">
                    Giáo viên chủ nhiệm
                  </th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border border-b border-gray-300 text-center">
                    <input onClick={handleCheckedItem} name="checkedExport" type="checkbox" />
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1A1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">2024-2025</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1</td>

                  <td className="py-2 px-4 border border-b border-gray-300 text-left">Sáng</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    Nguyễn Văn Nghĩa
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    <div className="flex gap-2">
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded">
                        Chỉnh Sửa
                      </button>
                      <button
                        onClick={handleViewDetails}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Xem Chi Tiết
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border border-b border-gray-300 text-center">
                    <input onClick={handleCheckedItem} name="checkedExport" type="checkbox" />
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1A1</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">2024-2025</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">1</td>

                  <td className="py-2 px-4 border border-b border-gray-300 text-left">Sáng</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    Nguyễn Văn Nghĩa
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    <div className="flex gap-2">
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded">
                        Chỉnh Sửa
                      </button>
                      <button
                        onClick={handleViewDetails}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Xem Chi Tiết
                      </button>
                    </div>
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
