const express = require("express");
const router = express.Router();

const StudentController = require("../app/controllers/StudentController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.get("/getAllStudents", authenticateToken, StudentController.getAllStudents);
router.post("/addStudent", authenticateToken, StudentController.addStudent);
router.post("/getStudentByCode", authenticateToken, StudentController.getStudentByCode);
router.post("/searchStudents", authenticateToken, StudentController.searchStudents);
router.post("/getFullInfoStudentByCode", authenticateToken, StudentController.getFullInfoStudentByCode);
router.post("/editStudent", authenticateToken, StudentController.editStudent);
router.post("/deleteStudent", authenticateToken, StudentController.deleteStudent);

router.post("/getStudentByNameAndAcademicYearAndGradeAndClassName", authenticateToken, StudentController.getStudentByNameAndAcademicYearAndGradeAndClassName);

router.post("/getStudentByAccountId", authenticateToken, StudentController.getStudentByAccountId);

module.exports = router;
