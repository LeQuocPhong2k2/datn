import { Alert, Card, Col, Collapse, Row, Select, Statistic, Table, Button, Empty } from 'antd';
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import { getGiaoVienByPhoneNumber } from '../../../api/Teacher';
import { getClassStatistics } from '../../../api/Transcripts';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function AcademicReport() {
  const [selectedClass_id, setSelectedClassId] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [classOptions, setClassOptions] = useState([]);
  const phoneNumber = sessionStorage.getItem('phoneNumberTeacher');
  const [danhHieu, setDanhHieu] = useState('');
  const [teacherInfo, setTeacherInfo] = useState({});
  const [classStatistics, setClassStatistics] = useState({ studentDetails: [] });
  const [chartData, setChartData] = useState({});
  const [scoreRangeData, setScoreRangeData] = useState({});
  const [showAllRecords, setShowAllRecords] = useState(false);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await getGiaoVienByPhoneNumber(phoneNumber);
        setTeacherInfo(response);

        const combinedOptions = response.lopChuNhiem.map((lop) => ({
          value: lop._id,
          label: `${lop.className} - ${lop.academicYear}`,
        }));

        const defaultOption = { value: '', label: 'Chọn lớp học' };
        setClassOptions([defaultOption, ...combinedOptions]);

        setSelectedClassId('');
      } catch (error) {
        console.error('Lỗi lấy thông tin giáo viên:', error);
      }
    };
    fetchTeacherInfo();
  }, [phoneNumber]);

  useEffect(() => {
    const fetchClassStatistics = async () => {
      try {
        const response = await getClassStatistics(selectedClassName, selectedSchoolYear);
        console.log('Thống kê lớp học:', response.data);
        const studentDetails = response.data?.studentDetails || [];
        setClassStatistics({ studentDetails });
        generateChartData(studentDetails);
        generateScoreRangeData(studentDetails);
      } catch (error) {
        console.error('Lỗi lấy thống kê lớp học:', error);
        setClassStatistics({ studentDetails: [] });
        setChartData({});
        setScoreRangeData({});
      }
    };
    if (selectedClassName && selectedSchoolYear) {
      fetchClassStatistics();
    }
  }, [selectedClassName, selectedSchoolYear]);

  const handleClassChange = (value, option) => {
    setSelectedClassId(value);
    if (option.label !== 'Chọn lớp học') {
      const [className, schoolYear] = option.label.split(' - ');
      setSelectedClassName(className);
      setSelectedSchoolYear(schoolYear);
    } else {
      setSelectedClassName('');
      setSelectedSchoolYear('');
    }
  };

  const handleDanhHieu = (avgScore) => {
    if (avgScore >= 9) {
      return 'Xuất sắc';
    } else if (avgScore >= 7) {
      return 'Hoàn thành tốt';
    } else if (avgScore >= 5) {
      return 'Hoàn thành';
    } else {
      return 'Chưa hoàn thành';
    }
  };

  // const generateChartData = (studentDetails) => {
  //   const categories = { 'Xuất sắc': 0, 'Hoàn thành tốt': 0, 'Hoàn thành': 0, 'Chưa hoàn thành': 0 };
  //   studentDetails.forEach((student) => {
  //     const danhHieu = handleDanhHieu(student.average);
  //     categories[danhHieu]++;
  //   });
  //   setChartData({
  //     labels: Object.keys(categories),
  //     datasets: [
  //       {
  //         label: 'Số lượng học sinh',
  //         data: Object.values(categories),
  //         backgroundColor: ['#4caf50', '#2196f3', '#ffeb3b', '#f44336'],
  //       },
  //     ],
  //   });
  // };
  const generateChartData = (studentDetails) => {
    const categories = {
      'Xuất sắc': 0,
      'Hoàn thành tốt': 0,
      'Hoàn thành': 0,
      'Chưa hoàn thành': 0,
    };
    studentDetails.forEach((student) => {
      const danhHieu = handleDanhHieu(student.average);
      categories[danhHieu]++;
    });
    setChartData({
      labels: Object.keys(categories),
      datasets: [
        {
          label: 'Số lượng học sinh',
          data: Object.values(categories),
          backgroundColor: ['#4caf50', '#2196f3', '#ffeb3b', '#f44336'],
        },
      ],
    });
  };

  const generateScoreRangeData = (studentDetails) => {
    const ranges = { '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0, '5-6': 0, '6-7': 0, '7-8': 0, '8-9': 0, '9-10': 0 };
    studentDetails.forEach((student) => {
      const avg = student.average;
      if (avg >= 1 && avg < 2) ranges['1-2']++;
      else if (avg >= 2 && avg < 3) ranges['2-3']++;
      else if (avg >= 3 && avg < 4) ranges['3-4']++;
      else if (avg >= 4 && avg < 5) ranges['4-5']++;
      else if (avg >= 5 && avg < 6) ranges['5-6']++;
      else if (avg >= 6 && avg < 7) ranges['6-7']++;
      else if (avg >= 7 && avg < 8) ranges['7-8']++;
      else if (avg >= 8 && avg < 9) ranges['8-9']++;
      else if (avg >= 9 && avg <= 10) ranges['9-10']++;
    });
    setScoreRangeData({
      labels: Object.keys(ranges),
      datasets: [
        {
          label: 'Số lượng học sinh',
          data: Object.values(ranges),
          backgroundColor: '#2196f3',
        },
      ],
    });
  };

  // const handleExportExcel = () => {
  const handleExportExcel = () => {
    // Tab chính: Thống kê lớp học
    const modifiedStudentDetails = classStatistics.studentDetails.map(({ studentCode, userName, average }) => ({
      'Mã số học sinh': studentCode,
      'Tên học sinh': userName,
      'Điểm trung bình': average,
    }));
    const worksheetMain = XLSX.utils.json_to_sheet(modifiedStudentDetails);

    // Tab phân loại học sinh
    const studentCategories = [];
    // Thêm phần tổng hợp số lượng
    chartData.labels.forEach((label, index) => {
      studentCategories.push({
        'Danh hiệu': label,
        'Số lượng học sinh': chartData.datasets[0].data[index],
      });
    });
    // Thêm dòng trống để phân cách
    studentCategories.push({});
    // Thêm chi tiết học sinh theo từng danh hiệu
    chartData.labels.forEach((label) => {
      studentCategories.push({ 'Danh hiệu': `=== Chi tiết học sinh ${label} ===` });
      const studentsInCategory = classStatistics.studentDetails.filter(
        (student) => handleDanhHieu(student.average) === label
      );
      studentsInCategory.forEach((student) => {
        studentCategories.push({
          'Mã học sinh': student.studentCode,
          'Tên học sinh': student.userName,
          'Điểm trung bình': student.average,
        });
      });
      // Thêm dòng trống giữa các danh hiệu
      studentCategories.push({});
    });
    const worksheetCategories = XLSX.utils.json_to_sheet(studentCategories);

    // Tab phân loại khoảng điểm
    const scoreRanges = [];
    // Thêm phần tổng hợp số lượng
    scoreRangeData.labels.forEach((label, index) => {
      scoreRanges.push({
        'Khoảng điểm': label,
        'Số lượng học sinh': scoreRangeData.datasets[0].data[index],
      });
    });
    // Thêm dòng trống để phân cách
    scoreRanges.push({});
    // Thêm chi tiết học sinh theo từng khoảng điểm
    scoreRangeData.labels.forEach((range) => {
      scoreRanges.push({ 'Khoảng điểm': `=== Chi tiết học sinh điểm ${range} ===` });
      const [min, max] = range.split('-').map(Number);
      const studentsInRange = classStatistics.studentDetails.filter(
        (student) => student.average >= min && student.average < max
      );
      studentsInRange.forEach((student) => {
        scoreRanges.push({
          'Mã học sinh': student.studentCode,
          'Tên học sinh': student.userName,
          'Điểm trung bình': student.average,
        });
      });
      // Thêm dòng trống giữa các khoảng điểm
      scoreRanges.push({});
    });
    const worksheetScoreRanges = XLSX.utils.json_to_sheet(scoreRanges);

    // Tạo workbook và thêm các sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetMain, 'Thống kê lớp học');
    XLSX.utils.book_append_sheet(workbook, worksheetCategories, 'Phân loại học sinh');
    XLSX.utils.book_append_sheet(workbook, worksheetScoreRanges, 'Phân loại khoảng điểm');

    // Xuất file Excel
    XLSX.writeFile(workbook, `ThongKeLopHoc_${selectedClassName}_${selectedSchoolYear}.xlsx`);
  };
  useEffect(() => {
    console.log('classStatistics', classStatistics);
    console.log('selecClassName', selectedClassName);
    console.log('selectedSchoolYear', selectedSchoolYear);
  }, [classStatistics, selectedClassName, selectedSchoolYear]);

  const handleViewAllToggle = () => {
    setShowAllRecords(!showAllRecords);
  };

  return (
    <div className="p-6 attendance-report">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Thống Kê Kết Quả Học Tập</h3>
        <div className="flex gap-4">
          <Select
            value={selectedClass_id}
            onChange={handleClassChange}
            options={classOptions}
            className="w-48"
            placeholder="Chọn lớp học"
          />
        </div>
      </div>
      {!selectedClassName && (
        <Empty description={<span className="text-gray-500">Vui lòng chọn lớp học để xem thống kê</span>} />
      )}
      {selectedClassName && selectedSchoolYear && (!classStatistics || classStatistics.studentDetails.length === 0) && (
        <Empty description={<span className="text-gray-500">Chưa có dữ liệu thống kê cho lớp này</span>} />
      )}
      {selectedClassName && selectedSchoolYear && classStatistics && classStatistics.studentDetails.length > 0 && (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Biểu đồ phân loại học sinh">
                <Bar data={chartData} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Biểu đồ khoảng điểm">
                <Bar data={scoreRangeData} />
              </Card>
            </Col>
          </Row>

          <Card
            title="Bảng chi tiết kết quả học tập"
            className="mt-4"
            extra={
              <div className="flex gap-2">
                <Button onClick={handleViewAllToggle} style={{ backgroundColor: '#77AC2F', color: 'white' }}>
                  {showAllRecords ? 'Thu gọn' : 'Xem tất cả'}
                </Button>
                <Button onClick={handleExportExcel} style={{ backgroundColor: '#1890ff', color: 'white' }}>
                  Xuất Excel
                </Button>
              </div>
            }
          >
            <Table
              dataSource={classStatistics.studentDetails}
              columns={[
                { title: 'Mã học sinh', dataIndex: 'studentCode', key: 'studentCode' },
                { title: 'Tên học sinh', dataIndex: 'userName', key: 'userName' },
                { title: 'Điểm trung bình', dataIndex: 'average', key: 'average' },
                { title: 'Danh hiệu', key: 'danhHieu', render: (_, record) => handleDanhHieu(record.average) },
              ]}
              rowKey="studentCode"
              pagination={showAllRecords ? false : { pageSize: 10 }}
            />
          </Card>
        </>
      )}
    </div>
  );
}
