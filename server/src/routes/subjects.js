const express = require("express");
const router = express.Router();

const SubjectController = require("../app/controllers/SubjectController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.post("/addSubject", authenticateToken, SubjectController.addSubject);
router.get("/findAllSubject", authenticateToken, SubjectController.findAllSubject);
router.post("/updateSubject", authenticateToken, SubjectController.updateSubject);
router.post("/deleteSubject", authenticateToken, SubjectController.deleteSubject);
router.post("/getSubjectAssignments", authenticateToken, SubjectController.getSubjectAssignments);
router.post("/getSubjectByGrade", authenticateToken, SubjectController.getSubjectByGrade);

module.exports = router;
