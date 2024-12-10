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
router.post("/getScheduleByWeekDays", ScheduleController.getScheduleByWeekDays);
router.post("/getScheduleByDay", ScheduleController.getScheduleByDay);
router.post("/getClassTeacherBySchoolYear", ScheduleController.getClassTeacherBySchoolYear);
router.post("/getSubjectOfTeacher", ScheduleController.getSubjectOfTeacher);
router.post("/getScheduleOfHomroomTeacher", ScheduleController.getScheduleOfHomroomTeacher);
router.post("/getSchedulesByClassOfHomroomTeacher", ScheduleController.getSchedulesByClassOfHomroomTeacher);

module.exports = router;
