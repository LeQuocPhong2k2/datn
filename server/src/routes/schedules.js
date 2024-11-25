const express = require("express");
const router = express.Router();

const ScheduleController = require("../app/controllers/ScheduleController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.get("/autoCreateTeacherSchedule", ScheduleController.autoCreateTeacherSchedule);
router.post("/createSchedule", ScheduleController.createSchedule);
router.post("/getSchedulesByClass", ScheduleController.getSchedulesByClass);
router.post("/getSubjectNotInSchedule", ScheduleController.getSubjectNotInSchedule);
router.post("/deleteSchedule", ScheduleController.deleteSchedule);
router.post("/updateSchedule", ScheduleController.updateSchedule);
router.post("/getScheduleOfTeacher", ScheduleController.getScheduleOfTeacher);
router.post("/getClassByDayAndTeacher", ScheduleController.getClassByDayAndTeacher);

module.exports = router;
