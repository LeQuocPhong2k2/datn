import axios from 'axios';

async function addStudent(student) {
  const response = await axios.post('http://localhost:3000/students/addStudent', student, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}

async function getAllStudents() {
  try {
    const response = await axios.get('http://localhost:3000/students/getAllStudents');
    console.log('Get all students response:', response);
    return response.data;
  } catch (error) {
    console.error('Get all students error:', error.response ? error.response.data : error.message);
  }
}

async function getStudentByCode(code) {
  const response = await axios.post(
    'http://localhost:3000/students/getStudentByCode',
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
async function searchStudents(studentCode) {
  const response = await axios.post(
    'http://localhost:3000/students/searchStudents',
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
async function getFullInfoStudentByCode(studentCode) {
  const response = await axios.post(
    'http://localhost:3000/students/getFullInfoStudentByCode',
    { studentCode },
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
  const response = await axios.post('http://localhost:3000/students/editStudent', student, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}
async function deleteStudent(studentCode) {
  const response = await axios.post(
    'http://localhost:3000/students/deleteStudent',
    { studentCode },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}
export {
  addStudent,
  getAllStudents,
  getStudentByCode,
  searchStudents,
  getFullInfoStudentByCode,
  editStudent,
  deleteStudent,
};
