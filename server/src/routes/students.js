const express = require("express");
const router = express.Router();

const StudentController = require("../app/controllers/StudentController");

router.get("/getAllStudents", StudentController.getAllStudents);
router.post("/addStudent", StudentController.addStudent);
router.post("/getStudentByCode", StudentController.getStudentByCode);

module.exports = router;
