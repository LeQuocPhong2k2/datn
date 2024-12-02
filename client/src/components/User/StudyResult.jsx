/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React from 'react';
import 'flowbite';
import { useEffect, useState } from 'react';

import { getTranscriptByStudentCodeAndClassAndSchoolYear } from '../../api/Transcripts';

const StudyResult = ({ studentInfor }) => {
  const [activeTabAcademic, setactiveTabAcademic] = useState('tongket');
  const [transcript, setTranscript] = useState({});
  const [avgScore, setAvgScore] = useState(0);
  const [danhHieu, setDanhHieu] = useState('');

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
      const response = await getTranscriptByStudentCodeAndClassAndSchoolYear(
        studentInfor.studentCode,
        studentInfor.className,
        getCurrentSchoolYear()
      );
      console.log('Get transcript response:', response);
      setTranscript(response.data.transcript);
      setAvgScore(response.data.average);
      handleDanhHieu(response.data.average);
    } catch (error) {
      console.error('Get transcript error:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTranscriptByStudentCodeAndClassAndSchoolYear(
          studentInfor.studentCode,
          studentInfor.className,
          getCurrentSchoolYear()
        );
        console.log('Get transcript response:', response);
        setTranscript(response.data.transcript);
        setAvgScore(response.data.average);
        handleDanhHieu(response.data.average);
      } catch (error) {
        console.error('Get transcript error:', error.response ? error.response.data : error.message);
      }
    };
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
              className={`px-4 py-2 ${activeTabAcademic === 'hocky1' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
            >
              Học kỳ I
            </div>
            <div
              onClick={() => {
                setactiveTabAcademic('hocky2');
                fetchData();
              }}
              className={`px-4 py-2 ${activeTabAcademic === 'hocky2' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
            >
              Học kỳ II
            </div>
            <div
              onClick={() => {
                setactiveTabAcademic('tongket');
                fetchData();
              }}
              className={`px-4 py-2 ${activeTabAcademic === 'tongket' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
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
            </div>
          )}
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
        </div>
      </div>
    </div>
  );
};

export default StudyResult;
