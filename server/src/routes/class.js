const express = require("express");
const router = express.Router();

const ClassController = require("../app/controllers/ClassController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.get("/getAllClasses", ClassController.getAllClasses);
router.post("/getClassesByAcademicYearAndGrade", ClassController.getClassesByAcademicYearAndGrade);
router.post("/getClassesByAcademicYearOrGradeOrClassNameOrClassSession", ClassController.getClassesByAcademicYearOrGradeOrClassNameOrClassSession);
router.post("/getDsStudentByClass", ClassController.getDsStudentByClass);
router.post("/importNewProfileStudent", ClassController.importNewProfileStudent);
router.post("/getListStudentByClassId", ClassController.getListStudentByClassId);
router.post("/addClass", ClassController.addClass);
router.post("/autoUpClass", ClassController.autoUpClass);
router.post("/deleteClass", ClassController.deleteClass);
router.post("/importStudents", ClassController.importStudents);
router.post("/getStudentListByClassNameAndAcademicYear", ClassController.getStudentListByClassNameAndAcademicYear);
module.exports = router;
