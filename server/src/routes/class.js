const express = require("express");
const router = express.Router();

const ClassController = require("../app/controllers/ClassController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.get("/getAllClasses", authenticateToken, ClassController.getAllClasses);
router.post("/getClassesByAcademicYearAndGrade", authenticateToken, ClassController.getClassesByAcademicYearAndGrade);
router.post("/getClassesByAcademicYearOrGradeOrClassNameOrClassSession", authenticateToken, ClassController.getClassesByAcademicYearOrGradeOrClassNameOrClassSession);
router.post("/getDsStudentByClass", authenticateToken, ClassController.getDsStudentByClass);
router.post("/importNewProfileStudent", authenticateToken, ClassController.importNewProfileStudent);
router.post("/getListStudentByClassId", authenticateToken, ClassController.getListStudentByClassId);
router.post("/addClass", authenticateToken, ClassController.addClass);
router.post("/autoUpClass", authenticateToken, ClassController.autoUpClass);
router.post("/deleteClass", authenticateToken, ClassController.deleteClass);
router.post("/importStudents", authenticateToken, ClassController.importStudents);
module.exports = router;
