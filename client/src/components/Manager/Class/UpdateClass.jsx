import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoPersonAddOutline } from 'react-icons/io5';
import { getStudentByCode } from '../../../api/Student';

const UpdateClass = ({
  classUpdate,
  setClassUpdate,
  studentList,
  setShowComponet,
  iShowComponet,
  handleBackDsLopHoc,
}) => {
  const [studentCode, setStudentCode] = useState('');
  const dropdownSearchStudentRef = useRef(null);
  const [studentAddClass, setStudentAddClass] = useState([]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //handle click outside
  const handleClickOutside = (event) => {
    if (dropdownSearchStudentRef.current && !dropdownSearchStudentRef.current.contains(event.target)) {
      setShowComponet({
        ...iShowComponet,
        classList: false,
        classDetail: false,
        classUpdate: true,
        searchStudent: false,
      });
    }
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

  /**
   * handle select student add class
   * @param {*} student
   */
  const handleSelectStudentAddClass = (student) => {
    setShowComponet({
      ...iShowComponet,
      searchStudent: false,
    });
    setStudentCode(student.studentCode);
    document.getElementById('searchStudentAddClass').value = student.studentCode + ' - ' + student.userName;
  };

  return (
    <div id="root" className="grid grid-flow-row gap-4 p-4 max-h-full relative">
      <div className="flex items-center justify-start gap-2">
        <span
          onClick={handleBackDsLopHoc}
          className="font-medium flex items-center justify-start gap-1 text-blue-500 cursor-pointer"
        >
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
          <input
            disabled
            type="text"
            id="namHoc"
            value={classUpdate.namHoc}
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="name1">Khối lớp*</label>
          <select
            name="khoiLop"
            id="khoiLop"
            value={classUpdate.khoiLop}
            className="w-full p-2 border border-gray-300 rounded"
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
          <input
            type="text"
            id="tenLop"
            value={classUpdate.tenLop}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="relative">
          <label htmlFor="name1">Giáo viên chủ nhiệm*</label>
          <input
            type="text"
            id="giaoVienChuNhiem"
            value={classUpdate.giaoVienChuNhiem}
            className="w-full p-2 border border-gray-300 rounded"
          />
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
          <select
            name="buoiHoc"
            id="buoiHoc"
            value={classUpdate.buoiHoc}
            className="w-full p-2 border border-gray-300 rounded"
          >
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
            <ul
              className="absolute w-full top-11 border p-2 bg-gray-100 slide-down max-h-40 overflow-y-scroll"
              ref={dropdownSearchStudentRef}
            >
              {studentAddClass.map((student, index) => (
                <li
                  onClick={() => handleSelectStudentAddClass(student)}
                  className="hover:cursor-pointer bg-gray-100 hover:bg-gray-300 px-2"
                >
                  {student.studentCode} - {student.userName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="overflow-x-auto max-h-96 overflow-y-scroll">
        <div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="pl-2 border border-b border-gray-300 text-left w-16">STT</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Mã số học sinh</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Họ và tên</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Năm sinh</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Giới tính</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Lớp</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Ngày vào trường</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Số điện thoại</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Trạng thái</th>
              </tr>
            </thead>
          </table>
        </div>
        <div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="pl-2 border border-b border-gray-300 text-left w-16">STT</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Mã số học sinh</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Họ và tên</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Năm sinh</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Giới tính</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Lớp</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Ngày vào trường</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Số điện thoại</th>
                <th className="pl-2 border border-b border-gray-300 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student, index) => (
                <tr key={student._id}>
                  <td className="pl-2 border border-b border-gray-300 text-left">{index + 1}</td>
                  <td className="pl-2 border border-b border-gray-300 text-left">{student.studentCode}</td>
                  <td className="pl-2 border border-b border-gray-300 text-left">{student.userName}</td>
                  <td className="pl-2 border border-b border-gray-300 text-left">
                    {new Date(student.dateOfBirth).toLocaleDateString('en-GB')}
                  </td>
                  <td className="pl-2 border border-b border-gray-300 text-left">{student.gender}</td>
                  <td className="pl-2 border border-b border-gray-300 text-left">{classUpdate.tenLop}</td>
                  <td className="pl-2 border border-b border-gray-300 text-left">
                    {new Date(student.dateOfEnrollment).toLocaleDateString('en-GB')}
                  </td>
                  <td className="pl-2 border border-b border-gray-300 text-left">{student.phoneNumber}</td>
                  <td className="pl-2 border border-b border-gray-300 text-left">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateClass;
