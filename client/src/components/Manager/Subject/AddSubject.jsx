import 'flowbite';
import React from 'react';
import { useEffect, useState } from 'react';
import { addSubject } from '../../../api/Subject';
import { Toaster, toast } from 'react-hot-toast';

export default function AddSubject() {
  const [subjectInfo, setSubjectInfo] = useState({
    subjectName: '',
    subjectCode: '',
    subjectDescription: '',
    subjectCredits: '',
    subjectGrade: '',
    subjectType: '',
  });

  const validateSubjectInfo = () => {
    if (!subjectInfo.subjectName) {
      toast.error('Tên môn học không được để trống');
      return false;
    }
    if (!subjectInfo.subjectGrade) {
      toast.error('Khối lớp không được để trống');
      return false;
    }
    if (!subjectInfo.subjectCredits) {
      toast.error('Số tiết học không được để trống');
      return false;
    }
    if (!subjectInfo.subjectType) {
      toast.error('Loại môn học không được để trống');
      return false;
    }
    return true;
  };

  const handleAddSubject = async () => {
    if (!validateSubjectInfo()) return;
    try {
      await addSubject(subjectInfo);
      toast.success('Thêm môn học thành công');
      //clear form
      setSubjectInfo({
        subjectName: '',
        subjectCode: '',
        subjectDescription: '',
        subjectCredits: '',
        subjectGrade: '',
        subjectType: '',
      });
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setSubjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === 'subjectName' ? value.toUpperCase() : value,
    }));
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      <div id="root" className="grid grid-flow-row gap-4 p-4 px-20 max-h-full overflow-auto relative">
        <div className="pb-5">
          <span className="text-lg font-medium flex items-center justify-start gap-1">Thêm mới môn học</span>
          <span className="text-sm text-gray-500 font-normal flex items-center justify-start gap-1">
            Chức năng này giúp bạn thêm mới môn học vào hệ thống
          </span>
        </div>
        <div>
          <span className="font-medium">1. Thông tin môn học</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          <div>
            <label htmlFor="tenMonHoc">Tên môn học*</label>
            <input
              type="text"
              id="tenMonHoc"
              value={subjectInfo.subjectName}
              onChange={(e) => handleOnchange(e)}
              name="subjectName"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="khoiLop">Khối lớp*</label>
            <input
              type="text"
              id="khoiLop"
              onChange={(e) => handleOnchange(e)}
              name="subjectGrade"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="soTiet">Số tiết học*</label>
            <input
              type="text"
              id="soTiet"
              onChange={(e) => handleOnchange(e)}
              name="subjectCredits"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="loaiMonHoc">Loại môn học*</label>
            <select
              onChange={(e) => handleOnchange(e)}
              name="subjectType"
              id="loaiMonHoc"
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue=""
            >
              <option value="" selected></option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Năng khiếu">Năng khiếu</option>
              <option value="Ngoại ngữ">Ngoại ngữ</option>
              <option value="Thể chất">Thể chất</option>
            </select>
          </div>
          <div>
            <label htmlFor="moTa">Mô tả</label>
            <input
              type="text"
              id="moTa"
              onChange={(e) => handleOnchange(e)}
              name="subjectDescription"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <div></div>
            <br />
            <button
              onClick={handleAddSubject}
              className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Thêm môn học
            </button>
          </div>
        </div>
        <div>
          <span className="font-medium">2. Danh sách môn học</span>
        </div>
        <div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-2 border border-b border-gray-300 text-left w-14">STT</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Tên môn học</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Khối lớp</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Số tiết</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Loại môn học</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Mô tả</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left"></th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">1</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">Toán</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">10</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">4</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">Cơ bản</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">Môn học cơ bản</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Xóa</button>
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                      Sửa
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">2</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">Văn</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">10</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">4</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">Cơ bản</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">Môn học cơ bản</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Xóa</button>
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                      Sửa
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
