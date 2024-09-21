import React from 'react';
import { useState } from 'react';
import 'flowbite';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';

import { addGiaoVien } from '../../../api/Teacher';

export default function QuanLyGiaoVien({ functionType }) {
  const [teacherInfo, setTeacherInfo] = useState({
    hoTen: '',
    namSinh: '',
    gioiTinh: '',
    trinhDo: '',
    sdt: '',
    diaChi: '',
    ngayBatDauCongTac: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTeacherInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (validateInput()) {
      try {
        addGiaoVien(teacherInfo);

        toast.success('Thêm giáo viên thành công');

        setTeacherInfo({
          hoTen: '',
          namSinh: '',
          gioiTinh: '',
          trinhDo: '',
          sdt: '',
          diaChi: '',
          ngayBatDauCongTac: '',
        });
      } catch (error) {
        if (error.response.status === 400) {
          toast.error('Số điện thoại đã tồn tại');
        } else {
          toast.error('Thêm giáo viên thất bại');
        }
      }
    }
  };

  const validateInput = () => {
    if (teacherInfo.hoTen === '') {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }

    if (teacherInfo.namSinh === '') {
      toast.error('Vui lòng nhập năm sinh');
      return false;
    }

    if (teacherInfo.gioiTinh === '') {
      toast.error('Vui lòng chọn giới tính');
      return false;
    }

    if (teacherInfo.trinhDo === '') {
      toast.error('Vui lòng chọn trình độ chuyên môn');
      return false;
    }

    if (teacherInfo.sdt === '') {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    } else {
      //regex check phone number
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(teacherInfo.sdt)) {
        toast.error('Số điện thoại không hợp lệ');
        return false;
      }
    }

    if (teacherInfo.diaChi === '') {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }

    if (teacherInfo.ngayBatDauCongTac === '') {
      toast.error('Vui lòng nhập ngày bắt đầu công tác');
      return false;
    }

    return true;
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      {functionType === 'add-teacher' && (
        <div className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto">
          <div>
            <span className="font-medium">1. Thông tin cá nhân</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name1">Họ và tên*</label>
              <input
                type="text"
                id="hoTen"
                value={teacherInfo.hoTen}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name2">Năm sinh*</label>
              <input
                type="date"
                id="namSinh"
                value={teacherInfo.namSinh}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="gioi-tinh">Giới tính*</label>
              <select
                id="gioiTinh"
                value={teacherInfo.gioiTinh}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="Nu">Nữ</option>
                <option value="Nam">Nam</option>
              </select>
            </div>
            <div>
              <label htmlFor="name4">Trình độ chuyên môn*</label>
              <select
                id="trinhDo"
                value={teacherInfo.trinhDo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="Cử nhân">Cử nhân</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
              </select>
            </div>

            <div>
              <label htmlFor="name5">SĐT liên lạc*</label>
              <input
                type="number"
                id="sdt"
                value={teacherInfo.sdt}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name5">Địa chỉ thường trú*</label>
              <input
                type="text"
                id="diaChi"
                value={teacherInfo.diaChi}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="name5">Ngày bắt đầu công tác*</label>
              <input
                type="date"
                id="ngayBatDauCongTac"
                value={teacherInfo.ngayBatDauCongTac}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <button
              onClick={handleSubmit}
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Thêm giáo viên
            </button>
          </div>
        </div>
      )}
    </>
  );
}
