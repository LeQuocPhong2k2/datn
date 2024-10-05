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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [teacherbyResearch, setTeacherByResearch] = useState([]);

  const [showMenuProfileTeacher, setShowMenuProfileTeacher] = useState(null);
  const handleShowMenuProfileStudent = (id) => {
    setShowMenuProfileTeacher(showMenuProfileTeacher === id ? null : id); // Nếu ID đã mở, đóng menu, ngược lại mở menu
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      {functionType === 'add-teacher' && (
        <div className="grid grid-flow-row gap-4 p-4 px-10 max-h-full overflow-auto">
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
      {functionType === 'edit-teacher' && (
        <div className="grid grid-flow-row gap-4 p-4 px-10 max-h-full overflow-x w-full" style={{ width: '100%' }}>
          <div>
            <span className="font-medium text-1.5xl">Danh sách giáo viên</span>
          </div>

          <div className="flex flex-col bg-gray-200 p-4 rounded w-full">
            <h2 className="text-lg font-semibold bg-gray-200 mb-4">Tìm kiếm giáo viên</h2>
            <div className={`flex flex-wrap gap-4 ${isCollapsed ? 'hidden' : 'w-full'}`}>
              <div className="flex-1">
                <label htmlFor="subject">Môn học giảng dạy</label>
                <select
                  id="subject"
                  className="w-full p-2 border border-gray-300 rounded"
                  // value={searchStudent.grade}
                  // onChange={(e) => setSearchStudent({ ...searchStudent, grade: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="Toán">Toán</option>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Đạo đức">Đạo đức</option>
                  <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội</option>
                  <option value="Giáo dục thể chất">Giáo dục thể chất</option>
                  <option value="Âm nhạc">Âm nhạc</option>
                  <option value="Mĩ thuật">Mĩ thuật</option>
                  <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
                  <option value="Tiếng dân tộc thiểu số">Tiếng dân tộc thiểu số</option>
                  <option value="Ngoại ngữ 1">Ngoại ngữ 1</option>
                  <option value="Tin học">Tin học</option>
                  <option value="Công nghệ">Công nghệ</option>
                  <option value="Lịch sử">Lịch sử</option>
                  <option value="Địa lí">Địa lí</option>
                  <option value="Khoa học">Khoa học</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="lopHoc">Lớp giảng dạy</label>
                <select
                  id="lopHoc"
                  className="w-full p-2 border border-gray-300 rounded"
                  // onChange={(e) => setSearchStudent({ ...searchStudent, className: e.target.value })}
                  // value={searchStudent.className}
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
                  // onChange={(e) => setSearchStudent({ ...searchStudent, academicYear: e.target.value })}
                  // value={searchStudent.academicYear}
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
                  // value={searchStudent.gender}
                  // onChange={(e) => setSearchStudent({ ...searchStudent, gender: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            <div className={`flex flex-wrap gap-4 ${isCollapsed ? 'hidden' : 'w-3/4'}`}>
              <div className="flex-1">
                <label htmlFor="hoTen">Họ tên</label>
                <input
                  type="text"
                  id="hoTen"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập họ tên..."
                  // value={searchStudent.userName}
                  // onChange={(e) => setSearchStudent({ ...searchStudent, userName: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="mssv">Số điện thoại liên lạc</label>
                <input
                  type="text"
                  id="mssv"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập số điện thoại liên lạc"
                  // value={searchStudent.studentCode}
                  // onChange={(e) => setSearchStudent({ ...searchStudent, studentCode: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="trinhDo">Trình độ chuyên môn</label>
                <select
                  id="trinhDo"
                  className="w-full p-2 border border-gray-300 rounded"
                  // value={searchStudent.status}
                  // onChange={(e) => setSearchStudent({ ...searchStudent, status: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="Cử nhân">Cử nhân</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>
              </div>
              {/* <div className="flex-1">
                <label htmlFor="danToc">Dân tộc</label>
                <select
                  id="danToc"
                  // value={searchStudent.ethnicGroups}
                  className="w-full p-2 border border-gray-300 rounded"
                  // onChange={(e) => setSearchStudent({ ...searchStudent, ethnicGroups: e.target.value })}
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
              </div> */}
            </div>
            <div className="flex flex-wrap gap-4 justify-center w-full item-ends" style={{ marginTop: '15px' }}>
              <div className="flex">
                <button
                  type="button"
                  // className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  // onClick={handleSearchStudent}
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="flex">
                <button
                  type="button"
                  // onClick={resetSearch}
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  Reset
                </button>
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                  <th>
                    <input
                      type="checkbox"
                      id="selectAll"
                      // onChange={(e) => {
                      //   const isChecked = e.target.checked;
                      //   // Gọi hàm để chọn hoặc bỏ chọn tất cả checkbox
                      //   setStudentbyResearch((prevStudents) =>
                      //     prevStudents.map((student) => ({
                      //       ...student,
                      //       isChecked: isChecked, // Thay đổi trạng thái checkbox
                      //     }))
                      //   );
                      // }}
                      //value={studentInfo.studentCode}
                      className=" p-2 border border-gray-300 rounded"
                    />
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
                    Số điện thoại
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
                    Trình độ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lớp chủ nhiệm
                  </th>
                  {/* <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tuỳ chỉnh
                  </th> */}
                </tr>
              </thead>
              {/* // chỗ body hiện thông tin  */}
              <tbody className="bg-white divide-y divide-gray-200">
                {teacherbyResearch.length === 0 ? ( // Check if there are no students to display
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Không có dữ liệu
                    </td>{' '}
                  </tr>
                ) : (
                  teacherbyResearch.map((student, index) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          id={`studentCode-${student._id}`} // Đảm bảo ID duy nhất cho mỗi checkbox
                          // onChange={(e) => {
                          //   const isChecked = e.target.checked;
                          //   // Cập nhật trạng thái checkbox cho sinh viên cụ thể
                          //   setStudentbyResearch((prevStudents) =>
                          //     prevStudents.map((s) => (s._id === student._id ? { ...s, isChecked: isChecked } : s))
                          //   );
                          // }}
                          //value={student.studentCode}
                          checked={student.isChecked || false} // Kiểm tra xem checkbox có được chọn không
                        />
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">{student.userName}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap relative  ">
                        <a
                          // onClick={(e) => {
                          //   e.preventDefault();
                          //   handleShowMenuProfileStudent(student._id); // Gọi hàm show với ID của học sinh
                          // }}
                          className="text-blue-500 hover:underline"
                        >
                          {student.userName}
                        </a>
                        {/* Menu thả xuống */}
                        {showMenuProfileTeacher === student._id && ( // Kiểm tra xem menu có đang mở không
                          <div className="absolute bg-white border border-gray-300 rounded shadow-lg mt-1  left-1/2 z-10  ">
                            <ul className="space-y-2 p-2 w-40 border ">
                              <li className="flex justify-center">
                                {/* <button onClick={() => handleViewProfile(student.id)}>Xem hồ sơ</button> */}
                                <button className="hover:bg-gray-300 text-center w-full">Xem hồ sơ</button>
                              </li>
                              <li className="flex justify-center">
                                {/* <button onClick={() => handleEditProfile(student.id)}>Sửa hồ sơ</button> */}
                                <button
                                  className="hover:bg-gray-300 text-center w-full"
                                  // onClick={() => {
                                  //   handleEditProfileStudent(student.studentCode);
                                  // }}
                                >
                                  Sửa hồ sơ
                                </button>
                              </li>

                              <li className="flex justify-center">
                                {/* <button onClick={() => handleDeleteProfile(student.id)}>Xoá hồ sơ</button> */}
                                <button
                                  className="hover:bg-gray-300 text-center w-full"
                                  onClick={() => {
                                    // handleDeleteProfileStudent(student.studentCode);
                                  }}
                                >
                                  Xoá hồ sơ
                                </button>
                              </li>

                              <li className="flex justify-center">
                                <button className="hover:bg-gray-300 text-center w-full">Chuyển lớp</button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.studentCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.dateOfBirth}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.ethnicGroups}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.className}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.status}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
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
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
