// import React, { useState } from 'react';
// import { format, getDay, addDays, startOfWeek, endOfWeek } from 'date-fns';

// const BaoBaiTable = () => {
//   const subjectsFromDB = {
//     Monday: [
//       { name: 'Toán', content: 'Bài 1: Số học', note: 'Ôn tập' },
//       { name: 'Tiếng Việt', content: 'Đọc: Chuyện cổ tích', note: '' },
//     ],
//     Tuesday: [
//       { name: 'Tiếng Anh', content: 'Unit 1: Hello', note: '' },
//       { name: 'Thể dục', content: 'Chạy 100m', note: 'Mang giày' },
//     ],
//     Wednesday: [{ name: 'Toán', content: 'Bài 2: Hình học', note: '' }],
//     Thursday: [{ name: 'Âm nhạc', content: 'Bài hát mới', note: '' }],
//     Friday: [{ name: 'Mỹ thuật', content: 'Vẽ tranh phong cảnh', note: '' }],
//     Saturday: [{ name: 'Khoa học', content: 'Bài thực hành', note: '' }],
//     Sunday: [],
//   };

//   const [currentPage, setCurrentPage] = useState(1);
//   const [startDate, setStartDate] = useState(new Date('2024-11-01')); // Ngày bắt đầu mặc định
//   const [endDate, setEndDate] = useState(new Date('2024-12-31')); // Ngày kết thúc mặc định
//   const daysPerPage = 7; // Hiển thị 7 ngày mỗi lần

//   // Hàm lấy tên thứ trong tuần
//   const getDayName = (date) => {
//     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     return daysOfWeek[getDay(date)];
//   };

//   // Hàm lấy danh sách 7 ngày trong tuần, bắt đầu từ Thứ 2
//   const getWeekDates = (page) => {
//     const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
//     const weekStartPage = addDays(weekStart, (page - 1) * daysPerPage);
//     let dates = [];
//     for (let i = 0; i < daysPerPage; i++) {
//       const currentDate = addDays(weekStartPage, i);
//       if (currentDate > endDate) break; // Không hiển thị ngày sau ngày kết thúc
//       dates.push(currentDate);
//     }
//     return dates;
//   };

//   // Lấy danh sách ngày hiện tại
//   const currentDays = getWeekDates(currentPage);

//   // Hàm phân trang
//   const nextPage = () => setCurrentPage((prev) => prev + 1);
//   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Báo Bài</h2>

//       <div className="mb-4">
//         <label htmlFor="start-date" className="block mb-2">
//           Chọn ngày bắt đầu:
//         </label>
//         <input
//           type="date"
//           id="start-date"
//           value={format(startDate, 'yyyy-MM-dd')}
//           onChange={(e) => setStartDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="end-date" className="block mb-2">
//           Chọn ngày kết thúc:
//         </label>
//         <input
//           type="date"
//           id="end-date"
//           value={format(endDate, 'yyyy-MM-dd')}
//           onChange={(e) => setEndDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <table className="w-full border-collapse border border-gray-400">
//         <thead>
//           <tr>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Ngày</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Môn học</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Nội dung</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Ghi chú</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentDays.map((date, index) => {
//             const dayName = getDayName(date);
//             const daySubjects = subjectsFromDB[dayName] || []; // Dữ liệu môn học cho ngày đó
//             return (
//               <React.Fragment key={index}>
//                 {daySubjects.length > 0 ? (
//                   daySubjects.map((subject, subIndex) => (
//                     <tr key={subIndex}>
//                       {subIndex === 0 && (
//                         <td rowSpan={daySubjects.length} className="border border-gray-400 px-4 py-2 font-semibold">
//                           {format(date, 'dd/MM/yyyy')}
//                         </td>
//                       )}
//                       <td className="border border-gray-400 px-4 py-2">{subject.name}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.content}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.note}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td className="border border-gray-400 px-4 py-2 font-semibold">{format(date, 'dd/MM/yyyy')}</td>
//                     <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
//                       Không có báo bài
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>

//       <table className="w-full border-collapse border border-gray-400">
//         {/* Table Header */}
//         <thead>
//           <tr>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Ngày</th>
//             {currentDays.map((date) => (
//               <th key={format(date, 'yyyy-MM-dd')} className="border border-gray-400 px-4 py-2 bg-gray-100">
//                 {format(date, 'dd/MM/yyyy')} ({getDayName(date)})
//               </th>
//             ))}
//           </tr>
//         </thead>

//         {/* Table Body */}
//         <tbody>
//           <tr>
//             <td className="border border-gray-400 px-4 py-2 font-semibold">Môn học</td>
//             {currentDays.map((date) => {
//               const dayName = getDayName(date); // Lấy tên thứ
//               const daySubjects = subjectsFromDB[dayName] || []; // Dữ liệu môn học từ DB
//               return (
//                 <td key={format(date, 'yyyy-MM-dd')} className="border border-gray-400 px-4 py-2">
//                   {daySubjects.map((subject, index) => (
//                     <div key={index} className="mb-2 border border-gray-400 p-2 rounded">
//                       <input
//                         type="text"
//                         value={subject.name}
//                         placeholder="Tên môn"
//                         readOnly
//                         className="block w-full border border-gray-400 mb-2 p-1 rounded bg-gray-100"
//                       />
//                       <input
//                         type="text"
//                         value={subject.content}
//                         placeholder="Nội dung bài mới"
//                         readOnly
//                         className="block w-full border border-gray-400 mb-2 p-1 rounded bg-gray-100"
//                       />
//                       <input
//                         type="text"
//                         value={subject.note}
//                         placeholder="Ghi chú"
//                         readOnly
//                         className="block w-full border border-gray-400 p-1 rounded bg-gray-100"
//                       />
//                     </div>
//                   ))}
//                 </td>
//               );
//             })}
//           </tr>
//         </tbody>
//       </table>

//       {/* Phân trang */}
//       <div className="mt-4 flex justify-between">
//         <button onClick={prevPage} disabled={currentPage === 1} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Trước
//         </button>
//         <button
//           onClick={nextPage}
//           disabled={currentDays.length < daysPerPage}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Sau
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BaoBaiTable;

import React, { useState } from 'react';
import { startOfWeek, endOfWeek, addDays, format } from 'date-fns';

const BaoBaiByWeek = () => {
  const sampleData = {
    Monday: [
      { name: 'Toán', content: 'Ôn tập chương 1', note: '' },
      { name: 'Tiếng Việt', content: 'Đọc hiểu bài thơ', note: '' },
    ],
    Tuesday: [
      { name: 'Tiếng Anh', content: 'Unit 2: My family', note: 'Mang từ điển' },
      { name: 'Khoa học', content: 'Bài 5: Hệ mặt trời', note: '' },
    ],
    Wednesday: [
      { name: 'Lịch sử', content: 'Chương 3: Chiến tranh', note: '' },
      { name: 'Địa lý', content: 'Bài 6: Địa hình Việt Nam', note: '' },
    ],
    Thursday: [
      { name: 'Thể dục', content: 'Chạy 200m', note: 'Mang giày' },
      { name: 'Âm nhạc', content: 'Học hát bài dân ca', note: '' },
    ],
    Friday: [
      { name: 'Công nghệ', content: 'Lắp ráp mạch điện', note: '' },
      { name: 'Sinh học', content: 'Phân loại động vật', note: '' },
    ],
    Saturday: [
      { name: 'Vật lý', content: 'Bài 3: Động lực học', note: '' },
      { name: 'Hóa học', content: 'Bài 2: Phản ứng hóa học', note: '' },
    ],
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [subjects, setSubjects] = useState(sampleData);

  // Lấy tuần hiện tại
  const currentWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  // Lấy danh sách các ngày trong tuần hiện tại
  const getWeekDates = () => {
    let dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(currentWeekStart, i));
    }
    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Báo Bài Theo Tuần</h2>

      {/* Chọn ngày để xác định tuần */}
      <div className="mb-4">
        <label htmlFor="select-date" className="block mb-2">
          Chọn ngày:
        </label>
        <input
          type="date"
          id="select-date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border border-gray-400 p-2 rounded"
        />
      </div>

      <p className="mb-4">
        Tuần: {format(currentWeekStart, 'dd/MM/yyyy')} - {format(currentWeekEnd, 'dd/MM/yyyy')}
      </p>

      {/* Hiển thị bảng báo bài */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2 bg-gray-100">Thứ</th>
            <th className="border border-gray-400 px-4 py-2 bg-gray-100">Môn học</th>
            <th className="border border-gray-400 px-4 py-2 bg-gray-100">Nội dung</th>
            <th className="border border-gray-400 px-4 py-2 bg-gray-100">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {weekDates.map((date, index) => {
            const dayName = format(date, 'EEEE'); // Tên ngày (Monday, Tuesday,...)
            const daySubjects = subjects[dayName] || []; // Dữ liệu môn học cho ngày đó
            return (
              <React.Fragment key={index}>
                {daySubjects.length > 0 ? (
                  daySubjects.map((subject, subIndex) => (
                    <tr key={subIndex}>
                      {subIndex === 0 && (
                        <td rowSpan={daySubjects.length} className="border border-gray-400 px-4 py-2 font-semibold">
                          {dayName} ({format(date, 'dd/MM/yyyy')})
                        </td>
                      )}
                      <td className="border border-gray-400 px-4 py-2">{subject.subjectName}</td>
                      <td className="border border-gray-400 px-4 py-2">{subject.content}</td>
                      <td className="border border-gray-400 px-4 py-2">{subject.note}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-gray-400 px-4 py-2 font-semibold">
                      {dayName} ({format(date, 'dd/MM/yyyy')})
                    </td>
                    <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
                      Không có báo bài
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BaoBaiByWeek;

// import React, { useState } from 'react';
// import { startOfWeek, endOfWeek, addDays, format } from 'date-fns';

// const BaoBaiByWeek = () => {
//   const sampleData = {
//     Monday: [
//       { name: 'Toán', content: 'Ôn tập chương 1', note: '' },
//       { name: 'Tiếng Việt', content: 'Đọc hiểu bài thơ', note: '' },
//     ],
//     Tuesday: [
//       { name: 'Tiếng Anh', content: 'Unit 2: My family', note: 'Mang từ điển' },
//       { name: 'Khoa học', content: 'Bài 5: Hệ mặt trời', note: '' },
//     ],
//     Wednesday: [
//       { name: 'Lịch sử', content: 'Chương 3: Chiến tranh', note: '' },
//       { name: 'Địa lý', content: 'Bài 6: Địa hình Việt Nam', note: '' },
//     ],
//     Thursday: [
//       { name: 'Thể dục', content: 'Chạy 200m', note: 'Mang giày' },
//       { name: 'Âm nhạc', content: 'Học hát bài dân ca', note: '' },
//     ],
//     Friday: [
//       { name: 'Công nghệ', content: 'Lắp ráp mạch điện', note: '' },
//       { name: 'Sinh học', content: 'Phân loại động vật', note: '' },
//     ],
//     Saturday: [
//       { name: 'Vật lý', content: 'Bài 3: Động lực học', note: '' },
//       { name: 'Hóa học', content: 'Bài 2: Phản ứng hóa học', note: '' },
//     ],
//   };

//   const [selectedStartDate, setSelectedStartDate] = useState(new Date());
//   const [selectedEndDate, setSelectedEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
//   const [subjects, setSubjects] = useState(sampleData);

//   // Lấy tuần hiện tại
//   const currentWeekStart = startOfWeek(selectedStartDate, { weekStartsOn: 1 });
//   const currentWeekEnd = endOfWeek(selectedEndDate, { weekStartsOn: 1 });

//   // Lấy danh sách các ngày trong tuần hiện tại
//   const getWeekDates = () => {
//     let dates = [];
//     for (let i = 0; i < 7; i++) {
//       dates.push(addDays(currentWeekStart, i));
//     }
//     return dates;
//   };

//   const weekDates = getWeekDates();

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Báo Bài Theo Tuần</h2>

//       {/* Chọn ngày để xác định tuần */}
//       <div className="mb-4">
//         <label htmlFor="select-start-date" className="block mb-2">
//           Chọn ngày bắt đầu:
//         </label>
//         <input
//           type="date"
//           id="select-start-date"
//           value={format(selectedStartDate, 'yyyy-MM-dd')}
//           onChange={(e) => setSelectedStartDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="select-end-date" className="block mb-2">
//           Chọn ngày kết thúc:
//         </label>
//         <input
//           type="date"
//           id="select-end-date"
//           value={format(selectedEndDate, 'yyyy-MM-dd')}
//           onChange={(e) => setSelectedEndDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <p className="mb-4">
//         Tuần: {format(currentWeekStart, 'dd/MM/yyyy')} - {format(currentWeekEnd, 'dd/MM/yyyy')}
//       </p>

//       {/* Hiển thị bảng báo bài */}
//       <table className="w-full border-collapse border border-gray-400">
//         <thead>
//           <tr>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Thứ</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Môn học</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Nội dung</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Ghi chú</th>
//           </tr>
//         </thead>
//         <tbody>
//           {weekDates.map((date, index) => {
//             const dayName = format(date, 'EEEE'); // Tên ngày (Monday, Tuesday,...)
//             const daySubjects = subjects[dayName] || []; // Dữ liệu môn học cho ngày đó
//             return (
//               <React.Fragment key={index}>
//                 {daySubjects.length > 0 ? (
//                   daySubjects.map((subject, subIndex) => (
//                     <tr key={subIndex}>
//                       {subIndex === 0 && (
//                         <td rowSpan={daySubjects.length} className="border border-gray-400 px-4 py-2 font-semibold">
//                           {dayName} ({format(date, 'dd/MM/yyyy')})
//                         </td>
//                       )}
//                       <td className="border border-gray-400 px-4 py-2">{subject.name}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.content}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.note}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td className="border border-gray-400 px-4 py-2 font-semibold">
//                       {dayName} ({format(date, 'dd/MM/yyyy')})
//                     </td>
//                     <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
//                       Không có báo bài
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BaoBaiByWeek;

// import React, { useState } from 'react';
// import { startOfWeek, endOfWeek, addDays, format } from 'date-fns';

// const BaoBaiByWeek = () => {
//   const sampleData = {
//     Monday: [
//       { name: 'Toán', content: 'Ôn tập chương 1', note: '' },
//       { name: 'Tiếng Việt', content: 'Đọc hiểu bài thơ', note: '' },
//     ],
//     Tuesday: [
//       { name: 'Tiếng Anh', content: 'Unit 2: My family', note: 'Mang từ điển' },
//       { name: 'Khoa học', content: 'Bài 5: Hệ mặt trời', note: '' },
//     ],
//     Wednesday: [
//       { name: 'Lịch sử', content: 'Chương 3: Chiến tranh', note: '' },
//       { name: 'Địa lý', content: 'Bài 6: Địa hình Việt Nam', note: '' },
//     ],
//     Thursday: [
//       { name: 'Thể dục', content: 'Chạy 200m', note: 'Mang giày' },
//       { name: 'Âm nhạc', content: 'Học hát bài dân ca', note: '' },
//     ],
//     Friday: [
//       { name: 'Công nghệ', content: 'Lắp ráp mạch điện', note: '' },
//       { name: 'Sinh học', content: 'Phân loại động vật', note: '' },
//     ],
//     Saturday: [
//       { name: 'Vật lý', content: 'Bài 3: Động lực học', note: '' },
//       { name: 'Hóa học', content: 'Bài 2: Phản ứng hóa học', note: '' },
//     ],
//   };

//   const [selectedStartDate, setSelectedStartDate] = useState(new Date());
//   const [selectedEndDate, setSelectedEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
//   const [subjects, setSubjects] = useState(sampleData);

//   // Lấy tuần hiện tại
//   const currentWeekStart = startOfWeek(selectedStartDate, { weekStartsOn: 1 });
//   const currentWeekEnd = endOfWeek(selectedEndDate, { weekStartsOn: 1 });

//   // Lấy danh sách các ngày trong tuần hiện tại
//   const getWeekDates = () => {
//     let dates = [];
//     for (let i = 0; i < 7; i++) {
//       dates.push(addDays(currentWeekStart, i));
//     }
//     return dates;
//   };

//   const weekDates = getWeekDates();

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Báo Bài Theo Tuần</h2>

//       {/* Chọn ngày để xác định tuần */}
//       <div className="mb-4">
//         <label htmlFor="select-start-date" className="block mb-2">
//           Chọn ngày bắt đầu:
//         </label>
//         <input
//           type="date"
//           id="select-start-date"
//           value={format(selectedStartDate, 'yyyy-MM-dd')}
//           onChange={(e) => setSelectedStartDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="select-end-date" className="block mb-2">
//           Chọn ngày kết thúc:
//         </label>
//         <input
//           type="date"
//           id="select-end-date"
//           value={format(selectedEndDate, 'yyyy-MM-dd')}
//           onChange={(e) => setSelectedEndDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <p className="mb-4">
//         Tuần: {format(currentWeekStart, 'dd/MM/yyyy')} - {format(currentWeekEnd, 'dd/MM/yyyy')}
//       </p>

//       {/* Hiển thị bảng báo bài */}
//       <table className="w-full border-collapse border border-gray-400">
//         <thead>
//           <tr>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Thứ</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Môn học</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Nội dung</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Ghi chú</th>
//           </tr>
//         </thead>
//         <tbody>
//           {weekDates.map((date, index) => {
//             const dayName = format(date, 'EEEE'); // Tên ngày (Monday, Tuesday,...)
//             const daySubjects = subjects[dayName] || []; // Dữ liệu môn học cho ngày đó
//             return (
//               <React.Fragment key={index}>
//                 {daySubjects.length > 0 ? (
//                   daySubjects.map((subject, subIndex) => (
//                     <tr key={subIndex}>
//                       {subIndex === 0 && (
//                         <td rowSpan={daySubjects.length} className="border border-gray-400 px-4 py-2 font-semibold">
//                           {dayName} ({format(date, 'dd/MM/yyyy')})
//                         </td>
//                       )}
//                       <td className="border border-gray-400 px-4 py-2">{subject.name}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.content}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.note}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td className="border border-gray-400 px-4 py-2 font-semibold">
//                       {dayName} ({format(date, 'dd/MM/yyyy')})
//                     </td>
//                     <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
//                       Không có báo bài
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BaoBaiByWeek;

// import React, { useState } from 'react';
// import { startOfWeek, endOfWeek, addDays, format, subWeeks, addWeeks } from 'date-fns';

// const BaoBaiByWeek = () => {
//   const sampleData = {
//     Monday: [
//       { name: 'Toán', content: 'Ôn tập chương 1', note: '' },
//       { name: 'Tiếng Việt', content: 'Đọc hiểu bài thơ', note: '' },
//     ],
//     Tuesday: [
//       { name: 'Tiếng Anh', content: 'Unit 2: My family', note: 'Mang từ điển' },
//       { name: 'Khoa học', content: 'Bài 5: Hệ mặt trời', note: '' },
//     ],
//     Wednesday: [
//       { name: 'Lịch sử', content: 'Chương 3: Chiến tranh', note: '' },
//       { name: 'Địa lý', content: 'Bài 6: Địa hình Việt Nam', note: '' },
//     ],
//     Thursday: [
//       { name: 'Thể dục', content: 'Chạy 200m', note: 'Mang giày' },
//       { name: 'Âm nhạc', content: 'Học hát bài dân ca', note: '' },
//     ],
//     Friday: [
//       { name: 'Công nghệ', content: 'Lắp ráp mạch điện', note: '' },
//       { name: 'Sinh học', content: 'Phân loại động vật', note: '' },
//     ],
//     Saturday: [
//       { name: 'Vật lý', content: 'Bài 3: Động lực học', note: '' },
//       { name: 'Hóa học', content: 'Bài 2: Phản ứng hóa học', note: '' },
//     ],
//   };

//   const [selectedStartDate, setSelectedStartDate] = useState(new Date());
//   const [selectedEndDate, setSelectedEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
//   const [subjects, setSubjects] = useState(sampleData);

//   // Lấy tuần hiện tại
//   const currentWeekStart = startOfWeek(selectedStartDate, { weekStartsOn: 1 });
//   const currentWeekEnd = endOfWeek(selectedEndDate, { weekStartsOn: 1 });

//   // Lấy danh sách các ngày trong tuần hiện tại
//   const getWeekDates = () => {
//     let dates = [];
//     for (let i = 0; i < 7; i++) {
//       dates.push(addDays(currentWeekStart, i));
//     }
//     return dates;
//   };

//   const weekDates = getWeekDates();

//   const handlePreviousWeek = () => {
//     setSelectedStartDate(subWeeks(selectedStartDate, 1));
//     setSelectedEndDate(subWeeks(selectedEndDate, 1));
//   };

//   const handleNextWeek = () => {
//     setSelectedStartDate(addWeeks(selectedStartDate, 1));
//     setSelectedEndDate(addWeeks(selectedEndDate, 1));
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Báo Bài Theo Tuần</h2>

//       {/* Chọn ngày để xác định tuần */}
//       <div className="mb-4">
//         <label htmlFor="select-start-date" className="block mb-2">
//           Chọn ngày bắt đầu:
//         </label>
//         <input
//           type="date"
//           id="select-start-date"
//           value={format(selectedStartDate, 'yyyy-MM-dd')}
//           onChange={(e) => setSelectedStartDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="select-end-date" className="block mb-2">
//           Chọn ngày kết thúc:
//         </label>
//         <input
//           type="date"
//           id="select-end-date"
//           value={format(selectedEndDate, 'yyyy-MM-dd')}
//           onChange={(e) => setSelectedEndDate(new Date(e.target.value))}
//           className="border border-gray-400 p-2 rounded"
//         />
//       </div>

//       <p className="mb-4">
//         Tuần: {format(currentWeekStart, 'dd/MM/yyyy')} - {format(currentWeekEnd, 'dd/MM/yyyy')}
//       </p>

//       {/* Paging buttons */}
//       <div className="mb-4">
//         <button onClick={handlePreviousWeek} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
//           Tuần trước
//         </button>
//         <button onClick={handleNextWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
//           Tuần sau
//         </button>
//       </div>

//       {/* Hiển thị bảng báo bài */}
//       <table className="w-full border-collapse border border-gray-400">
//         <thead>
//           <tr>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Thứ</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Môn học</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Nội dung</th>
//             <th className="border border-gray-400 px-4 py-2 bg-gray-100">Ghi chú</th>
//           </tr>
//         </thead>
//         <tbody>
//           {weekDates.map((date, index) => {
//             const dayName = format(date, 'EEEE'); // Tên ngày (Monday, Tuesday,...)
//             const daySubjects = subjects[dayName] || []; // Dữ liệu môn học cho ngày đó
//             return (
//               <React.Fragment key={index}>
//                 {daySubjects.length > 0 ? (
//                   daySubjects.map((subject, subIndex) => (
//                     <tr key={subIndex}>
//                       {subIndex === 0 && (
//                         <td rowSpan={daySubjects.length} className="border border-gray-400 px-4 py-2 font-semibold">
//                           {dayName} ({format(date, 'dd/MM/yyyy')})
//                         </td>
//                       )}
//                       <td className="border border-gray-400 px-4 py-2">{subject.name}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.content}</td>
//                       <td className="border border-gray-400 px-4 py-2">{subject.note}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td className="border border-gray-400 px-4 py-2 font-semibold">
//                       {dayName} ({format(date, 'dd/MM/yyyy')})
//                     </td>
//                     <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
//                       Không có báo bài
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BaoBaiByWeek;
