import { RiExpandLeftRightFill } from 'react-icons/ri';
import { useState, useEffect, useRef } from 'react';
import { PiExport } from 'react-icons/pi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import 'react-datepicker/dist/react-datepicker.css';
import { IoSearch } from 'react-icons/io5';
import { LuFilter } from 'react-icons/lu';
import { LuFilterX } from 'react-icons/lu';
import { IoPersonAddOutline } from 'react-icons/io5';
import { getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc, getDsHocSinhByLopHoc } from '../../api/Class';
import { getStudentByCode } from '../../api/Student';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default function DanhSachLopHoc({ filterClass, action }) {
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
    ngayBatDau: '',
    buoiHoc: '',
  });
  const fileExtension = '.xlsx';
  const dropdownRef = useRef(null);
  const dropdownSearchStudentRef = useRef(null);
  const driopdownExportDetailRef = useRef(null);
  const [studentCode, setStudentCode] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [iShowExport, setShowExport] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [studentAddClass, setStudentAddClass] = useState([]);
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const [iShowComponet, setShowComponet] = useState({
    classList: true,
    classDetail: false,
    classUpdate: false,
    searchStudent: false,
    exportDetail: false,
  });

  useEffect(() => {
    handleSearchClass();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    setFilter({ ...filter, namHoc: `${year}-${year + 1}` });
  }, []);

  //handle click outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowExport(false);
    }
    if (dropdownSearchStudentRef.current && !dropdownSearchStudentRef.current.contains(event.target)) {
      setShowComponet({
        ...iShowComponet,
        classList: false,
        classDetail: false,
        classUpdate: true,
        searchStudent: false,
      });
    }

    if (driopdownExportDetailRef.current && !driopdownExportDetailRef.current.contains(event.target)) {
      setShowComponet({
        ...iShowComponet,
        classList: false,
        classDetail: true,
        classUpdate: false,
        searchStudent: false,
        exportDetail: false,
      });
    }
  };

  /**
   * handle search class
   */
  const handleSearchClass = async () => {
    try {
      const res = await getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc(filter.namHoc, filter.khoiLop, filter.tenLop, filter.buoiHoc);
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
   * handle export class detail
   */
  const handleExportClassDetails = (args) => {
    let columnNames = [];
    let formatData = [];
    if (args === 'basic') {
      ({ columnNames, formatData } = exportClassDetailBasic());
    } else if (args === 'all') {
      ({ columnNames, formatData } = exportClassDetailAll());
    }

    console.log('columnNames:', formatData);

    const ws = XLSX.utils.json_to_sheet(formatData, {
      header: columnNames,
    });

    const wb = {
      Sheets: { [classes[classId].className]: ws },
      SheetNames: [classes[classId].className],
    };

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataBlob, 'Danh sách học sinh lớp ' + classes[classId].className + fileExtension);
  };

  /**
   * set data for export class detail basic
   * @returns
   */
  const exportClassDetailBasic = () => {
    const columnNames = ['STT', 'Mã số học sinh', 'Họ và tên', 'Năm sinh', 'Giới tính', 'Dân tộc', 'Ngày vào trường', 'Số điện thoại', 'Địa chỉ'];

    const formatData = studentList.map((item, index) => ({
      STT: index + 1,
      'Mã số học sinh': item.studentCode,
      'Họ và tên': item.userName,
      'Năm sinh': new Date(item.dateOfBirth).toLocaleDateString('en-GB'),
      'Giới tính': item.gender,
      'Dân tộc': item.ethnicGroups,
      'Ngày vào trường': new Date(item.dateOfEnrollment).toLocaleDateString('en-GB'),
      'Số điện thoại': item.phoneNumber,
      'Địa chỉ': item.address,
    }));

    return { columnNames, formatData };
  };

  const exportClassDetailAll = () => {
    const columnNames = [];

    let colCha = [];
    let colMe = [];
    let colQuanHeKhac = [];

    const setColRelationship = studentList.map((item, index) => {
      if (item.parents.length > 0) {
        item.parents.forEach((parent) => {
          if (parent.relationship === 'Cha') {
            colCha[index] = 'Có';
          } else if (parent.relationship === 'Mẹ') {
            colMe[index] = 'Có';
          } else {
            colQuanHeKhac[index] = parent.relationship;
          }
        });
      }
      return null;
    });

    const formatData = studentList.map((item, index) => {
      const formattedItem = {
        STT: index + 1,
        'Mã số học sinh': item.studentCode,
        'Họ và tên': item.userName,
        'Năm sinh': new Date(item.dateOfBirth).toLocaleDateString('en-GB'),
        'Giới tính': item.gender,
        'Dân tộc': item.ethnicGroups,
        'Ngày vào trường': new Date(item.dateOfEnrollment).toLocaleDateString('en-GB'),
        'Số điện thoại': item.phoneNumber,
        'Địa chỉ': item.address,
        'Trạng thái': item.status,
        Cha: colCha[index] ? colCha[index] : 'Không',
        Mẹ: colMe[index] ? colMe[index] : 'Không',
        'Quan hệ khác': colQuanHeKhac[index] ? colQuanHeKhac[index] : 'Không',
        // nếu cha = có thì show thông tin cha
        'Họ tên cha': colCha[index] ? item.parents[0].userName : '',
        'Năm sinh cha': colCha[index] ? new Date(item.parents[0].dateOfBirth).toLocaleDateString('en-GB') : '',
        'Số điện thoại cha': colCha[index] ? item.parents[0].phoneNumber : '',
        'Nghề nghiệp cha': colCha[index] ? item.parents[0].job : '',
        // nếu mẹ = có thì show thông tin mẹ
        'Họ tên mẹ': colMe[index] ? item.parents[1].userName : '',
        'Năm sinh mẹ': colMe[index] ? new Date(item.parents[1].dateOfBirth).toLocaleDateString('en-GB') : '',
        'Số điện thoại mẹ': colMe[index] ? item.parents[1].phoneNumber : '',
        'Nghề nghiệp mẹ': colMe[index] ? item.parents[1].job : '',
      };

      // nếu quan hệ khác = có thì show thông tin quan hệ khác
      if (colQuanHeKhac[index]) {
        formattedItem['Họ tên quan hệ khác'] = item.parents[0].userName;
        formattedItem['Năm sinh quan hệ khác'] = new Date(item.parents[0].dateOfBirth).toLocaleDateString('en-GB');
        formattedItem['Số điện thoại quan hệ khác'] = item.parents[0].phoneNumber;
        formattedItem['Nghề nghiệp quan hệ khác'] = item.parents[0].job;
      }
      return formattedItem;
    });

    return { columnNames, formatData };
  };

  /**
   * handle export class
   */
  const handleExportClass = () => {
    setShowExport(!iShowExport);
  };

  /**
   * handle view details
   * @param {*} classId
   */
  const handleViewDetails = (classId) => {
    setClassId(classId);
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

  //handle checked item
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

  //handle select student add class
  const handleSelectStudentAddClass = (student) => {
    setShowComponet({
      ...iShowComponet,
      searchStudent: false,
    });
    setStudentCode(student.studentCode);
    document.getElementById('searchStudentAddClass').value = student.studentCode + ' - ' + student.userName;
  };

  const handleSearchStudentByCode = async (e) => {
    setShowComponet({
      ...iShowComponet,
      searchStudent: true,
    });
    setTimeout(() => {
      try {
        const res = getStudentByCode(e);
        res.then((data) => {
          setStudentAddClass(data);
        });
      } catch (error) {
        console.error('Lỗi khi tìm kiếm học sinh:', error);
      }
    }, 300);
  };

  return (
    <>
      {iShowComponet.classList && (
        <div id="root" className="grid grid-flow-row gap-4 p-4 max-h-full w-full overflow-auto relative">
          <div>
            <span className="font-medium">Bộ lọc tìm kiếm</span>
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
                onChange={(e) => setFilter({ ...filter, tenLop: e.target.value })}
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
              <button onClick={handleSearchClass} className="font-medium gap-2 bg-blue-500 text-white px-4 py-2 rounded">
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="grid grid-flow-col items-center gap-2">
            <span className="font-medium">Danh sách lớp học</span>
            <div className="flex items-center justify-end relative dropdown-export" ref={dropdownRef}>
              <button
                disabled={classes.length === 0}
                onClick={handleExportClass}
                className="relative flex items-center justify-center gap-2 border px-4 py-2 rounded"
              >
                <PiExport />
                Xuất danh sách
                <RiExpandLeftRightFill className="rotate-90" />
                {iShowExport && (
                  <ul className="w-full absolute z-50 top-10 bg-white border rounded mt-1 p-2 slide-down">
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
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="w-5 py-2 px-4 border border-b border-gray-300 text-center">
                    <input id="checkedExportAll" type="checkbox" onChange={handleSelectAll} />
                  </th>
                  <th className="w-10 py-2 px-4 border border-b border-gray-300 text-left">STT</th>
                  <th className="w-48 py-2 px-4 border border-b border-gray-300 text-left">Tên lớp học</th>
                  <th className="w-48 py-2 px-4 border border-b border-gray-300 text-left">Năm học</th>

                  <th className="w-48 py-2 px-4 border border-b border-gray-300 text-left">Buổi học</th>
                  <th className="w-48 py-2 px-4 border border-b border-gray-300 text-left">Khối lớp</th>
                  <th className="w-80 py-2 px-4 border border-b border-gray-300 text-left">Giáo viên chủ nhiệm</th>
                  <th className="w-56 py-2 px-4 border border-b border-gray-300 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem, index) => (
                  <tr key={classItem._id}>
                    <td className="py-2 px-4 border border-b border-gray-300 text-center">
                      <input onClick={handleCheckedItem} name="checkedExport" type="checkbox" />
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.className}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.academicYear}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.classSession}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.grade}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classItem.teacherInfo.userName}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateClass(index)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                          Chỉnh Sửa
                        </button>
                        <button onClick={() => handleViewDetails(index)} className="bg-blue-500 text-white px-2 py-1 rounded">
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

      {iShowComponet.classDetail && (
        <div id="root" className="grid grid-flow-row gap-4 p-4 max-h-full w-full overflow-auto relative">
          <div className="flex items-center justify-start gap-2">
            <span onClick={handleBackDsLopHoc} className="font-medium flex items-center justify-start gap-1 text-blue-500 cursor-pointer">
              <IoMdArrowRoundBack /> Quay lại danh sách lớp học
            </span>
            <span className="font-medium">/ Xem thông tin chi tiết lớp học {classes[classId].className}</span>
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
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Tên lớp học</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Gv Chủ nhiệm</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Buổi học</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Ngày bắt đầu lớp học</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Sỉ số tối đa</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Sỉ số hiện tại</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">SLHS Nam</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">SLHS Nữ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].academicYear}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].grade}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].className}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].teacherInfo.userName}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].classSession}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">
                    {new Date(classes[classId].startDate).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].maxStudents}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].totalStudents}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].maleStudents}</td>
                  <td className="py-2 px-4 border border-b border-gray-300 text-left">{classes[classId].femaleStudents}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <span className="font-medium">2. Danh sách học sinh</span>
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <div className="flex items-center relative">
              <input type="text" id="namHoc" className="w-full p-2  border border-gray-300 rounded" placeholder="Tìm kiếm tên học sinh..." />
              <IoSearch className="absolute right-4" />
            </div>
            <div className="flex items-center md:justify-end sm:justify-start" ref={driopdownExportDetailRef}>
              <button
                onClick={() => setShowComponet({ ...iShowComponet, exportDetail: true })}
                className="relative w-fit flex items-center justify-center gap-2 border px-4 py-2 rounded"
              >
                <PiExport />
                Xuất danh sách học sinh
                {iShowComponet.exportDetail && (
                  <ul className="w-full absolute z-50 top-10 bg-white border rounded mt-1 p-2 slide-down">
                    <li className="text-start px-1 hover:bg-gray-200 ">
                      <a href="#export-class-detail" className="text-gray-700" onClick={() => handleExportClassDetails('basic')}>
                        Xuất thông tin cơ bản
                      </a>
                    </li>
                    <li className="text-start px-1 hover:bg-gray-200 ">
                      <a href="#export-class-detail-all" className="text-gray-700" onClick={() => handleExportClassDetails('all')}>
                        Xuất toàn bộ thông tin
                      </a>
                    </li>
                  </ul>
                )}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">STT</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Mã số học sinh</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Họ và tên</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Năm sinh</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Giới tính</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Dân tộc</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Ngày vào trường</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Số điện thoại</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Địa chỉ</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student, index) => (
                  <tr key={student._id}>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.studentCode}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.userName}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfBirth).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.gender}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.ethnicGroups}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfEnrollment).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.phoneNumber}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {iShowComponet.classUpdate && (
        <div id="root" className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto relative">
          <div className="flex items-center justify-start gap-2">
            <span onClick={handleBackDsLopHoc} className="font-medium flex items-center justify-start gap-1 text-blue-500 cursor-pointer">
              <IoMdArrowRoundBack /> Quay lại danh sách lớp học
            </span>
            <span className="font-medium">/ Cập nhật thông tin lớp học {classUpdate.tenLop}</span>
          </div>
          <div>
            <span className="font-medium">1. Cập nhật tin chung</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            <div>
              <label htmlFor="name1">Năm học*</label>
              <input disabled type="text" id="namHoc" value={classUpdate.namHoc} className="w-full p-2 bg-gray-50 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name1">Khối lớp*</label>
              <select name="khoiLop" id="khoiLop" value={classUpdate.khoiLop} className="w-full p-2 border border-gray-300 rounded">
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
              <input type="text" id="tenLop" value={classUpdate.tenLop} className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="relative">
              <label htmlFor="name1">Giáo viên chủ nhiệm*</label>
              <input type="text" id="giaoVienChuNhiem" value={classUpdate.giaoVienChuNhiem} className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name1">Ngày bắt đầu lớp học*</label>
              <input
                type="date"
                id="ngayBatDau"
                value={new Date(classUpdate.ngayBatDau).toISOString().slice(0, 10)}
                onChange={(e) => setClassUpdate({ ...classUpdate, ngayBatDau: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="gioi-tinh">Buổi học*</label>
              <select name="buoiHoc" id="buoiHoc" value={classUpdate.buoiHoc} className="w-full p-2 border border-gray-300 rounded">
                <option value="" selected></option>
                <option value="Sáng">Sáng</option>
                <option value="Chiều">Chiều</option>
              </select>
            </div>
          </div>

          <div>
            <span className="font-medium">2. Cập nhật danh sách học sinh</span>
          </div>
          <div className="pr-6 grid lg:grid-cols-3 ">
            <div className="flex items-center relative">
              <input
                type="text"
                id="searchStudentAddClass"
                onChange={(e) => handleSearchStudentByCode(e.target.value)}
                className="w-full p-2  border border-gray-300 rounded"
                placeholder="Tìm kiếm mã học sinh thêm vào lớp học"
              />
              <IoPersonAddOutline className="absolute right-4 hover:cursor-pointer active:bg-slate-300" />
              {iShowComponet.searchStudent && (
                <ul className="absolute w-full top-11 border p-2 bg-gray-100 slide-down max-h-40 overflow-y-auto" ref={dropdownSearchStudentRef}>
                  {studentAddClass.map((student, index) => (
                    <li onClick={() => handleSelectStudentAddClass(student)} className="hover:cursor-pointer bg-gray-100 hover:bg-gray-300 px-2">
                      {student.studentCode} - {student.userName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">STT</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Mã số học sinh</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Họ và tên</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Năm sinh</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Giới tính</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Lớp</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Ngày vào trường</th>
                  <th className="py-2 px-4 border border-b border-gray-300 text-left">Số điện thoại</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student, index) => (
                  <tr key={student._id}>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.studentCode}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.userName}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfBirth).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.gender}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{classUpdate.tenLop}</td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfEnrollment).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
