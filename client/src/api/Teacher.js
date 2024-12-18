import axios from 'axios';

async function addGiaoVien(giaoVien) {
  try {
    const response = await axios.post('http://localhost:3000/teachers/addGiaoVien', giaoVien, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Add teacher response:', response);
    return response.data;
  } catch (error) {
    console.error('Add teacher error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getAllGiaoViens() {
  try {
    const response = await axios.get('http://localhost:3000/teachers/getAllGiaoViens');
    console.log('Get all teachers response:', response);
    return response.data;
  } catch (error) {
    console.error('Get all teachers error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getGiaoVienChuaPhanCongChuNhiem(namHoc) {
  try {
    console.log('Getting teachers without home room teacher...', namHoc);
    const response = await axios.post(
      'http://localhost:3000/teachers/getGiaoVienChuaPhanCongChuNhiem',
      { namHoc },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Get teachers without home room teacher error:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export { addGiaoVien, getAllGiaoViens, getGiaoVienChuaPhanCongChuNhiem };
