import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';

import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getClassByDayAndTeacher } from '../../../api/Schedules';
import { getSubjectByGrade } from '../../../api/Subject';

import Menu from './Menu';
import { Toaster, toast } from 'react-hot-toast';

export default function TeachingPlans() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('create');
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState('');
  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    const grade = className.charAt(0);
    getSubjectByGrade(grade)
      .then((data) => {
        setSubjects(data);
      })
      .catch((error) => {
        console.error('Get subject by grade error:', error.response ? error.response.data : error.message);
        throw error;
      });
  }, [className]);

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

  const handleCreateFromTimetable = () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const subjects = timetable[formattedDate];
    if (!subjects) {
      alert('Không có thời khóa biểu cho ngày được chọn.');
      return;
    }

    const newData = subjects.map((subject) => ({
      name: subject,
      content: '',
      note: '',
    }));

    setData(newData);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const day = getDayOfWeek(date);
    getClassByDayAndTeacher(user.teacherId, day, getCurrentSchoolYear())
      .then((data) => {
        setSchedules(data.schedules);
      })
      .catch((error) => {
        console.error('Get class by day and teacher error:', error.response ? error.response.data : error.message);
        throw error;
      });
  };

  const handleAddNewReport = () => {
    const newReport = {
      name: '',
      content: '',
      note: '',
    };
    setData([...data, newReport]);
  };

  const handleRemoveReport = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleSave = () => {
    alert('Date' + getDayOfWeek(selectedDate) + 'id' + user.teacherId);
    console.log('Saving data:', data);
    toast.success('Báo bài đã được lưu.');
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

  const handleChangeClass = (className) => {
    let newTimetable = {};
    schedules.forEach((schedule) => {
      if (schedule.className === className) {
        const date = format(selectedDate, 'yyyy-MM-dd');
        let subjectNames = [];

        schedule.subjectNames.forEach((subject) => {
          subjectNames.push(subject);
        });

        newTimetable[date] = subjectNames;
      }
    });
    setTimetable(newTimetable);
  };

  return (
    <Menu active="teaching-report">
      <Toaster toastOptions={{ duration: 2500 }} />
      <div className="p-4">
        <div className="rounded shadow bg-white pb-2">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i class="fa-solid fa-briefcase mr-2"></i>
              BÁO BÀI
            </h2>
          </div>
          <div class="mx-4 text-lg font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul class="flex flex-wrap -mb-px">
              <li onClick={() => setActiveTab('create')} class="me-2 cursor-pointer">
                <span
                  className={`block p-4 border-b-2 ${activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                  inline
                  aria-current="page"
                >
                  Tạo báo bài
                </span>
              </li>
              <li onClick={() => setActiveTab('view')} class="me-2 cursor-pointer">
                <span
                  className={`block p-4 border-b-2 ${activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                >
                  Xem & Chỉnh sửa báo bài
                </span>
              </li>
            </ul>
          </div>

          {activeTab === 'create' && (
            <div className="mx-4 my-2">
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex flex-col justify-end gap-2 py-2">
                  <span>
                    Ngày báo bài<span className="text-red-500">*</span>
                  </span>
                  <div>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => handleDateChange(date)}
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
                        handleChangeClass(e.target.value);
                        setClassName(e.target.value);
                      }}
                      className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border"
                      defaultValue=""
                    >
                      <option value="">Chọn lớp</option>
                      {schedules.map((schedule, index) => (
                        <option key={index} value={schedule.className}>
                          {schedule.className}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 py-2">
                  <button
                    onClick={handleCreateFromTimetable}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Tạo báo bài theo TKB
                  </button>
                </div>
                <div className="flex gap-2 py-2">
                  <button
                    onClick={handleAddNewReport}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Thêm mới 1 báo bài
                  </button>
                </div>
                <div className="flex gap-2 py-2">
                  <button
                    onClick={handleSave}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-[5rem]"
                  >
                    Lưu
                  </button>
                </div>
              </div>
              <div className="grid grid-flow-row gap-2 py-2">
                <div className="flex flex-wrap gap-5 items-center w-full">
                  {data.map((subject, index) => (
                    <div
                      key={index}
                      className="w-full lg:w-96 relative grid grid-flow-row gap-2 bg-white p-4 rounded shadow hover:shadow-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-end ">
                        <i
                          onClick={() => handleRemoveReport(index)}
                          class="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-600"
                        ></i>
                      </div>
                      <select
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].name = e.target.value;
                          setData(newData);
                        }}
                        value={subject.name}
                        defaultValue={''}
                        className="w-full rounded bg-gray-100 px-3 py-2"
                      >
                        <option value=""></option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject.subjectName}>
                            {subject.subjectName}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={subject.content}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].content = e.target.value;
                          setData(newData);
                        }}
                        className="w-full rounded bg-gray-100"
                        placeholder="Nội dung"
                      ></textarea>
                      <textarea
                        value={subject.note}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].note = e.target.value;
                          setData(newData);
                        }}
                        className="w-full rounded bg-gray-100"
                        placeholder="Ghi chú"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'view' && (
            <div className="mx-4 my-2">
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
                      className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-2 py-2">
                  <span>
                    Lớp báo bài<span className="text-red-500">*</span>
                  </span>
                  <div>
                    <select className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border">
                      <option value="">Lớp 1</option>
                      <option value="">Lớp 2</option>
                      <option value="">Lớp 3</option>
                      <option value="">Lớp 4</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 py-2">
                  <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </div>

              <h2 className="text-lg font-bold text-blue-600 mb-4">Tạo báo bài</h2>

              {/* Chọn ngày */}
              <div className="flex items-center mb-4">
                <label htmlFor="date" className="mr-4 font-semibold">
                  Ngày:
                </label>
                <input type="date" id="date" className="bg-white text-black px-3 py-2 rounded border" />
              </div>

              {/* Nút tạo báo bài */}
              <div className="flex space-x-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Tạo báo bài theo thời khóa biểu
                </button>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
                  Thêm báo bài mới
                </button>
              </div>

              {/* Danh sách môn học */}

              <div className="mt-6 space-y-4">
                <div className="bg-white p-4 rounded shadow hover:shadow-lg border border-gray-200">
                  <h3 className="text-blue-600 font-semibold">s</h3>
                  <p className="mt-2 text-gray-700">
                    <strong>Bài học:</strong>
                  </p>
                  <p className="mt-1 text-gray-500">
                    <strong>Ghi chú:</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
}
