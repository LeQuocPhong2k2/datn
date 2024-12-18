const express = require("express");
const router = express.Router();

const ClassController = require("../app/controllers/ClassController");

router.get("/getAllClasses", ClassController.getAllClasses);
router.post("/getClassesByAcademicYearAndGrade", ClassController.getClassesByAcademicYearAndGrade);
router.post("/getClassesByAcademicYearOrGradeOrClassNameOrClassSession", ClassController.getClassesByAcademicYearOrGradeOrClassNameOrClassSession);
router.post("/getDsStudentByClass", ClassController.getDsStudentByClass);
router.post("/importNewProfileStudent", ClassController.importNewProfileStudent);

router.post("/addClass", ClassController.addClass);

module.exports = router;
