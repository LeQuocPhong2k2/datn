import axios from 'axios';

async function addLopHoc(lopHoc) {
  try {
    const response = await axios.post('http://localhost:3000/class/addClass', lopHoc, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Add class response:', response);
    return response.data;
  } catch (error) {
    console.error('Add class error:', error.response ? error.response.data : error.message);
    throw error;
  }
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
    console.log('Get class by academic year and grade response:', response);
    return response.data;
  } catch (error) {
    console.error(
      'Get class by academic year and grade error:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export { addLopHoc, getLopHocByNamHocVaKhoi };
