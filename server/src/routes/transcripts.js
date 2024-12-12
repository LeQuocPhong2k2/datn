const express = require("express");
const router = express.Router();

const TranscriptController = require("../app/controllers/TranscriptController");

router.post("/getTranscriptBySubjectAndClassAndSchoolYear", TranscriptController.getTranscriptBySubjectAndClassAndSchoolYear);
router.post("/updateTranscript", TranscriptController.updateTranscript);
router.post("/getTranscriptByStudentCodeAndClassAndSchoolYear", TranscriptController.getTranscriptByStudentCodeAndClassAndSchoolYear);
router.post("/getClassStatistics", TranscriptController.getClassStatistics);
router.post("/getStudentStatistics", TranscriptController.getStudentStatistics);

router.post("/checkImportTranscript", TranscriptController.checkImportTranscript);

module.exports = router;
