import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

async function addLopHoc(lopHoc) {
  console.log('lopHoc', lopHoc);
  const response = await axios.post(
    API_URL + '/class/addClass',
    {
      namHoc: lopHoc.namHoc,
      khoiLop: lopHoc.khoiLop,
      tenLop: lopHoc.tenLop,
      idGiaoVienChuNhiem: lopHoc.idGiaoVienChuNhiem,
      ngayBatDau: lopHoc.ngayBatDau,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

async function getLopHocByNamHocVaKhoi(namHoc, khoiLop) {
  try {
    const response = await axios.post(
      API_URL + '/class/getClassesByAcademicYearAndGrade',
      { academicYear: namHoc, grade: khoiLop },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get class by academic year and grade error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc(namHoc, khoiLop, tenLop, buoiHoc) {
  const response = await axios.post(
    API_URL + '/class/getClassesByAcademicYearOrGradeOrClassNameOrClassSession',
    { academicYear: namHoc, grade: khoiLop, className: tenLop, classSession: buoiHoc },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}

async function getDsHocSinhByLopHoc(idLopHoc) {
  const response = await axios.post(
    API_URL + '/class/getDsStudentByClass',
    { idClass: idLopHoc },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

async function importNewProfileStudent(studentInfo, namHoc, khoiLop, tenLop) {
  const response = await axios.post(
    API_URL + '/class/importNewProfileStudent',
    {
      student: studentInfo,
      namHoc,
      khoiLop,
      tenLop,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

async function importStudents(mshs, classId) {
  const response = await axios.post(
    API_URL + '/class/importStudents',
    {
      mshs,
      classId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

async function autoUpClass(namHoc) {
  const response = await axios.post(
    API_URL + '/class/autoUpClass',
    { namHoc },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}

async function deleteClass(idClass) {
  const response = await axios.post(
    API_URL + '/class/deleteClass',
    { idClass },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}

async function getStudentListByClassNameAndAcademicYear(tenLop, namHoc) {
  // sử dụng biến API_URL để thay thế đường dẫn cứng
  const response = await axios.post(
    `${API_URL}/class/getStudentListByClassNameAndAcademicYear`,
    { className: tenLop, academicYear: namHoc },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}

async function getHomRoomTeacherCurrent(phoneNumber) {
  try {
    const response = await axios.post(
      `${API_URL}/class/getHomRoomTeacherCurrent`,
      { phoneNumber },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get home room teacher current error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getAllClassTeacher(phoneNumber, academicYear) {
  try {
    const response = await axios.post(
      `${API_URL}/class/getAllClassTeacher`,
      { phoneNumber, academicYear },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get all class teachers error:', error.response ? error.response.data : error.message);
    throw error;
  }
}
async function getHomeRoomTeacherByClassNameAndAcademicYear(className, academicYear) {
  try {
    // console.log của className và academicYear để kiểm tra
    // console.log('className và academic', className + ' ' + academicYear);
    const response = await axios.post(
      `${API_URL}/class/getHomeRoomTeacherByClassNameAndAcademicYear`,
      { className, academicYear },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // console.log của response.data để kiểm tra
    //console.log('response.data ở bên api là', response.data);

    return response.data;
  } catch (error) {
    console.error(
      'Get home room teacher by class name and academic year error:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export {
  addLopHoc,
  getLopHocByNamHocVaKhoi,
  getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc,
  getDsHocSinhByLopHoc,
  importNewProfileStudent,
  importStudents,
  autoUpClass,
  deleteClass,
  getStudentListByClassNameAndAcademicYear,
  getHomRoomTeacherCurrent,
  getAllClassTeacher,
  getHomeRoomTeacherByClassNameAndAcademicYear,
};
