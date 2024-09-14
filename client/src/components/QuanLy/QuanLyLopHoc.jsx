import React from 'react';
import Modal from 'react-modal';
import 'flowbite';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import { getGiaoVienChuaPhanCongChuNhiem } from '../../api/Teacher';
import { addLopHoc } from '../../api/Class';

Modal.setAppElement('#root');

export default function QuanLyGiaoVien({ functionType }) {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lopHocInfo, setLopHocInfo] = useState({
    namHoc: '',
    khoiLop: '',
    tenLop: '',
    giaoVienChuNhiem: '',
    idGiaoVienChuNhiem: '',
    ngayBatDau: '',
    buoiHoc: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLopHocInfo((prevInfo) => ({
      ...prevInfo,
      [id]: id === 'tenLop' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async () => {
    if (validateInput()) {
      try {
        const res = await addLopHoc(lopHocInfo);

        toast.success('Thêm giáo viên thành công');

        setLopHocInfo({
          namHoc: '',
          khoiLop: '',
          tenLop: '',
          giaoVienChuNhiem: '',
          idGiaoVienChuNhiem: '',
          ngayBatDau: '',
          buoiHoc: '',
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

  const handleSearchTeacher = async () => {
    const res = await getGiaoVienChuaPhanCongChuNhiem(lopHocInfo.namHoc);
    console.log(res);
    setTeachers(res);
    openModal();
  };

  const handleSelectTeacher = (teacher) => {
    setLopHocInfo((prevInfo) => ({
      ...prevInfo,
      giaoVienChuNhiem: teacher.userName,
      idGiaoVienChuNhiem: teacher._id,
    }));
    closeModal();
  };

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

    if (lopHocInfo.ngayBatDau === '') {
      toast.error('Vui lòng nhập ngày bắt đầu');
      return false;
    }

    if (lopHocInfo.buoiHoc === '') {
      toast.error('Vui lòng chọn buổi học');
      return false;
    }

    return true;
  };

  // lấy năm học hiện tại
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    setLopHocInfo((prevInfo) => ({
      ...prevInfo,
      namHoc: `${year}-${year + 1}`,
    }));
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      {functionType === 'add-classRoom' && (
        <div id="root" className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto relative">
          <div>
            <span className="font-medium">1. Thông tin chung</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
              <input
                type="text"
                id="tenLop"
                value={lopHocInfo.tenLop}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
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
              <FiSearch
                onClick={handleSearchTeacher}
                className="absolute right-2 top-9 cursor-pointer"
              />
            </div>
            <div>
              <label htmlFor="name1">Ngày bắt đầu lớp học*</label>
              <input
                type="date"
                id="ngayBatDau"
                value={lopHocInfo.ngayBatDau}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="gioi-tinh">Buổi học*</label>
              <select
                name="buoiHoc"
                id="buoiHoc"
                value={lopHocInfo.buoiHoc}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" selected></option>
                <option value="Sáng">Sáng</option>
                <option value="Chiều">Chiều</option>
              </select>
            </div>
          </div>

          <div>
            <span className="font-medium">2. Import danh sách học sinh</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <input type="file" id="name1" className="w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <button
              onClick={handleSubmit}
              type="button"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Thêm lớp học
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
