import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

import { format, parse } from 'date-fns';

import { getReportDetailByDayOrClassOrSubject } from '../../../api/TeachingReport';
import { getClassTeacherBySchoolYear } from '../../../api/Schedules';
import { getSubjectByGrade } from '../../../api/Subject';

export default function TeachingPlans() {
  const { user } = useContext(UserContext);
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [listClassNames, setListClassNames] = useState([]);
  const [listSubjects, setListSubjects] = useState([]);
  const [dataManyDay, setDataManyDay] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState({
    date: '',
    subIndex: '',
  });
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

  useEffect(() => {
    if (className === '') {
      setSubjectName('');
    }

    const firstCharacters = className.charAt(0);
    getSubjectByGrade(firstCharacters)
      .then((data) => {
        setListSubjects(data);
      })
      .catch((error) => {
        console.error('Get subject by grade error:', error.response ? error.response.data : error.message);
        throw error;
      });
  }, [className]);

  const handleSearch = () => {
    let date = '';
    if (selectedDate && !isNaN(new Date(selectedDate).getTime())) {
      date = format(new Date(selectedDate), 'dd/MM/yyyy');
    }
    getReportDetailByDayOrClassOrSubject(getCurrentSchoolYear(), className, date, subjectName, user.teacherId)
      .then((data) => {
        let dataMany = {};
        data.teachingReports.forEach((report) => {
          report.reports.forEach((subject) => {
            if (dataMany[report._id.date]) {
              dataMany[report._id.date].push({
                subjectName: subject.subjectName,
                content: subject.content,
                note: subject.note,
                teacherName: subject.teacherName,
              });
            } else {
              dataMany[report._id.date] = [
                {
                  subjectName: subject.subjectName,
                  content: subject.content,
                  note: subject.note,
                  teacherName: subject.teacherName,
                },
              ];
            }
          });
        });
        console.log(dataMany);
        setDataManyDay(dataMany);
      })
      .catch((error) => {
        console.error(
          'Get report detail by day or class or subject error:',
          error.response ? error.response.data : error.message
        );
        throw error;
      });
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

  const datesToShow = Object.keys(dataManyDay).slice(currentPage * 5, (currentPage + 1) * 5);
  const totalPages = Math.ceil(Object.keys(dataManyDay).length / 5);

  return (
    <div>
      <div className="mx-4 my-2">
        <div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col justify-end gap-2 py-2">
              <span>Ngày báo bài</span>
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
              <span>Lớp báo bài</span>
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

            <div className="flex flex-col justify-end gap-2 py-2">
              <span>Môn học</span>
              <div>
                <select
                  onChange={(e) => {
                    setSubjectName(e.target.value);
                  }}
                  className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border"
                  defaultValue=""
                >
                  <option value="">Chọn môn học</option>
                  {listSubjects.map((elm, index) => (
                    <option key={index} value={elm.subjectName}>
                      {elm.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2 py-2">
              <button
                onClick={handleSearch}
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
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
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-32 min-w-32 text-left">Ngày</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-44 min-w-44 text-left">Môn học</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72 text-left">Nội dung</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72 text-left">Ghi chú</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100" colSpan={2}></th>
                </tr>
              </thead>
              <tbody>
                {datesToShow.map((date, index) => {
                  const daySubjects = dataManyDay[date] || [];
                  const dayName = getDayOfWeek(date);
                  return (
                    <React.Fragment key={index}>
                      {daySubjects.map((subject, subIndex) => (
                        <tr
                          key={subIndex}
                          className={`
                            ${activeIndex.date === date && activeIndex.subIndex === subIndex ? 'bg-blue-100' : ''}
                          `}
                        >
                          {subIndex === 0 && (
                            <td
                              rowSpan={daySubjects.length}
                              className="border bg-white border-gray-400 px-4 py-2 font-semibold"
                            >
                              <div className="grid grid-flow-row items-center justify-start">
                                <span>{dayName}</span>
                                <span>({date})</span>
                              </div>
                            </td>
                          )}
                          <td className="border border-gray-400 px-4 py-2">
                            {subject.subjectName}
                            {subject.teacherName !== user.userName ? (
                              <span className="text-red-500"> ({subject.teacherName})</span>
                            ) : null}
                          </td>
                          <td className="border border-gray-400 px-4 py-2">
                            <textarea
                              disabled={activeIndex.date !== date || activeIndex.subIndex !== subIndex ? true : false}
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
                              disabled={activeIndex.date !== date || activeIndex.subIndex !== subIndex ? true : false}
                              onChange={(e) => {
                                const newTimetable = { ...dataManyDay };
                                newTimetable[date][subIndex].note = e.target.value;
                                setDataManyDay(newTimetable);
                              }}
                              value={subject.note}
                              className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                            ></textarea>
                          </td>

                          {activeIndex.date === date && activeIndex.subIndex === subIndex ? (
                            <>
                              <td className="border border-gray-400 px-4 py-2 w-10 min-w-10">
                                <div className="flex items-center justify-center gap-2">
                                  <i class="fa-solid fa-rotate-right cursor-pointer text-blue-500 hover:text-blue-600"></i>
                                </div>
                              </td>
                              <td className="border border-gray-400 px-4 py-2 w-10 min-w-10">
                                <div className="flex items-center justify-center gap-2">
                                  <i class="fa-solid fa-check cursor-pointer text-green-500 hover:text-green-600"></i>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="border border-gray-400 px-4 py-2 w-10 min-w-10">
                                <div className="flex items-center justify-center gap-2">
                                  <i className="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-600"></i>
                                </div>
                              </td>
                              <td className="border border-gray-400 px-4 py-2 w-10 min-w-10">
                                <div
                                  onClick={() => {
                                    setActiveIndex({
                                      date: date,
                                      subIndex: subIndex,
                                    });
                                  }}
                                  className="flex items-center justify-center gap-2"
                                >
                                  <i class="fa-solid fa-pen-to-square cursor-pointer text-sky-500 hover:text-sky-600"></i>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
