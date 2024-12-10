/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import 'flowbite';
import { useEffect, useRef } from 'react';
// import { jwtDecode } from 'jwt-decode';
import { useState } from 'react'; // Thêm import useState
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toaster, toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { changePassword } from '../../api/Accounts';
import { createLeaveRequest, getLeaveRequestsByParentId } from '../../api/LeaveRequest';
import { getNotificationsByReceiverId } from '../../api/Notifications';
import { getFullParentInfo } from '../../api/Parents';
import { getFullInfoStudentByCode, getStudentByAccountId } from '../../api/Student';

import io from 'socket.io-client';
import Schedule from './Schedule';
import StudyResult from './StudyResult';
import ViewReport from './ViewReport';

export default function Student() {
  const getCurrentSchoolYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (currentMonth >= 8) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  };
  const [accounts, setAccounts] = useState([]);
  const [studentInfo, setStudentInfo] = useState({});
  // useEffect ra studentInfo

  // gọi tới apiu getFullInfoStudentByCode đựa trên studentCode ở trong cookie
  // const [studentInfo, setStudentInfo] = useState({});
  // useEffect(() => {
  //   getFullInfoStudentByCode(studentCode).then((res) => {
  //     setStudentInfo(res);
  //   });
  // }, []);

  // HÃY TẠO console.log về studentInfo để xem thông tin học sinh
  // console.log('setStudentInfo');
  useEffect(() => {
    document.title = 'Học sinh';
    const accountId = sessionStorage.getItem('_id');
    const resStudent = getStudentByAccountId(accountId);
    resStudent
      .then((data) => {
        console.log(data);
        setAccounts(data);
        getFullInfoStudentByCode(data.studentCode, getCurrentSchoolYear()).then((res) => {
          setStudentInfo(res);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // // hiện console.log để xem thông tin học sinh
  // console.log('studentInfo là:', studentInfo);

  // gọi tới apiu getFullInfoStudentByCode đựa trên studentCode ở trong cookie

  // console.log('studentInfo là:', studentInfo);
  const [isMenuOpen, setMenuOpen] = useState(false); // Thêm state để quản lý menu
  // show thông tin toàn bộ menu (thông tin hồ sơ,ds giáo viên,thời khoá biểu,các thư mới nhất,bàio học gần đây)
  const [showAllMenu, setShowAllMenu] = useState(true); // Thêm state để quản lý hiển thị toàn bộ menu
  const [showStudentProfile, setShowStudentProfile] = useState(false); // Thêm state để quản lý hiển thị hồ sơ học sinh
  const [activeTab, setActiveTab] = useState('profile'); // Thêm state để quản lý tab đang hoạt động
  // tạo phân trang học kỳ bên trong Tab Quá trình học tập

  // chỗ sự kiện cho tab thông báo

  const [showContent1, setShowContent1] = useState(false);

  // gọi tới api get all notifications

  const [notifications, setNotifications] = useState([]);
  const socket = useRef(null);
  const URL = process.env.REACT_APP_SOCKET_URL;
  useEffect(() => {
    getNotificationsByReceiverId(studentInfo._id).then((res) => {
      console.log('Notifications:', res.data);
      setNotifications(res.data);
    });
    console.log('socket:', URL);

    const connectSocket = () => {
      socket.current = io(URL, {
        // Đảm bảo địa chỉ chính xác
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.current.on('connect', () => {
        console.log('Client kết nối socket thành công:', socket.current.id);
        // alert('Kết nối socket thành công');
      });

      socket.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        // alert('Kết nối socket thất bại');
      });

      socket.current.on('newNotification', (notification) => {
        console.log(' newNotification ở socket kết nối thành công:', notification);
        // const delay = new Date(notification.notification_time) - new Date();
        // if (delay > 0) {
        //   setTimeout(() => {
        //     setNotifications((prev) => [notification, ...prev]);
        //   }, delay);
        // } else {
        //   setNotifications((prev) => [notification, ...prev]);
        // }
        setNotifications((prev) => [notification, ...prev]);
      });
      // lắng nghe sự kiện getAllNotifications ở phía server socket
      socket.current.on('getAllNotifications', (notifications) => {
        console.log('getAllNotifications ở socket kết nối thành công:', notifications);
        setNotifications(notifications);
      });
    };

    connectSocket();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [studentInfo]);
  // Thêm hàm format date
  const formatDateTime = (dateString) => {
    // Tách thời gian UTC thành các thành phần
    const date = new Date(dateString);
    const utcDay = date.getUTCDate().toString().padStart(2, '0');
    const utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const utcYear = date.getUTCFullYear();
    const utcHour = date.getUTCHours().toString().padStart(2, '0');
    const utcMinute = date.getUTCMinutes().toString().padStart(2, '0');

    return `${utcHour}:${utcMinute} ${utcDay}/${utcMonth}/${utcYear}`;
  };

  const [parentInfo, setParentInfo] = useState({ students: [] });
  const [selectedStudents, setSelectedStudents] = useState([]);

  // chỗ sự kiện tab đơn xin nghĩ học
  const handleResetLeaveRequest = () => {
    setStartDate('');
    setEndDate('');
    setSelectedSessions([]);
    setLeaveReason('');
    setSelectedStudents([]); // Reset selected students
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (studentInfo.parents && studentInfo.parents.length > 0) {
          const res = await getFullParentInfo(studentInfo.parents[0]._id);
          console.log('Parent Info:', res);
          if (res && res.students) {
            // Kiểm tra res và res.students tồn tại
            setParentInfo(res);
          }
        }
      } catch (error) {
        console.error('Error fetching parent info:', error);
      }
    };

    fetchData();
  }, [studentInfo.parents]); // Thêm dependency

  // Handler để xử lý chọn/bỏ chọn
  const handleStudentSelection = (student) => {
    if (selectedStudents.find((s) => s.student_id === student.student_id)) {
      setSelectedStudents(selectedStudents.filter((s) => s.student_id !== student.student_id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const [leaveRequests, setLeaveRequests] = useState([]);
  // lưu trữ đơn nghỉ học được chọn
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  // khi selectedLeaveRequest có sự thay đỔi thì console.log để xem thông tin
  useEffect(() => {
    console.log('Selected leave request:', selectedLeaveRequest);
  }, [selectedLeaveRequest]);

  useEffect(() => {
    if (parentInfo?.parent?._id) {
      getLeaveRequestsByParentId(parentInfo.parent._id)
        .then((res) => {
          console.log('Leave Requests lúc đầU là:', res.data);
          setLeaveRequests(res.data);
        })
        .catch((error) => {
          console.error('Error fetching leave requests:', error);
        });
    }
  }, [parentInfo]);
  // Sự kiện show đơn đã gửi
  const handleShowInfoLeaveRequestSent = () => {
    getLeaveRequestsByParentId(parentInfo.parent._id)
      .then((res) => {
        console.log('Leave Requests lúc đầU là:', res.data);
        setLeaveRequests(res.data);
      })
      .catch((error) => {
        console.error('Error fetching leave requests:', error);
      });
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
          // alert(error);
          toast.dismiss();
          toast.error(error);
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

  // tạo biến lưu lý do nghỉ học
  const [leaveReason, setLeaveReason] = useState('');

  // console.log selectedStudents để xem thông tin
  useEffect(() => {
    console.log('Selected students:', selectedStudents);
  }, [selectedStudents]);

  const handleSubmitLeaveRequest = () => {
    // Helper function to convert to Vietnam timezone
    const convertToVNTime = (date) => {
      const vnTime = new Date(date);
      vnTime.setHours(vnTime.getHours() + 7); // Convert to Vietnam timezone (UTC+7)
      return vnTime;
    };

    const formattedSessions = generateDateRange(startDate, endDate).map((date) => {
      // Convert the date to Vietnam timezone
      const vnDate = convertToVNTime(date);
      const dateString = vnDate.toISOString().split('T')[0];

      return {
        date: vnDate.toISOString(), // Store in ISO format but with correct timezone offset
        morning: selectedSessions.includes(`${dateString}-morning`) ? true : false,
        afternoon: selectedSessions.includes(`${dateString}-afternoon`) ? true : false,
      };
    });

    // Convert start and end dates to Vietnam timezone
    const vnStartDate = convertToVNTime(startDate);
    const vnEndDate = convertToVNTime(endDate);

    const createRequestPromises = selectedStudents.map((student) =>
      createLeaveRequest(
        student.student_id,
        studentInfo.parents[0]._id,
        student.class.homeRoomTeacher,
        student.class.class_id,
        vnStartDate.toISOString(), // Use Vietnam timezone
        vnEndDate.toISOString(), // Use Vietnam timezone
        leaveReason,
        formattedSessions
      )
    );

    Promise.all(createRequestPromises)
      .then((responses) => {
        console.log('Leave requests created successfully:', responses);
        // alert(`Đã gửi ${selectedStudents.length} đơn nghỉ học thành công`);
        toast.success(`Đã gửi ${selectedStudents.length} đơn nghỉ học thành công`);
        setShowFullInfoLeaveRequest(false);
        setShowInfoLeaveRequest(true);
      })
      .catch((error) => {
        // console.error('Error creating leave requests:', error);
        // alert('Đã xảy ra lỗi khi gửi đơn nghỉ học. Vui lòng thử lại sau.' + error);
        console.error('Lỗi khi tạo đơn xin nghỉ học:', error);

        // Kiểm tra nếu là lỗi trùng đơn nghỉ học
        if (error.response?.status === 400 && error.response?.data?.message) {
          alert(error.response.data.message);
          // Reset form or specific fields if needed
          // về lại trang  trước
          setShowFullInfoLeaveRequest(false);
          setShowInfoLeaveRequest(true);
        } else {
          // Các lỗi khác
          // alert('Đã xảy ra lỗi khi gửi đơn nghỉ học. Vui lòng thử lại sau.', +error);
          toast.error('Đã xảy ra lỗi khi gửi đơn nghỉ học. Vui lòng thử lại sau.');
          console.error('Lỗi khi gửi đơn xin nghỉ học:', error);
        }
      });
  };

  return (
    <div className="font-sans bg-gray-100 ">
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
                  alt="Student Profile"
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
                  className="flex items-center cursor-pointer"
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
                  className="flex items-center cursor-pointer"
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
                  className="flex items-center cursor-pointer"
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
                  className="flex items-center cursor-pointer"
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
              className={`tab cursor-pointer ${activeTab === 'profile' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
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
              className={`tab cursor-pointer ${activeTab === 'academic' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
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
              className={`tab cursor-pointer ${activeTab === 'lesson' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
              onClick={() => {
                setActiveTab('lesson');
              }}
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
              className={`tab cursor-pointer ${activeTab === 'notice' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
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
              className={`tab cursor-pointer ${activeTab === 'leaveRequest' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
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
                      alt="Student Profile"
                      className="rounded-full w-50 h-50 mx-auto"
                    /> */}

                    <img
                      src={
                        studentInfo.gender === 'Nam'
                          ? 'https://cdn-icons-png.flaticon.com/512/4537/4537074.png'
                          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfjUNC6tqBRQQZonwx0-vsJuTeDLetRoi-fp5Yee6shI1zXVumCeuE4mKye97fxwLgrj0&usqp=CAU'
                      }
                      alt="Student Profile"
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
          {activeTab === 'academic' && <StudyResult studentInfor={studentInfo} />}
          {activeTab === 'lesson' && <ViewReport studentInfor={studentInfo} />}
          {activeTab === 'notice' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Thông Báo</h2>
              {notifications
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((notification, index) => (
                  <div key={notification._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>Người gửi: </strong>
                        {/* {notification.sender_id}  */}
                        Admin
                      </div>
                      <div>
                        <strong>Thời gian: </strong>
                        {/* {new Date(notification.created_at).toLocaleString()} */}
                        {formatDateTime(notification.notification_time)}
                      </div>
                    </div>
                    <h3
                      className="text-lg font-semibold mt-2 cursor-pointer text-blue-500"
                      onClick={() => setShowContent1(index === showContent1 ? null : index)}
                    >
                      {notification.content.subject}
                    </h3>
                    {showContent1 === index && (
                      <div className="mt-2">
                        <p>{notification.content.text}</p>
                        {notification.content.image && (
                          <div className="mt-2 flex justify-center">
                            <img
                              src={notification.content.image}
                              alt="Thông báo"
                              className="w-1/2 h-auto object-cover"
                            />
                          </div>
                        )}

                        {notification.content.link && notification.content.link.trim() !== '' && (
                          <div className="mt-2 flex justify-between">
                            <b>
                              <a
                                href={notification.content.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-500"
                              >
                                Link liên kết
                              </a>
                            </b>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
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
                    // setShowInfoLeaveRequest(!showInfoLeaveRequest);
                    // setShowLeaveRequestSent(!showLeaveRequestSent);
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
                    setShowFullInfoLeaveRequestSent(false);
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
                      {leaveRequests
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sắp xếp theo created_at giảm dần
                        .map((request, index) => (
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
                                      {new Date(session.date).toLocaleDateString('en-GB')}:{' '}
                                      {/* Chỉnh lại session.date */}
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
                  <div className="flex items-center mb-4 border-b">
                    <i className="fas fa-user text-blue-500 mr-2"></i>
                    <span className="text-gray-600">Người làm đơn:</span>
                    <span className="ml-2 text-blue-500 font-semibold">{studentInfo.parents[0].userName}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <i className="fas fa-user text-green-500 mr-2"></i>
                    <span className="text-gray-600">Chọn con:</span>
                    <div className="ml-2">
                      {parentInfo && parentInfo.students && parentInfo.students.length > 0 ? (
                        parentInfo.students.map((student) => (
                          <div key={student.student_id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={student.student_id}
                              // Thay đổi điều kiện checked
                              checked={selectedStudents.some((s) => s.student_id === student.student_id)}
                              onChange={() => handleStudentSelection(student)}
                              className="mr-2"
                            />
                            <label htmlFor={student.student_id} className="text-green font-bold text-green-600">
                              {student.student_name}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p>Không có thông tin học sinh</p>
                      )}
                    </div>
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
                        handleResetLeaveRequest();
                      }}
                    >
                      Nhập lại
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        // thêm điều kiện cần chọn con ở selectedStudents
                        if (selectedStudents.length === 0) {
                          toast.dismiss();
                          toast.error('Vui lòng chọn con');

                          return;
                        } else if (selectedSessions.length === 0 || !leaveReason) {
                          // alert('Vui lòng chọn ngày nghỉ và ghi lý do');
                          toast.dismiss();
                          toast.error('Vui lòng chọn ngày nghỉ và ghi lý do');
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
                    <p className="ml-6">
                      - Phụ huynh của em:
                      {selectedStudents.map((student) => (
                        <span key={student.student_id}>{student.student_name}, </span>
                      ))}
                    </p>
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
                  {/* <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Người làm đơn</h2>
                    </div>
                    <p className="ml-6">- Tôi tên là: {studentInfo.parents[0].userName} </p>
                    <p className="ml-6">
                      - Phụ huynh của em:
                      {selectedStudents.map((student) => (
                        <span key={student.student_id}>{student.student_name}, </span>
                      ))}
                    </p>
                    <p className="ml-6">- Lớp: {studentInfo.className}</p>
                  </div> */}
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                      <h2 className="text-lg font-semibold">Người làm đơn</h2>
                    </div>
                    <p className="ml-6">- Tôi tên là: {studentInfo.parents[0].userName} </p>
                    <p className="ml-6">- Phụ huynh của em: {selectedLeaveRequest.student_name}</p>
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
