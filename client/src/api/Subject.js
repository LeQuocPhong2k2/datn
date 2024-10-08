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

async function findAllSubject() {
  try {
    const response = await axios.get('http://localhost:3000/subjects/findAllSubject');
    return response.data;
  } catch (error) {
    console.error('Find all subject error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function updateSubject(subjectInfo) {
  try {
    const response = await axios.post(
      'http://localhost:3000/subjects/updateSubject',
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
    console.error('Update subject error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function deleteSubject(subjectCode) {
  try {
    const response = await axios.post(
      'http://localhost:3000/subjects/deleteSubject',
      {
        subjectCode: subjectCode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Delete subject error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export { addSubject, findAllSubject, updateSubject, deleteSubject };
