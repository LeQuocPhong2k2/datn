import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Schedule from './Schedule';
import { getGiaoVienByPhoneNumber } from '../../api/Teacher';
import { getLeaveRequestsByTeacherId, updateLeaveRequest } from '../../api/LeaveRequest';
import { changePassword } from '../../api/Accounts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStudentListByClassNameAndAcademicYear } from '../../api/Class';
import { createAttendance } from '../../api/Attendance';
import { getAttendanceByClassAndDateNow } from '../../api/Attendance';

import { IoMdArrowDropdown } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';

import imgLogo from '../../assets/logo_datn_png.png';

import { IoMdArrowDropdown } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';

import imgLogo from '../../assets/logo_datn_png.png';

import InputScore from './InputScore';
import Menu from './Teacher/Menu';

export default function Teacher() {
  /**
   *
   */
  const [isMenuOpen, setMenuOpen] = useState('');
  /**
   *
   */
  useEffect(() => {
    document.title = 'Giáo viên';
  }, []);
  const phoneNumber = localStorage.getItem('phoneNumberTeacher');
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
  }, [teacherInfo._id]);

  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
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

    // kiểm tra nếu không phải ngày hiện tại thì không cho điểm danh
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
  }, [selectedClass_id]);
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

  const [toggleMenu, setToggleMenu] = useState(true);

  return <div className="h-screen max-w-[100%] grid grid-cols-1 font-sans bg-gray-100">{toggleMenu && <Menu />}</div>;
}
