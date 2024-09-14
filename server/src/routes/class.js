const express = require("express");
const router = express.Router();

const ClassController = require("../app/controllers/ClassController");

router.get("/getAllClasses", ClassController.getAllClasses);
router.post("/addClass", ClassController.addClass);
router.post("/getClassesByAcademicYearAndGrade", ClassController.getClassesByAcademicYearAndGrade);

module.exports = router;
