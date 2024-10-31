import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function createAttendance(class_id, teacher_id, date, attendanceRecords) {
  try {
    const response = await axios.post(
      `${API_URL}/attendance/create`,
      { class_id, teacher_id, date, attendanceRecords },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Create attendance response:', response);
    return response;
  } catch (error) {
    console.error('Create attendance error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export { createAttendance };
