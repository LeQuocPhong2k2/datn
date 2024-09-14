import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import 'flowbite';
import { FiSearch } from 'react-icons/fi';

export default function QuanLyHocSinh({ functionType }) {
  const [showMoiQuanHeKhac, setShowMoiQuanHeKhac] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [studentInfo, setStudentInfo] = useState({
    mssv: '',
    hoTen: '',
    namSinh: '',
    gioiTinh: '',
    ngayVaoTruong: '',
    sdt: '',
    diaChi: '',
    moiQuanHeKhac: showMoiQuanHeKhac,
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
    namHoc: '2024 - 2025',
    khoiLop: '',
    lopHoc: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    validateInput();
    console.log(studentInfo);

    if (validateInput()) {
      // call api here
      toast.success('Thêm học sinh thành công');
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

          {!showMoiQuanHeKhac && (
            <div>
              <div>
                <span className="font-medium">2. Thông tin gia đình</span>
              </div>
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
              <FiSearch className="absolute right-2 top-9 cursor-pointer" />
            </div>
            <div className="relative">
              <label htmlFor="name1">Giáo viên chủ nhiệm</label>
              <input
                disabled
                type="text"
                id="name1"
                value=""
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              />
            </div>

            <div className="relative">
              <label htmlFor="name1">Sỉ số lớp hiện tại</label>
              <input
                disabled
                type="text"
                id="name1"
                value=""
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
      {functionType === 'list-student' && (
        <div
          className="grid grid-flow-row gap-4 p-4 max-h-full overflow-auto w-full"
          style={{ width: '100%' }}
        >
          <div>
            <span className="font-medium text-1.5xl">Danh sách học sinh</span>
          </div>

          <div className="flex flex-col bg-gray-200 p-4 rounded w-full">
            <h2 className="text-lg font-semibold bg-gray-200 mb-4">Tìm kiếm học sinh</h2>
            <div className={`flex flex-wrap gap-4 ${isCollapsed ? 'hidden' : 'w-full'}`}>
              <div className="flex-1">
                <label htmlFor="grade">Khối</label>
                <select id="grade" className="w-full p-2 border border-gray-300 rounded">
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
                <select id="lopHoc" className="w-full p-2 border border-gray-300 rounded">
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
                <select id="year" className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Tất cả</option>
                  {/* Các tùy chọn năm học */}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="gioiTinh">Giới tính</label>
                <select id="gioiTinh" className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Tất cả</option>
                  <option value="Nam">Nam</option>
                  <option value="Nu">Nữ</option>
                </select>
              </div>
            </div>
            <div className={`flex flex-wrap gap-4 ${isCollapsed ? 'hidden' : 'w-full'}`}>
              <div className="flex-1">
                <label htmlFor="hoTen">Họ tên</label>
                <input
                  type="text"
                  id="hoTen"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập họ tên..."
                />
              </div>
              <div className="flex-1">
                <label htmlFor="mssv">Mã học sinh</label>
                <input
                  type="text"
                  id="mssv"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập mã học sinh..."
                />
              </div>
              <div className="flex-1">
                <label htmlFor="trangThai">Trạng thái</label>
                <select id="trangThai" className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Tất cả</option>
                  <option value="dangHoc">Đang học</option>
                  <option value="daTotNghiep">Đã tốt nghiệp</option>
                  <option value="daNghiHoc">Đã nghĩ học</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="danToc">Dân tộc</label>
                <select id="danToc" className="w-full p-2 border border-gray-300 rounded">
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
            <div
              className="flex flex-wrap gap-4 justify-center w-full item-ends"
              style={{ marginTop: '15px' }}
            >
              <div className="flex">
                <button
                  type="button"
                  // className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Tìm kiếm
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    STT
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Họ tên
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mã số học sinh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày sinh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giới Tính
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dân tộc
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên lớp
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng Thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tuỳ chỉnh
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Insert student data here */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">1</td>
                  <td className="px-6 py-4 whitespace-nowrap">Nguyễn Văn A</td>
                  <td className="px-6 py-4 whitespace-nowrap">HS001</td>
                  <td className="px-6 py-4 whitespace-nowrap">01/01/2001</td>
                  <td className="px-6 py-4 whitespace-nowrap">Nam</td>
                  <td className="px-6 py-4 whitespace-nowrap">Kinh</td>
                  <td className="px-6 py-4 whitespace-nowrap">1A1</td>
                  <td className="px-6 py-4 whitespace-nowrap">Đang học</td>
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
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
