import { RiExpandLeftRightFill } from 'react-icons/ri';
import { useState, useEffect, useRef } from 'react';
import { PiExport } from 'react-icons/pi';

import 'react-datepicker/dist/react-datepicker.css';
import { LuFilterX } from 'react-icons/lu';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc, getDsHocSinhByLopHoc } from '../../../api/Class';

import ViewClassDetail from './ViewClassDetail';
import UpdateClass from './UpdateClass';

export default function ListClass({ filterClass, action }) {
  const [pageLoading, setPageLoading] = useState(true);
  const fileExtension = '.xlsx';
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const [filter, setFilter] = useState({
    namHoc: '',
    khoiLop: '',
    tenLop: '',
    buoiHoc: '',
  });
  const [classUpdate, setClassUpdate] = useState({
    id: '',
    namHoc: '',
    khoiLop: '',
    tenLop: '',
    giaoVienChuNhiem: '',
    idGiaoVienChuNhiem: '',
    ngayBatDau: '',
    buoiHoc: '',
  });

  useEffect(() => {
    handlePageLoading();
  }, []);

  const handlePageLoading = () => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  const dropdownRef = useRef(null);

  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [iShowExport, setShowExport] = useState(false);
  const [studentList, setStudentList] = useState([]);

  const [iShowComponet, setShowComponet] = useState({
    classList: true,
    classDetail: false,
    classUpdate: false,
    searchStudent: false,
    exportDetail: false,
  });

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    setFilter({ ...filter, namHoc: `${year}-${year + 1}` });

    const fetchClasses = async () => {
      try {
        const res = await getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc(`${year}-${year + 1}`, '', '', '');
        setClasses(res.data);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm lớp học:', error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //handle click outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowExport(false);
    }
  };

  /**
   * handle search class
   */
  const handleSearchClass = async () => {
    try {
      const res = await getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc(
        filter.namHoc,
        filter.khoiLop,
        filter.tenLop,
        filter.buoiHoc
      );
      setClasses(res.data);
      setShowComponet({
        ...iShowComponet,
        classList: true,
        classDetail: false,
        classUpdate: false,
      });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm lớp học:', error);
    }
  };

  //handle clear filters
  const handleClearFilters = () => {
    setFilter({
      ...filter,
      namHoc: '',
      khoiLop: '',
      tenLop: '',
      buoiHoc: '',
    });
  };

  /**
   * handle show export class
   */
  const handleShowExportClass = () => {
    setShowExport(!iShowExport);
  };

  /**
   * handle export class
   * @param {*} args
   */
  const handleExportClass = (args) => {
    let columnNames = [];
    let formatData = [];
    if (args === 'basic') {
      ({ columnNames, formatData } = exportClassDetailBasic());
    }
    const ws = XLSX.utils.json_to_sheet(formatData, {
      header: columnNames,
    });
    const wb = {
      Sheets: { DSLOP: ws },
      SheetNames: ['DSLOP'], // Ensure SheetNames is an array
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataBlob, 'Danh sách lớp năm học ' + filter.namHoc + fileExtension);
  };

  /**
   * set data for export class detail basic
   * @returns
   */
  const exportClassDetailBasic = () => {
    const columnNames = [
      'STT',
      'Năm học',
      'Khối lớp',
      'Tên lớp',
      'Buổi học',
      'Giáo viên chủ nhiệm',
      'Ngày vào bắt đầu lớp học',
      'Sỉ số',
    ];
    const formatData = classes.map((item, index) => ({
      STT: index + 1,
      'Năm học': item.academicYear,
      'Khối lớp': item.grade,
      'Tên lớp': item.className,
      'Buổi học': item.classSession,
      'Giáo viên chủ nhiệm': item.teacherInfo.userName,
      'Ngày vào bắt đầu lớp học': new Date(item.startDate).toLocaleDateString('en-GB'),
      'Sỉ số': item.totalStudents,
    }));
    return { columnNames, formatData };
  };

  /**
   * handle view details
   * @param {*} classId
   */
  const handleViewDetails = (classId) => {
    setClassId(classId);
    handlePageLoading();
    setShowComponet({
      ...iShowComponet,
      classList: false,
      classDetail: true,
      classUpdate: false,
    });

    try {
      const res = getDsHocSinhByLopHoc(classes[classId]._id);
      res.then((data) => {
        console.log('Danh sách học sinh:', data);
        setStudentList(data);
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách học sinh:', error);
    }
  };

  /**
   *handle update class
   * @param {*} classId
   */
  const handleUpdateClass = (classId) => {
    setClassUpdate({
      id: classes[classId]._id,
      namHoc: classes[classId].academicYear,
      khoiLop: classes[classId].grade,
      tenLop: classes[classId].className,
      giaoVienChuNhiem: classes[classId].teacherInfo.userName,
      ngayBatDau: classes[classId].startDate,
      buoiHoc: classes[classId].classSession,
    });
    handlePageLoading();
    setShowComponet({
      ...iShowComponet,
      classList: false,
      classDetail: false,
      classUpdate: true,
    });
    try {
      const res = getDsHocSinhByLopHoc(classes[classId]._id);
      res.then((data) => {
        setStudentList(data);
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách học sinh:', error);
    }
  };

  //handle back to class list
  const handleBackDsLopHoc = () => {
    handlePageLoading();
    setShowComponet({
      ...iShowComponet,
      classList: true,
      classDetail: false,
      classUpdate: false,
    });
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

  /**
   * handle checked item
   */
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
      {pageLoading && (
        <div
          id="root"
          className="grid grid-flow-row gap-4 p-4 px-10 max-h-full w-full h-full items-center justify-center overflow-auto relative"
        >
          <button
            disabled
            type="button"
            class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              class="inline w-6 h-w-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
          </button>
        </div>
      )}

      {iShowComponet.classList && !pageLoading && (
        <div id="root" className="grid grid-flow-row gap-4 p-4 px-10 max-h-full w-full overflow-auto relative">
          <div className="pb-5">
            <span className="text-lg font-medium flex items-center justify-start gap-1">Danh sách lớp học</span>
            <span
              className="
              text-sm text-gray-500 font-normal flex items-center justify-start gap-1
            "
            >
              Trang này cho phép bạn xem danh sách lớp học, xem chi tiết lớp học, chỉnh sửa thông tin lớp học.
            </span>
          </div>
          <div>
            <span className="font-medium">1. Bộ lọc tìm kiếm</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
            <div className="grid grid-cols-10 items-center">
              <label htmlFor="name1" className="col-span-3">
                Năm học*
              </label>
              <select
                name="namHoc"
                id="namHoc"
                value={filter.namHoc}
                onChange={(e) => setFilter({ ...filter, namHoc: e.target.value })}
                className="col-span-7 p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="2020-2021">2020-2021</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
            <div className="grid grid-cols-10 items-center">
              <label htmlFor="name1" className="col-span-3">
                Khối lớp*
              </label>
              <select
                name="khoiLop"
                id="khoiLop"
                value={filter.khoiLop}
                onChange={(e) => setFilter({ ...filter, khoiLop: e.target.value })}
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
            <div className="grid grid-cols-10 items-center">
              <label htmlFor="name1" className="col-span-3">
                Tên lớp
              </label>
              <input
                type="text"
                id="tenLop"
                name="tenLop"
                value={filter.tenLop}
                onChange={(e) => setFilter({ ...filter, tenLop: e.target.value.toUpperCase() })}
                className="col-span-7 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="grid grid-cols-10 items-center">
              <label htmlFor="name1" className="col-span-3">
                Buổi học*
              </label>
              <select
                name="buoiHoc"
                id="buoiHoc"
                value={filter.buoiHoc}
                onChange={(e) => setFilter({ ...filter, buoiHoc: e.target.value })}
                className="col-span-7 p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="Sáng">Sáng</option>
                <option value="Chiều">Chiều</option>
              </select>
            </div>
            <div className="grid grid-flow-col items-center gap-2">
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center font-medium bg-red-500 text-white gap-2 px-4 py-2 rounded"
              >
                <LuFilterX />
                Xóa bộ lọc
              </button>
              <button
                onClick={handleSearchClass}
                className="font-medium gap-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="grid grid-flow-col items-center gap-2">
            <span className="font-medium">2. Danh sách lớp học</span>
            <div className="flex items-center justify-end relative dropdown-export" ref={dropdownRef}>
              <button
                disabled={classes.length === 0}
                onClick={handleShowExportClass}
                className="relative flex items-center justify-center gap-2 border px-4 py-2 rounded"
              >
                <PiExport />
                Xuất danh sách
                <RiExpandLeftRightFill className="rotate-90" />
                {iShowExport && (
                  <ul className="w-full absolute z-50 top-10 bg-white border rounded mt-1 p-2 slide-down">
                    <li className="px-1 hover:bg-gray-200 ">
                      <a href="#export-list-class" onClick={() => handleExportClass('basic')} className="text-gray-700">
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
              </button>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="w-5 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-center">
                    <input id="checkedExportAll" type="checkbox" onChange={handleSelectAll} />
                  </th>
                  <th className="w-10 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">STT</th>
                  <th className="w-36 min-w-36 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">
                    Năm học
                  </th>
                  <th className="w-36 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">Khối lớp</th>
                  <th className="w-36 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">Tên lớp học</th>
                  <th className="w-36 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">Buổi học</th>
                  <th className="w-36 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">Sỉ số</th>
                  <th className="w-80 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">
                    Giáo viên chủ nhiệm
                  </th>
                  <th className="w-56 py-2 px-4 border border-b bg-gray-200 border-gray-300 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem, index) => (
                  <tr key={classItem._id}>
                    <td className="py-2 px-4 border border-b border-gray-300 text-center">
                      <input onClick={handleCheckedItem} name="checkedExport" type="checkbox" />
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.academicYear}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.grade}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.className}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.classSession}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      {classItem.totalStudents + '/' + classItem.maxStudents}
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      {classItem.teacherInfo.userName}
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateClass(index)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Chỉnh Sửa
                        </button>
                        <button
                          onClick={() => handleViewDetails(index)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Xem Chi Tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {iShowComponet.classDetail && !pageLoading && (
        <ViewClassDetail
          classId={classId}
          classes={classes}
          studentList={studentList}
          setShowComponet={setShowComponet}
          iShowComponet={iShowComponet}
          handleBackDsLopHoc={handleBackDsLopHoc}
        />
      )}

      {iShowComponet.classUpdate && !pageLoading && (
        <UpdateClass
          classUpdate={classUpdate}
          setClassUpdate={setClassUpdate}
          studentList={studentList}
          setShowComponet={setShowComponet}
          iShowComponet={iShowComponet}
          handleBackDsLopHoc={handleBackDsLopHoc}
        />
      )}
    </>
  );
}
