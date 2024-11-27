import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function saveTeachingReport(academicYear, className, teacherNumber, reports) {
  const response = await axios.post(
    `${API_URL}/teachingReport/saveTeachingReport`,
    {
      academicYear,
      className,
      teacherNumber,
      reports,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

async function getTeachingReports(teacherNumber, academicYear, className, date) {
  const response = await axios.post(
    `${API_URL}/teachingReport/getTeachingReports`,
    {
      teacherNumber: teacherNumber,
      academicYear: academicYear,
      className: className,
      date: date,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export { saveTeachingReport, getTeachingReports };
