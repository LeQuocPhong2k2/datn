import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function createAttendance(class_id, teacher_id, date, attendanceRecords) {
  try {
    const response = await axios.post(
      `${API_URL}/attendance/createAttendance`,
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
async function getAttendanceByClassAndDateNow(class_id) {
  try {
    const response = await axios.post(
      `${API_URL}/attendance/getAttendanceByClassAndDateNow`,
      { class_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // console.log('Kết quả trả về là:', response);
    return response;
  } catch (error) {
    console.error('Get attendance error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export { createAttendance, getAttendanceByClassAndDateNow };
