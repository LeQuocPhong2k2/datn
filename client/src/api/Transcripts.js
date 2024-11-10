import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Retrieves a transcript based on the given subject code, class name, school year, and grade.
 *
 * @param {string} subjectCode - The code of the subject.
 * @param {string} className - The name of the class.
 * @param {number} schoolYear - The school year.
 * @param {number} grade - The grade.
 * @returns {Promise<Object>} - A promise that resolves to the transcript data or rejects with an error.
 * @throws {Error} - If an error occurs during the API request.
 */
async function getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade) {
  try {
    const response = await axios.post(
      API_URL + '/transcripts/getTranscriptBySubjectAndClassAndSchoolYear',
      {
        subjectCode: subjectCode,
        className: className,
        schoolYear: schoolYear,
        grade: grade,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Add teacher response:', response);
    return response;
  } catch (error) {
    console.error('Add teacher error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function updateTranscript(dataRow) {
  try {
    const response = await axios.post(
      API_URL + '/transcripts/updateTranscript',
      {
        mshs: dataRow.mshs,
        className: dataRow.className,
        schoolYear: dataRow.schoolYear,
        subjectCode: dataRow.subjectCode,
        gk1: dataRow.gk1,
        ck1: dataRow.ck1,
        tbhk1: dataRow.tbhk1,
        gk2: dataRow.gk2,
        ck2: dataRow.ck2,
        tbhk2: dataRow.tbhk2,
        tbcn: dataRow.tbcn,
        remarks: dataRow.remarks,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Update transcript error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export { getTranscriptBySubjectAndClassAndSchoolYear, updateTranscript };
