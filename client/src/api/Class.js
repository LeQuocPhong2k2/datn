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

export { addLopHoc };
