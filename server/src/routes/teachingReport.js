const express = require("express");
const router = express.Router();

const TeachingReportController = require("../app/controllers/TeachingReportController");

router.post("/saveTeachingReport", TeachingReportController.saveTeachingReport);
router.post("/getTeachingReports", TeachingReportController.getTeachingReports);
router.post("/getReportDetailByDayOrClassOrSubject", TeachingReportController.getReportDetailByDayOrClassOrSubject);
router.post("/updateTeachingReport", TeachingReportController.updateTeachingReport);
router.post("/getReportByClassAndDay", TeachingReportController.getReportByClassAndDay);

module.exports = router;
