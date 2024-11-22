const express = require("express");
const router = express.Router();

const TeachingPlanController = require("../app/controllers/TeachingPlanController");

<<<<<<< HEAD
router.post("/getTeachingPlanByTeacherAndByClassAndBySchoolYear", TeachingPlanController.getTeachingPlanByTeacherAndByClassAndBySchoolYear);
=======
router.post("/getTeachingPlanByTeacherAndByGradeAndBySchoolYear", TeachingPlanController.getTeachingPlanByTeacherAndByGradeAndBySchoolYear);
>>>>>>> 20843d1b23e93a1f5448cd60c5e4c29024bbf801

router.post("/createTeachingPlan", TeachingPlanController.createTeachingPlan);

module.exports = router;
