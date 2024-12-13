/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { format, parse } from 'date-fns';
import 'flowbite';
import React, { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { UserContext } from '../../../UserContext';
import Swal from 'sweetalert2';

import { getClassTeacherBySchoolYear } from '../../../api/Schedules';
import { getSubjectByGrade } from '../../../api/Subject';
import { getReportDetailByDayOrClassOrSubject, updateTeachingReport } from '../../../api/TeachingReport';

export default function TeachingPlans() {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState('idle');
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [listClassNames, setListClassNames] = useState([]);
  const [listSubjects, setListSubjects] = useState([]);
  const [dataManyDay, setDataManyDay] = useState({});
  const [dataManyBk, setDataManyBk] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState({
    date: '',
    subIndex: '',
  });
  const isWeekday = (date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day !== 0 && day !== 6;
  };

  const [dateStart, setDateStart] = useState(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() + 0);
    return yesterday;
  });
  const [dateEnd, setDateEnd] = useState(() => {
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
    if (status === 'changed') {
      Swal.fire({
        title: 'Thay đổi chưa lưu. Bạn có muốn tiếp tục?',
        icon: 'warning',
        showCancelButton: true,
        howCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Tiếp tục',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          if (className === '') {
            toast.error('Vui lòng chọn lớp');
            return;
          }

          let dateToStart = '';
          let dateToEnd = '';
          if (dateStart && !isNaN(new Date(dateStart).getTime())) {
            dateToStart = format(new Date(dateStart), 'dd/MM/yyyy');
          }
          if (dateEnd && !isNaN(new Date(dateEnd).getTime())) {
            dateToEnd = format(new Date(dateEnd), 'dd/MM/yyyy');
          }
          getReportDetailByDayOrClassOrSubject(
            getCurrentSchoolYear(),
            className,
            dateToStart,
            dateToEnd,
            subjectName,
            user.teacherId
          )
            .then((data) => {
              if (data.teachingReports.length === 0) {
                toast.error('Không tìm thấy báo bài!');
                setDataManyDay({});
                setDataManyBk({});
                return;
              }

              let dataMany = {};
              data.teachingReports.forEach((report) => {
                report.reports.forEach((subject) => {
                  if (dataMany[report._id.date]) {
                    dataMany[report._id.date].push({
                      subjectName: subject.subjectName,
                      content: subject.content,
                      note: subject.note,
                      teacherName: subject.teacherName,
                      detele: 0,
                    });
                  } else {
                    dataMany[report._id.date] = [
                      {
                        subjectName: subject.subjectName,
                        content: subject.content,
                        note: subject.note,
                        teacherName: subject.teacherName,
                        detele: 0,
                      },
                    ];
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
              setDataManyBk(dataMany);
            })
            .catch((error) => {
              console.error(
                'Get report detail by day or class or subject error:',
                error.response ? error.response.data : error.message
              );
              throw error;
            });
          setStatus('idle');
        }
      });
    } else {
      if (className === '') {
        toast.error('Vui lòng chọn lớp');
        return;
      }
      let dateToStart = '';
      let dateToEnd = '';
      if (dateStart && !isNaN(new Date(dateStart).getTime())) {
        dateToStart = format(new Date(dateStart), 'dd/MM/yyyy');
      }
      if (dateEnd && !isNaN(new Date(dateEnd).getTime())) {
        dateToEnd = format(new Date(dateEnd), 'dd/MM/yyyy');
      }
      getReportDetailByDayOrClassOrSubject(
        getCurrentSchoolYear(),
        className,
        dateToStart,
        dateToEnd,
        subjectName,
        user.teacherId
      )
        .then((data) => {
          if (data.teachingReports.length === 0) {
            toast.error('Không tìm thấy báo bài!');
            setDataManyDay({});
            setDataManyBk({});
            return;
          }

          let dataMany = {};
          data.teachingReports.forEach((report) => {
            report.reports.forEach((subject) => {
              if (dataMany[report._id.date]) {
                dataMany[report._id.date].push({
                  subjectName: subject.subjectName,
                  content: subject.content,
                  note: subject.note,
                  teacherName: subject.teacherName,
                  detele: 0,
                });
              } else {
                dataMany[report._id.date] = [
                  {
                    subjectName: subject.subjectName,
                    content: subject.content,
                    note: subject.note,
                    teacherName: subject.teacherName,
                    detele: 0,
                  },
                ];
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
          setDataManyBk(dataMany);
        })
        .catch((error) => {
          console.error(
            'Get report detail by day or class or subject error:',
            error.response ? error.response.data : error.message
          );
          throw error;
        });
      setStatus('idle');
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

  const handleInputChange = (e, date, subIndex, field) => {
    const newTimetable = JSON.parse(JSON.stringify(dataManyDay));
    newTimetable[date][subIndex][field] = e.target.value;
    setDataManyDay(newTimetable);
    setStatus('changed');
  };

  const handleReset = (date, subIndex) => {
    if (dataManyBk[date] && dataManyBk[date][subIndex]) {
      const newTimetable = JSON.parse(JSON.stringify(dataManyDay));
      newTimetable[date][subIndex].content = dataManyBk[date][subIndex].content;
      newTimetable[date][subIndex].note = dataManyBk[date][subIndex].note;
      console.log('dataManyBk[date][subIndex].content:', dataManyBk[date][subIndex].content);
      setDataManyDay(newTimetable);
      setActiveIndex({
        date: '',
        subIndex: '',
      });
      setStatus('idle');
    } else {
      console.error('Invalid date or subIndex:', date, subIndex);
    }
  };

  const handleDeleteSubject = (date, subIndex) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa môn học này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
    }).then((result) => {
      if (result.isConfirmed) {
        const newTimetable = JSON.parse(JSON.stringify(dataManyDay));
        newTimetable[date][subIndex]['delete'] = 1;
        setDataManyDay(newTimetable);
        setActiveIndex({
          date: '',
          subIndex: '',
        });
        setStatus('changed');
        toast.success('Đã xóa môn học thành công!');
      }
    });
  };

  const handleNavigateAway = (e) => {
    if (status === 'changed') {
      const confirm = window.confirm('Bạn có thay đổi chưa lưu. Bạn có muốn tiếp tục mà không lưu không?');
      if (!confirm) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleNavigateAway);
    return () => {
      window.removeEventListener('beforeunload', handleNavigateAway);
    };
  }, [status]);

  const datesToShow = Object.keys(dataManyDay).slice(currentPage * 5, (currentPage + 1) * 5);
  const totalPages = Math.ceil(Object.keys(dataManyDay).length / 5);

  const handleSave = () => {
    for (const date in dataManyDay) {
      for (const subject of dataManyDay[date]) {
        if (subject.content === '') {
          toast.error('Vui lòng nhập nội dung cho môn học');
          return;
        }
      }
    }

    if (className === '') {
      toast.error('Vui lòng chọn lớp');
      return;
    }

    const academicYear = getCurrentSchoolYear();
    const classReport = className;
    const teachCreate = user.teacherId;
    updateTeachingReport(academicYear, classReport, teachCreate, dataManyDay)
      .then((data) => {
        toast.success('Lưu báo bài thành công!');
        setStatus('idle');
      })
      .catch((error) => {
        console.error('Update teaching report error:', error.response ? error.response.data : error.message);
        throw error;
      });
    setStatus('idle');
    setActiveIndex({
      date: '',
      subIndex: '',
    });
  };

  return (
    <div>
      <div className="mx-4 my-2">
        <div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col justify-end gap-2 py-2">
              <span>Ngày báo bài</span>
              <div>
                <DatePicker
                  selected={dateStart}
                  onChange={(date) => setDateStart(date)}
                  dateFormat="dd/MM/yyyy"
                  filterDate={isWeekday}
                  className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <i class="fa-solid fa-link pb-5 text-blue-500"></i>
            </div>
            <div className="flex items-end justify-end gap-2 py-2">
              <div>
                <DatePicker
                  selected={dateEnd}
                  onChange={(date) => setDateEnd(date)}
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

            <div className="flex gap-2 py-2">
              {status === 'changed' ? (
                <button
                  onClick={handleSave}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-[8rem]"
                >
                  Lưu thay đổi
                </button>
              ) : (
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-[8rem]">
                  Lưu thay đổi
                </button>
              )}
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

          <div className="grid grid-flow-row gap-2 py-2 overflow-x-auto overflow-y-auto">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-32 min-w-32 text-left">Ngày</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-44 min-w-44 text-left">Môn học</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72 text-left">
                    Nội dung<span className="text-red-500">*</span>
                  </th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72 text-left">Ghi chú</th>
                  <th className="border border-gray-400 px-4 py-2 bg-gray-100" colSpan={2}></th>
                </tr>
              </thead>
              <tbody>
                {datesToShow.map((date, index) => {
                  const daySubjects = dataManyDay[date] || [];
                  const dayName = getDayOfWeek(date);
                  const numberSubjectsDeleted = daySubjects.filter((subject) => subject.delete === 1).length;
                  return (
                    <React.Fragment key={index}>
                      {daySubjects.map((subject, subIndex) => (
                        <tr
                          key={subIndex}
                          className={`${activeIndex.date === date && activeIndex.subIndex === subIndex ? 'bg-blue-100' : ''}`}
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
                          {subject.delete !== 1 && (
                            <>
                              <td className="border border-gray-400 px-4 py-2">
                                {subject.subjectName}
                                {subject.teacherName !== user.userName ? (
                                  <span className="text-red-500"> ({subject.teacherName})</span>
                                ) : null}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
                                <textarea
                                  disabled={activeIndex.date !== date || activeIndex.subIndex !== subIndex}
                                  onChange={(e) => handleInputChange(e, date, subIndex, 'content')}
                                  value={subject.content}
                                  className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                                ></textarea>
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
                                <textarea
                                  disabled={activeIndex.date !== date || activeIndex.subIndex !== subIndex}
                                  onChange={(e) => {
                                    handleInputChange(e, date, subIndex, 'note');
                                  }}
                                  value={subject.note}
                                  className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                                ></textarea>
                              </td>
                              {activeIndex.date === date && activeIndex.subIndex === subIndex ? (
                                <>
                                  <td className="border border-gray-400 px-4 py-2 w-14 min-w-14">
                                    <div
                                      onClick={() => {
                                        handleReset(date, subIndex);
                                      }}
                                      className="flex items-center justify-center gap-2"
                                    >
                                      <i className="fa-solid fa-rotate-right cursor-pointer text-blue-500 hover:text-blue-600"></i>
                                    </div>
                                  </td>
                                  <td className="border border-gray-400 px-4 py-2 w-14 min-w-14">
                                    <div
                                      onClick={() => {
                                        setActiveIndex({
                                          date: '',
                                          subIndex: '',
                                        });
                                      }}
                                      className="flex items-center justify-center gap-2"
                                    >
                                      <i className="fa-solid fa-check cursor-pointer text-green-500 hover:text-green-600"></i>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="border border-gray-400 px-4 py-2 w-14 min-w-14">
                                    {user.userName === subject.teacherName ? (
                                      <div
                                        onClick={() => {
                                          handleDeleteSubject(date, subIndex);
                                        }}
                                        className="flex items-center justify-center gap-2"
                                      >
                                        <i className="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-600"></i>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2">
                                        <i className="fa-solid fa-trash cursor-not-allowed text-gray-400 "></i>
                                      </div>
                                    )}
                                  </td>
                                  <td className="border border-gray-400 px-4 py-2 w-14 min-w-14">
                                    {user.userName === subject.teacherName ? (
                                      <div
                                        onClick={() => {
                                          setActiveIndex({
                                            date: date,
                                            subIndex: subIndex,
                                          });
                                        }}
                                        className="flex items-center justify-center gap-2"
                                      >
                                        <i className="fa-solid fa-pen-to-square cursor-pointer text-sky-500 hover:text-sky-600"></i>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2">
                                        <i className="fa-solid fa-pen-to-square cursor-not-allowed text-gray-400"></i>
                                      </div>
                                    )}
                                  </td>
                                </>
                              )}
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
