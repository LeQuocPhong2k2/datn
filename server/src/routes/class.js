const express = require("express");
const router = express.Router();

const ClassController = require("../app/controllers/ClassController");

router.get("/getAllClasses", ClassController.getAllClasses);
<<<<<<< HEAD
router.post("/addClass", ClassController.addClass);
router.post("/getClassesByAcademicYearAndGrade", ClassController.getClassesByAcademicYearAndGrade);
router.post("/getClassesByAcademicYearOrGradeOrClassNameOrClassSession", ClassController.getClassesByAcademicYearOrGradeOrClassNameOrClassSession);
router.post("/getDsStudentByClass", ClassController.getDsStudentByClass);
=======
// router.post("/addClass", ClassController.addClass);
router.post("/getClassesByAcademicYearAndGrade", ClassController.getClassesByAcademicYearAndGrade);
router.post("/getClassesByAcademicYearOrGradeOrClassNameOrClassSession", ClassController.getClassesByAcademicYearOrGradeOrClassNameOrClassSession);
router.post("/getDsStudentByClass", ClassController.getDsStudentByClass);
router.post("/importNewProfileStudent", ClassController.importNewProfileStudent);

router.post("/addClass", ClassController.addClass);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

module.exports = router;
