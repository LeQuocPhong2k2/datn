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

async function getTeachingPlanByTeacherAndByClassAndBySchoolYear(teacherId, className, academicYear) {
  const response = await axios.post(`${API_URL}/teachingPlans/getTeachingPlanByTeacherAndByClassAndBySchoolYear`, {
    teacherId,
    className,
    academicYear,
  });

  return response.data;
}

export { saveTeachingPlans, getTeachingPlanByTeacherAndByClassAndBySchoolYear };
