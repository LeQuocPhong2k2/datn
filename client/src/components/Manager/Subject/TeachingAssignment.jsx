import 'flowbite';
import React from 'react';
import { useEffect, useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { Toaster, toast } from 'react-hot-toast';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  createSchedule,
  getSchedulesByClass,
  getSubjectNotInSchedule,
  deleteSchedule,
  updateSchedule,
} from '../../../api/Schedules';
import { getGiaoVienByDepartment, getGiaoVienByClassNameAndSchoolYear } from '../../../api/Teacher';

import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function TeachingAssignment() {
  const [assignmentInput, setAssignmentInput] = useState({
    grade: '1',
    className: '1A1',
    schoolYear: '',
    subjectCode: '',
    teacherID: '',
    title: '',
  });
  const [teacher, setTeacher] = useState([]);
  const [semester1, setSemester1] = useState(false);
  const [semester2, setSemester2] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [subjectGrade, setSubjectGrade] = useState([]);
  const [activeSubjectAssignmentCreate, setActiveSubjectAssignmentCreate] = useState(-1);
  const [activeSubjectAssignmentUpdate, setActiveSubjectAssignmentUpdate] = useState(-1);
  const [teacherByDepartment, setTeacherByDepartment] = useState([]);
  const [checkBoxTimeSlotUpdate, setCheckBoxTimeSlotUpdate] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState('');
  /**
   *
   * @param {*} index
   */
  const openModal = (index) => {
    setModalIsOpen(true);
    setScheduleId(schedules[index]._id);
  };
  /**
   *
   */
  const closeModal = () => {
    setModalIsOpen(false);
    setScheduleId('');
  };
  /**
   *handle page loading
   */
  useEffect(() => {
    handlePageLoading();
  }, []);
  /**
   * handle page loading
   */
  const handlePageLoading = () => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };
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
   *handleGetSchedulesByClass
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
   */
  useEffect(() => {
    const fetchGetSchedulesByClass = async () => {
      try {
        const response = await getSchedulesByClass(assignmentInput.className, assignmentInput.schoolYear);
        if (response) {
          setSchedules(response.schedules);
        }
      } catch (error) {
        console.error('Get schedules by class error:', error);
      }
    };
    fetchGetSchedulesByClass();
  }, [assignmentInput.className, assignmentInput.schoolYear]);
  /**
   *
   */
  useEffect(() => {
    const fetchTeacherByClassNameAndSchoolYear = async () => {
      try {
        const response = await getGiaoVienByClassNameAndSchoolYear(
          assignmentInput.className,
          assignmentInput.schoolYear
        );
        if (response && response.length > 0) {
          setTeacher(response);
        } else {
          setTeacher([]);
        }
      } catch (error) {
        console.error('Get teacher by class name and school year error:', error);
      }
    };
    fetchTeacherByClassNameAndSchoolYear();
    handlePageLoading();
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
    setTeacher([]);
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
  const handleSelectSubjectAssignment = (index) => {
    handleCancelSubjectAssignmentUpdate(-1);
    setActiveSubjectAssignmentCreate(index);
    setAssignmentInput({
      ...assignmentInput,
      subjectCode: subjectGrade[index].subjectCode,
      title: subjectGrade[index].subjectName,
    });
    setCheckBoxTimeSlotUpdate([]);
  };
  /**
   *
   * @param {*} index
   */
  const handleSelectSubjectAssignmentUpdate = (index) => {
    handleCancelSubjectAssignment();
    setActiveSubjectAssignmentUpdate(index);
    setAssignmentInput({
      ...assignmentInput,
      subjectCode: schedules[index].subject.subjectCode,
      title: schedules[index].subject.subjectName,
      teacherID: schedules[index].scheduleTeacher._id,
    });
    setSemester1(schedules[index].semester1);
    setSemester2(schedules[index].semester2);
    handleGetTeacherByDepartment(schedules[index].subject.subjectType);
    setCheckBoxTimeSlotUpdate(
      schedules[index].timesSlot.map((slot) => ({
        scheduleDay: slot.scheduleDay,
        lessonNumber: slot.lessonNumber,
        checked: true,
      }))
    );
  };
  /**
   *
   * @param {*} department
   */
  const handleGetTeacherByDepartment = async (department) => {
    try {
      const response = await getGiaoVienByDepartment(department);
      setTeacherByDepartment(response);
    } catch (error) {
      console.error('Get teachers by department error:', error);
    }
  };
  /**
   *
   * @param {*} index
   */
  const handleCancelSubjectAssignmentUpdate = (index) => {
    setActiveSubjectAssignmentUpdate(-1);
    setAssignmentInput({
      ...assignmentInput,
      subjectCode: '',
      teacherID: '',
    });
    setCheckBoxTimeSlotUpdate([]);
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
    setActiveSubjectAssignmentCreate(-1);
    const timeSlotCheckboxs = document.querySelectorAll('.timeSlot-Checkbox');
    timeSlotCheckboxs.forEach((checkbox) => {
      checkbox.checked = false;
    });
    document.querySelectorAll('.teacherID').forEach((checkbox) => {
      checkbox.value = '';
    });
  };
  /**
   *
   * @returns
   */
  const handleValidateAssignment = (index) => {
    if (assignmentInput.teacherID === '') {
      toast.error('Vui lòng chọn giáo viên');
      return false;
    }

    if (semester1 === false && semester2 === false) {
      toast.error('Vui lòng chọn học kỳ');
      return false;
    }

    if (checkBoxTimeSlotUpdate.length === 0) {
      toast.error('Vui lòng chọn tiết học');
      return false;
    }

    const countLessonNumberChecked = checkBoxTimeSlotUpdate.filter((slot) => slot.checked).length;
    if (activeSubjectAssignmentCreate >= 0) {
      if (countLessonNumberChecked > Math.round(subjectGrade[activeSubjectAssignmentCreate].subjectCredits / 35)) {
        toast.error('Số tiết học đã chọn vượt quá số tiết/tuần');
        return false;
      }
    }

    if (activeSubjectAssignmentUpdate >= 0) {
      if (countLessonNumberChecked > Math.round(schedules[activeSubjectAssignmentUpdate].subject.subjectCredits / 35)) {
        toast.error('Số tiết học đã chọn vượt quá số tiết/tuần');
        return false;
      }
    }

    return true;
  };
  /**
   *
   */
  const handleSaveAssignment = async (index) => {
    if (handleValidateAssignment(index)) {
      const schedule = {
        scheduleTitle: assignmentInput.title,
        scheduleTimeSlot: checkBoxTimeSlotUpdate.filter((slot) => slot.checked),
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
          toast.success('Tạo lịch giảng dạy thành công');
          handlePageLoading();
          const fetchSubjectGrade = async () => {
            try {
              const response = await getSubjectNotInSchedule(assignmentInput.grade);
              setSubjectGrade(response.subjectNotInSchedule);
            } catch (error) {
              console.error('Get subject by grade error :', error);
            }
          };
          const fetchSubjectGradeSchedulesByClass = async () => {
            try {
              const response = await getSchedulesByClass(assignmentInput.className, assignmentInput.schoolYear);
              setSchedules(response.schedules);
            } catch (error) {
              console.error('Get subject by grade error :', error);
            }
          };
          fetchSubjectGradeSchedulesByClass();
          fetchSubjectGrade();
          setActiveSubjectAssignmentCreate(-1);
          resetCheckboxes();
          document.querySelectorAll('.teacherID').forEach((select) => {
            select.value = '';
          });
          document.querySelectorAll('.semester').forEach((checkbox) => {
            checkbox.checked = false;
          });
          const timeSlotCheckboxs = document.querySelectorAll('.timeSlot-Checkbox');
          timeSlotCheckboxs.forEach((checkbox) => {
            checkbox.checked = false;
          });
        }
      } catch (error) {
        console.error('Create schedule error:', error);
      }
    }
  };
  /**
   *
   */

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
   *
   */
  const resetCheckboxes = () => {
    setSemester1(false);
    setSemester2(false);
  };
  /**
   * Hiển thị lịch học
   */
  const formatTime = (decimalHour) => {
    const hours = Math.floor(decimalHour);
    const minutes = Math.round((decimalHour - hours) * 60); // Round minutes to nearest integer
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes === 0 ? '00' : minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const generateTimeSlots = () => {
    const timeSlots = [];
    const morningStartHour = 7 + 20 / 60; // 7:30 AM
    const morningEndHour = 10 + 30 / 60; // 10:30 AM
    const afternoonStartHour = 13.5; // 1:30 PM
    const afternoonEndHour = 15.5; // 3:30 PM
    const lessonDuration = 45 / 60; // 45 minutes in hours
    const breakDuration = 5 / 60; // 5 minutes in hours

    scheduleDays.forEach((day) => {
      let lessonNumber = 1; // Bắt đầu từ tiết 1
      for (let hour = morningStartHour; hour < morningEndHour; hour += lessonDuration + breakDuration) {
        timeSlots.push({
          scheduleDay: day,
          hour: formatTime(hour),
          lessonNumber,
          isFree: handleCheckScheduleExist(day, lessonNumber),
        });
        lessonNumber++;
      }

      for (let hour = afternoonStartHour; hour < afternoonEndHour; hour += lessonDuration + breakDuration) {
        timeSlots.push({
          scheduleDay: day,
          hour: formatTime(hour),
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
  const handleDeleteSchedule = async () => {
    try {
      const response = await deleteSchedule(scheduleId);
      if (response) {
        toast.success('Xóa lịch học thành công');
        closeModal();
        handlePageLoading();
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
  /**
   *
   * @param {*} scheduleDay
   * @param {*} lessonNumber
   */
  const handleCheckboxChange = (scheduleDay, lessonNumber) => {
    setCheckBoxTimeSlotUpdate((prev) => {
      const existingIndex = prev.findIndex(
        (timeSlot) => timeSlot.scheduleDay === scheduleDay && parseInt(timeSlot.lessonNumber) === parseInt(lessonNumber)
      );

      if (existingIndex !== -1) {
        return prev.map((timeSlot, index) =>
          index === existingIndex ? { ...timeSlot, checked: !timeSlot.checked } : timeSlot
        );
      } else {
        return [...prev, { scheduleDay, lessonNumber, checked: true }];
      }
    });
  };

  const handleSaveUpdateAssignment = async (index) => {
    if (handleValidateAssignment(index)) {
      const schedule = {
        scheduleTitle: assignmentInput.title,
        scheduleTimeSlot: checkBoxTimeSlotUpdate.filter((slot) => slot.checked),
        scheduleTeacher: assignmentInput.teacherID,
        subjectCode: assignmentInput.subjectCode,
        className: assignmentInput.className,
        schoolYear: assignmentInput.schoolYear,
      };

      try {
        const response = await updateSchedule(
          schedules[index]._id,
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
          toast.success('Cập nhật lịch học thành công');
          handlePageLoading();
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
          setActiveSubjectAssignmentUpdate(-1);
          resetCheckboxes();
          setCheckBoxTimeSlotUpdate([]);
          document.querySelectorAll('.teacherID').forEach((select) => {
            select.value = '';
          });
          document.querySelectorAll('.semester').forEach((checkbox) => {
            checkbox.checked = false;
          });
          document.querySelectorAll('.checkbox-lesson').forEach((checkbox) => {
            checkbox.checked = false;
          });
        }
      } catch (error) {
        console.error('Update schedule error:', error);
      }
    }
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Search Teacher"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Change overlay background color here
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            background: 'white',
          },
        }}
      >
        <div className="relative p-4 w-full h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-start gap-2 p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <IoWarningOutline className="text-xl text-red-700" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bạn chắc chắn muốn xóa môn học này?
              </h3>
            </div>

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <button
                onClick={handleDeleteSchedule}
                className="text-white inline-flex w-full justify-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                OK
              </button>
              <button
                onClick={closeModal}
                className="text-white inline-flex w-full justify-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {pageLoading && (
        <div
          id="root"
          className="grid grid-flow-row gap-4 p-4 px-10 max-h-full w-full h-full items-center justify-center overflow-auto relative"
        >
          <button
            disabled
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-6 h-w-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
          </button>
        </div>
      )}

      {!pageLoading && (
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
                value={teacher.length === 0 ? 'Chưa có giáo viên' : teacher[0].userName}
                disabled
              />
            </div>
            {/* <div>
              <div></div>
              <br />
              <button className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Tạo lịch cho Gv.Chủ nhiệm
              </button>
            </div> */}
          </div>
          <div>
            <span className="font-medium">3. Chọn môn học phân công*</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-10 min-w-10">STT</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-28 min-w-28">Mã môn học</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-32 min-w-32">Tên môn học</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-28 min-w-28">Tiết/tuần</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-28 min-w-28">Bộ môn</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-52 min-w-52">Giáo viên*</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-20 min-w-20">HK1*</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-20 min-w-20">HK2*</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-20 min-w-20">Thứ 2</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-20 min-w-20">Thứ 3</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-20 min-w-20">Thứ 4</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-20 min-w-20">Thứ 5</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-20 min-w-20">Thứ 6</th>
                  <th className="py-2 px-2 border border-b border-gray-300 text-left w-32 min-w-32"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={14} className="py-2 px-2 border border-b border-r border-gray-300 text-left">
                    Các môn học đã được phân công <i>{'(' + schedules.length + ' items)'}</i>
                  </td>
                </tr>
                {schedules.map((schedule, index) => (
                  <tr key={index} className={activeSubjectAssignmentUpdate === index ? 'bg-blue-100' : 'bg-white'}>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.subject && schedule.subject.subjectCode}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.subject && schedule.subject.subjectName}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-center">
                      {Math.round(schedule.subject && schedule.subject.subjectCredits / 35)}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.subject && schedule.subject.subjectType}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {activeSubjectAssignmentUpdate === index ? (
                        <select
                          name="teacherID"
                          id="tenGiaoVien"
                          className="teacherID h-10 w-full p-2 border border-gray-300 rounded"
                          defaultValue={schedule.scheduleTeacher._id}
                        >
                          <option value="" selected></option>
                          {teacherByDepartment === 0 ? (
                            <option value="" selected>
                              Chưa có giáo viên
                            </option>
                          ) : (
                            teacherByDepartment.map((teacher) => (
                              <option value={teacher._id}>{teacher.userName}</option>
                            ))
                          )}
                        </select>
                      ) : (
                        <span>{schedule.scheduleTeacher.userName}</span>
                      )}
                    </td>

                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {activeSubjectAssignmentUpdate === index ? (
                        <div className="flex items-center justify-center">
                          <input
                            name="semester1"
                            className="semester"
                            onChange={(e) => handleSetSemester(e)}
                            type="checkbox"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <input type="checkbox" checked={schedule.semester1} />
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {activeSubjectAssignmentUpdate === index ? (
                        <div className="flex items-center justify-center">
                          <input
                            name="semester2"
                            className="semester"
                            onChange={(e) => handleSetSemester(e)}
                            type="checkbox"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <input type="checkbox" checked={schedule.semester2} />
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.timesSlot
                        .filter((slot) => slot.scheduleDay === 'Monday')
                        .map((slot) => (
                          <div>
                            <span>Tiết {slot.lessonNumber}</span>
                            <br />
                          </div>
                        ))}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.timesSlot
                        .filter((slot) => slot.scheduleDay === 'Tuesday')
                        .map((slot) => (
                          <div>
                            <span>Tiết {slot.lessonNumber}</span>
                            <br />
                          </div>
                        ))}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.timesSlot
                        .filter((slot) => slot.scheduleDay === 'Wednesday')
                        .map((slot) => (
                          <div>
                            <span>Tiết {slot.lessonNumber}</span>
                            <br />
                          </div>
                        ))}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.timesSlot
                        .filter((slot) => slot.scheduleDay === 'Thursday')
                        .map((slot) => (
                          <div>
                            <span>Tiết {slot.lessonNumber}</span>
                            <br />
                          </div>
                        ))}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      {schedule.timesSlot
                        .filter((slot) => slot.scheduleDay === 'Friday')
                        .map((slot) => (
                          <div>
                            <span>Tiết {slot.lessonNumber}</span>
                            <br />
                          </div>
                        ))}
                    </td>
                    <td className="h-10 py-2 px-2 border border-b border-r border-gray-300 text-left">
                      <div className="h-10 flex items-center justify-center">
                        {activeSubjectAssignmentUpdate === index ? (
                          <div className="h-10 flex gap-2">
                            <button
                              onClick={() => handleCancelSubjectAssignmentUpdate(index)}
                              className="bg-red-500 hover:bg-red-700 text-white font-normal py-1 px-2 rounded"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveUpdateAssignment(index)}
                              className="bg-green-500 hover:bg-green-700 text-white font-normal py-1 px-2 rounded"
                            >
                              Lưu
                            </button>
                          </div>
                        ) : (
                          <div className="h-10 flex gap-2">
                            <button
                              onClick={() => openModal(index)}
                              className="bg-red-500 text-white hover:bg-red-700 font-normal py-1 px-2 rounded"
                            >
                              Xóa
                            </button>
                            <button
                              onClick={() => handleSelectSubjectAssignmentUpdate(index)}
                              className="bg-yellow-500 hover:bg-yellow-700 text-white font-normal py-1 px-2 rounded"
                            >
                              Sửa
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={14} className="py-2 px-2 border border-b border-gray-300 text-left">
                    Các môn học chưa được phân công <i>{'(' + subjectGrade.length + ' items)'}</i>
                  </td>
                </tr>
                {subjectGrade.map((subject, index) => (
                  <tr key={index} className={activeSubjectAssignmentCreate === index ? 'bg-blue-100' : 'bg-white'}>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{index + 1}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectCode}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectName}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-center">
                      {Math.round(subject.subjectCredits / 35)}
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectType}</td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      <select
                        disabled={activeSubjectAssignmentCreate === index ? false : true}
                        onChange={(e) => handleAssignmentInputChange(e)}
                        name="teacherID"
                        id="tenGiaoVien"
                        className="teacherID w-full p-2 border border-gray-300 rounded"
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
                        <input
                          disabled={activeSubjectAssignmentCreate === index ? false : true}
                          name="semester1"
                          className="semester"
                          onChange={(e) => handleSetSemester(e)}
                          type="checkbox"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      <div className="flex items-center justify-center">
                        <input
                          disabled={activeSubjectAssignmentCreate === index ? false : true}
                          name="semester2"
                          className="semester"
                          onChange={(e) => handleSetSemester(e)}
                          type="checkbox"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left"></td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left"></td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left"></td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left"></td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left"></td>
                    <td className="py-2 px-2 border border-b border-gray-300 text-left">
                      <div className="flex items-center justify-center">
                        {activeSubjectAssignmentCreate === index ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCancelSubjectAssignment(index)}
                              className="bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-2 rounded"
                            >
                              {/* <MdOutlineCancel /> */}
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveAssignment(index)}
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
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            <div>
              <label className="font-medium" htmlFor="name2">
                Thứ 2
              </label>
              <ul>
                {timeSlots
                  .filter((slot) => slot.scheduleDay === 'Monday')
                  .map((slot, index) => (
                    <li key={index} className="border-t border-l p-1">
                      {slot.isFree ? (
                        <label>
                          <input
                            className="timeSlot-Checkbox"
                            onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                            type="checkbox"
                          />
                          <span className="px-1">
                            {slot.hour} - Tiết:{slot.lessonNumber}
                          </span>
                        </label>
                      ) : (
                        <div>
                          {activeSubjectAssignmentUpdate >= 0 &&
                            checkBoxTimeSlotUpdate.some(
                              (timeSlot) =>
                                timeSlot.scheduleDay === slot.scheduleDay &&
                                parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber)
                            ) && (
                              <input
                                type="checkbox"
                                checked={checkBoxTimeSlotUpdate.some(
                                  (timeSlot) =>
                                    timeSlot.scheduleDay === slot.scheduleDay &&
                                    parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber) &&
                                    timeSlot.checked
                                )}
                                onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                              />
                            )}
                          <span className="text-red-500">
                            <span className="px-1">
                              {slot.hour} - Tiết:{slot.lessonNumber}
                            </span>
                          </span>
                        </div>
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
                    <li key={index} className="border-t border-l p-1">
                      {slot.isFree ? (
                        <label>
                          <input
                            className="timeSlot-Checkbox"
                            onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                            type="checkbox"
                          />
                          <span className="px-1">
                            {slot.hour} - Tiết:{slot.lessonNumber}
                          </span>
                        </label>
                      ) : (
                        <div>
                          {activeSubjectAssignmentUpdate >= 0 &&
                            checkBoxTimeSlotUpdate.some(
                              (timeSlot) =>
                                timeSlot.scheduleDay === slot.scheduleDay &&
                                parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber)
                            ) && (
                              <input
                                type="checkbox"
                                checked={checkBoxTimeSlotUpdate.some(
                                  (timeSlot) =>
                                    timeSlot.scheduleDay === slot.scheduleDay &&
                                    parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber) &&
                                    timeSlot.checked
                                )}
                                onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                              />
                            )}
                          <span className="text-red-500">
                            <span className="px-1">
                              {slot.hour} - Tiết:{slot.lessonNumber}
                            </span>
                          </span>
                        </div>
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
                    <li key={index} className="border-t border-l p-1">
                      {slot.isFree ? (
                        <label>
                          <input
                            className="timeSlot-Checkbox"
                            onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                            type="checkbox"
                          />
                          <span className="px-1">
                            {slot.hour} - Tiết:{slot.lessonNumber}
                          </span>
                        </label>
                      ) : (
                        <div>
                          {activeSubjectAssignmentUpdate >= 0 &&
                            checkBoxTimeSlotUpdate.some(
                              (timeSlot) =>
                                timeSlot.scheduleDay === slot.scheduleDay &&
                                parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber)
                            ) && (
                              <input
                                type="checkbox"
                                checked={checkBoxTimeSlotUpdate.some(
                                  (timeSlot) =>
                                    timeSlot.scheduleDay === slot.scheduleDay &&
                                    parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber) &&
                                    timeSlot.checked
                                )}
                                onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                              />
                            )}
                          <span className="text-red-500">
                            <span className="px-1">
                              {slot.hour} - Tiết:{slot.lessonNumber}
                            </span>
                          </span>
                        </div>
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
                    <li key={index} className="border-t border-l p-1">
                      {slot.isFree ? (
                        <label>
                          <input
                            className="timeSlot-Checkbox"
                            onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                            type="checkbox"
                          />
                          <span className="px-1">
                            {slot.hour} - Tiết:{slot.lessonNumber}
                          </span>
                        </label>
                      ) : (
                        <div>
                          {activeSubjectAssignmentUpdate >= 0 &&
                            checkBoxTimeSlotUpdate.some(
                              (timeSlot) =>
                                timeSlot.scheduleDay === slot.scheduleDay &&
                                parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber)
                            ) && (
                              <input
                                type="checkbox"
                                checked={checkBoxTimeSlotUpdate.some(
                                  (timeSlot) =>
                                    timeSlot.scheduleDay === slot.scheduleDay &&
                                    parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber) &&
                                    timeSlot.checked
                                )}
                                onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                              />
                            )}
                          <span className="text-red-500">
                            <span className="px-1">
                              {slot.hour} - Tiết:{slot.lessonNumber}
                            </span>
                          </span>
                        </div>
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
                    <li key={index} className="border-t border-l border-r p-1">
                      {slot.isFree ? (
                        <label>
                          <input
                            className="timeSlot-Checkbox"
                            onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                            type="checkbox"
                          />
                          <span className="px-1">
                            {slot.hour} - Tiết:{slot.lessonNumber}
                          </span>
                        </label>
                      ) : (
                        <div>
                          {activeSubjectAssignmentUpdate >= 0 &&
                            checkBoxTimeSlotUpdate.some(
                              (timeSlot) =>
                                timeSlot.scheduleDay === slot.scheduleDay &&
                                parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber)
                            ) && (
                              <input
                                type="checkbox"
                                checked={checkBoxTimeSlotUpdate.some(
                                  (timeSlot) =>
                                    timeSlot.scheduleDay === slot.scheduleDay &&
                                    parseInt(timeSlot.lessonNumber) === parseInt(slot.lessonNumber) &&
                                    timeSlot.checked
                                )}
                                onChange={() => handleCheckboxChange(slot.scheduleDay, slot.lessonNumber)}
                              />
                            )}
                          <span className="text-red-500">
                            <span className="px-1">
                              {slot.hour} - Tiết:{slot.lessonNumber}
                            </span>
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
