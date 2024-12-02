/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react';
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import { FiEdit } from 'react-icons/fi';
import { FiTrash } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { PiExport } from 'react-icons/pi';
import { CiImport } from 'react-icons/ci';
import { useEffect, useState, useRef } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoPersonAddOutline } from 'react-icons/io5';

import { getStudentByCode } from '../../../api/Student';
import { getGiaoVienChuaPhanCongChuNhiem } from '../../../api/Teacher';

Modal.setAppElement('#root');

const UpdateClass = ({
  classUpdate,
  setClassUpdate,
  studentList,
  setShowComponet,
  iShowComponet,
  handleBackDsLopHoc,
}) => {
  const [teachers, setTeachers] = useState([]);
  const dropdownSearchStudentRef = useRef(null);
  const [studentCode, setStudentCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [studentsImport, setStudentsImport] = useState([]);
  const [studentAddClass, setStudentAddClass] = useState([]);

  const [studentInfo, setStudentInfo] = useState({
    mssv: '',
    hoTen: '',
    namSinh: '',
    gioiTinh: '',
    danToc: '',
    ngayVaoTruong: '',
    sdt: '',
    diaChi: '',
    moiQuanHeKhac: false,
    moiQuanHeCha: false,
    moiQuanHeMe: false,
    hoTenCha: '',
    namSinhCha: '',
    ngheNghiepCha: '',
    sdtCha: '',
    hoTenMe: '',
    namSinhMe: '',
    ngheNghiepMe: '',
    sdtMe: '',
    moiQuanHe: '',
    hoTenNguoiGiamHo: '',
    namSinhNguoiGiamHo: '',
    ngheNghiepNguoiGiamHo: '',
    sdtNguoiGiamHo: '',
    namHoc: '',
    khoiLop: '',
    lopHoc: '',
    giaoVienChuNhiem: '',
    siSo: '',
  });

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * handle search teacher
   */
  const handleSearchTeacher = async () => {
    const res = await getGiaoVienChuaPhanCongChuNhiem(classUpdate.namHoc);
    console.log(res);
    setTeachers(res);
    openModal();
  };

  /**
   * handle select teacher
   * @param {*} teacher
   */
  const handleSelectTeacher = (teacher) => {
    setClassUpdate((prevInfo) => ({
      ...prevInfo,
      giaoVienChuNhiem: teacher.userName,
      idGiaoVienChuNhiem: teacher._id,
    }));
    closeModal();
  };

  /**
   * open modal
   */
  const openModal = () => {
    setIsModalOpen(true);
  };

  /**
   * close modal
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /**
   * handleFileUpload
   * @param {*} event
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setStudentsImport(worksheet);
    };
    reader.readAsArrayBuffer(file);
  };

  /**
   * handleImport
   */
  const handleImport = async () => {
    let totalStudents = studentsImport.length;
    setImportProgress(0);

    for (let index = 0; index < totalStudents; index++) {
      const student = studentsImport[index];

      studentInfo.mssv = student['Mã số sinh viên'];
      studentInfo.hoTen = student['Họ và tên'];
      studentInfo.namSinh = student['Năm sinh'];
      studentInfo.gioiTinh = student['Giới tính'];
      studentInfo.danToc = student['Dân tộc'];
      studentInfo.ngayVaoTruong = student['Ngày vào trường'];
      studentInfo.sdt = student['Số điện thoại'];
      studentInfo.diaChi = student['Địa chỉ'];
      studentInfo.moiQuanHeKhac = student['Quan hệ khác'] === 'Không' ? false : true;
      studentInfo.moiQuanHe = student['Quan hệ khác'];
      studentInfo.moiQuanHeCha = student['Cha'] === 'Có' ? true : false;
      studentInfo.moiQuanHeMe = student['Mẹ'] === 'Có' ? true : false;
      studentInfo.hoTenCha = student['Họ tên cha'];
      studentInfo.namSinhCha = student['Năm sinh cha'];
      studentInfo.ngheNghiepCha = student['Nghề nghiệp cha'];
      studentInfo.sdtCha = student['Số điện thoại cha'];
      studentInfo.hoTenMe = student['Họ tên mẹ'];
      studentInfo.namSinhMe = student['Năm sinh mẹ'];
      studentInfo.ngheNghiepMe = student['Nghề nghiệp mẹ'];
      studentInfo.sdtMe = student['Số điện thoại mẹ'];
      studentInfo.hoTenNguoiGiamHo = student['Họ tên quan hệ khác'];
      studentInfo.namSinhNguoiGiamHo = student['Năm sinh quan hệ khác'];
      studentInfo.ngheNghiepNguoiGiamHo = student['Nghề nghiệp quan hệ khác'];
      studentInfo.sdtNguoiGiamHo = student['Số điện thoại quan hệ khác'];
      studentInfo.namHoc = student['Năm học'];
      studentInfo.khoiLop = student['Khối'];
      studentInfo.lopHoc = student['Lớp'];

      try {
        //await addStudent(studentInfo);
      } catch (error) {
        if (error.response.status === 401) {
          console.log('Mã số sinh viên đã tồn tại');
        }
        if (error.response.status === 402) {
          console.log(`Số điện thoại đã được đăng ký cho tên ${studentInfo.hoTen}`);
        }
        if (error.response.status === 403) {
          console.log('Không tìm thấy lớp học');
        }
        if (error.response.status === 404) {
          console.log('Sỉ số lớp đã đầy');
        }
        if (error.response.status === 500) {
          console.log('Thêm học sinh thất bại');
        }
      }

      setImportProgress(Math.round(((index + 1) / totalStudents) * 100));
    }
  };

  /**
   * handle click outside dropdown search student
   * @param {*} event
   */
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

  /**
   * handle search student by code
   * @param {*} e
   */
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
    <div id="root" className="grid grid-flow-row gap-4 p-4 px-10 max-h-full relative">
      <div className="flex items-center justify-start gap-2 mb-5">
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
            defaultValue=""
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
          <FiSearch onClick={handleSearchTeacher} className="absolute right-2 top-9 cursor-pointer" />
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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <button
          type="button"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Cập nhật thông tin lớp học
        </button>
      </div>

      <div>
        <span className="font-medium">2. Cập nhật danh sách học sinh</span>
      </div>
      <div className="grid gap-2 xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-1">
        <div className="flex items-center relative">
          <input
            type="text"
            id="searchStudentAddClass"
            onChange={(e) => handleSearchStudentByCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Tìm kiếm mã học sinh thêm vào lớp học"
          />
          <div className="absolute right-4 p-2 rounded-md hover:cursor-pointer active:bg-slate-300">
            <IoPersonAddOutline />
          </div>
          {iShowComponet.searchStudent && (
            <ul
              className="z-50 absolute w-full top-11 border p-2 bg-gray-100 slide-down max-h-40 overflow-y-scroll"
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
        <div className="flex items-center md:justify-end sm:justify-start gap-2 h-full">
          <span>80%</span>
          <input className="border rounded-md px-2" type="file" />
          <div className="flex items-center justify-end relative dropdown-export">
            <button className="relative flex items-center justify-center gap-2 border px-4 py-2 rounded bg-gray-300 font-medium">
              <CiImport />
              Import
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300">
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
              <th className="py-2 px-4 border border-b border-gray-300 text-left">Trạng thái</th>
              <th className="py-2 px-4 border border-b border-gray-300 text-left" colSpan={2}></th>
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
                <td className="py-2 px-4 border border-b border-gray-300 text-left">{student.status}</td>
                <td className="py-2 px-4 border border-b border-gray-300 text-left w-10">
                  <div className="flex items-center justify-center cursor-pointer">
                    <FiEdit />
                  </div>
                </td>
                <td className="py-2 px-4 border border-b border-gray-300 text-left w-10">
                  <div className="flex items-center justify-center cursor-pointer text-red-500">
                    <FiTrash />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Search Teacher"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change overlay background color here
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            background: 'white',
          },
        }}
      >
        <div className="relative p-4 w-full h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Danh sách giáo viên chủ nhiệm</h3>
            </div>
            <div className="p-4 md:p-5 max-h-20 xl:max-h-96 lg:max-h-56 md:max-h-40 sm:max-h-20 overflow-auto">
              <ul className="space-y-2">
                {teachers.map((teacher) => (
                  <li
                    key={teacher._id}
                    className="flex justify-between items-center p-2 border border-gray-300 rounded"
                  >
                    <div>
                      <p className="font-semibold">{teacher.userName}</p>
                      <p className="text-sm text-gray-600">SĐT: {teacher.phoneNumber}</p>
                      <p className="text-sm text-gray-600">Trình độ: {teacher.levelOfExpertise}</p>
                    </div>
                    <button
                      onClick={() => handleSelectTeacher(teacher)}
                      className="p-2 bg-green-500 text-white rounded"
                    >
                      Chọn
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <button
                onClick={closeModal}
                className="text-white inline-flex w-full justify-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateClass;
