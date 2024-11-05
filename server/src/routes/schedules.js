const express = require("express");
const router = express.Router();

const ScheduleController = require("../app/controllers/ScheduleController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.get("/autoCreateTeacherSchedule", authenticateToken, ScheduleController.autoCreateTeacherSchedule);
router.post("/createSchedule", authenticateToken, ScheduleController.createSchedule);
router.post("/getSchedulesByClass", authenticateToken, ScheduleController.getSchedulesByClass);
router.post("/getSubjectNotInSchedule", authenticateToken, ScheduleController.getSubjectNotInSchedule);
router.post("/deleteSchedule", authenticateToken, ScheduleController.deleteSchedule);
router.post("/updateSchedule", authenticateToken, ScheduleController.updateSchedule);

module.exports = router;
