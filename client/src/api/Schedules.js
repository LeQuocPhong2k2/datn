import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function createSchedule(
  scheduleTitle,
  scheduleTeacher,
  scheduleTimeSlot,
  subjectCode,
  className,
  schoolYear,
  semester1,
  semester2
) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/createSchedule',
      { scheduleTitle, scheduleTeacher, scheduleTimeSlot, subjectCode, className, schoolYear, semester1, semester2 },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Create schedule error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getSchedulesByClass(className, schoolYear) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/getSchedulesByClass',
      {
        className,
        schoolYear,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get schedules by class error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getSubjectNotInSchedule(grade, schoolYear, className) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/getSubjectNotInSchedule',
      {
        grade,
        schoolYear,
        className,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get subject not in schedule error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function deleteSchedule(scheduleId) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/deleteSchedule',
      { scheduleId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Delete schedule error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function updateSchedule(
  scheduleId,
  scheduleTitle,
  scheduleTeacher,
  scheduleTimeSlot,
  subjectCode,
  className,
  schoolYear,
  semester1,
  semester2
) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/updateSchedule',
      {
        scheduleId,
        scheduleTitle,
        scheduleTeacher,
        scheduleTimeSlot,
        subjectCode,
        className,
        schoolYear,
        semester1,
        semester2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Update schedule error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getTeacherSchedule(teacherId, schoolYear) {
  try {
    const response = await axios.post(
      API_URL + '/teachers/getTeacherSchedule',
      { teacherId, schoolYear },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get teacher schedule error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getScheduleOfTeacher(teacherId, schoolYear) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/getScheduleOfTeacher',
      { teacherId, schoolYear },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get schedule of teacher error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getScheduleByWeekDays(teacherId, weekDays, schoolYear) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/getScheduleByWeekDays',
      { teacherId, weekDays, schoolYear },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get class by day and teacher error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getScheduleByDay(teacherId, day, schoolYear) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/getScheduleByDay',
      { teacherId, day, schoolYear },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get class by day and teacher error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getClassTeacherBySchoolYear(teacherId, schoolYear) {
  try {
    const response = await axios.post(
      API_URL + '/schedules/getClassTeacherBySchoolYear',
      { teacherId, schoolYear },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get class by day and teacher error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export {
  createSchedule,
  getSchedulesByClass,
  getSubjectNotInSchedule,
  deleteSchedule,
  updateSchedule,
  getTeacherSchedule,
  getScheduleOfTeacher,
  getScheduleByWeekDays,
  getScheduleByDay,
  getClassTeacherBySchoolYear,
};
