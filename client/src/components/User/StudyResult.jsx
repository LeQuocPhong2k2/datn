/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React from 'react';
import 'flowbite';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Row, Col, Button, Statistic } from 'antd';
import * as XLSX from 'xlsx';

import { getTranscriptByStudentCodeAndClassAndSchoolYear } from '../../api/Transcripts';
import { getStudentStatistics } from '../../api/Transcripts';

const StudyResult = ({ studentInfor }) => {
  const [activeTabAcademic, setactiveTabAcademic] = useState('tongket');
  const [transcript, setTranscript] = useState({});
  const [avgScore, setAvgScore] = useState(0);
  const [danhHieu, setDanhHieu] = useState('');
  const [chartData, setChartData] = useState({});
  const [scoreRangeData, setScoreRangeData] = useState({});
  const [stats, setStats] = useState({
    totalSubjects: 0,
    averageScore: 0,
    scoreRanges: {
      excellent: 0,
      good: 0,
      average: 0,
      belowAverage: 0,
    },
    subjectPerformance: {
      improved: 0,
      declined: 0,
      stable: 0,
    },
    semesterComparison: {
      hk1Average: 0,
      hk2Average: 0,
    },
  });

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

  const fetchData = async () => {
    try {
      const transcriptResponse = await getTranscriptByStudentCodeAndClassAndSchoolYear(
        studentInfor.studentCode,
        studentInfor.className,
        getCurrentSchoolYear()
      );
      console.log('Get transcript response:', transcriptResponse);
      setTranscript(transcriptResponse.data.transcript);
      setAvgScore(transcriptResponse.data.average);
      handleDanhHieu(transcriptResponse.data.average);

      const statsResponse = await getStudentStatistics(
        studentInfor.studentCode,
        studentInfor.className,
        getCurrentSchoolYear()
      );
      console.log('Get stats response:', statsResponse);
      setStats(statsResponse.data.statistics);

      generateChartData(statsResponse.data.statistics);
      generateScoreRangeData(statsResponse.data.statistics);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function removeNumberFromString(str) {
    // Sử dụng regular expression để thay thế các số bằng chuỗi rỗng
    return str.replace(/\d+/g, '').trim();
  }

  const handleDanhHieu = (avgScore) => {
    if (avgScore >= 9) {
      setDanhHieu('Xuất sắc');
    } else if (avgScore >= 7) {
      setDanhHieu('Hoàn thành tốt');
    } else if (avgScore >= 5) {
      setDanhHieu('Hoàn thành');
    } else {
      setDanhHieu('Chưa hoàn thành');
    }
  };

  const generateChartData = (stats) => {
    const labels = ['Xuất sắc', 'HT tốt', 'HT', 'Chưa HT'];
    const data = [
      stats.scoreRanges.excellent,
      stats.scoreRanges.good,
      stats.scoreRanges.average,
      stats.scoreRanges.belowAverage,
    ];

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Số môn học',
          data: data,
          backgroundColor: ['#4caf50', '#2196f3', '#ffeb3b', '#f44336'],
        },
      ],
    });
  };

  const generateScoreRangeData = (stats) => {
    setScoreRangeData({
      labels: ['Học kỳ I', 'Học kỳ II', 'Cả năm'],
      datasets: [
        {
          label: 'Điểm trung bình',
          data: [stats.semesterComparison.hk1Average, stats.semesterComparison.hk2Average, stats.averageScore],
          backgroundColor: ['#2196f3', '#FFEB3B', '#4caf50'],
        },
      ],
    });
  };

  const handleExportExcel = () => {
    // Sheet 1: Điểm chi tiết từng môn
    const subjectDetails = transcript.map((subject) => ({
      'Môn học': removeNumberFromString(subject.subjectName),
      'Điểm GK HK1': subject.hk1Gk,
      'Điểm CK HK1': subject.hk1Ck,
      'TB HK1': subject.hk1Tb,
      'Điểm GK HK2': subject.hk2Gk,
      'Điểm CK HK2': subject.hk2Ck,
      'TB HK2': subject.hk2Tb,
      'Điểm cả năm': subject.allYear,
    }));
    const worksheetSubjects = XLSX.utils.json_to_sheet(subjectDetails);

    // Sheet 2: Thống kê phân loại điểm
    const scoreStats = [
      { 'Phân loại': 'Xuất sắc (>= 9.0)', 'Số môn': stats.scoreRanges.excellent },
      { 'Phân loại': 'Giỏi (7.0-8.9)', 'Số môn': stats.scoreRanges.good },
      { 'Phân loại': 'Trung bình (5.0-6.9)', 'Số môn': stats.scoreRanges.average },
      { 'Phân loại': 'Yếu (< 5.0)', 'Số môn': stats.scoreRanges.belowAverage },
    ];
    const worksheetStats = XLSX.utils.json_to_sheet(scoreStats);

    // Sheet 3: So sánh học kỳ
    const semesterComparison = [
      { 'Học kỳ': 'Học kỳ I', 'Điểm TB': stats.semesterComparison.hk1Average },
      { 'Học kỳ': 'Học k��� II', 'Điểm TB': stats.semesterComparison.hk2Average },
      { 'Học kỳ': 'Cả năm', 'Điểm TB': stats.averageScore },
    ];
    const worksheetComparison = XLSX.utils.json_to_sheet(semesterComparison);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetSubjects, 'Điểm chi tiết');
    XLSX.utils.book_append_sheet(workbook, worksheetStats, 'Thống kê phân loại');
    XLSX.utils.book_append_sheet(workbook, worksheetComparison, 'So sánh học kỳ');

    XLSX.writeFile(workbook, `KetQuaHocTap_${studentInfor.studentCode}.xlsx`);
  };

  return (
    <div>
      <div>
        {/* Nội dung cho Quá trình học tập */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
          <div className="flex border-b">
            <div
              onClick={() => {
                setactiveTabAcademic('hocky1');
                fetchData();
              }}
              className={`px-4 py-2 ${activeTabAcademic === 'hocky1' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
              style={{ cursor: 'pointer' }}
            >
              Học kỳ I
            </div>
            <div
              onClick={() => {
                setactiveTabAcademic('hocky2');
                fetchData();
              }}
              className={`px-4 py-2 ${activeTabAcademic === 'hocky2' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
              style={{ cursor: 'pointer' }}
            >
              Học kỳ II
            </div>
            <div
              onClick={() => {
                setactiveTabAcademic('tongket');
                fetchData();
              }}
              className={`px-4 py-2 ${activeTabAcademic === 'tongket' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
              style={{ cursor: 'pointer' }}
            >
              Tổng kết
            </div>
          </div>
          {/* Thêm nội dung cho từng tab ở đây */}
          {activeTabAcademic === 'hocky1' && ( // Đảm bảo nội dung hiển thị đúng
            <div>
              <div className="container mx-auto mt-4">
                <div className="container mx-auto overflow-x-auto">
                  <table className="min-w-full border mb-5" style={{ userSelect: 'none', width: '100%' }}>
                    <thead className=" bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 w-60 min-w-60 text-left">
                          <span class="flex items-center">Môn học</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">Giữa kỳ</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">Cuối kỳ</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">TBHK</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(transcript) &&
                        transcript.map((student, index) => (
                          <tr className="h-10 odd:bg-white even:bg-yellow-50" key={index}>
                            <td className="border px-4 py-2">{removeNumberFromString(student.subjectName)}</td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk1Gk}</span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk1Ck}</span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk1Tb}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTabAcademic === 'hocky2' && (
            <div>
              <div className="container mx-auto mt-4">
                <div className="container mx-auto overflow-x-auto">
                  <table className="min-w-full border mb-5" style={{ userSelect: 'none', width: '100%' }}>
                    <thead className=" bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 w-60 min-w-60 text-left">
                          <span class="flex items-center">Môn học</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">Giữa kỳ</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">Cuối kỳ</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">TBHK</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(transcript) &&
                        transcript.map((student, index) => (
                          <tr className="h-10 odd:bg-white even:bg-yellow-50" key={index}>
                            <td className="border px-4 py-2">{removeNumberFromString(student.subjectName)}</td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk2Gk}</span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk2Ck}</span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk2Tb}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTabAcademic === 'tongket' && (
            <div>
              <div className="container mx-auto mt-4">
                <div className="container mx-auto overflow-x-auto">
                  <table className="min-w-full border mb-5" style={{ userSelect: 'none', width: '100%' }}>
                    <thead className=" bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 w-60 min-w-60 text-left">
                          <span class="flex items-center">Môn học</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">HKI</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">HKII</span>
                        </th>
                        <th className="border px-4 py-2 w-32 min-w-32 text-left">
                          <span class="flex items-center">Cả năm</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(transcript) &&
                        transcript.map((student, index) => (
                          <tr className="h-10 odd:bg-white even:bg-yellow-50" key={index}>
                            <td className="border px-4 py-2">{removeNumberFromString(student.subjectName)}</td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk1Tb}</span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.hk2Tb}</span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <span>{student.allYear}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {stats && stats.totalSubjects > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Thống kê kết quả học tập</h3>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="Biểu đồ phân loại điểm theo môn">
                        {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
                          <Bar data={chartData} />
                        ) : (
                          <div className="text-center text-gray-500">Không có dữ liệu</div>
                        )}
                        <div className="mt-4 text-gray-500">Note: HT : Hoàn thành</div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="So sánh điểm trung bình học kỳ">
                        {scoreRangeData && scoreRangeData.datasets && scoreRangeData.datasets.length > 0 ? (
                          <Bar data={scoreRangeData} />
                        ) : (
                          <div className="text-center text-gray-500">Không có dữ liệu</div>
                        )}
                      </Card>
                    </Col>
                  </Row>

                  <Card title="Thống kê chi tiết" className="mt-4">
                    <Row gutter={24}>
                      <Col span={12}>
                        <Card>
                          <b>
                            <Statistic
                              title="Tổng số môn học"
                              value={stats.totalSubjects}
                              valueStyle={{ color: stats.totalSubjects > 0 ? '#3f8600' : '#cf1322' }}
                            />
                          </b>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card>
                          <b>
                            <Statistic
                              title="Điểm trung bình cả năm"
                              value={stats.averageScore}
                              precision={2}
                              valueStyle={{ color: stats.averageScore >= 5 ? '#3f8600' : '#cf1322' }}
                            />
                          </b>
                        </Card>
                      </Col>
                    </Row>

                    <Button
                      onClick={handleExportExcel}
                      style={{ backgroundColor: '#1890ff', color: 'white' }}
                      className="mt-4"
                    >
                      Xuất báo cáo Excel
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          )}
          {activeTabAcademic === 'tongket' && (
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
                    { category: 'Xếp loại', value: danhHieu },
                    { category: 'TBM Cả năm', value: avgScore },
                    { category: 'Hạnh kiểm', value: 'Tốt' },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="summary-cell">{row.category}</td>
                      <td className="summary-cell summary-cell-value">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyResult;
