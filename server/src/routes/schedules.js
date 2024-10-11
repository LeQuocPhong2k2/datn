const express = require("express");
const router = express.Router();

const ScheduleController = require("../app/controllers/ScheduleController");

router.get("/autoCreateTeacherSchedule", ScheduleController.autoCreateTeacherSchedule);

module.exports = router;
