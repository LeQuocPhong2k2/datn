import 'flowbite';
import React from 'react';
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { getGiaoVienByDepartment } from '../../../api/Teacher';
import { IoMdAdd } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import { RiSubtractFill } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';

import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { getSubjectAssignments } from '../../../api/Subject';

const localizer = momentLocalizer(moment);

export default function TeachingAssignment() {
  const [events, setEvents] = useState([]);
  const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  useEffect(() => {
    // Giả lập dữ liệu từ thuật toán lịch học
    const timetable = [
      { subject: 'TIẾNG VIỆT 1', scheduleLesson: 1, session: 'Sáng', scheduleDay: 'Monday' },
      { subject: 'TOÁN 1', scheduleLesson: 2, session: 'Chiều', scheduleDay: 'Tuesday' },
      { subject: 'ANH VĂN 1', scheduleLesson: 2, session: 'Sáng', scheduleDay: 'Wednesday' },
      { subject: 'ÂM NHẠC 1', scheduleLesson: 1, session: 'Chiều', scheduleDay: 'Thursday' },
      { subject: 'ĐẠO ĐỨC 1', scheduleLesson: 1, session: 'Sáng', scheduleDay: 'Friday' },
    ];

    const newEvents = timetable.map((entry) => {
      const dayOfWeek = moment().day(entry.scheduleDay).startOf('day'); // Ngày đầu tiên của tuần
      const startHour = entry.session === 'Sáng' ? 8 : 13; // 8h sáng hoặc 13h chiều
      const start = moment(dayOfWeek)
        .add(startHour, 'hours')
        .add(entry.scheduleLesson - 1, 'hours'); // Bắt đầu tiết học
      const end = moment(start).add(1, 'hours'); // Giả sử mỗi tiết học kéo dài 1 giờ

      return {
        title: entry.subject,
        start: start.toDate(),
        end: end.toDate(),
      };
    });

    setEvents(newEvents);
  }, []);

  const EventComponent = ({ event }) => (
    <div>
      <div>
        <strong>{event.title}</strong>
      </div>{' '}
      <div>
        <strong>Gv.Nguyễn Văn Ba</strong>
      </div>{' '}
      {/* Tên môn học */}
      {/* <div>
        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
      </div>{' '} */}
      {/* Thời gian */}
    </div>
  );
  // Khởi tạo thời gian trong tuần từ 8 AM đến 6 PM (18:00)
  const generateTimeSlots = () => {
    const timeSlots = [];
    scheduleDays.forEach((day) => {
      let lessonNumber = 1; // Bắt đầu từ tiết 1

      for (let hour = 8; hour <= 17; hour++) {
        timeSlots.push({
          scheduleDay: day,
          hour,
          lessonNumber, // Thêm thứ tự tiết học
          isFree: true, // Mặc định là giờ trống
        });

        lessonNumber++; // Tăng số tiết học sau mỗi giờ
      }
    });
    return timeSlots;
  };

  // Xác định các giờ trống (không có sự kiện nào)
  const timeSlots = generateTimeSlots().map((slot) => {
    const isOccupied = events.some((event) => {
      const eventDay = moment(event.start).format('dddd');
      const eventHour = moment(event.start).hour();
      return eventDay === slot.scheduleDay && eventHour === slot.hour;
    });
    return {
      ...slot,
      isFree: !isOccupied, // Nếu giờ không có sự kiện thì là giờ trống
    };
  });

  const [assignment, setAssignment] = useState([
    {
      subjectCode: '',
      subjectName: '',
      subjectType: '',
      teacherCode: '',
      semester1: true,
      semester2: false,
    },
  ]);
  const [subjectAssignmentSearch, setSubjectAssignmentSearch] = useState([]);
  const [teachersDepartment, setTeachersDepartment] = useState([]);
  const [addRowSubject, setAddRowSubject] = useState(false);
  const handleAddRowSubject = () => {
    console.log('Thêm môn học');
    setAddRowSubject(true);
  };

  const handleSubtractRowSubject = () => {
    setAddRowSubject(false);
    setSubjectAssignmentSearch([]);
  };

  const handleSearchAssignment = async (department) => {
    console.log('Tìm kiếm giáo viên theo bộ môn...', department);
    try {
      const response = await getSubjectAssignments(department.toUpperCase());
      console.log('getSubjectAssignments:', response);
      setSubjectAssignmentSearch(response);
    } catch (error) {
      console.error('Get teachers by department error :', error);
    }
  };

  return (
    <div id="root" className="grid grid-flow-row gap-4 p-4 px-20 max-h-full overflow-auto relative">
      <div className="pb-5">
        <span className="text-lg font-medium flex items-center justify-start gap-1">Phân công giảng dạy</span>
        <span className="text-sm text-gray-500 font-normal flex items-center justify-start gap-1">
          Chức năng này giúp bạn phân công giáo viên giảng dạy môn học
        </span>
      </div>
      <div>
        <span className="font-medium">1. Chọn lớp học*</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <div>
          <label htmlFor="name2">Năm học*</label>
          <input
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            type="text"
            value="2024-2025"
            disabled
          />
        </div>
        <div>
          <label htmlFor="name2">Lớp học*</label>
          <select name="tenLop" id="tenLop" className="w-full p-2 border border-gray-300 rounded">
            <option value=""></option>
            <option value="1A1" selected>
              1A1
            </option>
            <option value="1A2">1A2</option>
            <option value="1A3">1A3</option>
            <option value="1A4">1A4</option>
            <option value="1A5">1A5</option>
            <option value="2A1">2A1</option>
            <option value="2A2">2A2</option>
            <option value="2A3">2A3</option>
            <option value="2A4">2A4</option>
            <option value="2A5">2A5</option>
            <option value="3A1">1A1</option>
            <option value="3A2">1A2</option>
            <option value="3A3">1A3</option>
            <option value="3A4">1A4</option>
            <option value="3A5">3A5</option>
            <option value="4A1">4A1</option>
            <option value="4A2">4A2</option>
            <option value="4A3">4A3</option>
            <option value="4A4">4A4</option>
            <option value="4A5">4A5</option>
            <option value="5A1">5A1</option>
            <option value="5A2">5A2</option>
            <option value="5A3">5A3</option>
            <option value="5A4">5A4</option>
            <option value="5A5">5A5</option>
          </select>
        </div>
        <div>
          <label htmlFor="name2">Giáo viên chủ nhiệm</label>
          <input
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            type="text"
            value="Nguyễn Thị A"
            disabled
          />
        </div>
        <div>
          <div></div>
          <br />
          <button className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Tạo lịch cho Gv.Chủ nhiệm
          </button>
        </div>
      </div>
      <div>
        <span className="font-medium">2. Lịch hiện tại của lớp</span>
      </div>
      <div className="overflow-x-auto overflow-y-auto">
        <Calendar
          style={{ height: '800px', minWidth: '1000px' }}
          localizer={localizer}
          events={events}
          components={{
            event: EventComponent, // Sử dụng component tùy chỉnh hiển thị sự kiện
          }}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['week', 'day']}
          step={60} // Mỗi bước thời gian là 1 giờ
          timeslots={1} // Chia thời gian thành các slot mỗi giờ
          min={new Date(2024, 1, 1, 8, 0)} // Bắt đầu từ 8:00 AM
          max={new Date(2024, 1, 1, 18, 0)} // Kết thúc lúc 6:00 PM
        />
      </div>
      <div>
        <span className="font-medium">3. Chọn môn học phân công*</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-14 min-w-14">STT</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-32 min-w-32">Mã môn học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-60 min-w-60">Tên môn học</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-36 min-w-36">Số tiết/tuần</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-36 min-w-36">Bộ môn</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-60  min-w-60">Giáo viên</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-36 min-w-36">Học kỳ 1</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-36 min-w-36">Học kỳ 2</th>
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-24 min-w-24"></th>
            </tr>
          </thead>
          <tbody>
            {addRowSubject && (
              <tr className="bg-blue-100">
                <td className="py-2 px-2 border border-b border-gray-300 text-left relative">1</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  {subjectAssignmentSearch[0]?.subjectCode}
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <select
                    onChange={(e) => {
                      handleSearchAssignment(e.target.value);
                    }}
                    name="tenGiaoVien"
                    id="tenGiaoVien"
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="" selected></option>
                    <option value="Toán 1">Toán 1</option>
                    <option value="Tiếng Việt 1">Tiếng Việt 1</option>
                    <option value="Anh văn 1">Anh văn 1</option>
                  </select>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">10</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  {subjectAssignmentSearch[0]?.subjectType}
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <select name="tenGiaoVien" id="tenGiaoVien" className="w-full p-2 border border-gray-300 rounded">
                    {subjectAssignmentSearch[0]?.teachers.map((teacher) => (
                      <option value={teacher._id}>{teacher.userName}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <input type="checkbox" />
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <input type="checkbox" />
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                      Tiếp tục
                    </button>
                  </div>
                  {/* <div onClick={handleSubtractRowSubject} className="flex items-center justify-center">
                    <RiSubtractFill className="text-xl text-red-500 cursor-pointer" />
                  </div> */}
                </td>
              </tr>
            )}
            <tr>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">1</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">20245678</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">Toán 1</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">10</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">Cơ bản</td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <select name="tenGiaoVien" id="tenGiaoVien" className="w-full p-2 border border-gray-300 rounded">
                  <option value="" selected></option>
                  <option value="GV001">Nguyễn Thị A</option>
                  <option value="GV002">Nguyễn Thị B</option>
                  <option value="GV003">Nguyễn Thị C</option>
                </select>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <input type="checkbox" />
                </div>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <input type="checkbox" />
                </div>
              </td>
              <td className="py-2 px-2 border border-b border-gray-300 text-left">
                <div className="flex items-center justify-center">
                  <button className="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                    Sửa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div onClick={handleAddRowSubject} className="flex items-center justify-start">
          <IoAddCircleOutline className="text-[20px] text-green-500 cursor-pointer" />
        </div>
      </div>

      <div>
        <span className="font-medium">3. Danh sách các tiết học trống</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <div>
          <label className="font-medium" htmlFor="name2">
            Thứ 2
          </label>
          <ul>
            {timeSlots
              .filter((slot) => slot.scheduleDay === 'Monday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input type="checkbox" /> {slot.hour}:00 - Tiết:{slot.lessonNumber}
                    </label>
                  ) : (
                    <span className="text-red-500">
                      {slot.hour}:00 (Đã có tiết học) - Tiết:{slot.lessonNumber}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <div>
          <label className="font-medium" htmlFor="name2">
            Thứ 3
          </label>
          <ul>
            {timeSlots
              .filter((slot, indexParent) => slot.scheduleDay === 'Tuesday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input
                        onChange={(e) => {
                          console.log(e.target.checked);
                          console.log(slot);
                        }}
                        type="checkbox"
                      />{' '}
                      {slot.hour}:00 - Tiết:{slot.lessonNumber}
                    </label>
                  ) : (
                    <span className="text-red-500">
                      {slot.hour}:00 (Đã có tiết học) - Tiết:{slot.lessonNumber}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>

        <div>
          <label className="font-medium" htmlFor="name2">
            Thứ 4
          </label>
          <ul>
            {timeSlots
              .filter((slot) => slot.scheduleDay === 'Wednesday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input type="checkbox" /> {slot.hour}:00 - Tiết:{slot.lessonNumber}
                    </label>
                  ) : (
                    <span className="text-red-500">
                      {slot.hour}:00 (Đã có tiết học) - Tiết:{slot.lessonNumber}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>

        <div>
          <label className="font-medium" htmlFor="name2">
            Thứ 5
          </label>
          <ul>
            {timeSlots
              .filter((slot) => slot.scheduleDay === 'Thursday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input type="checkbox" /> {slot.hour}:00 - Tiết:{slot.lessonNumber}
                    </label>
                  ) : (
                    <span className="text-red-500">
                      {slot.hour}:00 (Đã có tiết học) - Tiết:{slot.lessonNumber}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>

        <div>
          <label className="font-medium" htmlFor="name2">
            Thứ 6
          </label>
          <ul>
            {timeSlots
              .filter((slot) => slot.scheduleDay === 'Friday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input type="checkbox" /> {slot.hour}:00 - Tiết:{slot.lessonNumber}
                    </label>
                  ) : (
                    <span className="text-red-500">
                      {slot.hour}:00 (Đã có tiết học) - Tiết:{slot.lessonNumber}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div>
        <div></div>
        <br />
        <button className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Thêm phân công giảng dạy
        </button>
      </div>
    </div>
  );
}
