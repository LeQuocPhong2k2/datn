const express = require("express");
const router = express.Router();

const ScheduleController = require("../app/controllers/ScheduleController");

router.get("/autoCreateTeacherSchedule", ScheduleController.autoCreateTeacherSchedule);
router.post("/createSchedule", ScheduleController.createSchedule);
router.post("/getSchedulesByClass", ScheduleController.getSchedulesByClass);
router.post("/getSubjectNotInSchedule", ScheduleController.getSubjectNotInSchedule);
router.post("/deleteSchedule", ScheduleController.deleteSchedule);

module.exports = router;
