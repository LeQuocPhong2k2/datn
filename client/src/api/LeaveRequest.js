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
//getLeaveRequestsByStudentId
async function getLeaveRequestsByStudentId(student_id) {
  try {
    const response = await axios.post(
      `${API_URL}/leaveRequest/getLeaveRequestsByStudentId`,
      { student_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      'Lỗi khi lấy danh sách đơn xin nghĩ học theo id học sinh:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
// getLeaveRequestsByTeacherId
async function getLeaveRequestsByTeacherId(teacher_id) {
  try {
    const response = await axios.post(
      `${API_URL}/leaveRequest/getLeaveRequestsByTeacherId`,
      { teacher_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      'Lỗi khi lấy danh sách đơn xin nghĩ học theo id giáo viên:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
// getLeaveRequestsByParentId
async function getLeaveRequestsByParentId(parent_id) {
  try {
    const response = await axios.post(
      `${API_URL}/leaveRequest/getLeaveRequestsByParentId`,
      { parent_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      'Lỗi khi lấy danh sách đơn xin nghĩ học theo id phụ huynh:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// updateLeaveRequest
async function updateLeaveRequest(leaveRequest_id, status) {
  try {
    const response = await axios.post(
      `${API_URL}/leaveRequest/updateLeaveRequest`,
      { leaveRequest_id, status },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Lỗi khi cập nhật đơn xin nghĩ học:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export {
  createLeaveRequest,
  getLeaveRequestsByStudentId,
  getLeaveRequestsByTeacherId,
  updateLeaveRequest,
  getLeaveRequestsByParentId,
};
