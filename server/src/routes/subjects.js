const express = require("express");
const router = express.Router();

const SubjectController = require("../app/controllers/SubjectController");

router.post("/addSubject", SubjectController.addSubject);

module.exports = router;
