import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function addStudent(student) {
  const response = await axios.post(API_URL + '/students/addStudent', student, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}

async function getAllStudents() {
  try {
    const response = await axios.get(API_URL + '/students/getAllStudents');
    console.log('Get all students response:', response);
    return response.data;
  } catch (error) {
    console.error('Get all students error:', error.response ? error.response.data : error.message);
  }
}

async function getStudentByCode(code) {
  const response = await axios.post(
    API_URL + '/students/getStudentByCode',
    { studentCode: code },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
  // search students
}

async function getStudentByNameAndAcademicYearAndGradeAndClassName(userName, classId) {
  const response = await axios.post(
    API_URL + '/students/getStudentByNameAndAcademicYearAndGradeAndClassName',
    { userName, classId },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

async function searchStudents(studentCode) {
  const response = await axios.post(
    `${API_URL}/students/searchStudents`,
    {
      grade: studentCode.grade,
      className: studentCode.className,
      academicYear: studentCode.academicYear,
      gender: studentCode.gender,
      userName: studentCode.userName,
      studentCode: studentCode.studentCode,
      status: studentCode.status,
      ethnicGroups: studentCode.ethnicGroups,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}
// getFullInfoStudentByCode cho trang sửa hồ sơ học sinh
async function getFullInfoStudentByCode(studentCode, academicYear) {
  const response = await axios.post(
    `${API_URL}/students/getFullInfoStudentByCode`,
    { studentCode, academicYear },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}
// editStudent cho trang sửa hồ sơ học sinh
async function editStudent(student) {
  const response = await axios.post(`${API_URL}/students/editStudent`, student, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}
async function deleteStudent(studentCode) {
  const response = await axios.post(
    `${API_URL}/students/deleteStudent`,
    { studentCode },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}
// changePassword cho trang student
async function changePassword(userName, oldPassword, newPassword) {
  const response = await axios.post(
    `${API_URL}/accounts/changePassword`,
    { userName, oldPassword, newPassword },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}
async function getStudentByAccountId(accountId) {
  const response = await axios.post(
    `${API_URL}/students/getStudentByAccountId`,
    { accountId },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

export {
  addStudent,
  getAllStudents,
  getStudentByCode,
  searchStudents,
  getFullInfoStudentByCode,
  editStudent,
  deleteStudent,
  getStudentByNameAndAcademicYearAndGradeAndClassName,
  changePassword,
  getStudentByAccountId,
};
