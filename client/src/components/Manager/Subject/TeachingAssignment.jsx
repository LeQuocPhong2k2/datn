import 'flowbite';
import React from 'react';
import { useEffect, useState } from 'react';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { createSchedule, getSchedulesByClass, getSubjectNotInSchedule, deleteSchedule } from '../../../api/Schedules';

export default function TeachingAssignment() {
  const [assignmentInput, setAssignmentInput] = useState({
    grade: '1',
    className: '1A1',
    schoolYear: '',
    subjectCode: '',
    teacherID: '',
    title: '',
  });
  const [semester1, setSemester1] = useState(false);
  const [semester2, setSemester2] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [subjectGrade, setSubjectGrade] = useState([]);
  /**
   * get current year
   */
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    setAssignmentInput((prevInput) => ({
      ...prevInput,
      schoolYear: `${year}-${year + 1}`,
    }));
  }, []);
  /**
   *
   */
  useEffect(() => {
    handleGetSchedulesByClass();
  }, [assignmentInput.className, assignmentInput.schoolYear]);
  /**
   *
   * @param {*} e
   */
  const handleSelectClass = (e) => {
    const { name, value } = e.target;
    const grade = handleSplitClassNameToGrade(value);
    setAssignmentInput({
      ...assignmentInput,
      grade,
      [name]: value,
    });
  };
  /**
   *
   * @param {*} e
   */
  const handleAssignmentInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'className') {
      const grade = handleSplitClassNameToGrade(value);
      setAssignmentInput({
        ...assignmentInput,
        grade,
        [name]: value,
      });
    } else {
      setAssignmentInput({
        ...assignmentInput,
        [name]: value,
      });
    }
  };
  /**
   *
   * @param {*} className
   * @returns
   */
  const handleSplitClassNameToGrade = (className) => {
    const grade = className.split('')[0];
    return grade;
  };
  /**
   *
   */
  useEffect(() => {
    const fetchSubjectGrade = async () => {
      try {
        const response = await getSubjectNotInSchedule(assignmentInput.grade);
        setSubjectGrade(response.subjectNotInSchedule);
      } catch (error) {
        console.error('Get subject by grade error :', error);
      }
    };
    fetchSubjectGrade();
  }, [assignmentInput.grade]);
  /**
   *
   */
  const [activeSubjectAssignment, setActiveSubjectAssignment] = useState(-1);
  const handleSelectSubjectAssignment = (index) => {
    setActiveSubjectAssignment(index);
    setAssignmentInput({
      ...assignmentInput,
      subjectCode: subjectGrade[index].subjectCode,
      title: subjectGrade[index].subjectName,
    });
  };
  /**
   *
   * @param {*} index
   */
  const handleCancelSubjectAssignment = (index) => {
    setAssignmentInput({
      ...assignmentInput,
      subjectCode: '',
      teacherID: '',
    });
    setActiveSubjectAssignment(-1);
    setTimeSlotsChecked([]);
    const timeSlotCheckboxs = document.querySelectorAll('.timeSlot-Checkbox');
    timeSlotCheckboxs.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };
  /**
   *
   */
  const [timeSlotsChecked, setTimeSlotsChecked] = useState([]);
  const handleTimeSlotChange = (e, slot) => {
    if (e.target.checked) {
      setTimeSlotsChecked((prev) => [...prev, slot]);
    } else {
      timeSlotsChecked.forEach((timeSlot, index) => {
        if (timeSlot.scheduleDay === slot.scheduleDay && timeSlot.hour === slot.hour) {
          timeSlotsChecked.splice(index, 1);
        }
      });
      setTimeSlotsChecked(timeSlotsChecked);
    }
  };
  /**
   *
   * @returns
   */
  const handleValidateAssignment = () => {
    if (assignmentInput.teacherID === '') {
      alert('Vui lòng chọn giáo viên');
      return false;
    }

    if (semester1 === false && semester2 === false) {
      alert('Vui lòng chọn học kỳ');
      return false;
    }

    if (timeSlotsChecked.length === 0) {
      alert('Vui lòng chọn tiết học');
      return false;
    }

    if (timeSlotsChecked.length > Math.round(subjectGrade[activeSubjectAssignment].subjectCredits / 35)) {
      alert('Số tiết học đã chọn vượt quá số tiết/tuần');
      return false;
    }

    return true;
  };
  /**
   *
   */
  const handleSaveAssignment = async () => {
    if (handleValidateAssignment()) {
      const schedule = {
        scheduleTitle: assignmentInput.title,
        scheduleTimeSlot: timeSlotsChecked,
        scheduleTeacher: assignmentInput.teacherID,
        subjectCode: assignmentInput.subjectCode,
        className: assignmentInput.className,
        schoolYear: assignmentInput.schoolYear,
      };

      try {
        const response = await createSchedule(
          schedule.scheduleTitle,
          schedule.scheduleTeacher,
          schedule.scheduleTimeSlot,
          schedule.subjectCode,
          schedule.className,
          schedule.schoolYear,
          semester1,
          semester2
        );

        if (response) {
          alert('Phân công giảng dạy thành công');
          handleGetSchedulesByClass();
          const fetchSubjectGrade = async () => {
            try {
              const response = await getSubjectNotInSchedule(assignmentInput.grade);
              setSubjectGrade(response.subjectNotInSchedule);
            } catch (error) {
              console.error('Get subject by grade error :', error);
            }
          };
          fetchSubjectGrade();
          setActiveSubjectAssignment(-1);
        }
      } catch (error) {
        console.error('Create schedule error:', error);
      }
    }
  };
  /**
   *
   */
  const handleGetSchedulesByClass = async () => {
    try {
      const response = await getSchedulesByClass(assignmentInput.className, assignmentInput.schoolYear);
      setSchedules(response.schedules);
    } catch (error) {
      console.error('Get schedules by class error:', error);
    }
  };
  /**
   *
   * @param {*} e
   */
  const handleSetSemester = (e) => {
    const { name, checked } = e.target;
    if (name === 'semester1') {
      setSemester1(checked);
    } else {
      setSemester2(checked);
    }
  };

  /**
   * Hiển thị lịch học
   */
  const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const generateTimeSlots = () => {
    const timeSlots = [];
    const morningStartHour = 7.5; // 7:30 AM
    const morningEndHour = 10.5; // 10:30 AM
    const afternoonStartHour = 13.5; // 1:30 PM
    const afternoonEndHour = 15.5; // 3:30 PM
    const lessonDuration = 45 / 60; // 45 minutes in hours
    const breakDuration = 5 / 60; // 5 minutes in hours

    scheduleDays.forEach((day) => {
      let lessonNumber = 1; // Bắt đầu từ tiết 1

      // Morning sessions
      for (let hour = morningStartHour; hour < morningEndHour; hour += lessonDuration + breakDuration) {
        timeSlots.push({
          scheduleDay: day,
          hour,
          lessonNumber,
          isFree: handleCheckScheduleExist(day, lessonNumber),
        });
        lessonNumber++;
      }

      // Afternoon sessions
      for (let hour = afternoonStartHour; hour < afternoonEndHour; hour += lessonDuration + breakDuration) {
        timeSlots.push({
          scheduleDay: day,
          hour,
          lessonNumber,
          isFree: handleCheckScheduleExist(day, lessonNumber),
        });
        lessonNumber++;
      }
    });

    return timeSlots;
  };
  /**
   *
   * @param {*} day
   * @param {*} lessonNumber
   * @returns
   */
  const handleCheckScheduleExist = (day, lessonNumber) => {
    for (const schedule of schedules) {
      const scheduleExists = schedule.timesSlot.some(
        (slot) => parseInt(slot.lessonNumber) === lessonNumber && slot.scheduleDay === day
      );

      if (scheduleExists) {
        return false;
      }
    }
    return true;
  };
  const timeSlots = generateTimeSlots();
  /**
   *
   * @param {*} scheduleId
   */
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      console.log('Delete schedule:', scheduleId);
      const response = await deleteSchedule(scheduleId);
      if (response) {
        alert('Xóa lịch học thành công');
        handleGetSchedulesByClass();
        const fetchSubjectGrade = async () => {
          try {
            const response = await getSubjectNotInSchedule(assignmentInput.grade);
            setSubjectGrade(response.subjectNotInSchedule);
          } catch (error) {
            console.error('Get subject by grade error :', error);
          }
        };
        fetchSubjectGrade();
      }
    } catch (error) {
      console.error('Delete schedule error:', error);
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
            value={assignmentInput.schoolYear}
            disabled
          />
        </div>
        <div>
          <label htmlFor="className">Lớp học*</label>
          <select
            name="className"
            id="className"
            onChange={(e) => handleSelectClass(e)}
            value={assignmentInput.className}
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={''}
          >
            <option value="" selected></option>
            <option value="1A1">1A1</option>
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
              <th className="py-2 px-2 border border-b border-gray-300 text-left w-36 min-w-36"></th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={index} className={activeSubjectAssignment === index ? 'bg-blue-100' : 'bg-white'}>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{index + 1}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{schedule.subject.subjectCode}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{schedule.subject.subjectName}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-center">
                  {Math.round(schedule.subject.subjectCredits / 35)}
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{schedule.subject.subjectType}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  {schedule.scheduleTeacher.userName}
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <input type="checkbox" checked={schedule.semester1} />
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <input type="checkbox" checked={schedule.semester2} />
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteSchedule(schedule._id)}
                        className="bg-red-500 text-white hover:bg-red-700 font-medium py-1 px-2 rounded"
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => handleCancelSubjectAssignment(index)}
                        className="bg-cyan-700 hover:bg-cyan-900 text-white font-medium py-1 px-2 rounded"
                      >
                        Sửa
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {subjectGrade.map((subject, index) => (
              <tr key={index} className={activeSubjectAssignment === index ? 'bg-blue-100' : 'bg-white'}>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{index + 1}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectCode}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectName}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-center">
                  {Math.round(subject.subjectCredits / 35)}
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectType}</td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <select
                    onChange={(e) => handleAssignmentInputChange(e)}
                    name="teacherID"
                    id="tenGiaoVien"
                    className="w-full p-2 border border-gray-300 rounded"
                    defaultValue={''}
                  >
                    <option value="" selected></option>
                    {subject.teachers.length === 0 ? (
                      <option value="" selected>
                        Chưa có giáo viên
                      </option>
                    ) : (
                      subject.teachers.map((teacher) => <option value={teacher._id}>{teacher.userName}</option>)
                    )}
                  </select>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <input name="semester1" value={semester1} onChange={(e) => handleSetSemester(e)} type="checkbox" />
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    <input name="semester2" value={semester2} onChange={(e) => handleSetSemester(e)} type="checkbox" />
                  </div>
                </td>
                <td className="py-2 px-2 border border-b border-gray-300 text-left">
                  <div className="flex items-center justify-center">
                    {activeSubjectAssignment === index ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelSubjectAssignment(index)}
                          className="bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-2 rounded"
                        >
                          {/* <MdOutlineCancel /> */}
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSaveAssignment()}
                          className="bg-green-500 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
                        >
                          {/* <MdOutlineSave /> */}
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectSubjectAssignment(index)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded"
                      >
                        {/* <MdAddCircle /> */}
                        Thêm
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                      <input
                        className="timeSlot-Checkbox"
                        onChange={(e) => {
                          handleTimeSlotChange(e, slot);
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
            Thứ 3
          </label>
          <ul>
            {timeSlots
              .filter((slot) => slot.scheduleDay === 'Tuesday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input
                        className="timeSlot-Checkbox"
                        onChange={(e) => {
                          handleTimeSlotChange(e, slot);
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
                      <input
                        className="timeSlot-Checkbox"
                        onChange={(e) => {
                          handleTimeSlotChange(e, slot);
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
            Thứ 5
          </label>
          <ul>
            {timeSlots
              .filter((slot) => slot.scheduleDay === 'Thursday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input
                        className="timeSlot-Checkbox"
                        onChange={(e) => {
                          handleTimeSlotChange(e, slot);
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
            Thứ 6
          </label>
          <ul>
            {timeSlots
              .filter((slot) => slot.scheduleDay === 'Friday')
              .map((slot, index) => (
                <li key={index}>
                  {slot.isFree ? (
                    <label>
                      <input
                        className="timeSlot-Checkbox"
                        onChange={(e) => {
                          handleTimeSlotChange(e, slot);
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
      </div>
    </div>
  );
}
