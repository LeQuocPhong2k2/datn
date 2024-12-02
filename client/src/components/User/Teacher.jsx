/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// gen ui thêm học sinh
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toaster, toast } from 'react-hot-toast';
import { changePassword } from '../../api/Accounts';
import { createAttendance, getAttendanceByClassAndDateNow } from '../../api/Attendance';
import { getStudentListByClassNameAndAcademicYear } from '../../api/Class';
import { getLeaveRequestsByTeacherId, updateLeaveRequest } from '../../api/LeaveRequest';
import { getGiaoVienByPhoneNumber } from '../../api/Teacher';
import Schedule from './Schedule';

export default function Teacher() {
  useEffect(() => {
    document.title = 'Trang chủ giáo viên';
  }, []);
  const phoneNumber = sessionStorage.getItem('phoneNumberTeacher');
  const [teacherInfo, setTeacherInfo] = useState({});
  /// lấy thông tin giáo viên
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await getGiaoVienByPhoneNumber(phoneNumber);
        setTeacherInfo(response);
        console.log('Thông tin giáo viên:', response);
      } catch (error) {
        console.error('Lỗi lấy thông tin giáo viên:', error);
      }
    };
    fetchTeacherInfo();
  }, [phoneNumber]);

  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
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
      changePassword(teacherInfo.phoneNumber, oldPassword, newPassword)
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

  const [showAllMenu, setShowAllMenu] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showTimeTable, setShowTimeTable] = useState(true);
  // 1 state hiển thị thông báo notice ở màn hình chính
  const [showNotice, setShowNotice] = useState(true);
  const [showLessonHome, setShowLessonHome] = useState(true);
  // 1 state quản lý body của TeacherProfile
  const [showTeacherProfile, setShowTeacherProfile] = useState(false);

  // biến quản lý thông tin quản lý đơn nghĩ học của giáo viên
  const [showTeacherLeaveRequests, setShowTeacherLeaveRequests] = useState(true);

  // data mẫu đơn nghĩ học
  const [leaveRequests, setLeaveRequests] = useState([]);

  // gọi tới getLeaveRequestsByTeacherId xong to biến leaveRequests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!teacherInfo._id) return;

      try {
        const response = await getLeaveRequestsByTeacherId(teacherInfo._id);
        setLeaveRequests(response.data);
        console.log('Danh sách đơn nghỉ học:', response.data);
      } catch (error) {
        console.error('Lỗi lấy danh sách đơn nghỉ học:', error);
      }
    };
    fetchLeaveRequests();
  }, [teacherInfo._id, activeTab]);

  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  // mõi khi selectedLeaveRequest có sự thay đổi thì log ra xem có gì thay đổi không
  useEffect(() => {
    console.log('Đơn nghỉ học được chọn:', selectedLeaveRequest);
  }, [selectedLeaveRequest]);

  // biến quản lý khi bấm vào xem chi tiết đơn nghỉ học
  const [showFullInfoLeaveRequestSent, setShowFullInfoLeaveRequestSent] = useState(false);
  // biếN quản lý trạng thái đơn nghĩ học tất cả , đã duyệt, chờ duyệt,
  const [filterStatus, setFilterStatus] = useState('all');
  // biến lọc dữ liệu filterStatus
  const filteredRequests = leaveRequests.filter((request) =>
    filterStatus === 'all' ? true : request.status === filterStatus
  );
  // handle xử lý chấp thuận , từ chối đơn nghỉ học
  const handleUpdateLeaveRequest = async (leaveRequest_id, status) => {
    // alert ra leaveRequest_id và status

    try {
      const response = await updateLeaveRequest(leaveRequest_id, status);
      console.log('Cập nhật đơn nghỉ học:', response);
      // cập nhật lại danh sách đơn nghỉ học
      const updatedLeaveRequests = leaveRequests.map((request) =>
        request._id === leaveRequest_id ? { ...request, status } : request
      );
      setLeaveRequests(updatedLeaveRequests);
      toast.success('Cập nhật đơn nghỉ học thành công');
      setShowFullInfoLeaveRequestSent(false);
      setShowTeacherLeaveRequests(true);
      // chuyển qua tab đã duyệt
      if (status === 'approved') {
        setFilterStatus('approved');
      } else if (status === 'rejected') {
        setFilterStatus('rejected');
      }
    } catch (error) {
      console.error('Lỗi cập nhật đơn nghỉ học:', error);
      toast.error('Có lỗi xảy ra khi cập nhật đơn nghỉ học');
    }
  };
  // hàm xử lý khi mà bấm vào chấp thuận đơn nghỉ học thì gọi hàm createAttendanceByLeaveRequest
  const createAttendanceByLeaveRequest = async (leaveRequest, status) => {
    try {
      // Lặp qua từng phiên (session) trong đơn xin nghỉ
      for (const session of leaveRequest.sessions) {
        // Chuyển đổi ngày từ MongoDB ObjectId date sang định dạng Date thông thường
        // Sử dụng cách khác để parse ngày
        const sessionDate = session.date instanceof Date ? session.date : new Date(session.date.$date || session.date);
        // console.log lúc đầu để kiểm tra xem sessionDate ra giá trị nào
        console.log('sessionDate:', sessionDate);

        // Kiểm tra xem ngày có hợp lệ không
        if (isNaN(sessionDate.getTime())) {
          console.error('Invalid date:', session.date);
          continue; // Bỏ qua session không hợp lệ
        }

        // Tạo attendanceRecords cho từng học sinh trong session
        const attendanceRecords = [
          {
            student_id: leaveRequest.student_id,
            status: status === 'approved' ? 'VCP' : 'VKP', // VCP: Vắng có phép, VKP: Vắng không phép
            reason: status === 'approved' ? 'Học sinh vắng có phép' : 'Học sinh vắng không phép',
            leaveRequest_id: leaveRequest._id,
          },
        ];

        sessionDate.setHours(sessionDate.getHours() + 7);

        // Gọi hàm createAttendance cho từng ngày
        await createAttendance(leaveRequest.class_id, leaveRequest.teacher_id, sessionDate, attendanceRecords);
        // console.log thông báo đã tạo thành công từ ngày sessionDate
        console.log(`Đã tạo điểm danh từ ngày ${sessionDate}`);
      }

      toast.success('Đã tạo điểm danh từ đơn nghỉ học cho các ngày được chọn');
    } catch (error) {
      console.error('Lỗi cập nhật đơn nghỉ học:', error);
      toast.error('Có lỗi xảy ra khi cập nhật đơn nghỉ học');
    }
  };

  const [showContent, setShowContent] = useState(false);
  const [showContent1, setShowContent1] = useState(false);
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
  const senderName = 'Admin01';
  const createdAt = '2024-09-07T00:00:00.000Z'; // Thay thế bằng thời gian gửi thực tế
  const createdAt1 = '2023-12-24T00:00:00.000Z'; // Thay thế bằng thời gian gửi thực tế

  // phần sự kiệN cho nhập điểm học sinh\
  const [grade, setGrade] = useState(1); // Default grade is 1
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');

  // phần sự kiện dành cho chỗ điểm danh

  const [selectedClass, setSelectedClass] = useState('1A1');
  // biến lưu trữ selectedClass_id
  const [selectedClass_id, setSelectedClass_id] = useState('');
  //const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceDate, setAttendanceDate] = useState(new Date()); // Biến mới để lưu trữ ngày điểm danh

  const [recentDays, setRecentDays] = useState([]);

  const calculateRecentDays = (baseDate, isMobile) => {
    const currentDate = new Date(baseDate);
    console.log('currentDate:', currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(firstDayOfMonth);
      date.setDate(i + 1);
      return date;
    });
  };

  useEffect(() => {
    setRecentDays(calculateRecentDays(attendanceDate)); // Cập nhật recentDays dựa trên kích thước màn hình
    handleResetAttendance();
  }, [attendanceDate]);
  //console.log('recentDays:', recentDays);

  // useEffect kiểm tra xem có selectedClass chưa nếu có thì gọi sự kiện handleSelectClass
  useEffect(() => {
    if (selectedClass === '1A1') {
      handleSelectClass(selectedClass);
    }
  }, [selectedClass]);

  const [attendanceData, setAttendanceData] = useState({});

  const handleAttendanceSelectChange = (studentId, date, value) => {
    // Cập nhật lại attendanceData
    const newAttendanceData = { ...attendanceData };
    const formattedDate = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
    if (!newAttendanceData[studentId]) {
      newAttendanceData[studentId] = {};
    }
    newAttendanceData[studentId][formattedDate] = value;

    // Cập nhật lại state với dữ liệu mới
    setAttendanceData(newAttendanceData);

    // Nếu cần thì gọi handleAttendanceChange để lưu lại thay đổi (nếu có)
    handleAttendanceChange(studentId, date, value);
  };
  // useEffect để log ra attendanceData
  useEffect(() => {
    console.log('attendanceData đang có là:', attendanceData);
  }, [attendanceData]);

  // sự kiện hiển thị danh sách học sinh theo lớp học
  const [showStudentList, setShowStudentList] = useState(false);

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [studentList, setStudentList] = useState([]);

  const handleSelectClass = async (selectedClass) => {
    try {
      const response = await getStudentListByClassNameAndAcademicYear(selectedClass, selectedAcademicYear);

      if (response.data.length === 0) {
        // Nếu không có học sinh, cập nhật trạng thái để hiển thị thông báo
        setStudentList([]);
        setShowStudentList(true);
        console.log(`Không có học sinh trong lớp ${selectedClass}`);
      } else {
        setStudentList(response.data.students); //
        setSelectedClass_id(response.data.class_id);
        console.log(`Danh sách học sinh lớp ${selectedClass} :`, response.data.students); // Cập nhật log để hiển thị danh sách học sinh
        setShowStudentList(true);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách học sinh:', error);
      setStudentList([]); // Đặt danh sách học sinh thành rỗng
      setShowStudentList(false); // Ẩn danh sách học sinh
    }
  };

  const handleUpdateAttendance = async () => {
    const attendanceRecordsByDate = {}; // Mảng để lưu trữ thông tin điểm danh theo ngày

    // Nhóm các bản ghi theo ngày
    Object.entries(attendanceData).forEach(([studentId, dates]) => {
      Object.entries(dates).forEach(([date, status]) => {
        const dateISO = new Date(date).toISOString(); // Chuyển đổi ngày sang định dạng ISO
        console.log('dateISO được chuyển đổi là:', dateISO);

        // Nếu chưa có ngày này trong attendanceRecordsByDate, khởi tạo mảng
        if (!attendanceRecordsByDate[dateISO]) {
          attendanceRecordsByDate[dateISO] = [];
        }

        // Thêm bản ghi vào mảng tương ứng với ngày
        attendanceRecordsByDate[dateISO].push({
          student_id: studentId,
          student_name: studentList.find((student) => student._id === studentId)?.userName, // Tìm tên học sinh
          status: status,
          reason:
            status === 'CM'
              ? 'Học sinh có mặt'
              : status === 'VCP'
                ? 'Học sinh vắng có phép'
                : 'Học sinh vắng không phép',
        });
      });
    });

    // Gọi hàm createAttendance cho từng ngày
    for (const [dateISO, records] of Object.entries(attendanceRecordsByDate)) {
      if (records.length > 0) {
        try {
          await createAttendance(selectedClass_id, teacherInfo._id, dateISO, records); // Gọi hàm tạo điểm danh
          toast.success(`Điểm danh thành công cho ngày ${new Date(dateISO).toLocaleDateString('vi-VN')}`);
          handleResetAttendance(); // Reset lại các thuộc tính điểm danh
          // gọi lại handleAttendanceChange để cập nhật lại trạng thái điểm danh
          Object.entries(attendanceData).forEach(([studentId, dates]) => {
            Object.entries(dates).forEach(([date, status]) => {
              handleAttendanceChange(studentId, new Date(date), status);
            });
          });
        } catch (error) {
          console.error('Lỗi khi tạo điểm danh:', error);
          if (error.response) {
            toast.error(error.response.data.error);
          }
        }
      }
    }
  };

  // resset checkbox diểm danh đã chọn
  const handleResetAttendance = () => {
    setAttendanceData([]);
  };

  // Phần code điểm danh 2.0

  // Hàm xử lý thay đổi điểm danh
  const handleAttendanceChange = (studentId, date, status) => {
    const vietnamDate = new Date(date);
    vietnamDate.setHours(vietnamDate.getHours() + 7); // Điều chỉnh cho múi giờ Việt Nam
    const dateKey = vietnamDate.toISOString().split('T')[0]; // Lấy khóa ngày, chỉ lấy phần ngày

    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };

      // Kiểm tra xem học sinh đã có trong attendanceData chưa
      if (!updatedData[studentId]) {
        updatedData[studentId] = {}; // Nếu chưa có, khởi tạo đối tượng cho học sinh
      }

      // Cập nhật giá trị cho ngày tương ứng
      if (status) {
        updatedData[studentId][dateKey] = status; // Cập nhật hoặc thêm mới
      } else {
        delete updatedData[studentId][dateKey]; // Xóa nếu không có trạng thái
        // Nếu không còn mục nào, xóa học sinh khỏi attendanceData
        if (Object.keys(updatedData[studentId]).length === 0) {
          delete updatedData[studentId];
        }
      }

      return updatedData;
    });
  };
  // chỗ code mà xử lý có mặt cho tát cả trong phần điểm danh
  const selectedDate = new Date(attendanceDate);
  const vietnamDate = new Date(selectedDate);
  // vietnamDate.setHours(vietnamDate.getHours() + 7); bỏ để lấy đúng ngày được pick
  const formattedDate = vietnamDate.toISOString().split('T')[0]; // Chỉ lấy phần ngày

  const handleCoMatChoTatCa = () => {
    const dayOfWeek = vietnamDate.getDay(); // Lấy ngày trong tuần

    // kiểm tra n���u không phải ngày hiện tại thì không cho điểm danh
    if (vietnamDate.toDateString() !== new Date().toDateString()) {
      toast.error('Không thể chọn ngày không phải hôm nay.');
      return;
    }

    if (dayOfWeek !== 6 && dayOfWeek !== 0) {
      console.log('Ngày hiện tại:', formattedDate);
      // Kiểm tra xem tất cả học sinh đã có mặt hay chưa
      const allChecked = studentList.every((student) => attendanceData[student._id]?.[formattedDate] === 'CM');
      // const allChecked = studentList.every((student) => attendanceData[student._id] === 'CM');

      if (allChecked) {
        // Nếu tất cả học sinh đã có mặt, reset attendance
        handleResetAttendance();
      } else {
        // Lặp qua tất cả học sinh và cập nhật trạng thái
        studentList.forEach((student) => {
          handleAttendanceChange(student._id, vietnamDate, 'CM'); // Cập nhật điểm danh cho tất cả học sinh
        });
      }
    } else {
      alert('Không thể chọn ngày thứ Bảy hoặc Chủ Nhật.');
    }
  };

  // chỗ code để hiện VCP , VKP , CM cho tất cả học sinh cho đến ngày hiện tại từ API getAttendanceByClassAndDateNow

  const [dataDiemDanh, setdataDiemDanh] = useState([]);
  const [tongSoNgayDiemDanh, setTongSoNgayDiemDanh] = useState(0);
  // lưu studentAttendanceStats để get tổng số ngày CM, VCP, VKP cho từng học sinh
  const [studentAttendanceStats, setStudentAttendanceStats] = useState({});
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await getAttendanceByClassAndDateNow(selectedClass_id);
        setdataDiemDanh(response.data.dataDiemDanh);
        // console.log('data điểm danh:', response.data.dataDiemDanh);
        setTongSoNgayDiemDanh(response.data.tongSoNgayDiemDanh);
        // console.log('Tổng số ngày điểm danh:', response.data.tongSoNgayDiemDanh);
        setStudentAttendanceStats(response.data.studentAttendanceStats);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu điểm danh:', error);
      }
    };
    fetchAttendanceData();
  }, [selectedClass_id, attendanceData]);

  // Tạo một đối tượng ánh xạ (attendanceMap) để dễ dàng truy xuất trạng thái điểm danh theo student_id và ngày.
  const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {
    const map = {};
    dataDiemDanh.forEach((attendanceRecord) => {
      const date = attendanceRecord.date.split('T')[0]; // Lấy ngày (yyyy-mm-dd)
      attendanceRecord.attendanceRecords.forEach((record) => {
        if (!map[record.student_id]) {
          map[record.student_id] = {};
        }
        map[record.student_id][date] = record.status; // Lưu trạng thái theo ngày
      });
    });
    setAttendanceMap(map); // Lưu vào state
  }, [dataDiemDanh]);
  // khi attendanceMap thay đổi thì log ra xem có gì thay đổi không
  useEffect(() => {
    console.log('studentAttendanceStats:', studentAttendanceStats);
  }, [studentAttendanceStats]);

  const [key, setKey] = useState(0);

  return (
    <div className="h-screen max-w-[100%] font-sans bg-gray-100">
      <header className="grid grid-flow-col items-center bg-white border-b border-gray-300 ">
        <Toaster toastOptions={{ duration: 2200 }} />
        <div className="">
          <a href="/teacher">
            <img
              src="https://i.imgur.com/jRMcFwo_d.png?maxwidth=520&shape=thumb&fidelity=high"
              alt="SMAS Logo"
              className="h-14 p-2"
            />
          </a>
        </div>
        <div className="flex items-center justify-end px-4">
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
                  // setShowStudentProfile(true);
                  setShowTeacherProfile(true);
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
                {teacherInfo.userName}
              </a>
              {showProfile && (
                <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg" style={{ left: '-10px' }}>
                  <a
                    href="#"
                    onClick={() => {
                      // setShowStudentProfile(true);
                      setShowTeacherProfile(true);
                      setActiveTab('profile');
                      setShowAllMenu(false);

                      // setShowProfile(false);
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </a>
                  <a
                    href="#"
                    onClick={() => {
                      setShowChangePassword(true);
                      // setShowProfile(false);
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
                // setShowStudentProfile(true);
                setShowTeacherProfile(true);
                setMenuOpen(false);
                // setShowAllMenu(false);
                setShowProfile(false);
              }}
            >
              <i className="fas fa-user mr-2" style={{ color: '#429AB8' }}></i>Thông Tin Cá Nhân
            </span>
            <span
              className="flex items-center"
              onClick={() => {
                // setShowChangePassword(true);
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
                    'https://cdn-icons-png.flaticon.com/512/4537/4537074.png'
                    // studentInfo.gender === 'Nam'
                    //   ? 'https://cdn-icons-png.flaticon.com/512/4537/4537074.png'
                    //   : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfjUNC6tqBRQQZonwx0-vsJuTeDLetRoi-fp5Yee6shI1zXVumCeuE4mKye97fxwLgrj0&usqp=CAU'
                  }
                  alt="Student Profile"
                  className="rounded-full w-24 h-24 mx-auto"
                />

                <div className="mt-4">
                  <div className="font-bold">{teacherInfo.userName}</div>

                  <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 break-words md:flex-wrap">
                    <div className="text-gray-600">
                      Lớp Chủ Nhiệm:{' '}
                      <b>
                        {teacherInfo.lopChuNhiem && teacherInfo.lopChuNhiem.length > 0
                          ? teacherInfo.lopChuNhiem[0].className
                          : 'Chưa có lớp chủ nhiệm'}
                      </b>
                    </div>

                    <div className="text-gray-600">
                      Năm học :
                      <b>
                        {/* {studentInfo.studentCode} */}
                        {teacherInfo.lopChuNhiem && teacherInfo.lopChuNhiem.length > 0
                          ? teacherInfo.lopChuNhiem[0].academicYear
                          : 'Chưa có năm học'}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="w-1/2 text-center items-center"> */}
              <div className="w-full md:w-1/2 text-center items-center">
                <a
                  href="#"
                  onClick={() => {
                    setShowTeacherProfile(true);
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  {' '}
                  {/* Thay đổi href thành "#" và thêm onClick */}
                  <i className="fas fa-file-alt mr-2" style={{ color: '#ffb448' }}></i>
                  <div className="text-gray-600">Hồ Sơ Giáo Viên</div>
                </a>
                <a
                  onClick={() => {
                    // setShowStudentProfile(true);
                    setShowTeacherProfile(true);
                    setActiveTab('academic');
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-book mr-2" style={{ color: '#545885' }}></i>
                  <div className="text-gray-600">Nhập điểm học sinh</div>
                </a>
                <a
                  href="#"
                  onClick={() => {
                    // setShowStudentProfile(true);
                    setShowTeacherProfile(true);
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
                    // setShowStudentProfile(true);
                    setShowTeacherProfile(true);
                    setActiveTab('leaveRequest');
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-file-alt mr-2" style={{ color: '#f8c9be' }}></i>
                  <div className="text-gray-600">Đơn Xin Nghĩ Học </div>
                </a>

                <a
                  href="#"
                  onClick={() => {
                    // setShowStudentProfile(true);
                    setShowTeacherProfile(true);
                    setActiveTab('attendance');
                    setShowAllMenu(false);
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => e.currentTarget.querySelector('div').classList.add('font-bold')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('div').classList.remove('font-bold')}
                >
                  <i className="fas fa-clipboard-list mr-2" style={{ color: '#e0e4f6' }}></i>
                  <div className="text-gray-600">Điểm Danh </div>
                </a>
                {/* Thêm thông tin quá trình học tập ở đây */}
              </div>
            </div>
            <div className="mt-6"></div>
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2" style={{ color: '#0B6FA1' }}>
                <i className="fas fa-chalkboard-teacher mr-2" style={{ color: '#0B6FA1' }}></i>
                Danh Sách Các Lớp Giảng Dạy
              </h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#429AB8] text-white">
                    <th className="border p-2">Lớp</th>
                    <th className="border p-2">Môn Học</th>
                    <th className="border p-2">Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Lớp 1A2</td>
                    <td className="border p-2">Toán</td>
                    <td className="border p-2">Thứ Hai, 08:00 - 09:30</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Lớp 4B</td>
                    <td className="border p-2">Tiếng Việt</td>
                    <td className="border p-2">Thứ Ba, 10:00 - 11:30</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Lớp 5C</td>
                    <td className="border p-2">Khoa Học</td>
                    <td className="border p-2">Thứ Tư, 13:00 - 14:30</td>
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

              {showTimeTable && (
                <Schedule
                //  className={studentInfo.className}
                //  schoolYear={studentInfo.academicYear}
                />
              )}
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
                      Trường tiểu học Nguyễn Bỉnh Khiêm ngày mai 11/10 kính mời PHHS tới lớp 1A2 họp phụ huynh học sinh
                    </span>
                  </div>
                  <span>
                    <a
                      href="#"
                      onClick={() => {
                        // setShowStudentProfile(true);
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
                        // setShowStudentProfile(true);
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
      {showTeacherProfile && ( // phần dưới body
        <div
          className={`w-[90%] mx-auto overflow-y-scroll overflow-x-hidden max-h-[92%] bg-white p-6 rounded shadow ${window.innerWidth > 768 ? 'mt-4' : 'mt-0'}`}
        >
          <div className="flex space-x-2 mb-4 md:space-x-4 justify-center ">
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

            <div
              className={`tab ${activeTab === 'attendance' ? 'active' : ''} ${window.innerWidth <= 768 ? 'text-sm p-2' : ' p-3'}`}
              onClick={() => setActiveTab('attendance')}
              style={{
                backgroundColor: activeTab === 'attendance' ? '#0B6FA1' : '#929498',
                borderRadius: '5%',
                padding: '10px',
                color: 'white',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B6FA1')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = activeTab === 'attendance' ? '#0B6FA1' : '#929498')
              }
            >
              Điểm Danh
            </div>
          </div>

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
                        'https://cdn-icons-png.flaticon.com/512/4537/4537074.png'
                        // studentInfo.gender === 'Nam'
                        //   ? 'https://cdn-icons-png.flaticon.com/512/4537/4537074.png'
                        //   : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfjUNC6tqBRQQZonwx0-vsJuTeDLetRoi-fp5Yee6shI1zXVumCeuE4mKye97fxwLgrj0&usqp=CAU'
                      }
                      alt="Student Profile"
                      className="rounded-full mx-auto"
                      style={{ width: '200px', height: '200px' }}
                    />

                    <p className="font-bold" style={{ color: '#0B6FA1' }}>
                      {teacherInfo.userName}
                    </p>
                    {/* <p style={{ color: '#0B6FA1' }}> Năm học :{studentInfo.academicYear}</p> */}
                  </div>
                  <div className="w-2/3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Họ tên: </strong>
                        {teacherInfo.userName}
                      </div>
                      <div>
                        <strong>Giới tính:</strong>
                        {teacherInfo.gender}
                      </div>
                      <div>
                        <strong>SĐT: </strong>
                        {teacherInfo.phoneNumber}
                      </div>
                      <div>
                        <strong>Trình độ: </strong>
                        {teacherInfo.levelOfExpertise}
                      </div>

                      <div>
                        <strong>Địa chỉ: </strong>
                        {teacherInfo.address}
                      </div>
                      <div>
                        <strong>Ngày bắt đầu công tác :</strong>{' '}
                        {new Date(teacherInfo.dateOfEnrollment).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </div>

                      <div>
                        <strong>Môn giảng dạy: </strong>
                        {teacherInfo.department}
                      </div>
                      <div>
                        <strong>Lớp Chủ Nhiệm:</strong>
                        {teacherInfo.lopChuNhiem && teacherInfo.lopChuNhiem.length > 0
                          ? teacherInfo.lopChuNhiem[0].className
                          : 'Chưa có lớp chủ nhiệm'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'academic' && (
            <div className="w-[80%] mx-auto bg-white p-6 rounded shadow mt-4">
              <h2 className="text-xl font-bold mb-4 text-center">Nhập Điểm Cho Học Sinh Tiểu Học</h2>

              {/* Form nhập khối, lớp, môn học, học kỳ */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2">Khối</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                  >
                    <option value={1}>Khối 1</option>
                    <option value={2}>Khối 2</option>
                    <option value={3}>Khối 3</option>
                    <option value={4}>Khối 4</option>
                    <option value={5}>Khối 5</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Lớp</label>
                  <select className="w-full p-2 border rounded" style={{ zIndex: 10 }}>
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((grade) =>
                      Array.from({ length: 5 }, (_, j) => `A${j + 1}`).map((className) => (
                        <option key={`${grade}${className}`} value={`${grade}${className}`}>
                          {`${grade}${className}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Môn học</label>
                  <select className="w-full p-2 border rounded">
                    <option>Tiếng Việt</option>
                    <option>Toán</option>
                    <option>Ngoại ngữ 1</option>
                    <option>Đạo đức</option>
                    <option>TN-XH</option>
                    <option>Âm Nhạc</option>
                    <option>Mĩ Thuật</option>
                    <option>Tin học</option>
                    <option>Giáo dục thể chất</option>
                    <option>Hoạt động trải nghiệm</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Học kỳ</label>
                  <div className="flex items-center space-x-4">
                    <select className="w-full p-2 border rounded">
                      <option>Học kỳ 1</option>
                      <option>Học kỳ 2</option>
                    </select>
                    <select className="w-full p-2 border rounded">
                      <option>Giữa kỳ</option>
                      <option>Cuối kỳ</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Nhập điểm từ file Excel</label>
                  <input type="file" className="w-full p-2 border rounded" />
                </div>
              </div>

              {/* Table nhập điểm */}
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">STT</th>
                      <th className="border px-4 py-2">Họ và Tên</th>
                      <th className="border px-4 py-2">Ngày Sinh</th>
                      <th className="border px-4 py-2">Nhận Xét Giữa Kỳ</th>
                      <th className="border px-4 py-2">Nhận Xét Cuối Kỳ</th>
                      {/* Dựa trên lựa chọn học kỳ và khối để hiển thị thêm cột */}
                      {selectedSemester === 'Cuối kỳ' && grade > 3 && (
                        <>
                          <th className="border px-4 py-2">Kiểm Tra Cuối Kỳ</th>
                          <th className="border px-4 py-2">Xếp Loại Cuối Kỳ</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Đây là ví dụ về một hàng điểm, bạn cần thêm logic để render nhiều học sinh */}
                    <tr>
                      <td className="border px-4 py-2">1</td>
                      <td className="border px-4 py-2">Nguyễn Văn A</td>
                      <td className="border px-4 py-2">01/01/2015</td>
                      <td className="border px-4 py-2">
                        <select className="w-full p-2 border rounded">
                          <option>Hoàn thành tốt</option>
                          <option>Hoàn thành</option>
                          <option>Chưa hoàn thành</option>
                        </select>
                      </td>
                      <td className="border px-4 py-2">
                        <select className="w-full p-2 border rounded">
                          <option>Hoàn thành tốt</option>
                          <option>Hoàn thành</option>
                          <option>Chưa hoàn thành</option>
                        </select>
                      </td>
                      {/* Thêm ô kiểm tra nếu là cuối kỳ */}
                      {selectedSemester === 'Cuối kỳ' && grade > 3 && (
                        <>
                          <td className="border px-4 py-2">
                            <input type="number" className="w-full p-2 border rounded" placeholder="Điểm" />
                          </td>
                          <td className="border px-4 py-2">
                            <select className="w-full p-2 border rounded">
                              <option>Hoàn thành tốt</option>
                              <option>Hoàn thành</option>
                              <option>Chưa hoàn thành</option>
                            </select>
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
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
              {/* phần button chuyển trang */}
              <div className="flex space-x-4 mb-4 justify-center">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setFilterStatus('all');
                    setShowTeacherLeaveRequests(true);
                    setShowFullInfoLeaveRequestSent(false);
                  }}
                >
                  Tất cả
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setFilterStatus('approved');
                    setShowFullInfoLeaveRequestSent(false);
                    setShowTeacherLeaveRequests(true);
                  }}
                >
                  Đã duyệt
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setFilterStatus('pending');
                    setShowFullInfoLeaveRequestSent(false);
                    setShowTeacherLeaveRequests(true);
                  }}
                >
                  Chờ duyệt
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setFilterStatus('rejected');
                    setShowFullInfoLeaveRequestSent(false);
                    setShowTeacherLeaveRequests(true);
                  }}
                >
                  Từ chối
                </button>
              </div>

              {/* Hiển thị các đơn xin nghỉ học */}
              <div className="bg-gray-100 p-4 rounded-md border shadow-sm">
                {filteredRequests.length === 0 ? (
                  <p className="text-center text-gray-600">Hiện không có đơn xin nghỉ học nào.</p>
                ) : (
                  filteredRequests
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sắp xếp theo created_at giảm dần
                    .map((request) => (
                      <div key={request._id} className="p-1 ">
                        {showTeacherLeaveRequests && (
                          <div className="max-w-4xl mx-auto bg-white border shadow-md rounded-lg p-6">
                            {/* Nội dung sơ lược */}
                            <h3 className="text-center text-xl font-bold mb-4">Đơn xin nghỉ học</h3>

                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-gray-700">Từ ngày:</span>{' '}
                                {new Date(request.start_date).toLocaleDateString()}
                                <span className="ml-4 font-semibold text-gray-700">Đến ngày:</span>{' '}
                                {new Date(request.end_date).toLocaleDateString()}
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
                                  style={{ minWidth: '80px' }}
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
                              <span className="font-semibold text-gray-700">Học sinh xin nghĩ:</span>{' '}
                              <b className="text-green-600">{request.student_name}</b>
                            </div>

                            <div className="mt-2">
                              <p>
                                <span className="font-semibold text-gray-700">Lý do :</span> {request.reason}
                              </p>
                              <div className="mt-2">
                                <span className="font-semibold text-gray-700">Danh sách buổi nghỉ:</span>
                                <ul className="list-disc list-inside ml-4">
                                  {request.sessions.map((session) => (
                                    <li key={session._id}>
                                      {new Date(session.date).toLocaleDateString('en-GB')}: {session.morning && 'Sáng'}{' '}
                                      {session.afternoon && 'Chiều'}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                  setSelectedLeaveRequest(request);
                                  setShowFullInfoLeaveRequestSent(true);
                                  setShowTeacherLeaveRequests(false);
                                }}
                              >
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Hiển thị nội dung chi tiết khi showFullInfoLeaveRequestSent là true */}
                        {showFullInfoLeaveRequestSent &&
                          selectedLeaveRequest &&
                          selectedLeaveRequest._id === request._id && (
                            <div
                              key={request._id + 'detail'}
                              className="max-w-md mx-auto border bg-white shadow-md rounded-lg p-4 mt-6"
                            >
                              <div className="flex items-center mb-4 justify-between">
                                <button
                                  onClick={() => {
                                    setShowFullInfoLeaveRequestSent(false);
                                    setShowTeacherLeaveRequests(true);
                                  }}
                                  className="mr-2"
                                >
                                  <i className="fas fa-arrow-left text-blue-500"></i>
                                </button>
                                <h1 className="text-center text-blue-600 text-xl font-bold mx-auto">
                                  ĐƠN XIN PHÉP NGHỈ HỌC
                                </h1>
                              </div>
                              {/*
                              <div className="mb-4">
                                <h2 className="text-lg font-semibold">Người làm đơn</h2>
                                <p>Tên phụ huynh: Nguyễn Văn B</p>
                                <p>Phụ huynh của học sinh: Nguyễn Ánh Ngọc</p>
                                <p>Lớp: 1A3</p>
                              </div> */}
                              <div className="mb-4">
                                <h2 className="text-lg font-semibold">Người làm đơn</h2>
                                <p>Tên phụ huynh: {selectedLeaveRequest?.parent_name || 'Chưa có thông tin'}</p>

                                <p>
                                  Phụ huynh của học sinh:
                                  {selectedLeaveRequest?.student_name || 'Chưa có thông tin'}
                                </p>

                                <p>Lớp: {selectedLeaveRequest?.class_name || 'Chưa có thông tin'}</p>
                              </div>

                              <div className="mb-4">
                                <h2 className="text-lg font-semibold">Thời gian nghỉ</h2>
                                <ul className="list-disc list-inside">
                                  {selectedLeaveRequest.sessions.map((session) => (
                                    <li key={session._id}>
                                      {new Date(session.date).toLocaleDateString('en-GB')}: {session.morning && 'Sáng'}{' '}
                                      {session.afternoon && 'Chiều'}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mb-4">
                                <h2 className="text-lg font-semibold">Lý do :</h2>
                                <p>{selectedLeaveRequest.reason}</p>
                              </div>

                              <div className="flex justify-end space-x-2 mt-4">
                                {selectedLeaveRequest.status === 'pending' ? (
                                  <>
                                    <button
                                      className="bg-green-500 text-white px-4 py-2 rounded"
                                      onClick={() => {
                                        handleUpdateLeaveRequest(selectedLeaveRequest._id, 'approved');
                                        // khi mà có đƠn xin nghĩ học thì gọi lại sự kiện createAttendance dể cập cập nhật danh sách điểm danh bạn đó
                                        createAttendanceByLeaveRequest(selectedLeaveRequest, 'approved');
                                      }}
                                    >
                                      Đồng ý
                                    </button>
                                    <button
                                      className="bg-red-500 text-white px-4 py-2 rounded"
                                      onClick={() => {
                                        handleUpdateLeaveRequest(selectedLeaveRequest._id, 'rejected');
                                        createAttendanceByLeaveRequest(selectedLeaveRequest, 'approved');
                                      }}
                                    >
                                      Từ chối
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setShowFullInfoLeaveRequestSent(false);
                                      setShowTeacherLeaveRequests(true);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                  >
                                    Trở về
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* // sự kiệN tab điểm danh */}
          {activeTab === 'attendance' && (
            <div className="container mx-auto mt-4 p-4 overflow-x-auto">
              <h1 className="text-center text-xl font-bold">BẢNG ĐIỂM DANH LỚP {selectedClass}</h1>
              <p className="text-center mb-4">
                <span className="text-blue-700">Có Mặt (CM)</span>,{' '}
                <span className="text-green-700"> Vắng có phép (VCP)</span>,{' '}
                <span className="text-red-700">Vắng không phép(VKP)</span>,{' '}
                <span className="text-yellow-700">Màu vàng nhạt: Thứ bảy</span>,{' '}
                <span className="text-green-700">Màu xanh nhạt: Chủ Nhật</span>
              </p>
              <div className="flex flex-col md:flex-row justify-center p-4 space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center">
                  <label className="mr-2">Lớp:</label>
                  <select
                    className="border border-gray-300 p-1 rounded"
                    value={selectedClass}
                    onChange={(e) => {
                      const newClass = e.target.value; // Lưu giá trị mới vào biến
                      setSelectedClass(newClass); // Cập nhật selectedClass
                      handleSelectClass(newClass); // Gọi hàm với giá trị mới
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) =>
                      Array.from({ length: 5 }, (_, j) => `A${j + 1}`).map((className) => (
                        <option key={`${i}${className}`} value={`${i + 1}${className}`}>
                          {`${i + 1}${className}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="mr-2">Ngày:</label>
                  <DatePicker
                    selected={attendanceDate} // Sử dụng attendanceDate
                    onChange={(date) => setAttendanceDate(date)} // Cập nhật attendanceDate
                    dateFormat="dd/MM/yyyy"
                    className="border border-gray-300 p-1 rounded w-full"
                    placeholderText="DD/MM/YYYY"
                  />
                </div>

                <div className="flex items-center">
                  <button
                    onClick={handleCoMatChoTatCa}
                    className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-white ${
                      studentList.every((student) => attendanceData[student._id]?.[formattedDate] === 'CM')
                        ? 'bg-green-500 hover:bg-green-700'
                        : 'bg-blue-500 hover:bg-blue-700'
                    }`}
                  >
                    {studentList.every((student) => attendanceData[student._id]?.[formattedDate] === 'CM')
                      ? 'Bỏ chọn tất cả'
                      : 'Có mặt cho tất cả'}
                  </button>
                </div>
              </div>

              <div className="relative w-full overflow-x-auto">
                <div className="flex items-start">
                  {/* Cột cố định */}
                  <div className="sticky left-0 z-10 bg-white">
                    <table className="table-auto border-collapse border border-gray-400 mt-4">
                      <thead>
                        <tr style={{ backgroundColor: '#e0e0e0' }}>
                          <th className="border border-gray-400 px-2 py-1 sticky top-0 bg-white">STT</th>
                          <th className="border border-gray-400 px-2 py-1 whitespace-nowrap sticky top-0 bg-white">
                            Họ và tên
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentList.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="text-center text-red-500">
                              {/* Không có danh sách học sinh cho lớp {selectedClass}. */}
                              Trống
                            </td>
                          </tr>
                        ) : (
                          studentList.map((student, index) => (
                            <tr key={student._id} className="hover:bg-[#E5E7EB]">
                              <td className="border border-gray-400 px-2 py-1 text-center sticky left-0 bg-white">
                                {index + 1}
                              </td>
                              <td className="border border-gray-400 px-2 py-1 whitespace-nowrap sticky left-[50px] bg-white">
                                {student.userName}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Cột cuộn */}

                  <div className="overflow-x-auto flex-1">
                    <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
                      <thead>
                        <tr>
                          {recentDays.map((day, index) => (
                            <th key={index} className="border border-gray-400 px-2 py-1" style={{ width: '25px' }}>
                              {day.getDate()}
                            </th>
                          ))}
                          <th className="border border-gray-400 px-2 py-1">CM</th>
                          <th className="border border-gray-400 px-2 py-1">CP</th>
                          <th className="border border-gray-400 px-2 py-1">KP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentList.length === 0 ? (
                          <tr>
                            <td colSpan={recentDays.length + 3} className="text-center text-red-500">
                              Không có danh sách học sinh cho lớp {selectedClass}.
                            </td>
                          </tr>
                        ) : (
                          studentList.map((student) => {
                            const studentAttendanceMap = attendanceMap || {};
                            return (
                              <tr key={student._id} className="hover:bg-[#E5E7EB]">
                                {recentDays.map((date, index) => {
                                  const vietnamDate = new Date(date);
                                  vietnamDate.setHours(vietnamDate.getHours() + 7);
                                  const formattedDate = date.toLocaleDateString('en-CA', {
                                    timeZone: 'Asia/Ho_Chi_Minh',
                                  });
                                  const dayOfWeek = vietnamDate.getDay();

                                  const status =
                                    studentAttendanceMap[student._id]?.[formattedDate] ||
                                    attendanceData[student._id]?.[vietnamDate.toISOString().split('T')[0]] ||
                                    '';

                                  // Kiểm tra xem status có phải từ attendanceMap không
                                  const isStatusFromMap = !!studentAttendanceMap[student._id]?.[formattedDate];

                                  return (
                                    <td
                                      key={index}
                                      className={`border border-gray-400 px-2 py-1 text-center ${formattedDate.replace(/\//g, '-')}`}
                                      style={{
                                        backgroundColor: dayOfWeek === 6 ? '#FEF3C7' : dayOfWeek === 0 ? '#ccffcc' : '',
                                      }}
                                    >
                                      {dayOfWeek !== 6 && dayOfWeek !== 0 ? (
                                        isStatusFromMap ? (
                                          // Nếu status từ attendanceMap, hiển thị như text không thể sửa
                                          <span className="text-center block">{status}</span>
                                        ) : (
                                          // Nếu không phải từ attendanceMap, hiển thị dropdown như cũ
                                          <select
                                            value={status}
                                            onChange={(e) =>
                                              handleAttendanceChange(student._id, vietnamDate, e.target.value)
                                            }
                                            className="border-none bg-transparent text-center
                                            "
                                            style={{
                                              width: 'auto',
                                              height: 'auto',
                                              padding: 0,
                                              fontSize: 'inherit',
                                              WebkitAppearance: 'none',
                                              MozAppearance: 'none',
                                              appearance: 'none',
                                              background: 'none',
                                            }}
                                            onFocus={(e) => (e.target.style.minWidth = '40px')}
                                            onBlur={(e) => (e.target.style.minWidth = 'auto')}
                                          >
                                            <option value=""></option>
                                            <option value="CM">CM</option>
                                            <option value="VCP">VCP</option>
                                            <option value="VKP">VKP</option>
                                          </select>
                                        )
                                      ) : null}
                                    </td>
                                  );
                                })}

                                <td className="border border-gray-400 px-2 py-1 text-center">
                                  {studentAttendanceStats[student._id]?.statusCounts.CM || 0}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 text-center">
                                  {studentAttendanceStats[student._id]?.statusCounts.VCP || 0}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 text-center">
                                  {studentAttendanceStats[student._id]?.statusCounts.VKP || 0}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center mt-4 space-x-0 md:space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 md:mb-0"
                  onClick={async () => {
                    handleUpdateAttendance();
                    // thêm thông báo xác nhận cập nhật điểm danh cho ngày hôm đó
                    // const confirm = window.confirm('Bạn có chắc chắn muốn cập nhật điểm danh ?');
                    // if (confirm) {
                    //   await handleUpdateAttendance();
                    // }
                  }}
                >
                  Lưu
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => {
                    handleResetAttendance();
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          {activeTab === 'lesson' && (
            <div>
              <h3>Nội dung cho Bài Học Trên Lớp</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
