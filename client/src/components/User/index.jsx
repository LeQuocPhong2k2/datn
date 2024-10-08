import 'flowbite';
import { useEffect } from 'react';
import Cookies from 'js-cookie'; // Thêm import để sử dụng Cookies
// import { jwtDecode } from 'jwt-decode';
import { useState } from 'react'; // Thêm import useState
import { getFullInfoStudentByCode } from '../../api/Student';
export default function Student() {
  useEffect(() => {
    const student_token = Cookies.get('student_token'); // Lấy token từ cookie
    if (!student_token) {
      window.location.href = '/login'; // Nếu không có token, chuyển hướng về trang login
    }
  }, []);
  // gọi tới apiu getFullInfoStudentByCode đựa trên studentCode ở trong cookie
  const studentCode = Cookies.get('studentCode');
  const [studentInfo, setStudentInfo] = useState({});
  useEffect(() => {
    getFullInfoStudentByCode(studentCode).then((res) => {
      setStudentInfo(res);
    });
  }, []);
  console.log('studentInfo là:', studentInfo);
  const [isMenuOpen, setMenuOpen] = useState(false); // Thêm state để quản lý menu
  // show thông tin toàn bộ menu (thông tin hồ sơ,ds giáo viên,thời khoá biểu,các thư mới nhất,bàio học gần đây)
  const [showAllMenu, setShowAllMenu] = useState(true); // Thêm state để quản lý hiển thị toàn bộ menu
  const [showStudentProfile, setShowStudentProfile] = useState(false); // Thêm state để quản lý hiển thị hồ sơ học sinh
  const [activeTab, setActiveTab] = useState('profile'); // Thêm state để quản lý tab đang hoạt động
  // tạo phân trang học kỳ bên trong Tab Quá trình học tập
  const [activeTabAcademic, setactiveTabAcademic] = useState('tongket');

  const [showContent, setShowContent] = useState(false);
  const senderName = 'Admin01'; // Thay thế bằng tên người gửi thực tế
  const createdAt = '2024-09-07T00:00:00.000Z'; // Thay thế bằng thời gian gửi thực tế
  const content = {
    text: 'Nhân dịp Lễ Giáng Sinh 2024 Chúc các thầy cô và các em học sinh có một kỳ nghỉ lễ vui vẻ và hạnh phúc bên gia đình và người thân. Chúc các em học sinh sẽ có một kỳ học mới đầy nhiệt huyết và hứng khởi. Merry Christmas and Happy New Year 2024!',
    link: 'https://www.youtube.com/watch?v=4YBGRGBj7_w',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVLAlmZuyO7OQx5a9lyBLhl_t1gwimPhrMhw&s',
  };
  // biến quản lý thông tin nhập vào đơn nghĩ học
  const [showInfoLeaveRequest, setShowInfoLeaveRequest] = useState(true);
  // sau khi nhập có biến quản lý all thooong tin nhập
  const [showFullInfoLeaveRequest, setShowFullInfoLeaveRequest] = useState(false);
  // biến quản lý chọn lịch nghĩ học
  const [showScheduleLeaveRequest, setShowScheduleLeaveRequest] = useState(false);
  // biến quản lý bên ngoài tổng của nội dung buổi học
  const [showLesson, setShowLesson] = useState(true);
  // chi tiết buổi học
  const [showDetailLesson, setShowDetailLesson] = useState(false);

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <header className="bg-white p-4 border-b border-gray-300 flex justify-between items-center">
        <a href="/student">
          <img
            src="https://i.imgur.com/jRMcFwo_d.png?maxwidth=520&shape=thumb&fidelity=high"
            alt="SMAS Logo"
            className="h-12"
          />
        </a>
        <div className="flex items-center">
          {/* Hiển thị menu cho màn hình desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <span
              className="flex items-center"
              onClick={() =>
                window.open(
                  'https://mail.google.com/mail/?view=cm&fs=1&to=duct6984@gmail.com&su=Góp ý về website sổ liên lạc điện tử',
                  '_blank'
                )
              }
            >
              <i className="fas fa-envelope mr-2" style={{ color: '#429AB8' }}></i>Hộp thư góp ý
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
      {/* Hiển thị menu chính */}
      {showAllMenu && ( // Hiển thị toàn bộ menu nếu showAllMenu là true}
        <div className="container mx-auto py-8 px-4 md:px-16 flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-lg mb-4 md:mr-4">
            <h2 className="text-lg font-bold mb-2 " style={{ color: '#0B6FA1' }}>
              <i className="fas fa-info-circle mr-2" style={{ color: '#0B6FA1' }}></i>Thông Tin Hồ Sơ
            </h2>
            {/* <div className="flex justify-between">
            <div className="w-1/2 text-center"> */}
            <div className="flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-1/2 text-center">
                <img
                  src={
                    studentInfo.gender === 'Nam'
                      ? 'https://cdn-icons-png.flaticon.com/512/4537/4537074.png'
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfjUNC6tqBRQQZonwx0-vsJuTeDLetRoi-fp5Yee6shI1zXVumCeuE4mKye97fxwLgrj0&usqp=CAU'
                  }
                  alt="Student Profile Picture"
                  className="rounded-full w-24 h-24 mx-auto"
                />

                <div className="mt-4">
                  <div className="font-bold">{studentInfo.userName}</div>

                  <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 break-words md:flex-wrap">
                    <div className="text-gray-600">
                      Lớp: <b>{studentInfo.className}</b>
                    </div>

                    <div className="text-gray-600">
                      MSHS:<b>{studentInfo.studentCode}</b>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="w-1/2 text-center items-center"> */}
              <div className="w-full md:w-1/2 text-center items-center">
                <a
                  href="#"
                  onClick={() => {
                    setShowStudentProfile(true);
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  {' '}
                  {/* Thay đổi href thành "#" và thêm onClick */}
                  <i className="fas fa-file-alt mr-2" style={{ color: '#429AB8' }}></i>
                  <div className="text-gray-600">Hồ Sơ Học Sinh</div>
                </a>
                <a
                  href="#"
                  onClick={() => {
                    setShowStudentProfile(true);
                    setActiveTab('academic');
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-book mr-2" style={{ color: '#429AB8' }}></i>
                  <div className="text-gray-600">Quá Trình Học Tập</div>
                </a>
                <a
                  href="#"
                  onClick={() => {
                    setShowStudentProfile(true);
                    setActiveTab('lesson');
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-chalkboard mr-2" style={{ color: '#429AB8' }}></i>
                  <div className="text-gray-600">Bài Học Trên Lớp</div>
                </a>

                <a
                  href="#"
                  onClick={() => {
                    setShowStudentProfile(true);
                    setActiveTab('leaveRequest');
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-file-alt mr-2" style={{ color: '#429AB8' }}></i>
                  <div className="text-gray-600">Tạo đơn xin nghĩ học</div>
                </a>
                <div
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-user mr-2" style={{ color: '#429AB8' }}></i>
                  <div className="text-gray-600">GVCN: Hồ Kim Oanh</div>
                </div>
                {/* Thêm thông tin quá trình học tập ở đây */}
              </div>
            </div>
            <div className="mt-6"></div>
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
                <i className="fas fa-chalkboard-teacher mr-2" style={{ color: '#0B6FA1' }}></i>Danh Sách Giáo Viên Bộ
                Môn
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
                      <td className="border p-2">HĐTN</td>
                      <td className="border p-2">GDTC</td>
                      <td className="border p-2">Tiếng Việt</td>
                      <td className="border p-2">Tiếng Việt</td>
                      <td className="border p-2">Tiếng Việt</td>

                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                    </tr>
                    <tr>
                      <td className="border p-2"></td>
                      <td className="border p-2">2</td>
                      <td className="border p-2">Tiếng Việt</td>
                      <td className="border p-2">Tiếng Việt</td>
                      <td className="border p-2">Toán</td>
                      <td className="border p-2">Toán</td>
                      <td className="border p-2">Toán</td>
                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                    </tr>
                    <tr>
                      <td className="border p-2"></td>
                      <td className="border p-2">3</td>
                      <td className="border p-2">Đạo Đức</td>
                      <td className="border p-2">Toán</td>
                      <td className="border p-2">Anh Văn</td>
                      <td className="border p-2">Khoa Học</td>
                      <td className="border p-2">HĐTN</td>
                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                    </tr>
                    <tr>
                      <td className="border p-2"></td>
                      <td className="border p-2">4</td>
                      <td className="border p-2">Toán</td>
                      <td className="border p-2">Khoa Học</td>
                      <td className="border p-2">Anh Văn</td>
                      <td className="border p-2">Lịch Sử & Địa Lý</td>
                      <td className="border p-2">POKI</td>

                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                    </tr>

                    <tr>
                      <td className="border p-2"> Chiều</td>
                      <td className="border p-2">5</td>
                      <td className="border p-2">GDTC</td>
                      <td className="border p-2">Tiếng Việt</td>
                      <td className="border p-2">Tin Học</td>
                      <td className="border p-2">Anh Văn</td>
                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                    </tr>
                    <tr>
                      <td className="border p-2"></td>
                      <td className="border p-2">6</td>
                      <td className="border p-2">Công Nghệ</td>
                      <td className="border p-2">Lịch sử & Địa lý</td>
                      <td className="border p-2">Mĩ Thuật</td>
                      <td className="border p-2">Anh Văn</td>
                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                      <td className="border p-2"></td>
                    </tr>
                    <tr>
                      <td className="border p-2"></td>
                      <td className="border p-2">7</td>
                      <td className="border p-2">Âm nhạc</td>
                      <td className="border p-2">HĐTN</td>
                      <td className="border p-2">Tiếng Việt</td>
                      <td className="border p-2">L Tiếng Việt</td>
                      <td className="border p-2"></td>
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
                <span>
                  <a
                    href="#"
                    onClick={() => {
                      setShowStudentProfile(true);
                      setActiveTab('notice');
                      setShowAllMenu(false);
                    }}
                    className="flex items-center"
                    onMouseEnter={(e) => e.currentTarget.classList.add('font-bold')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('font-bold')}
                  >
                    Xem
                  </a>
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
                <i className="fas fa-info-circle mr-2"></i> Bài Học Gần Đây
              </h2>
              <div className="flex items-center">
                <span>Chưa có thông tin về bài học gần đây</span>
                <span className="ml-auto">
                  <a
                    href="#"
                    onClick={() => {
                      setShowStudentProfile(true);
                      setActiveTab('lesson');
                      setShowAllMenu(false);
                    }}
                    className="flex items-center"
                    onMouseEnter={(e) => e.currentTarget.classList.add('font-bold')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('font-bold')}
                  >
                    Xem
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStudentProfile && ( // Hiển thị nội dung hồ sơ học sinh nếu showStudentProfile là true
        <div className={`max-w-4xl mx-auto bg-white p-6 rounded shadow ${window.innerWidth > 768 ? 'mt-4' : 'mt-0'}`}>
          <div className="flex space-x-2 mb-4 md:space-x-4 ">
            <div
              className={`tab ${activeTab === 'profile' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
              onClick={() => setActiveTab('profile')}
              style={{
                backgroundColor: activeTab === 'profile' ? '#0B6FA1' : '#929498',
                borderRadius: '5%',
                padding: '10px',
                color: 'white',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B6FA1')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = activeTab === 'profile' ? '#0B6FA1' : '#929498')
              }
            >
              Thông tin hồ sơ
            </div>
            <div
              // className={`tab ${activeTab === 'academic' ? 'active' : ''}`}
              className={`tab ${activeTab === 'academic' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
              onClick={() => setActiveTab('academic')}
              style={{
                backgroundColor: activeTab === 'academic' ? '#0B6FA1' : '#929498',
                borderRadius: '5%',
                padding: '10px',
                color: 'white',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B6FA1')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = activeTab === 'academic' ? '#0B6FA1' : '#929498')
              }
            >
              Quá trình học tập
            </div>
            <div
              // className={`tab ${activeTab === 'lesson' ? 'active' : ''}`}
              className={`tab ${activeTab === 'lesson' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
              onClick={() => setActiveTab('lesson')}
              style={{
                backgroundColor: activeTab === 'lesson' ? '#0B6FA1' : '#929498',
                borderRadius: '5%',
                padding: '10px',
                color: 'white',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B6FA1')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = activeTab === 'lesson' ? '#0B6FA1' : '#929498')
              }
            >
              Bài học trên lớp
            </div>
            <div
              // className={`tab ${activeTab === 'notice' ? 'active' : ''}`}
              className={`tab ${activeTab === 'notice' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
              onClick={() => setActiveTab('notice')}
              style={{
                backgroundColor: activeTab === 'notice' ? '#0B6FA1' : '#929498',
                borderRadius: '5%',
                padding: '10px',
                color: 'white',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B6FA1')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = activeTab === 'notice' ? '#0B6FA1' : '#929498')
              }
            >
              Thông Báo
            </div>
            <div
              className={`tab ${activeTab === 'leaveRequest' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
              onClick={() => setActiveTab('leaveRequest')}
              style={{
                backgroundColor: activeTab === 'leaveRequest' ? '#0B6FA1' : '#929498',
                borderRadius: '5%',
                padding: '10px',
                color: 'white',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B6FA1')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = activeTab === 'leaveRequest' ? '#0B6FA1' : '#929498')
              }
            >
              Đơn nghỉ học
            </div>
          </div>

          {/* Hiển thị nội dung dựa trên tab đang hoạt động */}
          {activeTab === 'profile' && (
            <div>
              {/* Nội dung cho Thông tin hồ sơ */}
              <div className="border-t-2 border-b-2 border-gray-300 py-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#0B6FA1' }}>
                  <i className="fas fa-info-circle mr-2"></i>THÔNG TIN CHUNG
                </h2>
                <div className="flex">
                  <div className="w-1/3 text-center">
                    {/* <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfjUNC6tqBRQQZonwx0-vsJuTeDLetRoi-fp5Yee6shI1zXVumCeuE4mKye97fxwLgrj0&usqp=CAU"
                      alt="Student Profile Picture"
                      className="rounded-full w-50 h-50 mx-auto"
                    /> */}

                    <img
                      src={
                        studentInfo.gender === 'Nam'
                          ? 'https://cdn-icons-png.flaticon.com/512/4537/4537074.png'
                          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfjUNC6tqBRQQZonwx0-vsJuTeDLetRoi-fp5Yee6shI1zXVumCeuE4mKye97fxwLgrj0&usqp=CAU'
                      }
                      alt="Student Profile Picture"
                      className="rounded-full mx-auto"
                      style={{ width: '200', height: '200' }}
                    />

                    <p className="font-bold" style={{ color: '#0B6FA1' }}>
                      {studentInfo.userName}
                    </p>
                    {/* <p style={{ color: '#0B6FA1' }}> Năm học :{studentInfo.academicYear}</p> */}
                  </div>
                  <div className="w-2/3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Khối:</strong> {studentInfo.grade}
                      </div>
                      <div>
                        <strong>Tên lớp:</strong> {studentInfo.className}
                      </div>
                      <div>
                        <strong>Mã HS:</strong> {studentInfo.studentCode}
                      </div>

                      <div>
                        <strong>Trạng thái:</strong> {studentInfo.status}
                      </div>
                      <div>
                        <strong>Họ tên:</strong> {studentInfo.userName}
                      </div>
                      <div>
                        <strong>Giới tính:</strong> {studentInfo.gender}
                      </div>

                      <div>
                        <strong>Địa chỉ:</strong> {studentInfo.address}
                      </div>
                      <div>
                        <strong>Ngày sinh:</strong> {studentInfo.dateOfBirth}
                      </div>
                      <div>
                        <strong>Ngày vào trường:</strong>{' '}
                        {new Date(studentInfo.dateOfEnrollment).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </div>
                      <div>
                        <strong>Năm học:</strong> {studentInfo.academicYear}
                      </div>
                      <div>
                        <strong>Dân tộc:</strong> {studentInfo.ethnicGroups}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="border-b-2 border-gray-300 py-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#0B6FA1' }}>
                    <i className="fas fa-user mr-2" style={{ color: '#0B6FA1' }}></i> THÔNG TIN CÁ NHÂN
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Dân tộc:</strong> Kinh
                  </div>
                  <div>
                    <strong>Tôn giáo:</strong> Không
                  </div>
                  <div>
                    <strong>Đối tượng chính sách:</strong>
                  </div>
                  <div>
                    <strong>Chế độ chính sách:</strong>
                  </div>
                  <div>
                    <strong>Đối tượng ưu tiên:</strong>
                  </div>
                  <div>
                    <strong>Khu vực:</strong> Đồng bằng
                  </div>
                  <div>
                    <strong>Thành phần gia đình:</strong> Thành phần khác
                  </div>
                  <div>
                    <strong>Nhóm máu:</strong> Nhóm AB
                  </div>
                </div>
              </div> */}

              <div className="border-b-2 border-gray-300 py-4">
                <h2 className="text-xl font-bold mb-4 flex items-center" style={{ color: '#0B6FA1' }}>
                  <i className="fas fa-home mr-2" style={{ color: '#0B6FA1' }}></i> THÔNG TIN GIA ĐÌNH
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Họ Tên:</strong> {studentInfo.parents[0].userName}
                  </div>
                  {studentInfo.parents[1] && (
                    <div>
                      <strong>Họ Tên:</strong> {studentInfo.parents[1].userName}
                    </div>
                  )}
                  <div>
                    <strong>Mối Quan Hệ:</strong> {studentInfo.parents[0].relationship}
                  </div>
                  {studentInfo.parents[1] && (
                    <div>
                      <strong>Mối Quan Hệ:</strong> {studentInfo.parents[1].relationship}
                    </div>
                  )}
                  <div>
                    <strong>Ngày Sinh: </strong>
                    {studentInfo.parents[0].dateOfBirth}
                  </div>
                  {studentInfo.parents[1] && (
                    <div>
                      <strong>Ngày Sinh:</strong> {studentInfo.parents[1].dateOfBirth}
                    </div>
                  )}
                  <div>
                    <strong>Số điện thoại: </strong> {studentInfo.parents[0].phoneNumber}
                  </div>
                  {studentInfo.parents[1] && (
                    <div>
                      <strong>Số điện thoại: </strong> {studentInfo.parents[1].phoneNumber}
                    </div>
                  )}

                  <div>
                    <strong>Công việc</strong> {studentInfo.parents[0].job}
                  </div>
                  {studentInfo.parents[1] && (
                    <div>
                      <strong>Công việc</strong> {studentInfo.parents[1].job}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'academic' && (
            <div>
              {/* Nội dung cho Quá trình học tập */}
              <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
                <div className="flex border-b">
                  <div
                    onClick={() => {
                      setactiveTabAcademic('hocky1');
                    }}
                    className={`px-4 py-2 ${activeTabAcademic === 'hocky1' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                  >
                    Học kỳ I
                  </div>
                  <div
                    onClick={() => setactiveTabAcademic('hocky2')}
                    className={`px-4 py-2 ${activeTabAcademic === 'hocky2' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                  >
                    Học kỳ II
                  </div>
                  <div
                    onClick={() => setactiveTabAcademic('tongket')}
                    className={`px-4 py-2 ${activeTabAcademic === 'tongket' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                  >
                    Tổng kết
                  </div>
                </div>
                {/* Thêm nội dung cho từng tab ở đây */}
                {activeTabAcademic === 'hocky1' && ( // Đảm bảo nội dung hiển thị đúng
                  <div>
                    {/* Nội dung cho Học kỳ I */}
                    <div className="container mx-auto mt-4">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="table-header">
                            <th className="table-cell">Môn học</th>
                            <th className="table-cell">ĐĐG TX</th>
                            <th className="table-cell">ĐĐG GK</th>
                            <th className="table-cell">ĐĐG CK</th>
                            <th className="table-cell">TB HKI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { subject: 'Toán', ddgtx: '8 9', ddggk: '9', ddgck: '8.5', tbhki: '8.9' },
                            { subject: 'Tiếng Việt', ddgtx: '8 9', ddggk: '7.5', ddgck: '9.5', tbhki: '8.9' },
                            { subject: 'Đạo đức', ddgtx: '9 10', ddggk: '8', ddgck: '7.5', tbhki: '8.8' },
                            { subject: 'Giáo dục thể chất', ddgtx: '8 8', ddggk: '8', ddgck: '7.5', tbhki: '8.6' },
                            { subject: 'Tin học', ddgtx: '9 10', ddggk: '8', ddgck: '7.5', tbhki: '8.8' },
                            { subject: 'Công nghệ', ddgtx: '8 9', ddggk: '8', ddgck: '7.5', tbhki: '8.7' },
                            { subject: 'Ngoại ngữ', ddgtx: '7 8', ddggk: '9', ddgck: '8.5', tbhki: '8.1' },

                            { subject: ' Hoạt động trải nghiệm', ddgtx: 'Đ', ddggk: 'Đ', ddgck: 'Đ', tbhki: 'Đ' },
                            { subject: 'Âm nhạc', ddgtx: 'Đ', ddggk: 'Đ', ddgck: 'Đ', tbhki: 'Đ' },
                            { subject: 'Mỹ thuật', ddgtx: 'Đ', ddggk: 'Đ', ddgck: 'Đ', tbhki: 'Đ' },
                          ].map((row, index) => (
                            <tr key={index}>
                              <td className="table-cell">{row.subject}</td>
                              <td className="table-cell">{row.ddgtx}</td>
                              <td className="table-cell table-cell-grade">{row.ddggk}</td>
                              <td
                                className={`table-cell ${row.ddgck === '10' ? 'table-cell-grade-red' : 'table-cell-grade'}`}
                              >
                                {row.ddgck}
                              </td>
                              <td className="table-cell table-cell-grade">{row.tbhki}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-8">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="summary-header">
                              <th className="summary-cell" style={{ textAlign: 'left' }}>
                                Danh mục
                              </th>
                              <th className="summary-cell">Học kỳ I</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { category: 'Học lực', value: 'G' },
                              { category: 'Hạnh kiểm', value: 'T' },
                              { category: 'Danh hiệu', value: 'GIOI' },
                              { category: 'Xếp hạng', value: '32' },
                              { category: 'Số ngày nghỉ', value: '0' },
                              { category: 'TBM Học Kì', value: '8.5' },
                            ].map((row, index) => (
                              <tr key={index}>
                                <td className="summary-cell">{row.category}</td>
                                <td className="summary-cell summary-cell-value">{row.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="footer">
                        <p>Chú thích:</p>
                        <p>- ĐĐGTX: Điểm đánh giá thường xuyên</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTabAcademic === 'hocky2' && (
                  <div>
                    {/* Nội dung cho Học kỳ II */}
                    <div>
                      {/* Nội dung cho Học kỳ I */}
                      <div className="container mx-auto mt-4">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="table-header">
                              <th className="table-cell">Môn học</th>
                              <th className="table-cell">ĐĐG TX</th>
                              <th className="table-cell">ĐĐG GK</th>
                              <th className="table-cell">ĐĐG CK</th>
                              <th className="table-cell">TB HKII</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { subject: 'Toán', ddgtx: '8 9', ddggk: '9', ddgck: '8.5', tbhki: '8.9' },
                              { subject: 'Tiếng Việt', ddgtx: '8 9', ddggk: '7.5', ddgck: '9.5', tbhki: '8.9' },
                              { subject: 'Đạo đức', ddgtx: '9 10', ddggk: '8', ddgck: '7.5', tbhki: '8.8' },
                              { subject: 'Giáo dục thể chất', ddgtx: '8 8', ddggk: '8', ddgck: '7.5', tbhki: '8.6' },
                              { subject: 'Tin học', ddgtx: '9 10', ddggk: '8', ddgck: '7.5', tbhki: '8.8' },
                              { subject: 'Công nghệ', ddgtx: '8 9', ddggk: '8', ddgck: '7.5', tbhki: '8.7' },
                              { subject: 'Ngoại ngữ', ddgtx: '7 8', ddggk: '9', ddgck: '8.5', tbhki: '8.1' },

                              { subject: ' Hoạt động trải nghiệm', ddgtx: 'Đ', ddggk: 'Đ', ddgck: 'Đ', tbhki: 'Đ' },
                              { subject: 'Âm nhạc', ddgtx: 'Đ', ddggk: 'Đ', ddgck: 'Đ', tbhki: 'Đ' },
                              { subject: 'Mỹ thuật', ddgtx: 'Đ', ddggk: 'Đ', ddgck: 'Đ', tbhki: 'Đ' },
                            ].map((row, index) => (
                              <tr key={index}>
                                <td className="table-cell">{row.subject}</td>
                                <td className="table-cell">{row.ddgtx}</td>
                                <td className="table-cell table-cell-grade">{row.ddggk}</td>
                                <td
                                  className={`table-cell ${row.ddgck === '10' ? 'table-cell-grade-red' : 'table-cell-grade'}`}
                                >
                                  {row.ddgck}
                                </td>
                                <td className="table-cell table-cell-grade">{row.tbhki}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-8">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="summary-header">
                                <th className="summary-cell" style={{ textAlign: 'left' }}>
                                  Danh mục
                                </th>
                                <th className="summary-cell">Học kỳ II</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { category: 'Học lực', value: 'G' },
                                { category: 'Hạnh kiểm', value: 'T' },
                                { category: 'Danh hiệu', value: 'GIOI' },
                                { category: 'Xếp hạng', value: '32' },
                                { category: 'Số ngày nghỉ', value: '0' },
                                { category: 'TBM Học Kì', value: '8.5' },
                              ].map((row, index) => (
                                <tr key={index}>
                                  <td className="summary-cell">{row.category}</td>
                                  <td className="summary-cell summary-cell-value">{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="footer">
                          <p>Chú thích:</p>
                          <p>- ĐĐGTX: Điểm đánh giá thường xuyên</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTabAcademic === 'tongket' && (
                  <div className="mt-4">
                    <table className="w-full text-left border-collapse border border-gray-300  ">
                      <thead>
                        <tr className="table-header">
                          <th className="table-cell-tongket">Môn học</th>
                          <th className="table-cell-tongket">Học kỳ I</th>
                          <th className="table-cell-tongket">Học kỳ II</th>
                          <th className="table-cell-tongket">Cả năm</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="table-cell-tongket">GDCD</td>
                          <td className="table-cell-tongket">8.9</td>
                          <td className="table-cell-tongket">9.6</td>
                          <td className="table-cell-tongket">9.4</td>
                        </tr>
                        <tr>
                          <td className="table-cell-tongket">Công nghệ</td>
                          <td className="table-cell-tongket">6.1</td>
                          <td className="table-cell-tongket">7.5</td>
                          <td className="table-cell-tongket">6.8</td>
                        </tr>
                        <tr>
                          <td className="table-cell-tongket">Thể dục</td>
                          <td className="table-cell-tongket">Đ</td>
                          <td className="table-cell-tongket">Đ</td>
                          <td className="table-cell-tongket">Đ</td>
                        </tr>
                        <tr>
                          <td className="table-cell-tongket">Âm nhạc</td>
                          <td className="table-cell-tongket">Đ</td>
                          <td className="table-cell-tongket">Đ</td>
                          <td className="table-cell-tongket">Đ</td>
                        </tr>
                        <tr>
                          <td className="table-cell-tongket">Mỹ thuật</td>
                          <td className="table-cell-tongket">Đ</td>
                          <td className="table-cell-tongket">Đ</td>
                          <td className="table-cell-tongket">Đ</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-6">
                      <h2 className="font-bold">TỔNG KẾT HỌC KỲ, NĂM HỌC</h2>
                      <table className="w-full text-left mt-2">
                        <thead>
                          <tr className="table-header">
                            <th className="table-cell-tongket">Danh mục</th>
                            <th className="table-cell-tongket">Học kỳ I</th>
                            <th className="table-cell-tongket">Học kỳ II</th>
                            <th className="table-cell-tongket">Cả năm</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="table-cell-tongket">Học lực</td>
                            <td className="table-cell-tongket">T</td>
                            <td className="table-cell-tongket">T</td>
                            <td className="table-cell-tongket">T</td>
                          </tr>
                          <tr>
                            <td className="table-cell-tongket">Hạnh kiểm</td>
                            <td className="table-cell-tongket">T</td>
                            <td className="table-cell-tongket">T</td>
                            <td className="table-cell-tongket">T</td>
                          </tr>
                          <tr>
                            <td className="table-cell-tongket">Danh hiệu</td>
                            <td className="table-cell-tongket">GIỎI</td>
                            <td className="table-cell-tongket">GIỎI</td>
                            <td className="table-cell-tongket">GIỎI</td>
                          </tr>
                          <tr>
                            <td className="table-cell-tongket">Xếp hạng</td>
                            <td className="table-cell-tongket">32</td>
                            <td className="table-cell-tongket">37</td>
                            <td className="table-cell-tongket">32</td>
                          </tr>
                          <tr>
                            <td className="table-cell-tongket">Số ngày nghỉ</td>
                            <td className="table-cell-tongket">8</td>
                            <td className="table-cell-tongket">9</td>
                            <td className="table-cell-tongket">8</td>
                          </tr>
                          <tr>
                            <td className="table-cell-tongket">TBMHK</td>
                            <td className="table-cell-tongket">8.9</td>
                            <td className="table-cell-tongket">8.3</td>
                            <td className="table-cell-tongket">8.6</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="text-blue-500 mt-2 cursor-pointer">Lên lớp</div>
                    </div>
                    <div className="mt-6">
                      <h2 className="font-bold">Chú thích:</h2>
                      <ul className="list-disc list-inside">
                        <li>TBHKI: Trung bình học kỳ I</li>
                        <li>TBHKII: Trung bình học kỳ II</li>
                        <li>TBN: Trung bình cả năm</li>
                        <li>KIOT: Kiến thức qua lớp</li>
                        <li>Đ: Đạt, CĐ: Chưa đạt, HT: Hoàn thành, CHT: Chưa hoàn thành</li>
                        <li>Các dấu gạch</li>
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h2 className="font-bold">NHẬN XÉT CỦA GIÁO VIÊN BỘ MÔN</h2>
                      <div className="mt-2">
                        <span className="text-blue-500 cursor-pointer">Ngữ văn</span>
                        <span>: Còn chậm học, ý thức tốt</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'lesson' && (
            <div>
              {showLesson && (
                <div className="container mx-auto p-4">
                  {/* First Card */}
                  <div className="flex border-b pb-4 mb-4">
                    {/* Image Section */}
                    <div className="w-1/3">
                      <img
                        src="https://kids.hoc247.vn/storage-files/docs/2022/20220928/744x420/633423014a0a8.webp"
                        alt="App Edu.One"
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                    {/* Text Section */}
                    <div className="w-2/3 pl-4">
                      <h2 className="text-xl font-bold">Em ôn lại những gì đã học </h2>
                      <p className="text-sm text-gray-500">
                        08/10/2024 |{' '}
                        <a
                          href="#"
                          className="text-blue-500"
                          onClick={() => {
                            setShowLesson(false);
                            setShowDetailLesson(true);
                          }}
                        >
                          Xem Chi Tiết
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Second Card */}
                  <div className="flex flex-col border-t pt-4">
                    <h2 className="text-xl font-bold">
                      Hướng dẫn học sinh sử dụng MS Teams tham gia lớp học trực tuyến
                    </h2>
                    <p className="text-sm text-gray-500">
                      25/3/2020 |{' '}
                      <a href="#" className="text-blue-500">
                        Hướng dẫn
                      </a>
                    </p>
                    <a href="/path/to/file" className="text-red-500 text-sm mt-2">
                      <i className="fas fa-download"></i> Tải File đính kèm
                    </a>
                  </div>
                </div>
              )}
              {showDetailLesson && (
                <div>
                  <button
                    onClick={() => {
                      setShowLesson(true);
                      setShowDetailLesson(false);
                    }}
                    className="mr-2"
                  >
                    <i className="fas fa-arrow-left text-blue-500"></i> {/* Nút mũi tên quay về */}
                  </button>
                  <h2>Chi tiết bài học</h2>
                </div>
              )}
            </div>
          )}
          {activeTab === 'notice' && (
            <div>
              {/* Nội dung cho Thông báo */}
              <h2 className="text-xl font-bold mb-4">Thông Báo</h2>
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Người gửi:</strong>

                    {senderName}
                  </div>
                  <div>
                    <strong>Thời gian: </strong>
                    {new Date(createdAt).toLocaleString()} {/* Thay createdAt bằng thời gian gửi */}
                  </div>
                </div>
                <h3
                  className="text-lg font-semibold mt-2 cursor-pointer text-blue-500"
                  onClick={() => setShowContent(!showContent)}
                >
                  Chúc mừng lễ Giáng Sinh 2024 {/* Tiêu đề thông báo */}
                </h3>
                {showContent && ( // Hiển thị nội dung khi nhấp vào tiêu đề
                  <div className="mt-2">
                    <p>{content.text}</p> {/* Nội dung thông báo */}
                    {content.link && (
                      <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        Xem thêm
                      </a>
                    )}
                    {content.image && (
                      <div className="mt-2 flex justify-center">
                        <img src={content.image} alt="Thông báo" className="w-200 h-200 object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'leaveRequest' && (
            <div>
              {showInfoLeaveRequest && (
                <div className="max-w-md mx-auto bg-white border shadow-md rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-user text-blue-500 mr-2"></i>
                    <span className="text-gray-600">Người làm đơn:</span>
                    <span className="ml-2 text-blue-500 font-semibold">Lê Quốc Phòng</span>
                  </div>
                  {/* <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                      <span className="text-gray-600">Thời gian nghỉ</span>
                    </div>
                    <div className="ml-6 mb-2 flex items-center">
                      <span className="text-gray-600">Nghỉ từ: </span>
                      <input
                        type="date"
                        className="ml-2 text-black font-semibold"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="ml-6 flex items-center">
                      <span className="text-gray-600">Đến ngày:</span>
                      <input
                        type="date"
                        className="ml-2 text-black font-semibold"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div> */}

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-center border-b border-gray-200 mb-4">
                      <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                      <span className="text-gray-600">Thời gian nghỉ</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <span className="text-gray-600 whitespace-nowrap">Nghỉ từ:</span>
                        <input
                          type="date"
                          className="ml-6 text-black  font-bold  w-60" // Adjusted to use full width
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 whitespace-nowrap">Đến ngày:</span>
                        <input
                          type="date"
                          className="ml-2 text-black font-bold w-60" // Adjusted to use full width
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-list-alt text-purple-500 mr-2"></i>
                      <span className="text-gray-600">Danh sách buổi học</span>
                      <button
                        onClick={() => setShowScheduleLeaveRequest(!showScheduleLeaveRequest)} // Thay đổi trạng thái hiển thị
                        className="ml-auto focus:outline-none"
                      >
                        <i className={`fas fa-chevron-${showScheduleLeaveRequest ? 'up' : 'down'} text-gray-600`}></i>{' '}
                        {/* Mũi tên */}
                      </button>
                    </div>

                    {showScheduleLeaveRequest && ( // Hiển thị checkbox nếu showSchedule là true
                      <>
                        <div className="flex items-center mb-2">
                          <span className="text-gray-600">1. 10/09/2021 - Sáng</span>
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out ml-auto"
                          ></input>
                        </div>
                        <div className="flex items-center mb-4">
                          <span className="text-gray-600">2. 10/09/2021 - Chiều</span>
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out ml-auto"
                          ></input>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-comment-alt text-orange-500 mr-2"></i>
                      <span className="text-gray-600">Lý do xin nghỉ</span>
                    </div>
                    <div className="ml-6">
                      <input
                        type="text"
                        placeholder="Nhập nội dung..."
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        setShowFullInfoLeaveRequest(true);
                        setShowInfoLeaveRequest(false);
                      }}
                    >
                      Xem đầy đủ thông tin
                    </button>
                  </div>
                </div>
              )}
              {showFullInfoLeaveRequest && (
                <div className="max-w-md mx-auto border bg-white shadow-md rounded-lg p-4 mt-6">
                  <div className="flex items-center mb-4 justify-between">
                    <button
                      onClick={() => {
                        setShowFullInfoLeaveRequest(false);
                        setShowInfoLeaveRequest(true);
                      }}
                      className="mr-2"
                    >
                      <i className="fas fa-arrow-left text-blue-500"></i> {/* Nút mũi tên quay về */}
                    </button>
                    <h1 className="text-center text-blue-600 text-xl font-bold mx-auto">ĐƠN XIN PHÉP NGHỈ HỌC</h1>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user text-green-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Kính gửi</h2>
                    </div>
                    <p className="ml-6">. Ban giám hiệu nhà trường</p>
                    <p className="ml-6">. Giáo viên chủ nhiệm lớp 7/3 và các thầy cô bộ môn</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Người làm đơn</h2>
                    </div>
                    <p className="ml-6">. Tôi tên là: Lê Quốc Phòng</p>
                    <p className="ml-6">. Phụ huynh của em: {studentInfo.userName}</p>
                    <p className="ml-6">. Lớp: 7/3</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Thời gian nghỉ</h2>
                    </div>
                    <p className="ml-6">. Tôi làm đơn này xin phép cho con được nghỉ học trong thời gian sau:</p>
                    <p className="ml-10">+ 10/09/2021 - Sáng</p>
                    <p className="ml-10">+ 10/09/2021 - Chiều</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-comment-dots text-yellow-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Lý do</h2>
                    </div>
                    <p className="ml-6">. xin phép cháu bị ốm</p>
                    <p className="ml-6">. Kính mong quý thầy cô xem xét, giúp đỡ.</p>
                    <p className="ml-6">. Tôi sẽ nhắc nhở cháu học bài và làm bài tập đầy đủ.</p>
                  </div>
                  <div className="text-right mb-4">
                    <p>Xin chân thành cảm ơn</p>
                    <p>Ngày: 10/09/2021</p>
                    <p> Lê Quốc Phòng</p>
                  </div>
                  <div className="text-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Gửi</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
