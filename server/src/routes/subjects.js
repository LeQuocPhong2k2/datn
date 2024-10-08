const express = require("express");
const router = express.Router();

const SubjectController = require("../app/controllers/SubjectController");

router.post("/addSubject", SubjectController.addSubject);
router.get("/findAllSubject", SubjectController.findAllSubject);
router.post("/updateSubject", SubjectController.updateSubject);
router.post("/deleteSubject", SubjectController.deleteSubject);

module.exports = router;
