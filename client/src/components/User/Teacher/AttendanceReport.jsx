import React, { useState, useEffect } from 'react';
import { Card, Select, Row, Col, Statistic, Table, Tabs, Alert, Collapse } from 'antd';
import { getAttendanceStatsByClassAndMonth } from '../../../api/Attendance';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import './AttendanceReport.css'; // Import file CSS
import { getGiaoVienByPhoneNumber } from '../../../api/Teacher';
export default function AttendanceReport() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [outerRadius, setOuterRadius] = useState(window.innerWidth < 800 ? 100 : 160);

  const phoneNumber = localStorage.getItem('phoneNumberTeacher');
  const [teacherInfo, setTeacherInfo] = useState({});

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await getGiaoVienByPhoneNumber(phoneNumber);
        setTeacherInfo(response);
        // console.log('Thông tin giáo viên:', response);
        // trong thông tin giáo viên có array LopChuNhiem trong đó có _id của class mà giáo viên đó chủ nhiệm hãy lưu vào cookie để dùng cho việc điểm danh
        localStorage.setItem('class_id', response.lopChuNhiem[0]._id);
      } catch (error) {
        console.error('Lỗi lấy thông tin giáo viên:', error);
      }
    };
    fetchTeacherInfo();
  }, [phoneNumber]);

  //  lấy ra class_id từ localStorage
  const class_id = localStorage.getItem('class_id');

  const [studentAttendanceData, setStudentAttendanceData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAttendanceStatsByClassAndMonth(class_id, selectedMonth, selectedYear);
        setStudentAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
        setStudentAttendanceData({});
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  // console ra selectedMonth vaf selectedYear khi thay đổi
  useEffect(() => {
    console.log('Selected month:', selectedMonth);
    console.log('Selected year:', selectedYear);
  }, [selectedMonth, selectedYear]);

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
  // console.log('Total weekdays:', totalWeekdays);
  useEffect(() => {
    console.log('Total weekdays:', totalWeekdays);
  }, [totalWeekdays]);

  // const studentAttendanceData = {
  //   tongSoHocSinh: 3,
  //   tongSoHocSinhCoMat: 46,
  //   tongSoHocSinhVangCoPhep: 1,
  //   tongSoHocSinhVangKhongPhep: 1,
  //   danhSachHocSinh: [
  //     {
  //       _id: '671a4dff5c3c5adef643eff5',
  //       hoTen: 'Bùi Đình Dương',
  //       trangThai: 'CM',
  //       ngayNghi: ['21/11/2024'],
  //       lyDo: 'Học sinh có mặt',
  //     },
  //     {
  //       _id: '671c0f0357384d51a208223d',
  //       hoTen: 'Thái Đình Đặng',
  //       trangThai: 'CM',
  //       ngayNghi: ['20/11/2024'],
  //       lyDo: 'Học sinh có mặt',
  //     },
  //     {
  //       _id: '671c0f0257384d51a2082232',
  //       hoTen: 'Quách Quốc Dương',
  //       trangThai: 'CM',
  //       ngayNghi: [],
  //       lyDo: 'Học sinh có mặt',
  //     },
  //   ],
  // };

  // Prepare data for pie chart - Thêm kiểm tra điều kiện
  const chartData = [
    { name: 'Có mặt', value: studentAttendanceData?.tongSoHocSinhCoMat || 0, color: '#587E8B' },
    { name: 'Vắng có phép', value: studentAttendanceData?.tongSoHocSinhVangCoPhep || 0, color: '#DFC286' },
    { name: 'Vắng không phép', value: studentAttendanceData?.tongSoHocSinhVangKhongPhep || 0, color: '#f5222d' },
  ];

  // Data cho biểu đồ cột - Thêm kiểm tra điều kiện
  const barChartData = [
    {
      name: 'Điểm danh',
      'Có mặt': studentAttendanceData?.tongSoHocSinhCoMat || 0,
      'Vắng có phép': studentAttendanceData?.tongSoHocSinhVangCoPhep || 0,
      'Vắng không phép': studentAttendanceData?.tongSoHocSinhVangKhongPhep || 0,
    },
  ];

  // Cấu hình cho các bảng danh sách học sinh
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày có mặt',
      dataIndex: 'ngayCoMat',
      key: 'ngayCoMat',
      render: (ngayCoMat) => ngayCoMat?.join(', ') || 'Không có',
    },
    {
      title: 'Ngày vắng có phép',
      dataIndex: 'ngayVangCoPhep',
      key: 'ngayVangCoPhep',
      render: (ngayVangCoPhep) => ngayVangCoPhep?.join(', ') || 'Không có',
    },
    {
      title: 'Ngày vắng không phép',
      dataIndex: 'ngayVangKhongPhep',
      key: 'ngayVangKhongPhep',
      render: (ngayVangKhongPhep) => ngayVangKhongPhep?.join(', ') || 'Không có',
    },
  ];

  // Lọc danh sách học sinh theo trạng thái - Thêm kiểm tra điều kiện
  const getStudentsByStatus = (status) => {
    return studentAttendanceData?.danhSachHocSinh?.filter((student) => student.trangThai === status) || [];
  };

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

  // Kiểm tra học sinh cần nhắc nhở - Thêm kiểm tra điều kiện cho cả VCP và VKP
  const studentsNeedingAttention =
    studentAttendanceData?.danhSachHocSinh?.filter((student) => {
      if ((student.trangThai === 'VKP' || student.trangThai === 'VCP') && Array.isArray(student.ngayNghi)) {
        return student.ngayNghi.length >= 3;
      }
      return false;
    }) || [];

  // Phân chia học sinh vắng có phép và vắng không phép
  const studentsVangCoPhep = studentsNeedingAttention.filter((student) => student.trangThai === 'VCP');
  const studentsVangKhongPhep = studentsNeedingAttention.filter((student) => student.trangThai === 'VKP');

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
      {studentsNeedingAttention.length > 0 && (
        <Collapse
          className="mb-6"
          items={[
            {
              key: '1',
              label: <Alert message={<b>Cảnh báo</b>} showIcon style={{ margin: 0 }} />,
              children: (
                <div className="p-4">
                  {studentsVangCoPhep.length > 0 && (
                    <>
                      <p>Các học sinh cần được nhắc nhở vì nghỉ có phép quá 3 ngày:</p>
                      <ul className="list-disc pl-6">
                        {studentsVangCoPhep.map((student) => (
                          <li key={student._id}>{student.hoTen}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {studentsVangKhongPhep.length > 0 && (
                    <>
                      <p>Các học sinh cần được nhắc nhở vì nghỉ không phép quá 3 ngày:</p>
                      <ul className="list-disc pl-6">
                        {studentsVangKhongPhep.map((student) => (
                          <li key={student._id}>{student.hoTen}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ),
            },
          ]}
          defaultActiveKey={['1']} // Mặc định mở rộng
        />
      )}
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={4}>
          <b>
            <Card>
              <Statistic
                title="Tổng số học sinh"
                value={studentAttendanceData.tongSoHocSinh ?? '--'}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </b>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <b>
            <Card>
              <Statistic
                title="Tổng số buổi học "
                value={studentAttendanceData.tongSoHocSinh * totalWeekdays ?? '--'}
                valueStyle={{ color: '#587E8B' }}
              />
            </Card>
          </b>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <b>
            <Card>
              <Statistic
                title="Có mặt"
                value={studentAttendanceData.tongSoHocSinhCoMat ?? '--'}
                valueStyle={{ color: '#587E8B' }}
                suffix={`/ ${studentAttendanceData.tongSoHocSinh * totalWeekdays ?? '--'}`}
              />
            </Card>
          </b>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <b>
            <Card>
              <Statistic
                title="Vắng có phép"
                value={studentAttendanceData.tongSoHocSinhVangCoPhep ?? '--'}
                valueStyle={{ color: '#DFC286' }}
                suffix={`/ ${studentAttendanceData.tongSoHocSinh * totalWeekdays ?? '--'}`}
              />
            </Card>
          </b>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <b>
            <Card>
              <Statistic
                title="Vắng không phép"
                value={studentAttendanceData.tongSoHocSinhVangKhongPhep ?? '--'}
                valueStyle={{ color: '#f5222d' }}
                suffix={`/ ${studentAttendanceData.tongSoHocSinh * totalWeekdays ?? '--'}`}
              />
            </Card>
          </b>
        </Col>
      </Row>
      {/* Charts Row - Thêm điều kiện kiểm tra có data không */}
      {(studentAttendanceData?.tongSoHocSinh || 0) > 0 ? (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={12}>
            <Card title="Biểu đồ tỷ lệ điểm danh">
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={outerRadius}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Biểu đồ số lượng điểm danh">
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Có mặt" fill="#587E8B" />
                    <Bar dataKey="Vắng có phép" fill="#DFC286" />
                    <Bar dataKey="Vắng không phép" fill="#f5222d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card className="mb-6">
          <div className="text-center p-4 text-gray-500">Không có dữ liệu điểm danh</div>
        </Card>
      )}
      {/* Danh sách học sinh theo trạng thái - Thêm điều kiện kiểm tra có data không */}
      {/* {studentAttendanceData?.danhSachHocSinh?.length > 0 ? (
        <Card>
          <Tabs
            defaultActiveKey="CM"
            items={[
              {
                key: 'CM',
                label: 'Học sinh có mặt',
                children: <Table columns={columns} dataSource={getStudentsByStatus('CM')} rowKey="_id" />,
              },
              {
                key: 'VCP',
                label: 'Học sinh vắng có phép',
                children: <Table columns={columns} dataSource={getStudentsByStatus('VCP')} rowKey="_id" />,
              },
              {
                key: 'VKP',
                label: 'Học sinh vắng không phép',
                children: <Table columns={columns} dataSource={getStudentsByStatus('VKP')} rowKey="_id" />,
              },
            ]}
          />
        </Card>
      ) : (
        <Card>
          <div className="text-center p-4 text-gray-500">Không có dữ liệu học sinh</div>
        </Card>
      )} */}

      {studentAttendanceData?.danhSachHocSinh?.length > 0 ? (
        <Card>
          <Table columns={columns} dataSource={studentAttendanceData.danhSachHocSinh} rowKey="_id" />
        </Card>
      ) : (
        <Card>
          <div className="text-center p-4 text-gray-500">Không có dữ liệu học sinh</div>
        </Card>
      )}
    </div>
  );
}
