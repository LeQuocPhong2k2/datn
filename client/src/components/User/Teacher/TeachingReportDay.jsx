/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { format, parse } from 'date-fns';
import 'flowbite';
import React, { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UserContext } from '../../../UserContext';

import toast from 'react-hot-toast';
import { getClassTeacherBySchoolYear, getScheduleByDay } from '../../../api/Schedules';
import { checkBaoBaiisExsit, saveTeachingReport } from '../../../api/TeachingReport';

export default function TeachingReportDay() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState({});
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

        if (data.schedules.length === 0) {
          toast.error('Không tìm thấy lịch giảng dạy');
          return;
        }

        data.schedules[0].arrSubject.forEach((elm) => {
          if (elm.className === className) {
            const date = format(selectedDate, 'dd/MM/yyyy');
            if (newTimetable[date]) {
              newTimetable[date].push({
                subjectName: elm.subjectName,
                content: '',
                note: '',
              });
            } else {
              newTimetable[date] = [
                {
                  subjectName: elm.subjectName,
                  content: '',
                  note: '',
                },
              ];
            }
          }
        });

        newTimetable = Object.keys(newTimetable)
          .sort((a, b) => {
            const dateA = parse(a, 'dd/MM/yyyy', new Date());
            const dateB = parse(b, 'dd/MM/yyyy', new Date());
            return dateA - dateB;
          })
          .reduce((acc, key) => {
            acc[key] = newTimetable[key].sort((a, b) => a.subjectName.localeCompare(b.subjectName));
            return acc;
          }, {});

        // nếu không có dữ liệu thì thông báo
        if (Object.keys(newTimetable).length === 0) {
          toast('Không tìm thấy báo bài.', {
            icon: 'ℹ️', // Biểu tượng thông tin
            style: {
              background: '#blue',
              color: '#black',
            },
          });
          return;
        }

        setData(newTimetable);
        toast.success('Tạo báo bài thành công');
      })
      .catch((error) => {
        console.error('Get class by day and teacher error:', error.response ? error.response.data : error.message);
        throw error;
      });
  };

  const datesToShow = Object.keys(data);

  const handleRemoveReport = (date, subIndex) => {
    const newData = { ...data };
    if (newData[date] && newData[date][subIndex]) {
      newData[date].splice(subIndex, 1);
      if (newData[date].length === 0) {
        delete newData[date];
      }
      setData(newData);
      toast.success('Đã xóa môn học thành công!');
    } else {
      toast.error('Không tìm thấy môn học cần xóa!');
    }
  };

  const handleSaveReport = async () => {
    // kiểm tra nếu content hoặc note rỗng thì thông báo
    for (const date in data) {
      for (const subject of data[date]) {
        if (subject.content === '') {
          toast.error('Vui lòng nhập nội dung cho môn học');
          return;
        }
      }
    }

    // Kiểm tra báo bài đã tồn tại
    const isExist = await handleCheckIsEist(); // Sử dụng await
    if (!isExist) {
      const wConfim = window.confirm('Báo bài đã tồn tại, bạn có muốn tạo mới không?');
      if (!wConfim) {
        return;
      }
    }

    // Tiến hành lưu báo bài
    const academicYear = getCurrentSchoolYear();
    const classReport = className;
    const teachCreate = user.teacherId;

    saveTeachingReport(academicYear, classReport, teachCreate, data)
      .then((data) => {
        toast.success(data.message);
        setData({});
      })
      .catch((error) => {
        console.error('Save teaching report error:', error.response ? error.response.data : error.message);
        throw error;
      });
  };

  const handleCheckIsEist = async () => {
    const academicYear = getCurrentSchoolYear();
    const classReport = className;
    const teachCreate = user.teacherId;
    let check = true;

    try {
      for (const [date, subjects] of Object.entries(data)) {
        for (const subject of subjects) {
          try {
            await checkBaoBaiisExsit(academicYear, classReport, teachCreate, date, subject.subjectName);
          } catch (error) {
            check = false;
            console.error('Error checking Bao Bai:', error);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }

    return check;
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2 py-2">
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

        <div className="flex gap-2 py-2">
          <button
            onClick={handleSaveReport}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-[5rem]"
          >
            Lưu
          </button>
        </div>
      </div>

      <div className="grid grid-flow-row gap-2 py-2">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-36 min-w-36">Ngày</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-44 min-w-44">Môn học</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72">
                Nội dung<span className="text-red-500">*</span>
              </th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-72 min-w-72">Ghi chú</th>
              <th className="border border-gray-400 px-4 py-2 bg-gray-100 w-14 min-w-14"></th>
            </tr>
          </thead>
          <tbody>
            {datesToShow.map((date, index) => {
              const daySubjects = data[date] || [];
              return (
                <React.Fragment key={index}>
                  {daySubjects.map((subject, subIndex) => {
                    const dayName = getDayOfWeek(selectedDate);
                    return (
                      <tr key={subIndex}>
                        {subIndex === 0 && (
                          <td rowSpan={daySubjects.length} className="border border-gray-400 px-4 py-2 font-semibold">
                            {dayName} ({format(selectedDate, 'dd/MM/yyyy')})
                          </td>
                        )}
                        <td className="border border-gray-400 px-4 py-2">{subject.subjectName}</td>
                        <td className="border border-gray-400 px-4 py-2">
                          <textarea
                            onChange={(e) => {
                              const newData = { ...data };
                              if (newData[date] && newData[date][subIndex]) {
                                newData[date][subIndex].content = e.target.value;
                                setData(newData);
                              } else {
                                console.error('Invalid date or subIndex:', date, subIndex);
                              }
                            }}
                            value={subject.content}
                            className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                          ></textarea>
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                          <textarea
                            onChange={(e) => {
                              const newData = { ...data };
                              if (newData[date] && newData[date][subIndex]) {
                                newData[date][subIndex].note = e.target.value;
                                setData(newData);
                              } else {
                                console.error('Invalid date or subIndex:', date, subIndex);
                              }
                            }}
                            value={subject.note}
                            className="w-full h-16 rounded border border-gray-400 px-2 py-2"
                          ></textarea>
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                          <div
                            onClick={() => handleRemoveReport(date, subIndex)}
                            className="flex items-center justify-center"
                          >
                            <i class="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-600"></i>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
