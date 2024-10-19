import axios from 'axios';

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
      'http://localhost:3000/schedules/createSchedule',
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
      'http://localhost:3000/schedules/getSchedulesByClass',
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

async function getSubjectNotInSchedule(grade) {
  try {
    const response = await axios.post(
      'http://localhost:3000/schedules/getSubjectNotInSchedule',
      {
        grade,
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
      'http://localhost:3000/schedules/deleteSchedule',
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
      'http://localhost:3000/schedules/updateSchedule',
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

export { createSchedule, getSchedulesByClass, getSubjectNotInSchedule, deleteSchedule, updateSchedule };
