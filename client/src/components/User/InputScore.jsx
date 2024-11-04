import React from 'react';
import 'flowbite';
import { useEffect, useState } from 'react';

import { getSubjectByGrade } from '../../api/Subject';

export default function InputScore() {
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [grade, setGrade] = useState('1');
  const [classroom, setClassroom] = useState('1A');
  const [subjectList, setSubjectList] = useState([]);
  const [subject, setSubject] = useState('Tiếng Việt');
  const [activeEdit, setActiveEdit] = useState('-1');

  useEffect(() => {
    getSubjectByGrade(grade)
      .then((res) => setSubjectList(res))
      .catch((error) =>
        console.error('Get subject by grade error:', error.response ? error.response.data : error.message)
      );
  }, [grade]);

  const handleActiveEdit = () => {
    setActiveEdit((prev) => (prev === '1' ? '-1' : '1'));
  };

  return (
    <div className="w-[80%] mx-auto bg-white p-6 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4 text-center">Nhập Điểm Cho Học Sinh Tiểu Học</h2>

      {/* Form nhập khối, lớp, môn học, học kỳ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2">Khối</label>
          <select className="w-full p-2 border rounded" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value={'1'}>Khối 1</option>
            <option value={'2'}>Khối 2</option>
            <option value={'3'}>Khối 3</option>
            <option value={'4'}>Khối 4</option>
            <option value={'5'}>Khối 5</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Lớp</label>
          <select
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            className="w-full p-2 border rounded"
            style={{ zIndex: 10 }}
          >
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
            {subjectList.map((subject) => (
              <option key={subject.subjectCode} value={subject.subjectName}>
                {subject.subjectName}
              </option>
            ))}
            {subjectList.length === 0 && <option>Chưa có môn học</option>}
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
              <th className="border px-4 py-2" rowSpan={2}>
                STT
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                MSHS
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                Họ và Tên
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                Ngày Sinh
              </th>
              <th className="border px-4 py-2" colSpan={3}>
                HKI
              </th>
              <th className="border px-4 py-2" colSpan={3}>
                HKII
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                TB Cả Năm
              </th>
              <th className="border px-4 py-2" rowSpan={2}></th>
            </tr>
            <tr>
              <th className="border px-4 py-2">GK</th>
              <th className="border px-4 py-2">CK</th>
              <th className="border px-4 py-2">TB</th>
              <th className="border px-4 py-2">GK</th>
              <th className="border px-4 py-2">CK</th>
              <th className="border px-4 py-2">TB</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1</td>
              <td className="border px-4 py-2">123</td>
              <td className="border px-4 py-2">Nguyễn Văn A</td>
              <td className="border px-4 py-2">01/01/2010</td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">5</td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">5</td>
              <td className="border px-4 py-2 text-center">5</td>
              <td className="border px-4 py-2 text-center cursor-pointer text-xl">
                <div onClick={handleActiveEdit} className="flex items-center justify-center hover:text-blue-700">
                  {activeEdit === '1' ? (
                    <button className="bg-green-500 text-white p-1 rounded">Save</button>
                  ) : (
                    <button className="bg-red-500 text-white p-1 rounded">Cancel</button>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2" rowSpan={2}>
                STT
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                MSHS
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                Họ và Tên
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                Ngày Sinh
              </th>
              <th className="border px-4 py-2" colSpan={3}>
                HKI
              </th>
              <th className="border px-4 py-2" colSpan={3}>
                HKII
              </th>
              <th className="border px-4 py-2" rowSpan={2}>
                TB Cả Năm
              </th>
              <th className="border px-4 py-2" rowSpan={2}></th>
            </tr>
            <tr>
              <th className="border px-4 py-2">GK</th>
              <th className="border px-4 py-2">CK</th>
              <th className="border px-4 py-2">TB</th>
              <th className="border px-4 py-2">GK</th>
              <th className="border px-4 py-2">CK</th>
              <th className="border px-4 py-2">TB</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1</td>
              <td className="border px-4 py-2">123</td>
              <td className="border px-4 py-2">Nguyễn Văn A</td>
              <td className="border px-4 py-2">01/01/2010</td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">5</td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">
                <input type="text" className="w-12 p-1 border rounded text-center" />
              </td>
              <td className="border px-4 py-2 text-center">5</td>
              <td className="border px-4 py-2 text-center">5</td>
              <td className="border px-4 py-2 text-center cursor-pointer text-xl">
                <div onClick={handleActiveEdit} className="flex items-center justify-center hover:text-blue-700">
                  {activeEdit === '1' ? (
                    <button className="bg-green-500 text-white p-1 rounded">Save</button>
                  ) : (
                    <button className="bg-red-500 text-white p-1 rounded">Cancel</button>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
