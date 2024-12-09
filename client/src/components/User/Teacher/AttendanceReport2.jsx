/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Alert, Card, Col, Collapse, Row, Select, Statistic, Table, Button, Empty } from 'antd';
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getAttendanceStatsByClassAndMonth } from '../../../api/Attendance';
import { getAttendanceByClassAndDateNow } from '../../../api/Attendance';
import { getGiaoVienByPhoneNumber } from '../../../api/Teacher';
import './AttendanceReport.css'; // Import file CSS
export default function AttendanceReport() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [outerRadius, setOuterRadius] = useState(window.innerWidth < 800 ? 100 : 160);

  const phoneNumber = sessionStorage.getItem('phoneNumberTeacher');
  //  lấy ra class_id từ localStorage
  const class_id = sessionStorage.getItem('class_id');

  const [teacherInfo, setTeacherInfo] = useState({});
  const [dataDiemDanh, setDataDiemDanh] = useState({});
  const [studentAttendanceStats, setStudentAttendanceStats] = useState({});
  const [tongSoNgayDiemDanh, setTongSoNgayDiemDanh] = useState(0);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Reset data trước khi fetch
        setDataDiemDanh([]);
        setTongSoNgayDiemDanh(0);
        setStudentAttendanceStats({});

        const response = await getAttendanceByClassAndDateNow(class_id, selectedMonth, selectedYear);

        // Kiểm tra và set data mới
        if (response.data && response.data.dataDiemDanh) {
          setDataDiemDanh(response.data.dataDiemDanh);
          setTongSoNgayDiemDanh(response.data.tongSoNgayDiemDanh || 0);
          setStudentAttendanceStats(response.data.studentAttendanceStats || {});
        }
      } catch (error) {
        console.error('Lỗi lấy dữ liệu điểm danh:', error);
        // Trong trường hợp lỗi, giữ nguyên state rỗng đã reset
      }
    };
    fetchAttendanceData();
  }, [class_id, selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await getGiaoVienByPhoneNumber(phoneNumber);
        setTeacherInfo(response);
        // console.log('Thông tin giáo viên:', response);
        // trong thông tin giáo viên có array LopChuNhiem trong đó có _id của class mà giáo viên đó chủ nhiệm hãy lưu vào cookie để dùng cho việc điểm danh
        sessionStorage.setItem('class_id', response.lopChuNhiem[0]._id);
      } catch (error) {
        console.error('Lỗi lấy thông tin giáo viên:', error);
      }
    };
    fetchTeacherInfo();
  }, [phoneNumber]);

  // console ra selectedMonth vaf selectedYear khi thay đổi
  // useEffect(() => {
  //   console.log('Selected month:', selectedMonth);
  //   console.log('Selected year:', selectedYear);
  // }, [selectedMonth, selectedYear]);

  // tính độ dài màn hình để resize biểu đồ tròn
  useEffect(() => {
    const handleResize = () => {
      setOuterRadius(window.innerWidth < 800 ? 100 : 160);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const calculateWeekdaysInMonth = (year, month) => {
    let weekdays = 0;
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        weekdays++;
      }
    }
    return weekdays;
  };

  const totalWeekdays = calculateWeekdaysInMonth(selectedYear, selectedMonth);

  // Generate year options (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: `Năm ${new Date().getFullYear() - i}`,
  }));

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));

  // Transform attendance data for chart
  const transformDataForChart = (data) => {
    // Check if data exists and is an array
    if (!Array.isArray(data)) {
      return [];
    }

    const dailyStats = {};

    data.forEach((record) => {
      const date = new Date(record.date).getDate();
      dailyStats[date] = {
        VCP: 0,
        VKP: 0,
      };

      if (Array.isArray(record.attendanceRecords)) {
        record.attendanceRecords.forEach((student) => {
          if (student.status === 'VCP') dailyStats[date].VCP++;
          if (student.status === 'VKP') dailyStats[date].VKP++;
        });
      }
    });

    return Object.entries(dailyStats).map(([date, stats]) => ({
      date: Number(date),
      VCP: stats.VCP,
      VKP: stats.VKP,
    }));
  };

  const transformDataForTable = (data) => {
    // Check if data exists and is an array
    if (!Array.isArray(data)) {
      return [];
    }

    const tableData = [];

    data.forEach((record) => {
      if (!record || !Array.isArray(record.attendanceRecords)) {
        return;
      }

      const date = new Date(record.date).toLocaleDateString('vi-VN');
      const vcpCount = record.attendanceRecords.filter((s) => s.status === 'VCP').length;
      const vkpCount = record.attendanceRecords.filter((s) => s.status === 'VKP').length;
      const vcpStudents = record.attendanceRecords
        .filter((s) => s.status === 'VCP')
        .map((s) => s.student_name)
        .join(', ');
      const vkpStudents = record.attendanceRecords
        .filter((s) => s.status === 'VKP')
        .map((s) => s.student_name)
        .join(', ');

      tableData.push({
        key: date,
        date,
        vcpCount,
        vkpCount,
        vcpStudents,
        vkpStudents,
      });
    });

    return tableData;
  };

  // Export to Excel
  const exportToExcel = () => {
    const tableData = transformDataForTable(dataDiemDanh).map(({ key, ...rest }) => ({
      Ngày: rest.date,
      'Số lượng học sinh VCP': rest.vcpCount,
      'Số lượng học sinh VKP': rest.vkpCount,
      'Tên học sinh VCP': rest.vcpStudents,
      'Tên học sinh VKP': rest.vkpStudents,
    }));

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `ThongKeDiemDanh_${selectedMonth}_${selectedYear}.xlsx`);
  };

  const chartColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Số Học Sinh Vắng Có Phép',
      dataIndex: 'vcpCount',
      key: 'vcpCount',
    },
    {
      title: 'Tên Học Sinh Vắng Có Phép',
      dataIndex: 'vcpStudents',
      key: 'vcpStudents',
    },
    {
      title: 'Số Học Sinh Vắng Không Phép',
      dataIndex: 'vkpCount',
      key: 'vkpCount',
    },
    {
      title: 'Tên Học Sinh Vắng Không Phép',
      dataIndex: 'vkpStudents',
      key: 'vkpStudents',
    },
  ];

  const handleViewAllToggle = () => {
    setShowAllRecords(!showAllRecords);
    setPageSize(showAllRecords ? 10 : undefined);
  };

  return (
    <div className="p-6 attendance-report">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Thống Kê Điểm Danh</h3>
        <div className="flex gap-4">
          <Select value={selectedMonth} onChange={setSelectedMonth} options={monthOptions} className="w-32" />
          <Select value={selectedYear} onChange={setSelectedYear} options={yearOptions} className="w-32" />
        </div>
      </div>
      {/* Cảnh báo học sinh cần nhắc nhở */}

      {/* New Bar Chart */}
      <Card title="Biểu đồ thống kê vắng phép theo ngày" className="mb-6">
        {!dataDiemDanh || !Array.isArray(dataDiemDanh) || dataDiemDanh.length === 0 ? (
          <div className="flex justify-center items-center" style={{ height: '400px' }}>
            <Empty
              description={
                <span>
                  Không có dữ liệu điểm danh cho tháng {selectedMonth} năm {selectedYear}
                </span>
              }
            />
          </div>
        ) : (
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transformDataForChart(dataDiemDanh)}
                margin={{ top: 20, right: 30, left: 20, bottom: 45 }} // Adjusted margin
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{ value: 'Ngày', position: 'bottom', offset: 3 }} // Increased offset
                />
                <YAxis label={{ value: 'Số lượng học sinh', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                />
                <Bar dataKey="VCP" name="Vắng có phép" fill="#DFC286" />
                <Bar dataKey="VKP" name="Vắng không phép" fill="#f5222d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Detailed Table */}
      <Card
        title="Bảng chi tiết điểm danh"
        extra={
          <div className="flex gap-2">
            <Button onClick={handleViewAllToggle} style={{ backgroundColor: '#77AC2F', color: 'white' }}>
              {showAllRecords ? 'Thu gọn' : 'Xem tất cả'}
            </Button>
            <Button onClick={exportToExcel} style={{ backgroundColor: '#1890ff', color: 'white' }}>
              Xuất Excel
            </Button>
          </div>
        }
      >
        <Table
          columns={chartColumns}
          dataSource={transformDataForTable(dataDiemDanh)}
          pagination={showAllRecords ? false : { pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
