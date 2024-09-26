import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { PiExport } from 'react-icons/pi';
import { IoIosArrowForward } from 'react-icons/io';
import { IoCloseCircleOutline } from 'react-icons/io5';

import { getStudentByNameAndAcademicYearAndGradeAndClassName } from '../../../api/Student';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const XemChiTietLopHoc = ({ classId, classes, studentList, handleBackDsLopHoc, setShowComponet, iShowComponet }) => {
  const fileExtension = '.xlsx';
  const [studentName, setStudentName] = useState('');
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const [studentsSearch, setStudentsSearch] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowComponet({
        ...iShowComponet,
        exportDetail: false,
        classList: false,
        classDetail: true,
        classUpdate: false,
        searchStudent: false,
      });
    }
  };

  /**
   * handle export class details
   * @param {*} args
   */
  const handleExportClassDetails = (args) => {
    let columnNames = [];
    let formatData = [];
    if (args === 'basic') {
      ({ columnNames, formatData } = exportClassDetailBasic());
    } else if (args === 'all') {
      ({ columnNames, formatData } = exportClassDetailAll());
    }
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
    const columnNames = [
      'STT',
      'Mã số học sinh',
      'Họ và tên',
      'Năm sinh',
      'Giới tính',
      'Dân tộc',
      'Ngày vào trường',
      'Số điện thoại',
      'Địa chỉ',
      'Trạng thái',
    ];

    if (studentsSearch.length > 0) {
      const formatData = studentsSearch.map((item, index) => ({
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
      }));
      return { columnNames, formatData };
    } else {
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
        'Trạng thái': item.status,
      }));
      return { columnNames, formatData };
    }
  };

  /**
   * set data for export class detail all
   * @returns
   */
  const exportClassDetailAll = () => {
    const columnNames = [];
    let colCha = [];
    let colMe = [];
    let colQuanHeKhac = [];
    // const setColRelationship = studentList.map((item, index) => {
    //   if (item.parents.length > 0) {
    //     item.parents.forEach((parent) => {
    //       if (parent.relationship === 'Cha') {
    //         colCha[index] = 'Có';
    //       } else if (parent.relationship === 'Mẹ') {
    //         colMe[index] = 'Có';
    //       } else {
    //         colQuanHeKhac[index] = parent.relationship;
    //       }
    //     });
    //   }
    //   return null;
    // });
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
      };
      if (colCha[index] === 'Có' && colMe[index] === 'Có') {
        formattedItem['Họ tên cha'] = item.parents[0].userName;
        formattedItem['Năm sinh cha'] = new Date(item.parents[0].dateOfBirth).toLocaleDateString('en-GB');
        formattedItem['Số điện thoại cha'] = item.parents[0].phoneNumber;
        formattedItem['Nghề nghiệp cha'] = item.parents[0].job;

        formattedItem['Họ tên mẹ'] = item.parents[1].userName;
        formattedItem['Năm sinh mẹ'] = new Date(item.parents[1].dateOfBirth).toLocaleDateString('en-GB');
        formattedItem['Số điện thoại mẹ'] = item.parents[1].phoneNumber;
        formattedItem['Nghề nghiệp mẹ'] = item.parents[1].job;
      } else {
        if (colCha[index] === 'Có') {
          formattedItem['Họ tên cha'] = item.parents[0].userName;
          formattedItem['Năm sinh cha'] = new Date(item.parents[0].dateOfBirth).toLocaleDateString('en-GB');
          formattedItem['Số điện thoại cha'] = item.parents[0].phoneNumber;
          formattedItem['Nghề nghiệp cha'] = item.parents[0].job;
          formattedItem['Họ tên mẹ'] = '';
          formattedItem['Năm sinh mẹ'] = '';
          formattedItem['Số điện thoại mẹ'] = '';
          formattedItem['Nghề nghiệp mẹ'] = '';
        }
        if (colMe[index] === 'Có') {
          formattedItem['Họ tên cha'] = '';
          formattedItem['Năm sinh cha'] = '';
          formattedItem['Số điện thoại cha'] = '';
          formattedItem['Nghề nghiệp cha'] = '';
          formattedItem['Họ tên mẹ'] = item.parents[0].userName;
          formattedItem['Năm sinh mẹ'] = new Date(item.parents[0].dateOfBirth).toLocaleDateString('en-GB');
          formattedItem['Số điện thoại mẹ'] = item.parents[0].phoneNumber;
          formattedItem['Nghề nghiệp mẹ'] = item.parents[0].job;
        }
      }
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

  const handleSearchByName = async (e) => {
    setStudentName(e.target.value);
    try {
      const res = await getStudentByNameAndAcademicYearAndGradeAndClassName(e.target.value);
      setStudentsSearch(res);
      setShowComponet({
        ...iShowComponet,
        searchStudent: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectStudentViewDetail = (student) => {
    console.log('student', student);
  };

  return (
    <div
      id="root"
      className="grid grid-flow-row gap-2 p-4 px-10 max-h-full w-full overflow-auto relative custom-scrollbar"
    >
      <div className="pb-5">
        <span
          onClick={handleBackDsLopHoc}
          className="w-fit text-lg font-medium flex items-center justify-start gap-1 text-blue-500 cursor-pointer"
        >
          Danh sách lớp học
        </span>
        <span className="text-lg font-medium flex items-center justify-start gap-1">
          Xem thông tin chi tiết lớp học {classes[classId].className}
        </span>
        <span
          className="
              text-sm text-gray-500 font-normal flex items-center justify-start gap-1
            "
        >
          Trang này cho phép bạn xem danh sách lớp học, xem chi tiết lớp học, chỉnh sửa thông tin lớp học.
        </span>
      </div>

      <div>
        <span className="font-medium">1. Thông tin chung</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Năm học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Khối lớp</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Tên lớp học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Gv Chủ nhiệm</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Buổi học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Ngày bắt đầu lớp học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Sỉ số tối đa</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">Sỉ số hiện tại</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">SLHS Nam</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left">SLHS Nữ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].academicYear}</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].grade}</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].className}</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                {classes[classId].teacherInfo.userName}
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].classSession}</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                {new Date(classes[classId].startDate).toLocaleDateString('en-GB')}
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].maxStudents}</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].totalStudents}</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].maleStudents}</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">{classes[classId].femaleStudents}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <span className="font-medium">2. Danh sách học sinh</span>
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <div className="flex items-center relative gap-2">
          <input
            type="text"
            value={studentName}
            onChange={(e) => handleSearchByName(e)}
            className="w-full p-2  border border-gray-300 rounded"
            placeholder="Tìm kiếm tên học sinh..."
          />
          <IoSearch className="absolute right-8" />
          {studentName.length > 0 && (
            <IoCloseCircleOutline
              onClick={() => {
                setStudentName('');
                setStudentsSearch([]);
              }}
              className="cursor-pointer text-red-500"
            />
          )}
        </div>
        <div className="flex items-center md:justify-end sm:justify-start">
          <button
            onClick={() => setShowComponet({ ...iShowComponet, exportDetail: true })}
            className="relative w-fit flex items-center justify-center gap-2 border px-4 py-2 rounded"
          >
            <PiExport />
            Xuất danh sách học sinh
            {iShowComponet.exportDetail && (
              <ul ref={dropdownRef} className="w-full absolute z-50 top-10 bg-white border rounded mt-1 p-2 slide-down">
                <li className="text-start px-1 hover:bg-gray-200 ">
                  <a
                    href="#export-class-detail"
                    className="text-gray-700"
                    onClick={() => handleExportClassDetails('basic')}
                  >
                    Xuất thông tin cơ bản
                  </a>
                </li>
                <li className="text-start px-1 hover:bg-gray-200 ">
                  <a
                    href="#export-class-detail-all"
                    className="text-gray-700"
                    onClick={() => handleExportClassDetails('all')}
                  >
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
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-14">STT</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-40">Mã số học sinh</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-40">Họ và tên</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-40">Năm sinh</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-28">Giới tính</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-40">Ngày vào trường</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-40">Số điện thoại</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-40">Địa chỉ</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-14"></th>
            </tr>
          </thead>
          <tbody>
            {studentsSearch.length > 0
              ? studentsSearch.map((student, index) => (
                  <tr key={student._id}>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.studentCode}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.userName}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfBirth).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.gender}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfEnrollment).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.phoneNumber}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.address}</td>
                    <td className="cursor-pointer py-2 px-2 border border-b border-gray-300 text-left">
                      <div
                        className="flex items-center justify-center text-blue-500 text-xl"
                        onClick={() => handleSelectStudentViewDetail(student)}
                      >
                        <IoIosArrowForward />
                      </div>
                    </td>
                  </tr>
                ))
              : studentList.map((student, index) => (
                  <tr key={student._id}>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.studentCode}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.userName}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfBirth).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.gender}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {new Date(student.dateOfEnrollment).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.phoneNumber}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{student.address}</td>
                    <td className="cursor-pointer py-2 px-2 border border-b border-gray-300 text-left">
                      <div
                        className="flex items-center justify-center text-blue-500 text-xl"
                        onClick={() => handleSelectStudentViewDetail(student)}
                      >
                        <IoIosArrowForward />
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default XemChiTietLopHoc;
