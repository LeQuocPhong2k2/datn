import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

async function saveTeachingPlans(plans, teacherPhoneNumber, academicYear) {
  const response = await axios.post(`${API_URL}/teachingPlans/createTeachingPlan`, {
    plans,
    teacherPhoneNumber,
    academicYear,
  });

  return response.data;
}

async function getTeachingPlanByTeacherAndByGradeAndBySchoolYear(teacherId, grade, academicYear) {
  const response = await axios.post(`${API_URL}/teachingPlans/getTeachingPlanByTeacherAndByGradeAndBySchoolYear`, {
    teacherId,
    grade,
    academicYear,
  });

  return response.data;
}

async function updateTeachingPlan(plans, teacherPhoneNumber, academicYear, grade) {
  const response = await axios.post(`${API_URL}/teachingPlans/updateTeachingPlan`, {
    plans,
    teacherPhoneNumber,
    academicYear,
    grade,
  });
  return response.data;
}

export { saveTeachingPlans, getTeachingPlanByTeacherAndByGradeAndBySchoolYear, updateTeachingPlan };
