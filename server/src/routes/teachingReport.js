const express = require("express");
const router = express.Router();

const TeachingReportController = require("../app/controllers/TeachingReportController");

router.post("/saveTeachingReport", TeachingReportController.saveTeachingReport);
router.post("/getTeachingReports", TeachingReportController.getTeachingReports);

module.exports = router;