import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
// createLeaveRequest
async function createLeaveRequest(student_id, parent_id, teacher_id, class_id, start_date, end_date, reason, sessions) {
  try {
    const response = await axios.post(
      `${API_URL}/leaveRequest/createLeaveRequest`,
      {
        student_id,
        parent_id,
        teacher_id,
        class_id,
        start_date,
        end_date,
        reason,
        sessions,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo đơn xin nghĩ học :', error.response ? error.response.data : error.message);
    throw error;
  }
}
export { createLeaveRequest };
