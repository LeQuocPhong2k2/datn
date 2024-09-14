import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import 'flowbite';
import { FiSearch } from 'react-icons/fi';
import Modal from 'react-modal';

import { addStudent } from '../../api/Student';
import { getLopHocByNamHocVaKhoi } from '../../api/Class';

Modal.setAppElement('#root');

export default function QuanLyHocSinh({ functionType }) {
  const [showMoiQuanHeKhac, setShowMoiQuanHeKhac] = useState(false);
  const [showMoiQuanHeCha, setShowMoiQuanHeCha] = useState(false);
  const [showMoiQuanHeMe, setShowMoiQuanHeMe] = useState(false);
  const [lopHocs, setLopHocs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [studentInfo, setStudentInfo] = useState({
    mssv: '',
    hoTen: '',
    namSinh: '',
    gioiTinh: '',
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
              <input
                type="text"
                id="hoTen"
                onChange={handleChange}
                value={studentInfo.hoTen}
                className="w-full p-2 border border-gray-300 rounded"
              />
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
              <select
                className="w-full p-2 border border-gray-300 rounded"
                name="gioi-tinh"
                id="gioiTinh"
                onChange={handleChange}
                value={studentInfo.gioiTinh}
              >
                <option value="" selected></option>
                <option value="Nu">Nữ</option>
                <option value="Nam">Nam</option>
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
              <input
                type="number"
                id="sdt"
                onChange={handleChange}
                value={studentInfo.sdt}
                className="w-full p-2 border border-gray-300 rounded"
              />
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
                <input
                  type="checkbox"
                  value={showMoiQuanHeCha}
                  onChange={() => setShowMoiQuanHeCha(!showMoiQuanHeCha)}
                />
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
                <input
                  type="checkbox"
                  id="moiQuanHeMe"
                  value={showMoiQuanHeMe}
                  onChange={() => setShowMoiQuanHeMe(!showMoiQuanHeMe)}
                />
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
            <input
              type="checkbox"
              id="moiQuanHeKhac"
              value={showMoiQuanHeKhac}
              onChange={() => setShowMoiQuanHeKhac(!showMoiQuanHeKhac)}
            />
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
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    id="moiQuanHe"
                    onChange={handleChange}
                    value={studentInfo.moiQuanHe}
                  >
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
              <select
                className="w-full p-2 border border-gray-300 rounded"
                id="khoiLop"
                onChange={handleChange}
                value={studentInfo.khoiLop}
              >
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
              <FiSearch
                onClick={handleSearchLopHoc}
                className="absolute right-2 top-9 cursor-pointer"
              />
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
              <input
                disabled
                type="text"
                id="siSo"
                value={studentInfo.siSo}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
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
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Danh sách giáo viên chủ nhiệm
              </h3>
            </div>
            <div class="p-4 md:p-5 max-h-20 xl:max-h-96 lg:max-h-56 md:max-h-40 sm:max-h-20 overflow-auto">
              <ul className="space-y-2">
                {lopHocs.map((lopHoc) => (
                  <li
                    key={lopHoc._id}
                    className="flex justify-between items-center p-2 border border-gray-300 rounded"
                  >
                    <div>
                      <p className="font-semibold">{lopHoc.className}</p>
                      <p className="text-sm text-gray-600">
                        Sỉ số hiện tại: {lopHoc.totalStudents}
                      </p>
                      <p className="text-sm text-gray-600">
                        Giáo viên chủ nhiệm: {lopHoc.teacherInfo.userName}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectLopHoc(lopHoc)}
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
