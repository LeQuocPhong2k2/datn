const express = require("express");
const router = express.Router();

const TeachingPlanController = require("../app/controllers/TeachingPlanController");

router.post("/getTeachingPlanByTeacherAndByClassAndBySchoolYear", TeachingPlanController.getTeachingPlanByTeacherAndByClassAndBySchoolYear);

router.post("/createTeachingPlan", TeachingPlanController.createTeachingPlan);

module.exports = router;
