import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function addSubject(subjectInfo) {
  try {
    const response = await axios.post(
      API_URL + '/subjects/addSubject',
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
    const response = await axios.get(API_URL + '/subjects/findAllSubject');
    return response.data;
  } catch (error) {
    console.error('Find all subject error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function updateSubject(subjectInfo) {
  try {
    const response = await axios.post(
      API_URL + '/subjects/updateSubject',
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
      API_URL + '/subjects/deleteSubject',
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

async function getSubjectAssignments(subjectName) {
  try {
    const response = await axios.post(
      API_URL + '/subjects/getSubjectAssignments',
      { subjectName },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get subject assignments error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getSubjectByGrade(grade) {
  try {
    const response = await axios.post(
      API_URL + '/subjects/getSubjectByGrade',
      { grade },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get subject by grade error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export { addSubject, findAllSubject, updateSubject, deleteSubject, getSubjectAssignments, getSubjectByGrade };
