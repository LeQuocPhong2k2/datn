import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function saveTeachingReport(academicYear, className, teachCreate, dataSave) {
  const response = await axios.post(
    `${API_URL}/teachingReport/saveTeachingReport`,
    {
      academicYear,
      className,
      teachCreate,
      dataSave,
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

async function getReportDetailByDayOrClassOrSubject(academicYear, className, date, subjectName, teacherId) {
  const response = await axios.post(
    `${API_URL}/teachingReport/getReportDetailByDayOrClassOrSubject`,
    {
      academicYear,
      className,
      date,
      subjectName,
      teacherId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export { saveTeachingReport, getTeachingReports, getReportDetailByDayOrClassOrSubject };
