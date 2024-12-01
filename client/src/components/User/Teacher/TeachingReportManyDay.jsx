import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { format, getDay, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getClassTeacherBySchoolYear } from '../../../api/Schedules';
import { getScheduleByWeekDays } from '../../../api/Schedules';
import { saveTeachingReport } from '../../../api/TeachingReport';
import toast from 'react-hot-toast';

export default function TeachingReportManyDay() {
  const { user } = useContext(UserContext);
  const [listClassNames, setListClassNames] = useState([]);
  const [dataManyDay, setDataManyDay] = useState({});
  const [className, setClassName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [dateStart, setDateStart] = useState(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() + 1);
    return yesterday;
  });
  const [dateEnd, setDateEnd] = useState(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() + 1);
    return yesterday;
  });

  const isWeekday = (date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day !== 0 && day !== 6 && date > today;
  };

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

  const getDayName = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[getDay(date)];
  };

  const getDayOfWeek = (dateString) => {
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
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

  const handleCreateFromTimetableManyDay = () => {
    if (className === '') {
      toast.error('Vui lòng chọn lớp báo bài');
      return;
    }
    // if (dataManyDay && Object.keys(dataManyDay).length > 0) {
    //   const confirm = window.confirm('Bạn có muốn tạo mới báo bài? Những thay đổi trước đó sẽ bị mất!');
    //   if (!confirm) {
    //     return;
    //   }
    // }
    let weekDays = [];
    weekDays = getWeekdaysTimetableManyDay(dateStart, dateEnd);
    getScheduleByWeekDays(user.teacherId, weekDays, getCurrentSchoolYear())
      .then((data) => {
        let dataMany = {};
        data.schedules.forEach((schedule) => {
          schedule.arrSubject.forEach((subject) => {
            if (subject.className === className) {
              let currentDate = new Date(dateStart);
              currentDate.setHours(0, 0, 0, 0);
              const endDate = new Date(dateEnd);
              endDate.setHours(0, 0, 0, 0);
              while (currentDate <= endDate) {
                const dayName = getDayName(currentDate);
                if (dayName === schedule.day) {
                  if (dataMany[format(currentDate, 'dd/MM/yyyy')]) {
                    dataMany[format(currentDate, 'dd/MM/yyyy')].push({
                      subjectName: subject.subjectName,
                      content: '',
                      note: '',
                    });
                  } else {
                    dataMany[format(currentDate, 'dd/MM/yyyy')] = [
                      {
                        subjectName: subject.subjectName,
                        content: '',
                        note: '',
                      },
                    ];
                  }
                }
                currentDate.setDate(currentDate.getDate() + 1);
              }
            }
          });
        });

        dataMany = Object.keys(dataMany)
          .sort((a, b) => {
            const dateA = parse(a, 'dd/MM/yyyy', new Date());
            const dateB = parse(b, 'dd/MM/yyyy', new Date());
            return dateA - dateB;
          })
          .reduce((acc, key) => {
            acc[key] = dataMany[key].sort((a, b) => a.subjectName.localeCompare(b.subjectName));
            return acc;
          }, {});

        setDataManyDay(dataMany);
      })
      .catch((error) => {
        console.error('Get class by day and teacher error:', error.response ? error.response.data : error.message);
        throw error;
      });

    toast.success('Tạo báo bài thành công');
  };

  function getWeekdaysTimetableManyDay(startDate, endDate) {
    let days = [];
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    endDate = new Date(endDate);
    endDate.setHours(0, 0, 0, 0);
    while (currentDate <= endDate) {
      let dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      days.push(dayName);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }

  const datesToShow = Object.keys(dataManyDay).slice(currentPage * 5, (currentPage + 1) * 5);
  const totalPages = Math.ceil(Object.keys(dataManyDay).length / 5);

  const handleDeleteSubject = (date, subIndex) => {
    const newTimetable = { ...dataManyDay };
    if (newTimetable[date]) {
      newTimetable[date].splice(subIndex, 1);
      if (newTimetable[date].length === 0) {
        delete newTimetable[date];
      }
      setDataManyDay(newTimetable);
      toast.success('Đã xóa môn học thành công!');
    } else {
      toast.error('Không tìm thấy môn học cần xóa!');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * 5 < Object.keys(dataManyDay).length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSaveReport = () => {
    for (const date in dataManyDay) {
      for (const subject of dataManyDay[date]) {
        if (subject.content === '') {
          toast.error('Vui lòng nhập nội dung cho môn học');
          return;
        }
      }
    }

    const academicYear = getCurrentSchoolYear();
    const classReport = className;
    const teachCreate = user.teacherId;
    saveTeachingReport(academicYear, classReport, teachCreate, dataManyDay)
      .then((data) => {
        toast.success('Lưu báo bài thành công');
      })
      .catch((error) => {
        console.error('Save teaching report error:', error.response ? error.response.data : error.message);
        toast.error('Lưu báo bài thất bại');
        throw error;
      });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2 py-2">
        <div className="flex flex-col justify-end gap-2 py-2">
          <span>
            Ngày bắt đầu:<span className="text-red-500">*</span>
          </span>
          <div>
            <DatePicker
              selected={dateStart}
              onChange={(date) => setDateStart(date)}
              filterDate={isWeekday}
              dateFormat="dd/MM/yyyy"
              className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2 py-2">
          <span>
            Ngày kết thúc:<span className="text-red-500">*</span>
          </span>
          <div>
            <DatePicker
              selected={dateEnd}
              onChange={(date) => setDateEnd(date)}
              filterDate={isWeekday}
              dateFormat="dd/MM/yyyy"
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
            onClick={handleCreateFromTimetableManyDay}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tạo báo bài
          </button>
        </div>

        <div className="flex gap-2 py-2">
          <button
            onClick={handleSaveReport}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-[5rem]"
          >
            Lưu
          </button>
        </div>
      </div>

      <div className="flex items-center justify-start gap-4 py-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${
            currentPage === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <div className="min-w-24 w-24 flex items-center justify-start text-center">
          {Object.keys(dataManyDay).length > 0 ? (
            <span className="text-lg font-semibold w-full">
              Page: {currentPage + 1} / {totalPages}
            </span>
          ) : (
            <span className="text-lg font-semibold w-full">Page: 0 / 0</span>
          )}
        </div>
        <button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded ${
            (currentPage + 1) * 5 >= Object.keys(dataManyDay).length
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>

      <div className="grid grid-flow-row gap-2 py-2">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-36 min-w-36 text-left">Ngày</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-44 min-w-44 text-left">Môn học</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72 text-left">
                Nội dung<span className="text-red-500">*</span>
              </th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72 text-left">Ghi chú</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-14 min-w-14"></th>
            </tr>
          </thead>
          <tbody>
            {datesToShow.map((date, index) => {
              const daySubjects = dataManyDay[date] || [];
              const dayName = getDayOfWeek(date);
              return (
                <React.Fragment key={index}>
                  {daySubjects.map((subject, subIndex) => (
                    <tr key={subIndex}>
                      {subIndex === 0 && (
                        <td rowSpan={daySubjects.length} className="border border-gray-400 px-4 py-2 font-semibold">
                          {dayName} ({date})
                        </td>
                      )}
                      <td className="border border-gray-400 px-4 py-2">{subject.subjectName}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        <textarea
                          onChange={(e) => {
                            const newTimetable = { ...dataManyDay };
                            newTimetable[date][subIndex].content = e.target.value;
                            setDataManyDay(newTimetable);
                          }}
                          value={subject.content}
                          className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                        ></textarea>
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <textarea
                          onChange={(e) => {
                            const newTimetable = { ...dataManyDay };
                            newTimetable[date][subIndex].note = e.target.value;
                            setDataManyDay(newTimetable);
                          }}
                          value={subject.note}
                          className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                        ></textarea>
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <div
                          onClick={() => handleDeleteSubject(date, subIndex)}
                          className="flex items-center justify-center"
                        >
                          <i className="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-600"></i>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
