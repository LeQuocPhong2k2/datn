/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Modal from 'react-modal';
import { Toaster, toast } from 'react-hot-toast';
import { editStudent } from '../../../api/Student';
Modal.setAppElement('#root');

const UpdateStudent = ({ handleBackSearchStudent, studentInfoUpdate }) => {
  useEffect(() => {
    console.log('Thông tin được lưu là ', studentInfoUpdate);
  }, [studentInfoUpdate]);

  // const [userNameStudent, setUserNameStudent] = useState(studentInfoUpdate.userName); // Thêm stat

  const [showMoiQuanHeKhac, setShowMoiQuanHeKhac] = useState(false);
  const [showMoiQuanHeCha, setShowMoiQuanHeCha] = useState(true);
  const [showMoiQuanHeMe, setShowMoiQuanHeMe] = useState(true);
  // kiểm tra phần tử studentInfoUpdate có trường  relationshipOther = false không nếu có thì showMoiQuanHeKhac = false , còn nếu relationshipOther = true thì showMoiQuanHeKhac = true
  const [thongTinCha, setThongTinCha] = useState({});
  const [thongTinMe, setThongTinMe] = useState({});
  const [thongTinNguoiGiamHo, setThongTinNguoiGiamHo] = useState({});

  const [studentInfo, setStudentInfo] = useState({
    studentCode: studentInfoUpdate.studentCode,
    userName: studentInfoUpdate.userName,
    phoneNumber: studentInfoUpdate.phoneNumber,
    dateOfBirth: studentInfoUpdate.dateOfBirth,
    gender: studentInfoUpdate.gender,
    dateOfEnrollment: studentInfoUpdate.dateOfEnrollment,
    address: studentInfoUpdate.address,
    relationshipOther: studentInfoUpdate.relationshipOther,
    parents: [],
    ethnicGroups: studentInfoUpdate.ethnicGroups,
    status: studentInfoUpdate.status,
    academicYear: studentInfoUpdate.academicYear,
    grade: studentInfoUpdate.grade,
    className: studentInfoUpdate.className,
    homeRoomTeacherName: studentInfoUpdate.homeRoomTeacherName,
    maxStudents: studentInfoUpdate.maxStudents,
  });

  useEffect(() => {
    if (studentInfoUpdate) {
      setShowMoiQuanHeKhac(studentInfoUpdate.relationshipOther === 'true');

      // Kiểm tra relationshipOther và lưu thông tin vào các state tương ứng
      if (studentInfoUpdate.relationshipOther === 'false') {
        setThongTinCha(studentInfoUpdate.parents.find((parent) => parent.relationship === 'Cha') || {});
        setThongTinMe(studentInfoUpdate.parents.find((parent) => parent.relationship === 'Mẹ') || {});
      } else {
        setThongTinNguoiGiamHo(studentInfoUpdate.parents[0] || {}); // Giả sử người giám hộ là phần tử đầu tiên
      }
    }
  }, [studentInfoUpdate]);

  useEffect(() => {
    // Cập nhật thông tin cha, mẹ hoặc người giám hộ vào studentInfo
    setStudentInfo((prevInfo) => ({
      ...prevInfo,
      parents: studentInfoUpdate.relationshipOther === 'false' ? [thongTinCha, thongTinMe] : [thongTinNguoiGiamHo],
    }));
  }, [thongTinCha, thongTinMe, thongTinNguoiGiamHo]);

  const handleEditStudent = async () => {
    // hiện toàn bộ thông tin của học sinh và các phần tử cha mẹ người giám hộ
    // gọi editStudent từ api/Student.js sau đó cập nhật lại studentInfoUpdate
    console.log('Thông tin cập nhật là ', studentInfo);
    const response = await editStudent(studentInfo);
    console.log('Kết quả cập nhật là ', response);
    if (response) {
      toast.success('Cập nhật hồ sơ học sinh thành công');
    } else {
      // alert('Cập nhật hồ sơ học sinh thất bại');
      toast.error('Cập nhật hồ sơ học sinh thất bại');
    }
  };

  return (
    <div id="root" className="grid grid-flow-row gap-4 p-4 max-h-full relative w-full">
      <Toaster toastOptions={{ duration: 2200 }} />
      <div className="flex items-center justify-start gap-2">
        <span
          onClick={handleBackSearchStudent}
          className="font-medium flex items-center justify-start gap-1 text-blue-500 cursor-pointer"
        >
          <IoMdArrowRoundBack /> Quay lại danh sách học sinh
        </span>
        {/* <span className="font-medium">/ Cập nhật thông tin lớp học {classUpdate.tenLop}</span> */}
      </div>
      <div>
        <span className="font-medium">1. Cập nhật thông tin chung</span>
      </div>
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
              // onChange={handleChange}
              value={studentInfoUpdate.studentCode}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              placeholder="Sinh mã tự động"
            />
          </div>
          <div>
            <label htmlFor="name1">Họ và tên*</label>
            <input
              type="text"
              id="hoTen"
              // onChange={handleChange}
              // value={studentInfoUpdate.userName}
              onChange={(e) => setStudentInfo({ ...studentInfo, userName: e.target.value })} // Cập nhật state studentInfo khi người dùng nhập
              value={studentInfo.userName} // Sử dụng state để hiển thị giá trị
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="name2">Năm sinh*</label>
            <input
              type="date"
              id="namSinh"
              value={studentInfo.dateOfBirth ? studentInfo.dateOfBirth.split('/').reverse().join('-') : ''} // Chuyển đổi định dạng từ DD/MM/YYYY sang YYYY-MM-DD
              onChange={(e) => {
                const [year, month, day] = e.target.value.split('-'); // Lấy year, month, day từ giá trị nhập
                setStudentInfo({ ...studentInfo, dateOfBirth: `${month}/${day}/${year}` }); // Cập nhật state với định dạng MM/DD/YYYY
              }} // Cập nhật state studentInfo khi người dùng nhập
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="gioi-tinh">Giới tính*</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              id="gioiTinh"
              // onChange={handleChange}
              onChange={(e) => setStudentInfo({ ...studentInfo, gender: e.target.value })} // Cập nhật state studentInfo khi người dùng nhập
              value={studentInfo.gender}
            >
              <option value="" selected></option>
              <option value="Nữ">Nữ</option>
              <option value="Nam">Nam</option>
            </select>
          </div>
          <div>
            <label htmlFor="gioi-tinh">Dân tộc*</label>
            <select
              id="danToc"
              // onChange={handleChange}
              onChange={(e) => setStudentInfo({ ...studentInfo, ethnicGroups: e.target.value })} // Cập nhật state studentInfo khi người dùng nhập
              value={studentInfo.ethnicGroups}
              className="w-full p-2 border border-gray-300 rounded"
            >
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
              <option value="Hrê">Hrê</option>
            </select>
          </div>
          <div>
            <label htmlFor="name4" style={{ color: 'red' }}>
              Ngày vào trường*
            </label>
            <input
              disabled
              type="date"
              id="ngayVaoTruong"
              // onChange={handleChange}
              onChange={(e) => setStudentInfo({ ...studentInfo, dateOfEnrollment: e.target.value })} // Cập nhật state studentInfo khi người dùng nhập
              value={studentInfo.dateOfEnrollment.split('T')[0]} // Chuyển đổi định dạng
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="name5">SĐT liên lạc*</label>
            <input
              type="number"
              id="sdt"
              // onChange={handleChange}
              value={studentInfo.phoneNumber}
              onChange={(e) => setStudentInfo({ ...studentInfo, phoneNumber: e.target.value })} // Cập nhật state studentInfo khi người dùng nhập
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="name5">Địa chỉ thường trú*</label>
            <input
              type="text"
              id="diaChi"
              // onChange={handleChange}
              onChange={(e) => setStudentInfo({ ...studentInfo, address: e.target.value })} // Cập nhật state studentInfo khi người dùng nhập
              value={studentInfo.address}
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
            {showMoiQuanHeCha && (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="name1">Họ tên cha*</label>
                  <input
                    type="text"
                    id="hoTenCha"
                    // onChange={handleChange}
                    // value={thongTinCha.userName}
                    value={thongTinCha.userName}
                    onChange={(e) => setThongTinCha({ ...thongTinCha, userName: e.target.value })} // Update state on change
                    className="w-full p-2 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="name1">Năm sinh cha*</label>
                  <input
                    type="date"
                    id="namSinhCha"
                    // onChange={handleChange}
                    value={thongTinCha.dateOfBirth ? thongTinCha.dateOfBirth.split('/').reverse().join('-') : ''} // Chuyển đổi định dạng
                    onChange={(e) => setThongTinCha({ ...thongTinCha, dateOfBirth: e.target.value })} // Update state on change
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="name1">Nghề nghiệp cha*</label>
                  <input
                    type="text"
                    id="ngheNghiepCha"
                    // onChange={handleChange}
                    value={thongTinCha.job}
                    onChange={(e) => setThongTinCha({ ...thongTinCha, job: e.target.value })} // Update state on change
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="name1">Số điện thoại cha*</label>
                  <input
                    type="number"
                    id="sdtCha"
                    // onChange={handleChange}
                    value={thongTinCha.phoneNumber}
                    onChange={(e) => setThongTinCha({ ...thongTinCha, phoneNumber: e.target.value })} // Update state on change
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
            {showMoiQuanHeMe && (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="name1">Họ tên mẹ*</label>
                  <input
                    type="text"
                    id="hoTenMe"
                    // onChange={handleChange}
                    value={thongTinMe.userName}
                    onChange={(e) => setThongTinMe({ ...thongTinMe, userName: e.target.value })} // Update state on change
                    className="w-full p-2  border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="name1">Năm sinh mẹ*</label>
                  <input
                    type="date"
                    id="namSinhMe"
                    // onChange={handleChange}

                    value={thongTinMe.dateOfBirth ? thongTinMe.dateOfBirth.split('/').reverse().join('-') : ''} // Chuyển đổi định dạng
                    onChange={(e) => setThongTinMe({ ...thongTinMe, dateOfBirth: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="name1">Nghề nghiệp mẹ*</label>
                  <input
                    type="text"
                    id="ngheNghiepMe"
                    // onChange={handleChange}
                    value={thongTinMe.job}
                    onChange={(e) => {
                      setThongTinMe({ ...thongTinMe, job: e.target.value });
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="name1">Số điện thoại mẹ*</label>
                  <input
                    type="number"
                    id="sdtMe"
                    // onChange={handleChange}
                    value={thongTinMe.phoneNumber}
                    onChange={(e) => setThongTinMe({ ...thongTinMe, phoneNumber: e.target.value })}
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
                  // onChange={handleChange}
                  value={thongTinNguoiGiamHo.relationship}
                  onChange={(e) => setThongTinNguoiGiamHo({ ...thongTinNguoiGiamHo, relationship: e.target.value })}
                >
                  <option value="" disabled selected></option>
                  <option value="Ông bà">Ông bà</option>
                  <option value="Anh chị">Anh chị</option>
                  <option value="Họ hàng">Họ hàng</option>
                </select>
              </div>
              <div>
                <label htmlFor="name1">Họ tên người giám hộ</label>
                <input
                  type="text"
                  id="hoTenNguoiGiamHo"
                  // onChange={handleChange}
                  value={thongTinNguoiGiamHo.userName}
                  onChange={(e) => setThongTinNguoiGiamHo({ ...thongTinNguoiGiamHo, userName: e.target.value })}
                  className="w-full p-2 border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="name1">Năm sinh người giám hộ</label>
                <input
                  type="date"
                  id="namSinhNguoiGiamHo"
                  value={
                    thongTinNguoiGiamHo.dateOfBirth
                      ? thongTinNguoiGiamHo.dateOfBirth.split('/').reverse().join('-')
                      : ''
                  }
                  onChange={(e) => setThongTinNguoiGiamHo({ ...thongTinNguoiGiamHo, dateOfBirth: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="relative">
                <label htmlFor="name1">Nghề nghiệp người giám hộ</label>
                <input
                  type="text"
                  id="ngheNghiepNguoiGiamHo"
                  value={thongTinNguoiGiamHo.job}
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setThongTinNguoiGiamHo({ ...thongTinNguoiGiamHo, job: e.target.value })} // Update state on change
                />
              </div>
              <div className="relative">
                <label htmlFor="name1">Số điện thoại người giám hộ</label>
                <input
                  type="number"
                  id="sdtNguoiGiamHo"
                  value={thongTinNguoiGiamHo.phoneNumber}
                  onChange={(e) => setThongTinNguoiGiamHo({ ...thongTinNguoiGiamHo, phoneNumber: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <span className="font-medium">4. Thông tin lớp học</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div>
            <label htmlFor="name1" style={{ color: 'red' }}>
              Năm học*
            </label>
            <input
              disabled
              type="text"
              id="namHoc"
              // onChange={handleChange}
              value={studentInfo.academicYear}
              onChange={(e) => setStudentInfo({ ...studentInfo, academicYear: e.target.value })} // Update state on change
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="name1" style={{ color: 'red' }}>
              Khối lớp*
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              id="khoiLop"
              // onChange={handleChange}
              value={studentInfo.grade}
              onChange={(e) => setStudentInfo({ ...studentInfo, grade: e.target.value })} // Update state on change
              disabled
            >
              <option value="" disabled selected></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="relative">
            <label htmlFor="name1" style={{ color: 'red' }}>
              Lớp học*
            </label>
            <input
              type="text"
              id="lopHoc"
              disabled
              // onChange={handleChange}
              value={studentInfo.className}
              onChange={(e) => setStudentInfo({ ...studentInfo, className: e.target.value })} // Update state on change
              className="w-full p-2 border border-gray-300 rounded"
            />
            {/* <FiSearch onClick={handleSearchLopHoc} className="absolute right-2 top-9 cursor-pointer" /> */}
          </div>
          <div className="relative">
            <label htmlFor="name1" style={{ color: 'red' }}>
              Giáo viên chủ nhiệm
            </label>
            <input
              disabled
              type="text"
              id="giaoVienChuNhiem"
              value={studentInfo.homeRoomTeacherName}
              onChange={(e) => setStudentInfo({ ...studentInfo, homeRoomTeacherName: e.target.value })} // Update state on change
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
            />
          </div>

          <div className="relative">
            <label htmlFor="name1" style={{ color: 'red' }}>
              Sỉ số lớp hiện tại
            </label>
            <input
              disabled
              type="text"
              id="siSo"
              value={studentInfo.maxStudents}
              onChange={(e) => setStudentInfo({ ...studentInfo, maxStudents: e.target.value })} // Update state on change
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <button
            // onClick={handleSubmit}
            onClick={handleEditStudent}
            type="button"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Sửa hồ sơ học sinh
          </button>
        </div>
      </div>
    </div>
  );
};
export default UpdateStudent;
