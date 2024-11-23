const express = require("express");
const router = express.Router();

const TeachingPlanController = require("../app/controllers/TeachingPlanController");

router.post("/getTeachingPlanByTeacherAndByGradeAndBySchoolYear", TeachingPlanController.getTeachingPlanByTeacherAndByGradeAndBySchoolYear);

router.post("/createTeachingPlan", TeachingPlanController.createTeachingPlan);
router.post("/updateTeachingPlan", TeachingPlanController.updateTeachingPlan);

module.exports = router;
