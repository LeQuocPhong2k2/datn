import 'flowbite';
import { useEffect } from 'react';
import Cookies from 'js-cookie'; // Thêm import để sử dụng Cookies
// import { jwtDecode } from 'jwt-decode';
import { useState } from 'react'; // Thêm import useState
import { getFullInfoStudentByCode, getStudentByAccountId } from '../../api/Student';
import { changePassword } from '../../api/Accounts';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';
import { createLeaveRequest, getLeaveRequestsByStudentId } from '../../api/LeaveRequest';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Schedule from './Schedule';

export default function Student() {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const student_token = Cookies.get('student_token'); // Lấy token từ cookie
    if (!student_token) {
      window.location.href = '/login'; // Nếu không có token, chuyển hướng về trang login
    }
  }, []);
  // gọi tới apiu getFullInfoStudentByCode đựa trên studentCode ở trong cookie
  const studentCode = Cookies.get('studentCode');
  // const [studentInfo, setStudentInfo] = useState({});
  // useEffect(() => {
  //   getFullInfoStudentByCode(studentCode).then((res) => {
  //     setStudentInfo(res);
  //   });
  // }, []);

  // HÃY TẠO console.log về studentInfo để xem thông tin học sinh
  // console.log('setStudentInfo');
  useEffect(() => {
    document.title = 'Trang Học Sinh';
    const accountId = localStorage.getItem('_id');
    const resStudent = getStudentByAccountId(accountId);
    resStudent
      .then((data) => {
        console.log(data);
        setAccounts(data);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = '/login';
      });
  }, []);

  // gọi tới apiu getFullInfoStudentByCode đựa trên studentCode ở trong cookie
  const [studentInfo, setStudentInfo] = useState({});
  useEffect(() => {
    getFullInfoStudentByCode(accounts.studentCode).then((res) => {
      setStudentInfo(res);
    });
  }, [accounts.studentCode]);
  // console.log('studentInfo là:', studentInfo);
  const [isMenuOpen, setMenuOpen] = useState(false); // Thêm state để quản lý menu
  // show thông tin toàn bộ menu (thông tin hồ sơ,ds giáo viên,thời khoá biểu,các thư mới nhất,bàio học gần đây)
  const [showAllMenu, setShowAllMenu] = useState(true); // Thêm state để quản lý hiển thị toàn bộ menu
  const [showStudentProfile, setShowStudentProfile] = useState(false); // Thêm state để quản lý hiển thị hồ sơ học sinh
  const [activeTab, setActiveTab] = useState('profile'); // Thêm state để quản lý tab đang hoạt động
  // tạo phân trang học kỳ bên trong Tab Quá trình học tập
  const [activeTabAcademic, setactiveTabAcademic] = useState('tongket');

  const [showContent, setShowContent] = useState(false);
  const [showContent1, setShowContent1] = useState(false);
  const senderName = 'Admin01'; // Thay thế bằng tên người gửi thực tế
  const createdAt = '2024-09-07T00:00:00.000Z'; // Thay thế bằng thời gian gửi thực tế
  const createdAt1 = '2023-12-24T00:00:00.000Z'; // Thay thế bằng thời gian gửi thực tế
  const content = {
    text: 'Nhân dịp Lễ Giáng Sinh 2023 Chúc các thầy cô và các em học sinh có một kỳ nghỉ lễ vui vẻ và hạnh phúc bên gia đình và người thân. Chúc các em học sinh sẽ có một kỳ học mới đầy nhiệt huyết và hứng khởi. Merry Christmas and Happy New Year 2024!',
    link: 'https://www.youtube.com/watch?v=4YBGRGBj7_w',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVLAlmZuyO7OQx5a9lyBLhl_t1gwimPhrMhw&s',
  };
  const content1 = {
    // hãy viết text về họp phụ huynh
    text: ' Kính mời quý phụ huynh tham dự buổi họp phụ huynh học sinh vào lúc 7h30 ngày 10/10/2024 tại trường Tiểu học Nguyễn Bỉnh Khiêm. Đây là cơ hội để quý phụ huynh gặp gỡ và trò chuyện với giáo viên, cũng như nhận thông tin về quá trình học tập của con em mình. Hẹn gặp lại quý phụ huynh!',
    link: 'https://www.youtube.com/watch?v=4YBGRGBj7_w',
    image:
      'https://www.canva.com/design/DAGTWH_JYfw/_ZLoUqEYAJgTzgSi6WQ3wQ/view?utm_content=DAGTWH_JYfw&utm_campaign=designshare&utm_medium=link&utm_source=editor',
  };
  // data mẫu đơn nghĩ học
  const [leaveRequests, setLeaveRequests] = useState([]);
  // lưu trữ đơn nghỉ học được chọn
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);

  // useEffect để lấy tất cả đơn nghĩ học

  useEffect(() => {
    if (studentInfo._id) {
      getLeaveRequestsByStudentId(studentInfo._id).then((res) => {
        console.log('Leave Requests:', res.data);
        setLeaveRequests(res.data);
      });
    }
  }, []);
  // Sự kiện show đơn đã gửi
  const handleShowInfoLeaveRequestSent = () => {
    if (studentInfo._id) {
      getLeaveRequestsByStudentId(studentInfo._id).then((res) => {
        console.log('Leave Requests:', res.data);
        setLeaveRequests(res.data);
      });
    }
    // setShowInfoLeaveRequest(false);
    // setShowLeaveRequestSent(true);
  };

  // biến quản lý thông tin nhập vào đơn nghĩ học
  const [showInfoLeaveRequest, setShowInfoLeaveRequest] = useState(true);
  // sau khi nhập có biến quản lý all thooong tin nhập
  const [showFullInfoLeaveRequest, setShowFullInfoLeaveRequest] = useState(false);
  const [showFullInfoLeaveRequestSent, setShowFullInfoLeaveRequestSent] = useState(false);
  // biến quản lý chọn lịch nghĩ học
  const [showScheduleLeaveRequest, setShowScheduleLeaveRequest] = useState(false);
  // biến quản lý xem đơn nghĩ học đã gửi
  const [showLeaveRequestSent, setShowLeaveRequestSent] = useState(false);
  // biến quản lý bên ngoài tổng của nội dung buổi học
  const [showLesson, setShowLesson] = useState(true);
  // chi tiết buổi học
  const [showDetailLesson, setShowDetailLesson] = useState(false);
  const [showDetailLesson1, setShowDetailLesson1] = useState(false);

  // 1 state quản lý khi bấm vào họ tên trên góc tay phải hiển thị mục là thông tin cá nhân,đổi mật khẩu,đăng xuất
  // const [showProfile, setShowProfile] = useState(false);
  // // 1 state h iển thị form thay đổi mật khẩu
  // const [showChangePassword, setShowChangePassword] = useState(false);
  // const [oldPassword, setOldPassword] = useState();
  // const [newPassword, setNewPassword] = useState();
  // const [confirmPassword, setConfirmPassword] = useState();

  // // sự kiện khi bấm nút lưu mật khẩu
  // const handleChangePassword = () => {
  //   // kiểm tra có nhập đủ thông tin không

  //   if (!oldPassword || !newPassword || !confirmPassword) {
  //     toast.dismiss();
  //     toast.error('Vui lòng nhập đầy đủ thông tin');
  //     return;
  //   }

  //   // so sánh mật khẩu mới và mật khẩu xác nhận có giống nhau không
  //   else if (newPassword !== confirmPassword) {
  //     toast.dismiss();
  //     toast.error('Mật khẩu xác nhận không đúng');
  //     return;
  //   } else {
  //     // gọi tới api changePassword do userName trong studentInfo là tên còn trong account là mã học sinh nên ở đây truyền mã học sinh
  //     changePassword(studentInfo.studentCode, oldPassword, newPassword)
  //       .then((res) => {
  //         toast.dismiss();
  //         toast.success(res.data.message);
  //         setShowChangePassword(false);
  //       })
  //       .catch((error) => {
  //         alert(error);
  //       });
  //   }
  // };
  // 1 state hiển thị lên xuống thười khoá biểu ở màn hình chính
  // const [showTimeTable, setShowTimeTable] = useState(true);
  // // 1 state hiển thị thông báo notice ở màn hình chính
  // const [showNotice, setShowNotice] = useState(true);
  // // 1 state hiển thị thông báo bài học gần đây ở màn hình chính
  // const [showLessonHome, setShowLessonHome] = useState(true);

  // // phần state nghĩ học
  // // Add these new state variables
  // const [startDate, setStartDate] = useState('');

  // const [endDate, setEndDate] = useState('');
  // // định dạng DD/MM/YYYY

  // const [selectedSessions, setSelectedSessions] = useState([]);
  // hàm xử lý tạo ngày nghĩ dựa trên ngày bắt đầu và ngày kết thúc
  function generateDateRange(start, end) {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }
  // format ngày tháng theo việt nam
  function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  function handleSessionChange(e) {
    const { value, checked } = e.target;

    setSelectedSessions(
      (prev) =>
        checked
          ? [...prev, value] // Thêm session vào mảng khi được chọn
          : prev.filter((session) => session !== value) // Loại bỏ session khỏi mảng khi bỏ chọn
    );
  }

  // 1 state quản lý khi bấm vào họ tên trên góc tay phải hiển thị mục là thông tin cá nhân,đổi mật khẩu,đăng xuất
  const [showProfile, setShowProfile] = useState(false);
  // 1 state h iển thị form thay đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  // sự kiện khi bấm nút lưu mật khẩu
  const handleChangePassword = () => {
    // kiểm tra có nhập đủ thông tin không

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.dismiss();
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // so sánh mật khẩu mới và mật khẩu xác nhận có giống nhau không
    else if (newPassword !== confirmPassword) {
      toast.dismiss();
      toast.error('Mật khẩu xác nhận không đúng');
      return;
    } else {
      // gọi tới api changePassword do userName trong studentInfo là tên còn trong account là mã học sinh nên ở đây truyền mã học sinh
      changePassword(studentInfo.studentCode, oldPassword, newPassword)
        .then((res) => {
          toast.dismiss();
          toast.success(res.data.message);
          setShowChangePassword(false);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  // 1 state hiển thị lên xuống thười khoá biểu ở màn hình chính
  const [showTimeTable, setShowTimeTable] = useState(true);
  // 1 state hiển thị thông báo notice ở màn hình chính
  const [showNotice, setShowNotice] = useState(true);
  // 1 state hiển thị thông báo bài học gần đây ở màn hình chính
  const [showLessonHome, setShowLessonHome] = useState(true);

  // phần state nghĩ học
  // Add these new state variables
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSessions, setSelectedSessions] = useState([]);
  // hàm xử lý tạo ngày nghĩ dựa trên ngày bắt đầu và ngày kết thúc
  function generateDateRange(start, end) {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }
  // format ngày tháng theo việt nam
  function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  function handleSessionChange(e) {
    const { value, checked } = e.target;

    setSelectedSessions(
      (prev) =>
        checked
          ? [...prev, value] // Thêm session vào mảng khi được chọn
          : prev.filter((session) => session !== value) // Loại bỏ session khỏi mảng khi bỏ chọn
    );
  }

  // tạo biến lưu lý do nghỉ học
  const [leaveReason, setLeaveReason] = useState('');
  // xử lý sự kiện khi bấm gửi đơn nghỉ học
  const handleSubmitLeaveRequest = () => {
    // Chuyển đổi selectedSessions thành định dạng mong muốn
    const formattedSessions = generateDateRange(startDate, endDate).map((date) => {
      const dateString = new Date(date).toISOString().split('T')[0];
      return {
        date: new Date(date).toISOString(),
        morning: selectedSessions.includes(`${dateString}-morning`) ? true : false,
        afternoon: selectedSessions.includes(`${dateString}-afternoon`) ? true : false,
      };
    });

    createLeaveRequest(
      studentInfo._id,
      studentInfo.parents[0]._id,
      studentInfo.homeRoomTeacher_id,
      studentInfo.class_id,
      startDate,
      endDate,
      leaveReason,
      formattedSessions
    )
      .then((response) => {
        console.log('Leave request created successfully:', response);
        alert('Đã gửi đơn nghỉ học thành công');
        setShowFullInfoLeaveRequest(false);
        setShowInfoLeaveRequest(true);
        // chuyển qua tab xem đơn đã gửi
        // setShowLeaveRequestSent(true);
        // setShowScheduleLeaveRequest(false);
      })
      .catch((error) => {
        console.error('Error creating leave request:', error);
        alert('Đã xảy ra lỗi khi gửi đơn nghỉ học. Vui lòng thử lại sau.' + error);
      });
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <header className="bg-white p-4 border-b border-gray-300 flex justify-between items-center">
        <Toaster toastOptions={{ duration: 2200 }} />
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
              className="flex items-center cursor-default hover:cursor-pointer"
              onClick={() =>
                window.open(
                  'https://mail.google.com/mail/?view=cm&fs=1&to=duct6984@gmail.com&su=Góp ý về website sổ liên lạc điện tử',
                  '_blank'
                )
              }
            >
              <i className="fas fa-envelope mr-2" style={{ color: '#f6a9a7' }}></i>Hộp thư góp ý
            </span>
            <span className="flex items-center cursor-pointer">
              <a href="tel:0907021954" style={{ textDecoration: 'none' }}>
                <i className="fas fa-phone mr-2" style={{ color: '#77ac2f' }}></i>0907021954
              </a>
            </span>
            <div className="relative ">
              <span
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setShowStudentProfile(true);
                  setActiveTab('notice');
                  setShowAllMenu(false);
                }}
              >
                <i className="fas fa-bell mr-2" style={{ color: '#d55557' }}></i>
                Thông báo
              </span>
            </div>
            <div className="relative ">
              <a href="#" className="flex items-center" onClick={() => setShowProfile(!showProfile)}>
                <i className="fas fa-user-circle mr-2" style={{ color: '#429AB8' }}></i>
                {studentInfo.userName}
              </a>
              {showProfile && (
                <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg" style={{ left: '-10px' }}>
                  <a
                    href="#"
                    onClick={() => {
                      setShowStudentProfile(true);
                      setActiveTab('profile');
                      setShowAllMenu(false);
                      setShowProfile(false);
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </a>
                  <a
                    href="#"
                    onClick={() => {
                      setShowChangePassword(true);
                      setShowProfile(false);
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đổi mật khẩu
                  </a>

                  <a href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Đăng xuất
                  </a>
                </div>
              )}
            </div>
          </div>
          {/* Hiện menu cho màn hình điện thoại */}{' '}
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="md:hidden">
            <i className="fas fa-bars" style={{ color: '#429AB8' }}></i> {/* Dấu ba gạch */}
          </button>
        </div>

        {isMenuOpen && ( // đây là menu cho responsive mobile hiện
          <div className="absolute left-0 bg-white shadow-lg p-4 md:hidden" style={{ top: '0px' }}>
            <span
              className="flex items-center"
              onClick={() => {
                setShowStudentProfile(true);
                setMenuOpen(false);
                setShowAllMenu(false);
                setShowProfile(false);
              }}
            >
              <i className="fas fa-user mr-2" style={{ color: '#429AB8' }}></i>Thông Tin Cá Nhân
            </span>
            <span
              className="flex items-center"
              onClick={() => {
                setShowChangePassword(true);
                setMenuOpen(false);
              }}
            >
              <i className="fas fa-lock mr-2" style={{ color: '#429AB8' }}></i>Đổi Mật Khẩu
            </span>

            <span
              className="flex items-center cursor-default hover:cursor-pointer"
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
              <i className="fas fa-phone mr-2" style={{ color: '#429AB8' }}></i>SĐT Hỗ Trợ : 0907021954
            </span>
            <span className="flex items-center">
              <i className="fas fa-school mr-2" style={{ color: '#429AB8' }}></i>
              Trường Tiểu học Nguyễn Bỉnh Khiêm
            </span>
            <a href="/login" className="flex items-center">
              <i className="fas fa-sign-out-alt mr-2" style={{ color: '#429AB8' }}></i>
              Đăng Xuất
            </a>
          </div>
        )}
        {showChangePassword && ( // form thay đổi mật khẩu
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setShowChangePassword(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button
                  className="text-blue-500"
                  onClick={() => setShowChangePassword(false)} // Close the modal
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mật khẩu cũ <span className="text-red-500">(*)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu cũ"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mật khẩu mới <span className="text-red-500">(*)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Xác nhận mật khẩu <span className="text-red-500">(*)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Xác nhận lại mật khẩu"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleChangePassword}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>
      <div>
        <h1>Test123123123123</h1>
      </div>
      {/* Hiển thị menu chính */}
      {showAllMenu && ( // hiển thị thông tin toàn bộ bên dưới menu
        <div className="container mx-auto py-8 px-4 md:px-32 flex flex-col md:flex-row">
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
                  <i className="fas fa-file-alt mr-2" style={{ color: '#ffb448' }}></i>
                  <div className="text-gray-600">Hồ Sơ Học Sinh</div>
                </a>
                <a
                  onClick={() => {
                    setShowStudentProfile(true);
                    setActiveTab('academic');
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-book mr-2" style={{ color: '#545885' }}></i>
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
                  <i className="fas fa-chalkboard mr-2" style={{ color: '#e89175' }}></i>
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
                  <i className="fas fa-file-alt mr-2" style={{ color: '#f8c9be' }}></i>
                  <div className="text-gray-600">Tạo Đơn Xin Nghĩ Học </div>
                </a>
                <div
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-user mr-2" style={{ color: '#af4d62' }}></i>
                  <div className="text-gray-600">GVCN: {studentInfo.homeRoomTeacherName}</div>
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
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
                  <i className="far fa-calendar-alt mr-2" style={{ color: '#0B6FA1' }}></i>Thời Khóa Biểu
                </h2>
                <button onClick={() => setShowTimeTable(!showTimeTable)} className="text-blue-500 focus:outline-none">
                  <i className={`fas fa-chevron-${showTimeTable ? 'up' : 'down'}`}></i>
                </button>
              </div>
              {/* Thời khoá biểu */}

              {showTimeTable && <Schedule className={studentInfo.className} schoolYear={studentInfo.academicYear} />}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
                  <i className="fas fa-envelope mr-2"></i>Các Thư Mới Nhất
                </h2>
                <button onClick={() => setShowNotice(!showNotice)} className="text-blue-500 focus:outline-none">
                  <i className={`fas fa-chevron-${showNotice ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {showNotice && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span>
                      Trường tiểu học Nguyễn Bỉnh Khiêm ngày mai 11/10 kính mời PHHS tới lớp {studentInfo.className} họp
                      phụ huynh học sinh
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
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
                  <i className="fas fa-info-circle mr-2"></i> Bài Học Gần Đây
                </h2>
                <button onClick={() => setShowLessonHome(!showLessonHome)} className="text-blue-500 focus:outline-none">
                  <i className={`fas fa-chevron-${showLessonHome ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {showLessonHome && (
                <div className="flex items-center">
                  <span>Ôn Tập bài 2: Hình vuông - Hình tròn - Hình tam giác - Hình chữ nhật SGK Cánh diều</span>
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
              )}
            </div>
          </div>
        </div>
      )}

      {showStudentProfile && ( // phần dưới body
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
                      style={{ width: '200px', height: '200px' }}
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
                      <div>
                        <strong>GVCN:</strong> {studentInfo.homeRoomTeacherName}
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
                  {/*  Card 1*/}
                  <div className="flex flex-col md:flex-row border-b pb-4 mb-4">
                    {/* Image Section */}
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                      <img
                        src="https://kids.hoc247.vn/storage-files/docs/2022/20220928/744x420/63451d69eb2bc.webp"
                        alt="App Edu.One"
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>

                    {/* Text Section */}
                    <div className="w-full md:w-2/3 md:pl-4">
                      <h2 className="text-lg md:text-xl font-bold">
                        Bài 2: Hình vuông - Hình tròn - Hình tam giác - Hình chữ nhật SGK Cánh diều
                      </h2>
                      <div className="mt-2 p-4 bg-gray-100 rounded">
                        <span>
                          Trong bài học Hình vuông - Hình tròn - Hình tam giác - Hình chữ nhật, học sinh sẽ được học về
                          các hình học cơ bản như hình vuông, hình tròn, hình tam giác, hình chữ nhật. Học sinh sẽ được
                          học cách nhận biết và phân biệt các hình học cơ bản này.
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        11/10/2024 |{' '}
                        <a
                          href="#"
                          className="text-blue-500"
                          onClick={() => {
                            setShowLesson(false);
                            setShowDetailLesson1(true);
                          }}
                        >
                          Xem Chi Tiết
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Card 1 */}
                  <div className="flex flex-col md:flex-row border-b pb-4 mb-4">
                    {/* Image Section */}
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                      <img
                        src="https://i.imgur.com/3sxrx5Q_d.png?maxwidth=520&shape=thumb&fidelity=high"
                        alt="App Edu.One"
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>

                    {/* Text Section */}
                    <div className="w-full md:w-2/3 md:pl-4">
                      <h2 className="text-lg md:text-xl font-bold">Báo bài ngày 12 tháng 10 năm 2024 – Lớp 1A</h2>
                      <div className="mt-2 p-4 bg-gray-100 rounded">
                        <span>Thông báo bài học ngày 12 tháng 10 năm 2024 của lớp 1A.</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
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

                  {/*  Card 2 */}
                  <div className="flex flex-col border-t pt-4">
                    <h2 className="text-xl font-bold">
                      Hướng dẫn học sinh sử dụng MS Teams tham gia lớp học trực tuyến
                    </h2>
                    <p className="text-sm text-gray-500">
                      25/09/2024 |{' '}
                      <a
                        href="https://docs.google.com/document/d/1DheW41WHB6UD4NCyPGu5gcVSo6HOyaCNqEqOOLeaiF8/edit?tab=t.0"
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Hướng dẫn
                      </a>
                    </p>
                    <a
                      href="https://docs.google.com/document/d/1DheW41WHB6UD4NCyPGu5gcVSo6HOyaCNqEqOOLeaiF8/export?format=pdf"
                      className="text-red-500 text-sm mt-2"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-download"></i> Tải File đính kèm
                    </a>
                  </div>
                </div>
              )}
              {showDetailLesson && (
                <div className="container mx-auto p-4">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setShowLesson(true);
                        setShowDetailLesson(false);
                      }}
                      className="mr-2"
                    >
                      <i className="fas fa-arrow-left text-blue-500"></i> {/* Nút mũi tên quay về */}
                      <span>
                        <strong>Quay lại</strong>
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowLesson(false);
                        setShowDetailLesson(false);
                        setShowDetailLesson1(true);
                      }}
                      className="ml-2"
                    >
                      <span>
                        <strong>Bài tiếp theo</strong>
                      </span>
                      <i className="fas fa-arrow-right text-blue-500"></i> {/* Nút mũi tên chuyển tiếp */}
                    </button>
                  </div>
                  <h3 className=" mt-2">
                    <strong>Xin chào quý phụ huynh và các em học sinh,</strong>
                  </h3>

                  <h3 className=" mt-4">
                    <strong>Hôm nay, lớp 1A đã học các nội dung sau đây:</strong>
                  </h3>

                  <ul className="list-disc list-inside mt-4">
                    <li>
                      <strong>Môn Tiếng Việt:</strong> Học bài "Vần A, O" và luyện viết các từ có chứa vần này. Các em
                      đã luyện đọc và viết các từ cơ bản như "ba", "bò", "cá", "cô".
                    </li>
                    <li>
                      <strong>Môn Toán:</strong> Ôn lại các số từ 1 đến 10 và học cách đếm số lượng vật thể. Các em cũng
                      đã làm bài tập đếm số con vật trong tranh.
                    </li>
                    <li>
                      <strong>Môn Đạo Đức:</strong> Học bài "Chào hỏi lễ phép". Các em đã thực hành cách chào hỏi khi
                      gặp người lớn, thầy cô và bạn bè.
                    </li>
                  </ul>

                  <h3 className=" mt-6">
                    <strong>Tình hình làm bài tập về nhà:</strong>
                  </h3>
                  <p className="mt-4">
                    Nhiều em đã hoàn thành tốt bài tập về nhà, tuy nhiên vẫn còn một số bạn chưa hoàn thành hết hoặc cần
                    hỗ trợ thêm về cách làm. Những em hoàn thành bài tập sẽ được khen ngợi trước lớp, còn các em chưa
                    làm xong sẽ có thêm thời gian để ôn lại.
                  </p>

                  <h3 className="mt-6">
                    <strong>Ghi chú cho phụ huynh:</strong>
                  </h3>
                  <p className="mt-4">Ngày mai các em sẽ có bài tập về nhà gồm:</p>
                  <ul className="list-disc list-inside">
                    <li>Luyện viết 5 từ có vần "A, O" trong vở ô ly.</li>
                    <li>Đếm và vẽ lại 5 đồ vật trong nhà.</li>
                  </ul>

                  <p className="text-center font-bold mt-4">Chân thành cảm ơn quý phụ huynh đã quan tâm theo dõi!</p>
                </div>
              )}

              {showDetailLesson1 && (
                <div className="p-4">
                  <button
                    onClick={() => {
                      setShowLesson(true);
                      setShowDetailLesson(false);
                      setShowDetailLesson1(false);
                    }}
                    className="mr-2"
                  >
                    <i className="fas fa-arrow-left text-blue-500"></i> {/* Nút mũi tên quay về */}
                    <span>
                      <strong>Quay lại</strong>
                    </span>
                  </button>
                  <div className="text-center mb-8">
                    <img
                      src="https://kids.hoc247.vn/storage-files/docs/2022/20220928/744x420/63451d69eb2bc.webp"
                      alt="Banner with children, a bus, and a kite"
                      className="mx-auto"
                      width="800"
                      height="300"
                    />
                    <h1 class="text-3xl font-bold text-red-600">
                      BÀI 2: Hình vuông - Hình tròn - Hình tam giác - Hình chữ nhật
                    </h1>
                  </div>
                  <p class="text-center mt-2">
                    Giải Toán lớp 1 Bài 2: Hình vuông - Hình tròn - Hình tam giác - Hình chữ nhật
                  </p>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4">1. Tóm tắt lý thuyết</h1>
                    <p className="mb-4">
                      - Nhận biết và phân biệt được hình tròn, hình tam giác, hình vuông, hình chữ nhật
                    </p>
                    <p className="mb-4">- Đọc đúng tên với hình tương ứng.</p>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://image1.hoc247.vn/upload/2022/20220928/images/toan-1-bai-2-CD.JPG"
                        alt="Various shapes: square, circle, triangle, rectangle"
                        width="600"
                        height="200"
                      />
                    </div>
                    <p className="mb-4">
                      - Xác định được hình tròn, hình tam giác, hình vuông, hình chữ nhật trong thực tế
                    </p>
                    <p className="mb-4">
                      - Sử dụng các hình tròn, hình tam giác, hình vuông, hình chữ nhật để ghép thành hình khác như:
                      hình chiếc xe, ngôi nhà, con cá,....
                    </p>
                    <div className="flex justify-center">
                      <img
                        src="https://storage.googleapis.com/a1aa/image/0qAf1M04RX0WESUeWzLue3UzKei0j91sVafaxaUzUZZyqBucC.jpg"
                        alt="Fish made of various shapes"
                        width="200"
                        height="200"
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4">2. Bài tập minh họa</h1>
                    <p className="mb-4">
                      <strong>Câu 1:</strong> Gọi tên các đồ vật có hình tam giác:
                    </p>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://hoc247.net/fckeditorimg/upload/images/bai-tap-minh-hoa-bai-2-toan-1-Canh-dieu(1).jpg"
                        alt="Various objects with triangular shapes"
                        width="200"
                        height="400"
                      />
                    </div>
                    <p className="mb-4">
                      <strong>Hướng dẫn giải:</strong>
                    </p>
                    <p className="mb-4">Các đồ vật có hình tam giác là: bánh pizza, thước kẻ, cây thông và quả dâu.</p>
                    <p className="mb-4">
                      <strong>Câu 2:</strong> Cho biết có bao nhiêu ảnh về có dạng hình hình tròn?
                    </p>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://hoc247.net/fckeditorimg/upload/images/tim-hinh-tron.PNG"
                        alt="Various objects with circular shapes"
                        width="200"
                        height="200"
                      />
                    </div>
                    <p className="mb-4">
                      <strong>Hướng dẫn giải:</strong>
                    </p>
                    <p className="mb-4">Đáp án có 4 hình tròn</p>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://hoc247.net/fckeditorimg/upload/images/dap-an-bai-tap-minh-hoa-cau-1.PNG"
                        alt="Various objects with circular shapes"
                        width="200"
                        height="200"
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4">3. Bài tập SGK</h1>
                    <h2 className="text-xl font-bold mb-4">3.1. Giải câu 1 trang 9 SGK Toán 1 CD</h2>
                    <p className="mb-4">
                      Kể tên đồ vật trong hình vẽ có dạng: hình vuông, hình tròn, hình tam giác, hình chữ nhật.
                    </p>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://image1.hoc247.vn/upload/2022/20220928/images/Luyen-tap-thuc-hanh-cau-1-trang-9-sgk-toan-1-canh-dieu.jpg"
                        alt="Various objects with different shapes"
                        width="600"
                        height="200"
                      />
                    </div>
                    <p className="mb-4">
                      <strong>Phương pháp giải:</strong>
                    </p>
                    <p className="mb-4">
                      Quan sát tranh và kể tên đồ vật trong hình vẽ có dạng: hình vuông, hình tròn, hình tam giác, hình
                      chữ nhật.
                    </p>
                    <p className="mb-4">
                      <strong>Lời giải chi tiết:</strong>
                    </p>
                    <p className="mb-4">- Đồ vật có dạng hình vuông: Bức tranh</p>
                    <p className="mb-4">- Đồ vật có dạng hình tròn: Đĩa nhạc, biển báo cấm ô tô</p>
                    <p className="mb-4">- Đồ vật có dạng hình tam giác: Biển báo dành cho người đi bộ</p>
                    <p className="mb-4">- Đồ vật có dạng hình chữ nhật: Phong thư</p>
                    <h2 className="text-xl font-bold mb-4">3.2. Giải câu 2 trang 9 SGK Toán 1 CD</h2>
                    <p className="mb-4">Hình tam giác có màu gì? Hình vuông có màu gì? Gọi tên các hình có màu đó.</p>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://image1.hoc247.vn/upload/2022/20220928/images/Luyen-tap-thuc-hanh-cau-2-trang-9-sgk-toan-1-canh-dieu.jpg"
                        alt="Various shapes with different colors"
                        width="600"
                        height="200"
                      />
                    </div>
                    <p className="mb-4">
                      <strong>Phương pháp giải:</strong>
                    </p>
                    <p className="mb-4">Quan sát hình vẽ để trả lời câu hỏi.</p>
                    <h2 className="text-xl font-bold mb-4">3.3. Giải câu 3 trang 9 SGK Toán 1 CD</h2>
                    <p className="mb-4">Ghép hình em thích:</p>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://image1.hoc247.vn/upload/2022/20220928/images/Luyen-tap-thuc-hanh-cau-3-trang-9-sgk-toan-1-canh-dieu.jpg"
                        alt="Various objects made of different shapes"
                        width="600"
                        height="200"
                      />
                    </div>
                    <p className="mb-4">
                      <strong>Phương pháp giải:</strong>
                    </p>
                    <p className="mb-4">Học sinh tự thực hiện.</p>
                    <p className="mb-4">
                      <strong>Lời giải chi tiết:</strong>
                    </p>
                    <p className="mb-4">Học sinh tự thực hiện.</p>
                    <h2 className="text-xl font-bold mb-4">3.4. Giải câu 4 trang 9 SGK Toán 1 CD</h2>
                    <p className="mb-4">
                      Kể tên các đồ vật trong thực tế có dạng: hình vuông, hình tròn, hình tam giác, hình chữ nhật.
                    </p>
                    <p className="mb-4">
                      <strong>Phương pháp giải:</strong>
                    </p>
                    <p className="mb-4">
                      HS quan sát và kể tên các đồ vật trong thực tế có dạng: hình vuông, hình tròn, hình tam giác, hình
                      chữ nhật.
                    </p>
                    <p className="mb-4">
                      <strong>Lời giải chi tiết:</strong>
                    </p>
                    <p className="mb-4">
                      - Các đồ vật có dạng hình vuông như: khăn mùi xoa, gạch lát sàn, ô cửa sổ, ....
                    </p>
                    <p className="mb-4">- Các đồ vật có dạng hình tròn như: bánh xe, cái đĩa, cái nấm, ....</p>
                    <p className="mb-4">
                      - Các đồ vật có dạng hình tam giác như: khăn quàng đỏ, cờ thi đua, cái kẻ, ....
                    </p>
                    <p className="mb-4">- Các đồ vật có dạng hình chữ nhật như: quyển vở, hộp bút, bảng viết, ....</p>
                  </div>
                  <div className="text-center text-gray-500 text-sm">
                    <p>Ngày 11/10/2024</p>
                    <p>Chia sẻ bởi: Thầy Nguyễn Đức Trí</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'notice' && (
            <div>
              {/* Nội dung cho Thông báo */}
              <h2 className="text-xl font-bold mb-4">Thông Báo</h2>
              {/* Thông báo họp phụ huynh */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Người gửi: </strong>

                    {senderName}
                  </div>
                  <div>
                    <strong>Thời gian: </strong>
                    {new Date(createdAt).toLocaleString()} {/* Thay createdAt bằng thời gian gửi */}
                  </div>
                </div>
                <h3
                  className="text-lg font-semibold mt-2 cursor-pointer text-blue-500"
                  onClick={() => setShowContent1(!showContent1)}
                >
                  Thông báo họp phụ huynh {/* Tiêu đề thông báo */}
                </h3>
                {showContent1 && ( // Hiển thị nội dung khi nhấp vào tiêu đề
                  <div className="mt-2">
                    <p>{content1.text}</p> {/* Nội dung thông báo */}
                    {content1.image && (
                      <div className="mt-2 flex justify-center">
                        <img src={content1.image} alt="Thông báo" className="w-200 h-200 object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Người gửi: </strong>

                    {senderName}
                  </div>
                  <div>
                    <strong>Thời gian: </strong>
                    {new Date(createdAt1).toLocaleString()} {/* Thay createdAt bằng thời gian gửi */}
                  </div>
                </div>
                <h3
                  className="text-lg font-semibold mt-2 cursor-pointer text-blue-500"
                  onClick={() => setShowContent(!showContent)}
                >
                  Chúc mừng lễ Giáng Sinh 2023 {/* Tiêu đề thông báo */}
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
              <div className="flex space-x-4 mb-4 justify-center">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setShowInfoLeaveRequest(false);
                    setShowLeaveRequestSent(true);
                    handleShowInfoLeaveRequestSent();
                  }}
                >
                  Xem đơn đã gửi
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setShowInfoLeaveRequest(true);
                    setShowLeaveRequestSent(false);
                  }}
                >
                  Tạo mới đơn nghỉ học
                </button>
              </div>
              {/* màn hình cho tất cả đơn dã gửi  */}

              {showLeaveRequestSent && (
                <div className="max-w-4xl mx-auto bg-white border shadow-md rounded-lg p-6">
                  <h3 className="text-center text-xl font-bold mb-4">Tất cả đơn nghỉ học đã gửi</h3>

                  {leaveRequests.length === 0 ? (
                    <p className="text-center text-gray-600">Bạn chưa gửi đơn nghỉ học nào.</p>
                  ) : (
                    <div className="space-y-4">
                      {leaveRequests.map((request, index) => (
                        <div key={request._id} className="bg-gray-100 p-4 rounded-md border shadow-sm">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-semibold text-gray-700">Từ ngày:</span>{' '}
                              {new Date(request.start_date).toLocaleDateString()} {/* Chỉnh lại start_date */}
                              <span className="ml-4 font-semibold text-gray-700">Đến ngày:</span>{' '}
                              {new Date(request.end_date).toLocaleDateString()} {/* Chỉnh lại end_date */}
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                                  request.status === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : request.status === 'approved'
                                      ? 'bg-green-500 text-white'
                                      : 'bg-red-500 text-white'
                                }`}
                                style={{ minWidth: '80px' }} // Đảm bảo phần tử có kích thước tối thiểu để không quá hẹp
                              >
                                {request.status === 'pending'
                                  ? 'Chờ duyệt'
                                  : request.status === 'approved'
                                    ? 'Đã duyệt'
                                    : 'Bị từ chối'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <p>
                              <span className="font-semibold text-gray-700">Lý do nghỉ:</span> {request.reason}
                            </p>
                            <div className="mt-2">
                              <span className="font-semibold text-gray-700">Danh sách buổi nghỉ:</span>
                              <ul className="list-disc list-inside ml-4">
                                {request.sessions.map((session) => (
                                  <li key={session._id}>
                                    {new Date(session.date).toLocaleDateString('en-GB')}: {/* Chỉnh lại session.date */}
                                    {session.morning && 'Sáng'} {session.afternoon && 'Chiều'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                              onClick={() => {
                                setShowFullInfoLeaveRequestSent(true);
                                setShowLeaveRequestSent(false);
                                setSelectedLeaveRequest(request); // Lưu đơn được chọn
                              }}
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* màn hình tạo đơn xin nghỉ học  */}

              {showInfoLeaveRequest && (
                <div className="max-w-md mx-auto bg-white border shadow-md rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-user text-blue-500 mr-2"></i>
                    <span className="text-gray-600">Người làm đơn:</span>
                    <span className="ml-2 text-blue-500 font-semibold">{studentInfo.parents[0].userName}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-center border-b border-gray-200 mb-4">
                      <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                      <span className="text-gray-600">Thời gian nghỉ</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div
                        className="flex items-center"
                        style={{
                          overflowX: 'hidden',
                          maxWidth: '100%',
                        }}
                      >
                        <span className="text-gray-600 whitespace-nowrap" style={{ marginRight: '22px' }}>
                          Nghỉ từ:
                        </span>
                        {/* <input
                          type="date"
                          className="ml-6 text-black  font-bold  w-60" // Adjusted to use full width
                          min={new Date().toISOString().split('T')[0]}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        /> */}

                        <DatePicker
                          selected={startDate}
                          minDate={new Date()}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="dd/MM/yyyy" // Định dạng hiển thị
                          placeholderText="DD/MM/YYYY" // Placeholder hiển thị
                          className="  text-black font-bold w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg" // Thiết lập max-width theo từng màn hình
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 whitespace-nowrap" style={{ marginRight: '10px' }}>
                          Đến ngày:
                        </span>
                        {/* <input
                          type="date"
                          className="ml-2 text-black font-bold w-60" // Adjusted to use full width
                          min={startDate}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        /> */}
                        <DatePicker
                          selected={endDate}
                          minDate={startDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="dd/MM/yyyy" // Định dạng hiển thị
                          placeholderText="DD/MM/YYYY"
                          className=" text-black font-bold w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg" // Thiết lập max-width theo từng màn hình
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

                    {showScheduleLeaveRequest &&
                      startDate &&
                      endDate && ( // Hiển thị checkbox nếu showSchedule là true
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-end mb-2">
                            <button
                              className={`${
                                selectedSessions.length ===
                                generateDateRange(startDate, endDate).flatMap((date) => [
                                  `${new Date(date).toISOString().split('T')[0]}-morning`,
                                  `${new Date(date).toISOString().split('T')[0]}-afternoon`,
                                ]).length
                                  ? 'bg-red-500 hover:bg-red-600'
                                  : 'bg-blue-500 hover:bg-blue-600'
                              } text-white px-2 py-1 rounded-lg`}
                              onClick={() => {
                                const allSessions = generateDateRange(startDate, endDate).flatMap((date) => [
                                  `${new Date(date).toISOString().split('T')[0]}-morning`,
                                  `${new Date(date).toISOString().split('T')[0]}-afternoon`,
                                ]);
                                if (selectedSessions.length === allSessions.length) {
                                  setSelectedSessions([]);
                                } else {
                                  setSelectedSessions(allSessions);
                                }
                              }}
                            >
                              {selectedSessions.length ===
                              generateDateRange(startDate, endDate).flatMap((date) => [
                                `${new Date(date).toISOString().split('T')[0]}-morning`,
                                `${new Date(date).toISOString().split('T')[0]}-afternoon`,
                              ]).length
                                ? 'Bỏ chọn tất cả'
                                : 'Chọn tất cả'}
                            </button>
                          </div>
                          {generateDateRange(startDate, endDate).map((date) => (
                            <div key={date} className="flex justify-between ml-6 mb-2">
                              <div>
                                {' '}
                                <span>Ngày {formatDate(date)}</span>
                              </div>

                              <div className="flex items-center">
                                <label className="inline-flex items-center mr-4">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    value={`${new Date(date).toISOString().split('T')[0]}-morning`}
                                    onChange={handleSessionChange}
                                    checked={selectedSessions.includes(
                                      `${new Date(date).toISOString().split('T')[0]}-morning`
                                    )}
                                  />
                                  <span className="ml-2">Sáng</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    value={`${new Date(date).toISOString().split('T')[0]}-afternoon`}
                                    onChange={handleSessionChange}
                                    checked={selectedSessions.includes(
                                      `${new Date(date).toISOString().split('T')[0]}-afternoon`
                                    )}
                                  />
                                  <span className="ml-2">Chiều</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
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
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-4"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setSelectedSessions([]);
                        setLeaveReason('');
                      }}
                    >
                      Nhập lại
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        if (selectedSessions.length === 0 || !leaveReason) {
                          alert('Vui lòng chọn ngày nghỉ và ghi lý do');
                          return;
                        }
                        // alert ra selectedSessions

                        // alert(selectedSessions);
                        setShowFullInfoLeaveRequest(true);
                        setShowInfoLeaveRequest(false);
                      }}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              )}
              {/* màn hình show full thông tin sau khi đơn xin nghỉ học  */}
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
                    <p className="ml-6">. Giáo viên chủ nhiệm lớp {studentInfo.className} và các thầy cô bộ môn</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Người làm đơn</h2>
                    </div>
                    <p className="ml-6">- Tôi tên là: {studentInfo.parents[0].userName} </p>
                    <p className="ml-6">- Phụ huynh của em: {studentInfo.userName}</p>
                    <p className="ml-6">- Lớp: {studentInfo.className}</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Thời gian nghỉ</h2>
                    </div>
                    <p className="ml-6">- Tôi làm đơn này xin phép cho con được nghỉ học trong thời gian sau:</p>
                    {generateDateRange(startDate, endDate).map((date) => {
                      const dateString = new Date(date).toISOString().split('T')[0]; // Lấy ngày dạng ISO ngắn
                      const isMorningSelected = selectedSessions.includes(`${dateString}-morning`);
                      const isAfternoonSelected = selectedSessions.includes(`${dateString}-afternoon`);

                      return (
                        <div key={date}>
                          {isMorningSelected && (
                            <p className="ml-10">
                              + {formatDate(date)} - Sáng
                              {/* ({dateString}-morning) */}
                            </p>
                          )}
                          {isAfternoonSelected && (
                            <p className="ml-10">
                              + {formatDate(date)} - Chiều
                              {/* ({dateString}-afternoon) */}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-comment-dots text-yellow-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Lý do</h2>
                    </div>
                    <p className="ml-6">- {leaveReason}</p>
                    <p className="ml-6">- Kính mong quý thầy cô xem xét, giúp đỡ.</p>
                    <p className="ml-6">- Tôi sẽ nhắc nhở cháu học bài và làm bài tập đầy đủ.</p>
                  </div>
                  <div className="text-right mb-4">
                    <p>Xin chân thành cảm ơn</p>
                    <p>Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                    <p>{studentInfo.parents[0].userName}</p>
                  </div>
                  <div className="text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        handleSubmitLeaveRequest();
                        // sau khi gửi thì reset lại form nội dung đã nhập
                        setStartDate('');
                        setEndDate('');
                        setSelectedSessions([]);
                        setLeaveReason('');
                      }}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              )}
              {/* màn hình show full thông tin khi xem những đơn đã gửi  */}
              {showFullInfoLeaveRequestSent && selectedLeaveRequest && (
                <div className="max-w-md mx-auto border bg-white shadow-md rounded-lg p-4 mt-6">
                  <div className="flex items-center mb-4 justify-between">
                    <button
                      onClick={() => {
                        setShowFullInfoLeaveRequestSent(false);
                        setShowLeaveRequestSent(true);
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
                    <p className="ml-6">. Giáo viên chủ nhiệm lớp {studentInfo.className} và các thầy cô bộ môn</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Người làm đơn</h2>
                    </div>
                    <p className="ml-6">- Tôi tên là: {studentInfo.parents[0].userName} </p>
                    <p className="ml-6">- Phụ huynh của em: {studentInfo.userName}</p>
                    <p className="ml-6">- Lớp: {studentInfo.className}</p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Thời gian nghỉ</h2>
                    </div>
                    <p className="ml-6">- Tôi làm đơn này xin phép cho con được nghỉ học trong thời gian sau:</p>

                    {selectedLeaveRequest.sessions.map((session) => (
                      <li key={session._id}>
                        {new Date(session.date).toLocaleDateString('en-GB')}: {/* Chỉnh lại session.date */}
                        {session.morning && 'Sáng'} {session.afternoon && 'Chiều'}
                      </li>
                    ))}
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-comment-dots text-yellow-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Lý do</h2>
                    </div>
                    <p className="ml-6">- {selectedLeaveRequest.reason}</p>
                    <p className="ml-6">- Kính mong quý thầy cô xem xét, giúp đỡ.</p>
                    <p className="ml-6">- Tôi sẽ nhắc nhở cháu học bài và làm bài tập đầy đủ.</p>
                  </div>
                  <div className="text-right mb-4">
                    <p>Xin chân thành cảm ơn</p>
                    <p>Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                    <p>{studentInfo.parents[0].userName}</p>
                  </div>
                  <div className="text-center">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setShowFullInfoLeaveRequestSent(false);
                        setShowLeaveRequestSent(true);
                      }}
                    >
                      Xác nhận
                    </button>
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
