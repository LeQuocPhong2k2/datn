const express = require("express");
const router = express.Router();

const TranscriptController = require("../app/controllers/TranscriptController");

router.post("/getTranscriptBySubjectAndClassAndSchoolYear", TranscriptController.getTranscriptBySubjectAndClassAndSchoolYear);
router.post("/updateTranscript", TranscriptController.updateTranscript);

module.exports = router;
