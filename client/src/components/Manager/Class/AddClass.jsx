import 'flowbite';
import React from 'react';
import Modal from 'react-modal';
import { FiSearch } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegCircleCheck } from 'react-icons/fa6';

import * as XLSX from 'xlsx';

import { addLopHoc, importNewProfileStudent, deleteClass, importStudents } from '../../../api/Class';
import { getGiaoVienChuaPhanCongChuNhiem } from '../../../api/Teacher';

Modal.setAppElement('#root');

export default function QuanLyGiaoVien({ functionType }) {
  const [pageLoading, setPageLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [studentsFileUpload, setStudentsFileUpload] = useState([]);
  const [studentsImportFailed, setStudentsImportFailed] = useState([]);
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

  const arrClassName = [
    '1A1',
    '1A2',
    '1A3',
    '1A4',
    '1A5',
    '2A1',
    '2A2',
    '2A3',
    '2A4',
    '2A5',
    '3A1',
    '3A2',
    '3A3',
    '3A4',
    '3A5',
    '4A1',
    '4A2',
    '4A3',
    '4A4',
    '4A5',
    '5A1',
    '5A2',
    '5A3',
    '5A4',
    '5A5',
  ];
  const [filteredClassNames, setFilteredClassNames] = useState([]);
  useEffect(() => {
    setFilteredClassNames(arrClassName);
  }, []);
  /**
   * handle page loading
   */
  useEffect(() => {
    toast.remove();
    handlePageLoading();
  }, []);
  /**
   * handle page loading
   */
  const handlePageLoading = () => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };
  /**
   * handle change input
   * @param {*} e
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'khoiLop') {
      if (value === '') {
        setLopHocInfo((prevInfo) => ({
          ...prevInfo,
          tenLop: '',
        }));
        setFilteredClassNames(arrClassName);
      }
      const filtered = arrClassName.filter((className) => className[0].includes(value));
      setFilteredClassNames(filtered);
    }
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
  /**
   *
   * @returns
   */
  const handleSubmit = async () => {
    setImportProgress(0);
    if (!validateInput()) {
      return;
    } else {
      try {
        const res = await addLopHoc(lopHocInfo);
        if (res) {
          switch (lopHocInfo.khoiLop) {
            case '1':
              handleImportNewProfileStudent(res);
              break;
            default:
              handleImportStudents(res);
              break;
          }
        }
      } catch (error) {
        if (error.response.status === 400) {
          toast.error('Lớp học đã tồn tại');
          return;
        }
      }
    }
  };
  /**
   *
   * @param {*} classId
   */
  const handleDeleteClass = async (classId) => {
    const res = await deleteClass(classId);
    if (res) {
      console.log('Xóa lớp học thành công');
    }
  };
  /**
   *
   * @param {*} classReponse
   * @returns
   */
  const handleImportStudents = async (classReponse) => {
    let totalStudents = studentsFileUpload.length;
    setImportProgress(0);
    setStudentsImportFailed([]);
    let isImported = true;
    for (let index = 0; index < totalStudents; index++) {
      const student = studentsFileUpload[index];
      const studentInfo = {};
      studentInfo.mshs = student['Mã số học sinh'];
      if (studentInfo.mshs === undefined) {
        toast.error('File import không đúng định dạng');
        handleDeleteClass(classReponse._id);
        return;
      }
      try {
        await importStudents(studentInfo.mshs, classReponse._id);
      } catch (error) {
        isImported = false;
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
    if (!isImported) {
      //handleDeleteClass(classReponse._id);
      toast.error('Tạo lớp học thất bại');
    } else {
      //clear data
      setStudentsFileUpload([]);
      setLopHocInfo({
        khoiLop: '',
        tenLop: '',
        giaoVienChuNhiem: '',
        idGiaoVienChuNhiem: '',
        ngayBatDau: '05/09/2024',
        studentsList: [],
        typeFileImport: '',
      });
      document.getElementById('input-file').value = '';

      toast.success('Tạo lớp học thành công');
    }
  };
  /**
   *
   * @param {*} classReponse
   */
  const handleImportNewProfileStudent = async (classReponse) => {
    let totalStudents = studentsFileUpload.length;
    setImportProgress(0);
    setStudentsImportFailed([]);
    let isImported = true;
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

      if (
        studentInfo.lopHoc !== lopHocInfo.tenLop ||
        studentInfo.khoiLop !== lopHocInfo.khoiLop ||
        studentInfo.namHoc !== lopHocInfo.namHoc
      ) {
        toast.error('File import không đúng với thông tin lớp học');
        handleDeleteClass(classReponse._id);
        return;
      }

      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      const validateDate = (date) => {
        return dateRegex.test(date);
      };
      if (!validateDate(studentInfo.ngayVaoTruong)) {
        toast.error('Ngày vào trường không đúng định dạng');
        handleDeleteClass(classReponse._id);
        return;
      }

      if (!validateDate(studentInfo.namSinh)) {
        toast.error('Năm sinh không đúng định dạng');
        handleDeleteClass(classReponse._id);
        return;
      }

      if (studentInfo.moiQuanHeKhac) {
        if (!validateDate(studentInfo.namSinhNguoiGiamHo)) {
          toast.error('Năm sinh người giám hộ không đúng định dạng');
          handleDeleteClass(classReponse._id);
          return;
        }
      }

      if (studentInfo.moiQuanHeCha) {
        if (!validateDate(studentInfo.namSinhCha)) {
          toast.error('Năm sinh cha không đúng định dạng');
          handleDeleteClass(classReponse._id);
          return;
        }
      }

      if (studentInfo.moiQuanHeMe) {
        if (!validateDate(studentInfo.namSinhMe)) {
          toast.error('Năm sinh mẹ không đúng định dạng');
          handleDeleteClass(classReponse._id);
          return;
        }
      }

      try {
        await importNewProfileStudent(studentInfo, lopHocInfo.namHoc, lopHocInfo.khoiLop, lopHocInfo.tenLop);
      } catch (error) {
        isImported = false;
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
    if (!isImported) {
      handleDeleteClass(classReponse._id);
      toast.error('Tạo lớp học thất bại');
    } else {
      setStudentsFileUpload([]);
      setLopHocInfo({
        khoiLop: '',
        tenLop: '',
        giaoVienChuNhiem: '',
        idGiaoVienChuNhiem: '',
        ngayBatDau: '05/09/2024',
        studentsList: [],
        typeFileImport: '',
      });
      document.getElementById('input-file').value = '';
      toast.success('Tạo lớp học thành công');
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
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-6 h-w-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
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
      <Toaster toastOptions={{ duration: 2200 }} />
      {!pageLoading && functionType === 'add-classRoom' && (
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
            <span className="font-medium">1. Thông tin chung*</span>
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
                defaultValue={''}
              >
                <option value="" selected></option>
                {filteredClassNames.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
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
              <label htmlFor="name1">Ngày bắt đầu lớp học*</label>
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div className="flex items-start justify-start">
              <input
                id="input-file"
                className="w-full border-e border-y rounded-e px-2"
                type="file"
                onChange={handleFileUpload}
              />
            </div>
            <div>
              <button
                onClick={handleSubmit}
                type="button"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Thêm mới lớp học
              </button>
            </div>
          </div>
          <div>
            {/* <span className="flex items-center gap-1">
              Tạo lớp học:
              {' ' + newClassProgress}%{' '}
              {newClassProgress === 100 ? <FaRegCircleCheck className=" text-green-500" /> : ''}
            </span> */}
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
    </>
  );
}
