import axios from 'axios';

async function addSubject(subjectInfo) {
  try {
    const response = await axios.post(
      'http://localhost:3000/subjects/addSubject',
      {
        subjectName: subjectInfo.subjectName,
        subjectCode: subjectInfo.subjectCode,
        subjectDescription: subjectInfo.subjectDescription,
        subjectCredits: subjectInfo.subjectCredits,
        subjectGrade: subjectInfo.subjectGrade,
        subjectType: subjectInfo.subjectType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Add subject error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export { addSubject };
