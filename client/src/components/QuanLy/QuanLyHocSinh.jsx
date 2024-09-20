import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import 'flowbite';
import { FiSearch } from 'react-icons/fi';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';

import { addStudent } from '../../api/Student';
import { getLopHocByNamHocVaKhoi } from '../../api/Class';
import { searchStudents } from '../../api/Student';
import { BsEthernet } from 'react-icons/bs';
Modal.setAppElement('#root');

export default function QuanLyHocSinh({ functionType }) {
  const [studentsImport, setStudentsImport] = useState([]);
  const [showMoiQuanHeKhac, setShowMoiQuanHeKhac] = useState(false);
  const [showMoiQuanHeCha, setShowMoiQuanHeCha] = useState(false);
  const [showMoiQuanHeMe, setShowMoiQuanHeMe] = useState(false);
  const [lopHocs, setLopHocs] = useState([]);
  const [importProgress, setImportProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState({
    success: 0,
    failed: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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

  // lấy năm học hiện tại
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      namHoc: `${year}-${year + 1}`,
    }));
  }, []);

  const handleSearchLopHoc = async () => {
    const res = await getLopHocByNamHocVaKhoi(studentInfo.namHoc, studentInfo.khoiLop);
    setLopHocs(res);
    openModal();
  };

  const handleSelectLopHoc = (lopHoc) => {
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      lopHoc: lopHoc.className,
      giaoVienChuNhiem: lopHoc.teacherInfo.userName,
      siSo: lopHoc.totalStudents,
    }));
    closeModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (showMoiQuanHeKhac) {
      setShowMoiQuanHeCha(true);
      setShowMoiQuanHeMe(true);
    } else {
      setShowMoiQuanHeCha(false);
      setShowMoiQuanHeMe(false);
    }
  }, [showMoiQuanHeKhac]);

  useEffect(() => {
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      moiQuanHeKhac: showMoiQuanHeKhac,
    }));
  }, [showMoiQuanHeKhac]);

  useEffect(() => {
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      moiQuanHeCha: showMoiQuanHeCha,
    }));
  }, [showMoiQuanHeCha]);

  useEffect(() => {
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      moiQuanHeMe: showMoiQuanHeMe,
    }));
  }, [showMoiQuanHeMe]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (validateInput()) {
      try {
        await addStudent(studentInfo);

        // clear form trừ năm học
        setStudentInfo((prevInfo) => ({
          ...prevInfo,
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
          khoiLop: '',
          lopHoc: '',
          giaoVienChuNhiem: '',
          siSo: '',
        }));

        toast.success('Thêm học sinh thành công');
      } catch (error) {
        if (error.response.status === 401) {
          toast.error('Mã số sinh viên đã tồn tại');
        }
        if (error.response.status === 402) {
          toast.error(`Số điện thoại đã được đăng ký cho tên ${studentInfo.hoTen}`);
        }
        if (error.response.status === 403) {
          toast.error('Không tìm thấy lớp học');
        }
        if (error.response.status === 404) {
          toast.error('Sỉ số lớp đã đầy');
        }
        if (error.response.status === 500) {
          toast.error('Thêm học sinh thất bại');
        }
      }
    }
  };

  const validateInput = () => {
    if (studentInfo.hoTen === '') {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    if (studentInfo.namSinh === '') {
      toast.error('Vui lòng nhập năm sinh');
      return false;
    }
    if (studentInfo.gioiTinh === '') {
      toast.error('Vui lòng chọn giới tính');
      return false;
    }
    if (studentInfo.danToc === '') {
      toast.error('Vui lòng chọn dân tộc');
      return false;
    }
    if (studentInfo.ngayVaoTruong === '') {
      toast.error('Vui lòng nhập ngày vào trường');
      return false;
    }
    if (studentInfo.sdt === '') {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (studentInfo.diaChi === '') {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }
    if (showMoiQuanHeKhac) {
      if (studentInfo.moiQuanHe === '') {
        toast.error('Vui lòng chọn mối quan hệ');
        return false;
      }
      if (studentInfo.hoTenNguoiGiamHo === '') {
        toast.error('Vui lòng nhập họ tên người giám hộ');
        return false;
      }
      if (studentInfo.namSinhNguoiGiamHo === '') {
        toast.error('Vui lòng nhập năm sinh người giám hộ');
        return false;
      }
      if (studentInfo.ngheNghiepNguoiGiamHo === '') {
        toast.error('Vui lòng nhập nghề nghiệp người giám hộ');
        return false;
      }
      if (studentInfo.sdtNguoiGiamHo === '') {
        toast.error('Vui lòng nhập số điện thoại người giám hộ');
        return false;
      }
    } else {
      if (showMoiQuanHeCha === false) {
        if (studentInfo.hoTenCha === '') {
          toast.error('Vui lòng nhập họ tên cha');
          return false;
        }
        if (studentInfo.namSinhCha === '') {
          toast.error('Vui lòng nhập năm sinh cha');
          return false;
        }
        if (studentInfo.ngheNghiepCha === '') {
          toast.error('Vui lòng nhập nghề nghiệp cha');
          return false;
        }
        if (studentInfo.sdtCha === '') {
          toast.error('Vui lòng nhập số điện thoại cha');
          return false;
        }
      }
      if (showMoiQuanHeMe === false) {
        if (studentInfo.hoTenMe === '') {
          toast.error('Vui lòng nhập họ tên mẹ');
          return false;
        }
        if (studentInfo.namSinhMe === '') {
          toast.error('Vui lòng nhập năm sinh mẹ');
          return false;
        }
        if (studentInfo.ngheNghiepMe === '') {
          toast.error('Vui lòng nhập nghề nghiệp mẹ');
          return false;
        }
        if (studentInfo.sdtMe === '') {
          toast.error('Vui lòng nhập số điện thoại mẹ');
          return false;
        }
      }
    }

    if (studentInfo.khoiLop === '') {
      toast.error('Vui lòng chọn khối lớp');
      return false;
    }
    if (studentInfo.lopHoc === '') {
      toast.error('Vui lòng nhập lớp học');
      return false;
    }

    return true;
  };

  const [searchStudent, setSearchStudent] = useState({
    grade: '',
    className: '',
    academicYear: '',
    gender: '',
    userName: '',
    studentCode: '',
    status: '',
    ethnicGroups: '',
  });
  const [studentbyResearch, setStudentbyResearch] = useState([]);

  const handleSearchStudent = async (e) => {
    if (
      searchStudent.grade === '' &&
      searchStudent.className === '' &&
      searchStudent.academicYear === '' &&
      searchStudent.gender === '' &&
      searchStudent.userName === '' &&
      searchStudent.studentCode === '' &&
      searchStudent.status === '' &&
      searchStudent.ethnicGroups === ''
    ) {
      toast.dismiss();
      toast.error('Vui lòng nhập ít nhất một trường để tìm kiếm');

      return;
    }

    try {
      const res = await searchStudents(searchStudent); // Truyền searchStudent
      console.log(res);
      toast.success('Tìm kiếm học sinh thành công');
      setStudentbyResearch(res);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Không tìm thấy học sinh');
        // reset lại bảng
        setStudentbyResearch([]);
      } else {
        console.error('Lỗi tìm kiếm học sinh:', error);
      }
    }
  };

  // tạo resetSearch
  const resetSearch = () => {
    setSearchStudent((prev) => ({
      ...prev,
      grade: '',
      className: '',
      academicYear: '',
      gender: '',
      userName: '',
      studentCode: '',
      status: '',
      ethnicGroups: '',
    }));
    setStudentbyResearch([]);
    // xoá toàn bộ thông tin bảng
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
    let success = 0;
    let failed = 0;
    console.log('totalStudents', totalStudents);
    studentsImport.forEach(async (student, index) => {
      studentInfo.mssv = student['Mã số sinh viên'];
      studentInfo.hoTen = student['Họ và tên'];
      studentInfo.namSinh = student['Năm sinh'];
      studentInfo.gioiTinh = student['Giới tính'];
      studentInfo.danToc = student['Dân tộc'];
      studentInfo.ngayVaoTruong = student['Ngày vào trường'];
      studentInfo.sdt = student['Số điện thoại'];
      studentInfo.diaChi = student['Địa chỉ'];
      studentInfo.moiQuanHeKhac = student['Mối hệ khác'] === 'Không' ? false : true;
      studentInfo.moiQuanHe = student['Mối hệ khác'];
      studentInfo.moiQuanHeCha = student['Cha'] === 'Không' ? true : false;
      studentInfo.moiQuanHeMe = student['Mẹ'] === 'Không' ? true : false;
      studentInfo.hoTenCha = student['Họ tên cha'];
      studentInfo.namSinhCha = student['Năm sinh cha'];
      studentInfo.ngheNghiepCha = student['Nghề nghiệp cha'];
      studentInfo.sdtCha = student['Số điện thoại cha'];
      studentInfo.hoTenMe = student['Họ tên mẹ'];
      studentInfo.namSinhMe = student['Năm sinh mẹ'];
      studentInfo.ngheNghiepMe = student['Nghề nghiệp mẹ'];
      studentInfo.sdtMe = student['Số điện thoại mẹ'];
      studentInfo.hoTenNguoiGiamHo = student['Họ tên người giám hộ'];
      studentInfo.namSinhNguoiGiamHo = student['Năm sinh người giám hộ'];
      studentInfo.ngheNghiepNguoiGiamHo = student['Nghề nghiệp người giám hộ'];
      studentInfo.sdtNguoiGiamHo = student['Số điện thoại người giám hộ'];
      studentInfo.namHoc = student['Năm học'];
      studentInfo.khoiLop = student['Khối'];
      studentInfo.lopHoc = student['Lớp'];

      console.log('studentInfo', studentInfo);

      try {
        const response = await addStudent(studentInfo);

        if (response.ok) {
          success++;
        } else {
          failed++;
        }
        setImportProgress(Math.round(((index + 1) / totalStudents) * 100));
      } catch (error) {
        failed++;
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
        setImportProgress(Math.round(((index + 1) / totalStudents) * 100));
      }

      setProgressStatus({ success, failed });
    });
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      {functionType === 'add-student' && (
        <div className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto">
          <div>
            <span className="font-medium">1. Thông tin cá nhân</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Mã số sinh viên*</label>
              <input
                disabled
                type="text"
                id="mssv"
                onChange={handleChange}
                value={studentInfo.mssv}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
                placeholder="Sinh mã tự động"
              />
            </div>
            <div>
              <label htmlFor="name1">Họ và tên*</label>
              <input type="text" id="hoTen" onChange={handleChange} value={studentInfo.hoTen} className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name2">Năm sinh*</label>
              <input
                type="date"
                id="namSinh"
                onChange={handleChange}
                value={studentInfo.namSinh}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="gioi-tinh">Giới tính*</label>
              <select className="w-full p-2 border border-gray-300 rounded" id="gioiTinh" onChange={handleChange} value={studentInfo.gioiTinh}>
                <option value="" selected></option>
                <option value="Nu">Nữ</option>
                <option value="Nam">Nam</option>
              </select>
            </div>
            <div>
              <label htmlFor="gioi-tinh">Dân tộc*</label>
              <select id="danToc" onChange={handleChange} value={studentInfo.danToc} className="w-full p-2 border border-gray-300 rounded">
                <option value=""></option>
                <option value="Kinh">Kinh</option>
                <option value="Tày">Tày</option>
                <option value="Thái">Thái</option>
                <option value="Mường">Mường</option>
                <option value="Khmer">Khmer</option>
                <option value="Mông">Mông</option>
                <option value="Nùng">Nùng</option>
                <option value="Dao">Dao</option>
                <option value="H'Mông">H'Mông</option>
                <option value="Co Tu">Co Tu</option>
                <option value="Xơ Đăng">Xơ Đăng</option>
                <option value="Chăm">Chăm</option>
                <option value="Ba Na">Ba Na</option>
                <option value="Bru - Vân Kiều">Bru - Vân Kiều</option>
                <option value="Ê Đê">Ê Đê</option>
                <option value="Gia Rai">Gia Rai</option>
                <option value="Ra Glai">Ra Glai</option>
                <option value="Sê Đăng">Sê Đăng</option>
                <option value="Tà Ôi">Tà Ôi</option>
                <option value="Thổ">Thổ</option>
                <option value="Chứt">Chứt</option>
                <option value="Khơ Mú">Khơ Mú</option>
                <option value="La Hủ">La Hủ</option>
                <option value="Lào">Lào</option>
                <option value="Lự">Lự</option>
                <option value="Ngái">Ngái</option>
                <option value="Người Hoa">Người Hoa</option>
                <option value="Người Tàu">Người Tàu</option>
                <option value="Người Chăm">Người Chăm</option>
                <option value="Người Thái">Người Thái</option>
                <option value="Người Mường">Người Mường</option>
                <option value="Người Kinh">Người Kinh</option>
                <option value="Người Nùng">Người Nùng</option>
                <option value="Người Dao">Người Dao</option>
                <option value="Người Mông">Người Mông</option>
                <option value="Người Khơ Me">Người Khơ Me</option>
                <option value="Người Bru - Vân Kiều">Người Bru - Vân Kiều</option>
                <option value="Người Ê Đê">Người Ê Đê</option>
                <option value="Người Ba Na">Người Ba Na</option>
                <option value="Người Gia Rai">Người Gia Rai</option>
                <option value="Người Ra Glai">Người Ra Glai</option>
                <option value="Người Sê Đăng">Người Sê Đăng</option>
                <option value="Người Tà Ôi">Người Tà Ôi</option>
                <option value="Người Thổ">Người Thổ</option>
                <option value="Người Chứt">Người Chứt</option>
                <option value="Người Khơ Mú">Người Khơ Mú</option>
                <option value="Người La Hủ">Người La Hủ</option>
                <option value="Người Lào">Người Lào</option>
                <option value="Người Lự">Người Lự</option>
                <option value="Người Ngái">Người Ngái</option>
              </select>
            </div>
            <div>
              <label htmlFor="name4">Ngày vào trường*</label>
              <input
                type="date"
                id="ngayVaoTruong"
                onChange={handleChange}
                value={studentInfo.ngayVaoTruong}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name5">SĐT liên lạc*</label>
              <input type="number" id="sdt" onChange={handleChange} value={studentInfo.sdt} className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label htmlFor="name5">Địa chỉ thường trú*</label>
              <input
                type="text"
                id="diaChi"
                onChange={handleChange}
                value={studentInfo.diaChi}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {showMoiQuanHeKhac === false && (
            <div>
              <div>
                <span className="font-medium">2. Thông tin gia đình</span>
              </div>
              <div className="pt-2">
                <input type="checkbox" value={showMoiQuanHeCha} onChange={() => setShowMoiQuanHeCha(!showMoiQuanHeCha)} />
                <label htmlFor="moiQuanHeKhac" className="p-2">
                  Vắng cha <i>(Nếu học sinh vắng cha chọn tính năng này)</i>
                </label>
              </div>
              {showMoiQuanHeCha === false && (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div>
                    <label htmlFor="name1">Họ tên cha*</label>
                    <input
                      type="text"
                      id="hoTenCha"
                      onChange={handleChange}
                      value={studentInfo.hoTenCha}
                      className="w-full p-2 border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="name1">Năm sinh cha*</label>
                    <input
                      type="date"
                      id="namSinhCha"
                      onChange={handleChange}
                      value={studentInfo.namSinhCha}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="name1">Nghề nghiệp cha*</label>
                    <input
                      type="text"
                      id="ngheNghiepCha"
                      onChange={handleChange}
                      value={studentInfo.ngheNghiepCha}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="name1">Số điện thoại cha*</label>
                    <input
                      type="number"
                      id="sdtCha"
                      onChange={handleChange}
                      value={studentInfo.sdtCha}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <input type="checkbox" id="moiQuanHeMe" value={showMoiQuanHeMe} onChange={() => setShowMoiQuanHeMe(!showMoiQuanHeMe)} />
                <label htmlFor="moiQuanHeKhac" className="p-2">
                  Vắng mẹ <i>(Nếu học sinh vắng mẹ chọn tính năng này)</i>
                </label>
              </div>
              {showMoiQuanHeMe === false && (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div>
                    <label htmlFor="name1">Họ tên mẹ*</label>
                    <input
                      type="text"
                      id="hoTenMe"
                      onChange={handleChange}
                      value={studentInfo.hoTenMe}
                      className="w-full p-2  border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="name1">Năm sinh mẹ*</label>
                    <input
                      type="date"
                      id="namSinhMe"
                      onChange={handleChange}
                      value={studentInfo.namSinhMe}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="name1">Nghề nghiệp mẹ*</label>
                    <input
                      type="text"
                      id="ngheNghiepMe"
                      onChange={handleChange}
                      value={studentInfo.ngheNghiepMe}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="name1">Số điện thoại mẹ*</label>
                    <input
                      type="number"
                      id="sdtMe"
                      onChange={handleChange}
                      value={studentInfo.sdtMe}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <input type="checkbox" id="moiQuanHeKhac" value={showMoiQuanHeKhac} onChange={() => setShowMoiQuanHeKhac(!showMoiQuanHeKhac)} />
            <label htmlFor="moiQuanHeKhac" className="p-2">
              Mối quan hệ khác <i>(Nếu học sinh vắng cả cha và mẹ thì chọn tính năng này)</i>
            </label>
          </div>

          {showMoiQuanHeKhac && (
            <div>
              <div>
                <span className="font-medium">3. Thông tin người giám hộ</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="name1">Mối quan hệ</label>
                  <select className="w-full p-2 border border-gray-300 rounded" id="moiQuanHe" onChange={handleChange} value={studentInfo.moiQuanHe}>
                    <option value="" selected></option>
                    <option value="OngBa">Ông bà</option>
                    <option value="AnhChi">Anh chị</option>
                    <option value="HoHang">Họ hàng</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="name1">Họ tên người giám hộ</label>
                  <input
                    type="text"
                    id="hoTenNguoiGiamHo"
                    onChange={handleChange}
                    value={studentInfo.hoTenNguoiGiamHo}
                    className="w-full p-2 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="name1">Năm sinh người giám hộ</label>
                  <input
                    type="date"
                    id="namSinhNguoiGiamHo"
                    onChange={handleChange}
                    value={studentInfo.namSinhNguoiGiamHo}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="name1">Nghề nghiệp người giám hộ</label>
                  <input
                    type="text"
                    id="ngheNghiepNguoiGiamHo"
                    onChange={handleChange}
                    value={studentInfo.ngheNghiepNguoiGiamHo}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="name1">Số điện thoại người giám hộ</label>
                  <input
                    type="number"
                    id="sdtNguoiGiamHo"
                    onChange={handleChange}
                    value={studentInfo.sdtNguoiGiamHo}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <span className="font-medium">4. Thêm vào lớp học</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Năm học*</label>
              <input
                disabled
                type="text"
                id="namHoc"
                onChange={handleChange}
                value={studentInfo.namHoc}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name1">Khối lớp*</label>
              <select className="w-full p-2 border border-gray-300 rounded" id="khoiLop" onChange={handleChange} value={studentInfo.khoiLop}>
                <option value="" selected></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="name1">Lớp học*</label>
              <input
                type="text"
                id="lopHoc"
                onChange={handleChange}
                value={studentInfo.lopHoc}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <FiSearch onClick={handleSearchLopHoc} className="absolute right-2 top-9 cursor-pointer" />
            </div>
            <div className="relative">
              <label htmlFor="name1">Giáo viên chủ nhiệm</label>
              <input
                disabled
                type="text"
                id="giaoVienChuNhiem"
                value={studentInfo.giaoVienChuNhiem}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
            </div>

            <div className="relative">
              <label htmlFor="name1">Sỉ số lớp hiện tại</label>
              <input disabled type="text" id="siSo" value={studentInfo.siSo} className="w-full p-2 bg-gray-50 border border-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <button
              onClick={handleSubmit}
              type="button"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Thêm học sinh
            </button>
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
                {lopHocs.map((lopHoc) => (
                  <li key={lopHoc._id} className="flex justify-between items-center p-2 border border-gray-300 rounded">
                    <div>
                      <p className="font-semibold">{lopHoc.className}</p>
                      <p className="text-sm text-gray-600">Sỉ số hiện tại: {lopHoc.totalStudents}</p>
                      <p className="text-sm text-gray-600">Giáo viên chủ nhiệm: {lopHoc.teacherInfo.userName}</p>
                    </div>
                    <button onClick={() => handleSelectLopHoc(lopHoc)} className="p-2 bg-green-500 text-white rounded">
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
      {functionType === 'list-student' && (
        <div className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto w-full" style={{ width: '100%' }}>
          <div>
            <span className="font-medium text-1.5xl">Danh sách học sinh</span>
          </div>

          <div className="flex flex-col bg-gray-200 p-4 rounded w-full">
            <h2 className="text-lg font-semibold bg-gray-200 mb-4">Tìm kiếm học sinh</h2>
            <div className={`flex flex-wrap gap-4 ${isCollapsed ? 'hidden' : 'w-full'}`}>
              <div className="flex-1">
                <label htmlFor="grade">Khối</label>
                <select
                  id="grade"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={searchStudent.grade}
                  onChange={(e) => setSearchStudent({ ...searchStudent, grade: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="lopHoc">Lớp học</label>
                <select
                  id="lopHoc"
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setSearchStudent({ ...searchStudent, className: e.target.value })}
                  value={searchStudent.className}
                >
                  <option value="">Tất cả</option>
                  {/* Thêm các tuỳ chọn lớp học từ 1A1 tới 1A5 tương tự với các khối 2,3,4,5 */}
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
              <div className="flex-1">
                <label htmlFor="year">Năm học</label>

                <select
                  id="year"
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setSearchStudent({ ...searchStudent, academicYear: e.target.value })}
                  value={searchStudent.academicYear}
                >
                  <option value="">Tất cả</option>
                  {/* Các tùy chọn năm học */}
                  <option value="2020-2021">2020-2021</option>
                  <option value="2021-2022">2021-2022</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="gioiTinh">Giới tính</label>
                <select
                  id="gioiTinh"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={searchStudent.gender}
                  onChange={(e) => setSearchStudent({ ...searchStudent, gender: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            <div className={`flex flex-wrap gap-4 ${isCollapsed ? 'hidden' : 'w-full'}`}>
              <div className="flex-1">
                <label htmlFor="hoTen">Họ tên</label>
                <input
                  type="text"
                  id="hoTen"
                  value={searchStudent.userName}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập họ tên..."
                  onChange={(e) => setSearchStudent({ ...searchStudent, userName: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="mssv">Mã học sinh</label>
                <input
                  type="text"
                  id="mssv"
                  value={searchStudent.studentCode}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập mã học sinh..."
                  onChange={(e) => setSearchStudent({ ...searchStudent, studentCode: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="trangThai">Trạng thái</label>
                <select
                  id="trangThai"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={searchStudent.status}
                  onChange={(e) => setSearchStudent({ ...searchStudent, status: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="Đang học">Đang học</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                  <option value="Đã nghĩ học">Đã nghĩ học</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="danToc">Dân tộc</label>
                <select
                  id="danToc"
                  value={searchStudent.ethnicGroups}
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setSearchStudent({ ...searchStudent, ethnicGroups: e.target.value })}
                >
                  <option value="">Chọn dân tộc</option>
                  <option value="Kinh">Kinh</option>
                  <option value="Tày">Tày</option>
                  <option value="Thái">Thái</option>
                  <option value="Mường">Mường</option>
                  <option value="Khmer">Khmer</option>
                  <option value="Mông">Mông</option>
                  <option value="Nùng">Nùng</option>
                  <option value="Dao">Dao</option>
                  <option value="H'Mông">H'Mông</option>
                  <option value="Co Tu">Co Tu</option>
                  <option value="Xơ Đăng">Xơ Đăng</option>
                  <option value="Chăm">Chăm</option>
                  <option value="Ba Na">Ba Na</option>
                  <option value="Bru - Vân Kiều">Bru - Vân Kiều</option>
                  <option value="Ê Đê">Ê Đê</option>
                  <option value="Gia Rai">Gia Rai</option>
                  <option value="Ra Glai">Ra Glai</option>
                  <option value="Sê Đăng">Sê Đăng</option>
                  <option value="Tà Ôi">Tà Ôi</option>
                  <option value="Thổ">Thổ</option>
                  <option value="Chứt">Chứt</option>
                  <option value="Khơ Mú">Khơ Mú</option>
                  <option value="La Hủ">La Hủ</option>
                  <option value="Lào">Lào</option>
                  <option value="Lự">Lự</option>
                  <option value="Ngái">Ngái</option>
                  <option value="Người Hoa">Người Hoa</option>
                  <option value="Người Tàu">Người Tàu</option>
                  <option value="Người Chăm">Người Chăm</option>
                  <option value="Người Thái">Người Thái</option>
                  <option value="Người Mường">Người Mường</option>
                  <option value="Người Kinh">Người Kinh</option>
                  <option value="Người Nùng">Người Nùng</option>
                  <option value="Người Dao">Người Dao</option>
                  <option value="Người Mông">Người Mông</option>
                  <option value="Người Khơ Me">Người Khơ Me</option>
                  <option value="Người Bru - Vân Kiều">Người Bru - Vân Kiều</option>
                  <option value="Người Ê Đê">Người Ê Đê</option>
                  <option value="Người Ba Na">Người Ba Na</option>
                  <option value="Người Gia Rai">Người Gia Rai</option>
                  <option value="Người Ra Glai">Người Ra Glai</option>
                  <option value="Người Sê Đăng">Người Sê Đăng</option>
                  <option value="Người Tà Ôi">Người Tà Ôi</option>
                  <option value="Người Thổ">Người Thổ</option>
                  <option value="Người Chứt">Người Chứt</option>
                  <option value="Người Khơ Mú">Người Khơ Mú</option>
                  <option value="Người La Hủ">Người La Hủ</option>
                  <option value="Người Lào">Người Lào</option>
                  <option value="Người Lự">Người Lự</option>
                  <option value="Người Ngái">Người Ngái</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center w-full item-ends" style={{ marginTop: '15px' }}>
              <div className="flex">
                <button
                  type="button"
                  // className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={handleSearchStudent}
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={resetSearch}
                  class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  Reset
                </button>
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={toggleCollapse}
                  class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã số học sinh
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày sinh
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giới Tính
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dân tộc
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên lớp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tuỳ chỉnh
                  </th>
                </tr>
              </thead>
              {/* // chỗ body hiện thông tin  */}
              <tbody className="bg-white divide-y divide-gray-200">
                {studentbyResearch.length === 0 ? ( // Check if there are no students to display
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Không có dữ liệu
                    </td>{' '}
                  </tr>
                ) : (
                  studentbyResearch.map((student, index) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.studentCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.dateOfBirth}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.ethnicGroups}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.className}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          className="focus:outline-none text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {functionType === 'add-student-import' && (
        <div className="w-full p-20 grid grid-rows-4">
          <div>
            <input type="file" onChange={handleFileUpload} />
            <button
              onClick={handleImport}
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Import
            </button>
          </div>
          <div>
            <span>Process: {importProgress}%</span>
          </div>
          <div>
            <span>Thành công: {progressStatus.success}</span>
          </div>
          <div>
            <span>Thất bại: {progressStatus.failed}</span>
          </div>
        </div>
      )}
    </>
  );
}
