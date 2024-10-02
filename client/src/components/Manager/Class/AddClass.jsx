import 'flowbite';
import React from 'react';
import Modal from 'react-modal';
import { CiImport } from 'react-icons/ci';
import { FiSearch } from 'react-icons/fi';
import { useEffect, useState, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoMdHelpCircleOutline } from 'react-icons/io';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { addLopHoc, importNewProfileStudent } from '../../../api/Class';
import { getGiaoVienChuaPhanCongChuNhiem } from '../../../api/Teacher';

Modal.setAppElement('#root');

export default function QuanLyGiaoVien({ functionType }) {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [newClassProgress, setNewClassProgress] = useState(0);
  const [studentsFileUpload, setStudentsFileUpload] = useState([]);
  const [studentsImportFailed, setStudentsImportFailed] = useState([]);
  const [iShowComponet, setShowComponent] = useState({
    showDownloadFileSample: false,
  });
  const [lopHocInfo, setLopHocInfo] = useState({
    namHoc: '',
    khoiLop: '',
    tenLop: '',
    giaoVienChuNhiem: '',
    idGiaoVienChuNhiem: '',
    ngayBatDau: '05/09/2024',
    studentsList: [],
    typeFileImport: '',
  });
  const [studentInfo, setStudentInfo] = useState({
    mssv: '',
    ho: '',
    ten: '',
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
  });

  /**
   * handle change input
   * @param {*} e
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setLopHocInfo((prevInfo) => ({
      ...prevInfo,
      [id]: id === 'tenLop' ? value.toUpperCase() : value,
    }));
  };

  /**
   * handle search teacher
   */
  const handleSearchTeacher = async () => {
    const res = await getGiaoVienChuaPhanCongChuNhiem(lopHocInfo.namHoc);
    console.log(res);
    setTeachers(res);
    openModal();
  };

  /**
   * handle select teacher
   * @param {*} teacher
   */
  const handleSelectTeacher = (teacher) => {
    setLopHocInfo((prevInfo) => ({
      ...prevInfo,
      giaoVienChuNhiem: teacher.userName,
      idGiaoVienChuNhiem: teacher._id,
    }));
    closeModal();
  };

  /**
   * validate input
   * @returns
   */
  const validateInput = () => {
    if (lopHocInfo.khoiLop === '') {
      toast.error('Vui lòng chọn khối lớp');
      return false;
    }

    if (lopHocInfo.tenLop === '') {
      toast.error('Vui lòng nhập tên lớp');
      return false;
    }

    if (lopHocInfo.giaoVienChuNhiem === '') {
      toast.error('Vui lòng chọn giáo viên chủ nhiệm');
      return false;
    }

    return true;
  };

  /**
   * get current year
   */
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    setLopHocInfo((prevInfo) => ({
      ...prevInfo,
      namHoc: `${year}-${year + 1}`,
      ngayBatDau: `05/09/${year}`,
      typeFileImport: prevInfo.khoiLop === '1' ? 'newClass' : 'oldClass',
    }));
  }, []);

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
   * handle file upload
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
      setStudentsFileUpload(worksheet);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    // init progress
    setNewClassProgress(0);
    setImportProgress(0);
    // 1. Validate input and add new class
    if (!validateInput()) {
      return;
    } else {
      const res = addLopHoc(lopHocInfo);
      res
        .then((res) => {
          console.log('Thêm lớp học thành công');
        })
        .catch((err) => {
          console.log(err.response.data);
          toast.error(err.response.data.message);
        });

      let progress = 0;
      setNewClassProgress(progress);
      while (progress < 100) {
        progress += 10;
        setNewClassProgress(progress);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // 2. Import students
    if (lopHocInfo.khoiLop === '1') {
      handleImportNewProfileStudent();
    }
  };

  const handleImportNewProfileStudent = async () => {
    let totalStudents = studentsFileUpload.length;
    setImportProgress(0);
    setStudentsImportFailed([]);
    for (let index = 0; index < totalStudents; index++) {
      const student = studentsFileUpload[index];
      const studentInfo = {};
      studentInfo.namHoc = student['Năm học'];
      studentInfo.khoiLop = student['Khối'];
      studentInfo.lopHoc = student['Lớp'];
      studentInfo.mssv = student['Mã số học sinh'];
      studentInfo.ho = student['Họ'];
      studentInfo.ten = student['Tên'];
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

      try {
        await importNewProfileStudent(studentInfo, lopHocInfo.namHoc, lopHocInfo.khoiLop, lopHocInfo.tenLop);
      } catch (error) {
        setStudentsImportFailed((studentsImportFailed) => [
          ...studentsImportFailed,
          {
            student: error.response.data.student,
            message: error.response.data.message,
          },
        ]);

        if (error.response.status === 400) {
          console.log('Mã số sinh viên đã tồn tại');
        }
        if (error.response.status === 404) {
          console.log('Lớp học không tồn tại');
        }
        if (error.response.status === 405) {
          console.log('Sỉ số lớp học đã đủ');
        }
        if (error.response.status === 500) {
          console.log('Import thất bại');
        }
      }
      setImportProgress(Math.round(((index + 1) / totalStudents) * 100));
    }
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      {functionType === 'add-classRoom' && (
        <div id="root" className="grid grid-flow-row gap-4 p-4 px-20 max-h-full overflow-auto relative">
          <div className="pb-5">
            <span className="text-lg font-medium flex items-center justify-start gap-1">Thêm mới lớp học</span>
            <span
              className="
              text-sm text-gray-500 font-normal flex items-center justify-start gap-1
            "
            >
              Chức năng này giúp bạn thêm mới lớp học cho năm học mới
            </span>
          </div>
          <div>
            <span className="font-medium">1. Thông tin chung</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Năm học*</label>
              <input
                disabled
                type="text"
                id="namHoc"
                value={lopHocInfo.namHoc}
                onChange={handleChange}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name1">Khối lớp*</label>
              <select
                name="khoiLop"
                id="khoiLop"
                value={lopHocInfo.khoiLop}
                onChange={handleChange}
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
              <select
                name="tenLop"
                id="tenLop"
                value={lopHocInfo.tenLop}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="1A1">1A1</option>
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
            <div className="relative">
              <label htmlFor="name1">Giáo viên chủ nhiệm*</label>
              <input
                type="text"
                id="giaoVienChuNhiem"
                value={lopHocInfo.giaoVienChuNhiem}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <FiSearch onClick={handleSearchTeacher} className="absolute right-2 top-9 cursor-pointer" />
            </div>
            <div>
              <label htmlFor="name1">Ngày bắt đầu lớp học</label>
              <input
                type="text"
                id="ngayBatDau"
                value={lopHocInfo.ngayBatDau}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <span data-tooltip-target="tooltip-default" className="font-medium flex items-center gap-1">
              2. Import danh sách học sinh
            </span>
            <span className="italic">
              (Chọn khối lớp 1 để import hồ sơ học sinh mới, chọn khối lớp khác để import danh sách học sinh cũ.)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div className="flex items-start justify-start">
              <input className="w-full border-e border-y rounded-e px-2" type="file" onChange={handleFileUpload} />
            </div>
            <div>
              <button
                onClick={handleSubmit}
                type="button"
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Thêm mới lớp học
              </button>
            </div>
          </div>
          <div>
            <span className="flex items-center gap-1">
              Tạo lớp học:
              {' ' + newClassProgress}%{' '}
              {newClassProgress === 100 ? <FaRegCircleCheck className=" text-green-500" /> : ''}
            </span>
            <br />
            <span className="flex items-center gap-1">
              Import danh sách học sinh:
              {' ' + importProgress}% {importProgress === 100 ? <FaRegCircleCheck className=" text-green-500" /> : ''}
            </span>
          </div>
          <div className=" text-red-500">
            <span>Danh sách học sinh import thất bại</span>
          </div>
          <div>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-14">STT</th>
                  <th className="py-2 pl-2 border border-b border-gray-300 text-left w-52">Họ và tên</th>
                  <th className="py-2 pl-2 border border-b border-gray-300 text-left w-20">Lớp</th>
                  <th className="py-2 pl-2 border border-b border-gray-300 text-left w-40">Số điện thoại</th>
                  <th className="py-2 pl-2 border border-b border-gray-300 text-left w-40">Năm sinh</th>
                  <th className="py-2 pl-2 border border-b border-gray-300 text-left w-40">Địa chỉ</th>
                  <th className="py-2 pl-2 border border-b border-gray-300 text-left w-96">Lý do import thất bại</th>
                </tr>
              </thead>
              <tbody>
                {studentsImportFailed.map((student, index) => (
                  <tr key={index}>
                    <td className="py-2 pl-2 border border-b border-gray-300">{student.student && index + 1}</td>
                    <td className="py-2 pl-2 border border-b border-gray-300">
                      {student.student && student.student.firstName} {student.student && student.student.lastName}
                    </td>
                    <td className="py-2 pl-2 border border-b border-gray-300">{lopHocInfo.tenLop}</td>
                    <td className="py-2 pl-2 border border-b border-gray-300">
                      {student.student && student.student.phoneNumber}
                    </td>
                    <td className="py-2 pl-2 border border-b border-gray-300">
                      {student.student && student.student.dateOfBirth}
                    </td>
                    <td className="py-2 pl-2 border border-b border-gray-300">
                      {student.student && student.student.address}
                    </td>
                    <td className="py-2 pl-2 border border-b border-gray-300">{student.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
        <div class="relative p-4 w-full h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Danh sách giáo viên chủ nhiệm</h3>
            </div>
            <div class="p-4 md:p-5 max-h-20 xl:max-h-96 lg:max-h-56 md:max-h-40 sm:max-h-20 overflow-auto">
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
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <button
                onClick={closeModal}
                class="text-white inline-flex w-full justify-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
