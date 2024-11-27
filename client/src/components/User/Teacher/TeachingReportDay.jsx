import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getScheduleByDay, getClassTeacherBySchoolYear } from '../../../api/Schedules';
import toast from 'react-hot-toast';

export default function TeachingReportDay() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [className, setClassName] = useState('');
  const [listClassNames, setListClassNames] = useState([]);
  const isWeekday = (date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day !== 0 && day !== 6 && date > today;
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() + 1);
    return yesterday;
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

  useEffect(() => {
    getClassTeacherBySchoolYear(user.teacherId, getCurrentSchoolYear())
      .then((data) => {
        setListClassNames(data.classNames);
      })
      .catch((error) => {
        console.error('Get class teacher by school year error:', error.response ? error.response.data : error.message);
        throw error;
      });
  }, [user.teacherId]);

  function getDayOfWeek(inputDate) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let date;
    if (inputDate instanceof Date) {
      date = inputDate;
    } else if (typeof inputDate === 'string') {
      date = new Date(inputDate);
    } else {
      return 'Invalid date!';
    }

    if (isNaN(date.getTime())) return 'Invalid date!';
    return daysOfWeek[date.getDay()];
  }

  const handleCreateFromTimetableDay = () => {
    if (className === '') {
      toast.error('Vui lòng chọn lớp báo bài');
      return;
    }

    // if (data.length > 0) {
    //   const confirm = window.confirm('Bạn có muốn tạo mới báo bài?');
    //   if (!confirm) {
    //     return;
    //   }
    // }

    const day = getDayOfWeek(selectedDate);
    getScheduleByDay(user.teacherId, day, getCurrentSchoolYear())
      .then((data) => {
        setData([]);
        let newTimetable = {};
        let subjectNames = [];
        data.schedules[0].arrSubject.forEach((elm) => {
          if (elm.className === className) {
            subjectNames.push(elm.subjectName);
          }
        });
        const date = format(selectedDate, 'yyyy-MM-dd');
        newTimetable[date] = subjectNames;
        const subjects = newTimetable[date];
        const newData = subjects.map((subject) => ({
          subjectName: subject,
          content: '',
          note: '',
        }));

        //sort data by subject name
        newData.sort((a, b) => {
          if (a.subjectName < b.subjectName) {
            return -1;
          }
          if (a.subjectName > b.subjectName) {
            return 1;
          }
          return 0;
        });
        setData(newData);
      })
      .catch((error) => {
        console.error('Get class by day and teacher error:', error.response ? error.response.data : error.message);
        throw error;
      });

    toast.success('Tạo báo bài thành công');
  };

  const handleRemoveReport = (index) => {
    const newData = data.filter((_, i) => i !== index);
    console.log(newData);
    setData(newData);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col justify-end gap-2 py-2">
          <span>
            Ngày báo bài<span className="text-red-500">*</span>
          </span>
          <div>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              filterDate={isWeekday}
              className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2 py-2">
          <span>
            Lớp báo bài<span className="text-red-500">*</span>
          </span>
          <div>
            <select
              onChange={(e) => {
                setClassName(e.target.value);
              }}
              className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border"
              defaultValue=""
            >
              <option value="">Chọn lớp</option>
              {listClassNames.map((elm, index) => (
                <option key={index} value={elm.className}>
                  {elm.className}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 py-2">
          <button
            onClick={handleCreateFromTimetableDay}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tạo báo bài
          </button>
        </div>
      </div>

      <div className="grid grid-flow-row gap-2 py-2">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-36 min-w-36">Ngày</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-44 min-w-44">Môn học</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72">Nội dung</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72">Ghi chú</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-10 min-w-10"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((subject, subIndex) => {
              const dayName = getDayOfWeek(selectedDate);
              return (
                <tr key={subIndex}>
                  {subIndex === 0 && (
                    <td rowSpan={data.length} className="border border-gray-400 px-4 py-2 font-semibold">
                      {dayName} ({format(selectedDate, 'dd/MM/yyyy')})
                    </td>
                  )}
                  <td className="border border-gray-400 px-4 py-2">{subject.subjectName}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    <textarea
                      onChange={(e) => {
                        const newData = [...data];
                        newData[subIndex].content = e.target.value;
                        setData(newData);
                      }}
                      value={subject.content}
                      className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                    ></textarea>
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <textarea
                      onChange={(e) => {
                        const newData = [...data];
                        newData[subIndex].note = e.target.value;
                        setData(newData);
                      }}
                      value={subject.note}
                      className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                    ></textarea>
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <div onClick={() => handleRemoveReport(subIndex)} className="flex items-center justify-center">
                      <i class="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-600"></i>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
