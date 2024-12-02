/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import 'flowbite';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Toaster, toast } from 'react-hot-toast';

import Menu from './Menu';

import { createAttendance, getAttendanceByClassAndDateNow } from '../../../api/Attendance';
import { getStudentListByClassNameAndAcademicYear } from '../../../api/Class';
import { getGiaoVienByPhoneNumber } from '../../../api/Teacher';

export default function StudentAttendance() {
  const phoneNumber = sessionStorage.getItem('phoneNumberTeacher');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [studentList, setStudentList] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedClass_id, setSelectedClass_id] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const selectedDate = new Date(attendanceDate);
  const vietnamDate = new Date(selectedDate);
  const formattedDate = vietnamDate.toISOString().split('T')[0];
  const [attendanceData, setAttendanceData] = useState({});
  const [recentDays, setRecentDays] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [studentAttendanceStats, setStudentAttendanceStats] = useState({});
  const [teacherInfo, setTeacherInfo] = useState({});
  const [dataDiemDanh, setdataDiemDanh] = useState([]);
  const [tongSoNgayDiemDanh, setTongSoNgayDiemDanh] = useState(0);

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
  const [selectedClass, setSelectedClass] = useState('');
  // set selected class là teacherInfo.lopChuNhiem[0].className

  useEffect(() => {
    if (teacherInfo.lopChuNhiem) {
      setSelectedClass(teacherInfo.lopChuNhiem[0].className);
      handleSelectClass(teacherInfo.lopChuNhiem[0].className);
    }
  }, [teacherInfo, teacherInfo.lopChuNhiem, setSelectedClass]);

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

  useEffect(() => {
    setRecentDays(calculateRecentDays(attendanceDate)); // Cập nhật recentDays dựa trên kích thước màn hình
    handleResetAttendance();
  }, [attendanceDate]);

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

  const handleCoMatChoTatCa = () => {
    const dayOfWeek = vietnamDate.getDay(); // Lấy ngày trong tuần

    // kiểm tra n���u không phải ngày hiện tại thì không cho điểm danh
    // if (vietnamDate.toDateString() !== new Date().toDateString()) {
    //   toast.error('Không thể chọn ngày không phải hôm nay.');
    //   return;
    // }

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

  const handleResetAttendance = () => {
    setAttendanceData([]);
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

  return (
    <Menu active="student-attendance">
      <Toaster toastOptions={{ duration: 2200 }} />
      <div className="p-4">
        <div className="rounded shadow bg-white ">
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
                <label className="mr-2">
                  Năm học :
                  {teacherInfo.lopChuNhiem?.map((lop) => (
                    <span key={lop._id}>{lop.academicYear}</span>
                  ))}
                </label>

                <label className="mr-2">Lớp :</label>
                {/* <select
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
                </select> */}
                {teacherInfo.lopChuNhiem?.map((lop) => (
                  <span key={lop._id}>{lop.className}</span>
                ))}
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
        </div>
      </div>
    </Menu>
  );
}
