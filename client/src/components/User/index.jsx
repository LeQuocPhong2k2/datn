import 'flowbite';
import { useEffect } from 'react';
import Cookies from 'js-cookie'; // Thêm import để sử dụng Cookies
// import { jwtDecode } from 'jwt-decode';
import { useState } from 'react'; // Thêm import useState

export default function Student() {
  useEffect(() => {
    const student_token = Cookies.get('student_token'); // Lấy token từ cookie
    if (!student_token) {
      window.location.href = '/login'; // Nếu không có token, chuyển hướng về trang login
    }
  }, []);
  const [isMenuOpen, setMenuOpen] = useState(false); // Thêm state để quản lý menu

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <header className="bg-white p-4 border-b border-gray-300 flex justify-between items-center">
        <img
          src="https://storage.googleapis.com/a1aa/image/iVZXqfvKtP2EP6j5VvGbeFpRC3XmwG4XeCnWa5Qm5tUYnyInA.jpg"
          alt="SMAS Logo"
          className="h-12"
        />
        <div className="flex items-center">
          {/* Hiển thị menu cho màn hình desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="flex items-center">
              <i className="fas fa-envelope mr-2" style={{ color: '#429AB8' }}></i>Hộp thư
            </span>
            <span className="flex items-center">
              <i className="fas fa-phone mr-2" style={{ color: '#429AB8' }}></i>0907021954
            </span>
            <span className="flex items-center">
              <i className="fas fa-school mr-2" style={{ color: '#429AB8' }}></i>
              {/* Thêm biểu tượng trường học với màu xanh dạng #429AB8 */}
              Trường Tiểu học Nguyễn Bỉnh Khiêm
            </span>
          </div>
          {/* Hiện menu cho màn hình điện thoại */}
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="md:hidden">
            <i className="fas fa-bars" style={{ color: '#429AB8' }}></i> {/* Dấu ba gạch */}
          </button>
        </div>
        {isMenuOpen && ( // Hiện menu khi isMenuOpen là true
          <div className="absolute left-0 bg-white shadow-lg p-4 md:hidden">
            <span className="flex items-center">
              <i className="fas fa-envelope mr-2" style={{ color: '#429AB8' }}></i>Hộp thư
            </span>
            <span className="flex items-center">
              <i className="fas fa-phone mr-2" style={{ color: '#429AB8' }}></i>0907021954
            </span>
            <span className="flex items-center">
              <i className="fas fa-school mr-2" style={{ color: '#429AB8' }}></i>
              Trường Tiểu học Nguyễn Bỉnh Khiêm
            </span>
          </div>
        )}
      </header>

      <div className="container mx-auto py-8 px-4 md:px-16 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-lg mb-4 md:mr-4">
          <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
            <i className="fas fa-info-circle mr-2" style={{ color: '#0B6FA1' }}></i>Thông Tin Hồ Sơ
          </h2>
          {/* <div className="flex justify-between">
            <div className="w-1/2 text-center"> */}
          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2 text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfjUNC6tqBRQQZonwx0-vsJuTeDLetRoi-fp5Yee6shI1zXVumCeuE4mKye97fxwLgrj0&usqp=CAU"
                alt="Student Profile Picture"
                className="rounded-full w-24 h-24 mx-auto"
              />
              <div className="mt-4">
                <div className="font-bold">Nguyễn Thị Như Ngọc</div>
                {/* <div className="text-gray-600">Lớp 1A2</div>
                <div className="text-gray-600">MSHS : 20245437</div> */}
                <div className=" flex justify-center space-x-4">
                  <div className="text-gray-600 ">
                    Lớp: <b>1A2</b>
                  </div>

                  <div className="text-gray-600 ">
                    MSHS:<b>20245437</b>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="w-1/2 text-center items-center"> */}
            <div className="w-full md:w-1/2 text-center items-center">
              <a href="/student-profile" className="flex items-center">
                <i className="fas fa-file-alt mr-2" style={{ color: '#429AB8' }}></i>
                <div className="text-gray-600">Hồ Sơ Học Sinh</div>
              </a>
              <a href="/academic-progress" className="flex items-center">
                <i className="fas fa-book mr-2" style={{ color: '#429AB8' }}></i>
                <div className="text-gray-600">Quá Trình Học Tập</div>
              </a>
              <a href="/class-lessons" className="flex items-center">
                <i className="fas fa-chalkboard mr-2" style={{ color: '#429AB8' }}></i>
                <div className="text-gray-600">Bài Học Trên Lớp</div>
              </a>
              <a href="/teacher-profile" className="flex items-center">
                <i className="fas fa-user mr-2" style={{ color: '#429AB8' }}></i>
                <div className="text-gray-600">GVCN: Hồ Kim Oanh</div>
              </a>
              {/* Thêm thông tin quá trình học tập ở đây */}
            </div>
          </div>
          <div className="mt-6"></div>
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
              <i className="fas fa-chalkboard-teacher mr-2" style={{ color: '#0B6FA1' }}></i>Danh Sách Giáo Viên Bộ Môn
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#429AB8] text-white">
                  <th className="border p-2">Môn Học</th>
                  <th className="border p-2">Giáo Viên</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Tiếng Anh</td>
                  <td className="border p-2">Hồ Kim Oanh</td>
                </tr>
                <tr>
                  <td className="border p-2">Sinh học</td>
                  <td className="border p-2">Trần Thanh Danh</td>
                </tr>
                <tr>
                  <td className="border p-2">Âm nhạc</td>
                  <td className="border p-2">Trần Thanh Linh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="bg-white p-4 rounded-lg shadow-lg mb-4 ">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
              <i className="far fa-calendar-alt mr-2" style={{ color: '#0B6FA1' }}></i>Thời Khóa Biểu
            </h2>
            <div className="overflow-x-auto">
              {' '}
              {/* Thêm div để tạo khả năng cuộn cho bảng trên thiết bị di động */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#429AB8] text-white">
                    <th className="border p-2">Buổi</th>
                    <th className="border p-2">Tiết</th>
                    <th className="border p-2">Thứ 2</th>
                    <th className="border p-2">Thứ 3</th>
                    <th className="border p-2">Thứ 4</th>
                    <th className="border p-2">Thứ 5</th>
                    <th className="border p-2">Thứ 6</th>
                    <th className="border p-2">Thứ 7</th>
                    <th className="border p-2">Chủ nhật</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Sáng</td>
                    <td className="border p-2">1</td>
                    <td className="border p-2">Chào cờ</td>
                    <td className="border p-2">Sinh hoạt lớp</td>
                    <td className="border p-2">Sinh học</td>
                    <td className="border p-2">Thể dục</td>
                    <td className="border p-2">GDCD</td>
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                  </tr>
                  <tr>
                    <td className="border p-2"></td>
                    <td className="border p-2">2</td>
                    <td className="border p-2">Sinh hoạt lớp</td>
                    <td className="border p-2">Sinh học</td>
                    <td className="border p-2">Địa lí</td>
                    <td className="border p-2">Công nghệ</td>
                    <td className="border p-2">Mĩ Thuật</td>
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                  </tr>
                  <tr>
                    <td className="border p-2"></td>
                    <td className="border p-2">3</td>
                    <td className="border p-2">Âm nhạc</td>
                    <td className="border p-2">Ngữ Văn</td>
                    <td className="border p-2">GDCD</td>
                    <td className="border p-2">Tin học</td>
                    <td className="border p-2">Thể dục</td>
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                  </tr>
                  <tr>
                    <td className="border p-2"></td>
                    <td className="border p-2">4</td>
                    <td className="border p-2">Công nghệ</td>
                    <td className="border p-2">Tin học</td>
                    <td className="border p-2">Toán</td>
                    <td className="border p-2">Thể dục</td>
                    <td className="border p-2">Toán</td>
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                  </tr>
                  <tr>
                    <td className="border p-2"></td>
                    <td className="border p-2">5</td>
                    <td className="border p-2">Địa lí</td>
                    <td className="border p-2">Tin học</td>
                    <td className="border p-2">Vật lí</td>
                    <td className="border p-2">Ngữ Văn</td>
                    <td className="border p-2">Ngữ Văn</td>
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>{' '}
            {/* Kết thúc div cuộn */}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
              <i className="fas fa-envelope mr-2"></i>Các Thư Mới Nhất
            </h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span>
                  Trường tiểu học Nguyễn Bỉnh Khiêm ngày mai 11/10 kính mời PHHS tới lớp 1A2 họp phụ huynh học sinh
                </span>
              </div>
              <span>Xem</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
              <i className="fas fa-info-circle mr-2"></i> Bài Học Gần Đây
            </h2>
            <div className="flex items-center">
              <span>Chưa có thông tin về bài học gần đây</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
