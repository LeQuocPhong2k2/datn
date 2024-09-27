import axios from 'axios';

async function addLopHoc(lopHoc) {
  const response = await axios.post('http://localhost:3000/class/addClass', lopHoc, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

async function getLopHocByNamHocVaKhoi(namHoc, khoiLop) {
  try {
    const response = await axios.post(
      'http://localhost:3000/class/getClassesByAcademicYearAndGrade',
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
    'http://localhost:3000/class/getClassesByAcademicYearOrGradeOrClassNameOrClassSession',
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
    'http://localhost:3000/class/getDsStudentByClass',
    { idClass: idLopHoc },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

async function importStudents(idClass, students, academicYear, grade) {
  const response = await axios.post(
    'http://localhost:3000/class/importStudents',
    {
      idClass: idClass,
      students: students,
      academicYear: academicYear,
      grade: grade,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

export {
  addLopHoc,
  getLopHocByNamHocVaKhoi,
  getLopHocByNamHocOrKhoiOrTenLopOrBuoiHoc,
  getDsHocSinhByLopHoc,
  importStudents,
};
