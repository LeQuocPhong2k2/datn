import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import Menu from './Menu';

const TeachingReport = () => {
  const [data, setData] = useState([
    {
      date: new Date().toISOString().split('T')[0],
      subjects: [],
    },
  ]);

  const handleAddSubject = (sessionIndex) => {
    const newSubject = { name: 'Môn mới', content: '', note: '' };
    const updatedData = [...data];
    updatedData[sessionIndex].subjects.push(newSubject);
    setData(updatedData);
  };

  const handleAddReport = () => {
    const newReport = {
      date: new Date().toISOString().split('T')[0],
      subjects: [],
    };
    setData([...data, newReport]);
  };

  return (
    <Menu active="teaching-report2">
      <div className="p-4">
        <div className="rounded shadow bg-white">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i className="fa-solid fa-briefcase mr-2"></i>
              BÁO BÀI
            </h2>
          </div>
          <div className="px-4 py-4 text-lg">
            <div className="flex flex-wrap gap-2">
              <input
                onChange={(e) => {
                  console.log('Chọn ngày' + e.target.value);
                }}
                type="date"
                className="bg-white text-black px-3 py-2 rounded border"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <button
                onClick={handleAddReport}
                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <IoAdd className="text-2xl" />
                Thêm báo bài
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <button className="bg-blue-700 px-4 py-2 rounded">Quay lại</button>
            <h1 className="text-xl font-semibold">Báo bài - Lớp 5A</h1>
          </div>
        </div>
        {data.map((report, index) => (
          <div key={index} className="bg-white p-4 rounded shadow mt-4">
            <h3 className="text-lg font-bold">Ngày: {report.date}</h3>
            <button onClick={() => handleAddSubject(index)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
              Thêm môn học
            </button>
            {report.subjects.map((subject, subIndex) => (
              <div key={subIndex} className="mt-2">
                <input
                  type="text"
                  placeholder="Tên môn học"
                  value={subject.name}
                  onChange={(e) => {
                    const updatedData = [...data];
                    updatedData[index].subjects[subIndex].name = e.target.value;
                    setData(updatedData);
                  }}
                  className="bg-gray-100 text-black px-3 py-2 rounded border w-full"
                />
                <textarea
                  placeholder="Nội dung"
                  value={subject.content}
                  onChange={(e) => {
                    const updatedData = [...data];
                    updatedData[index].subjects[subIndex].content = e.target.value;
                    setData(updatedData);
                  }}
                  className="bg-gray-100 text-black px-3 py-2 rounded border w-full mt-2"
                />
                <textarea
                  placeholder="Ghi chú"
                  value={subject.note}
                  onChange={(e) => {
                    const updatedData = [...data];
                    updatedData[index].subjects[subIndex].note = e.target.value;
                    setData(updatedData);
                  }}
                  className="bg-gray-100 text-black px-3 py-2 rounded border w-full mt-2"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </Menu>
  );
};

export default TeachingReport;
