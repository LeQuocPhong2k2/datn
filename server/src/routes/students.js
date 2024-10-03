<<<<<<< HEAD
const express = require('express')
const router = express.Router()

const StudentController = require('../app/controllers/StudentController')

router.get('/getAllStudents', StudentController.getAllStudents)
router.post('/addStudent', StudentController.addStudent)
router.post('/getStudentByCode', StudentController.getStudentByCode)
router.post('/searchStudents', StudentController.searchStudents)
router.post(
  '/getFullInfoStudentByCode',
  StudentController.getFullInfoStudentByCode
)
router.post('/editStudent', StudentController.editStudent)
router.post('/deleteStudent', StudentController.deleteStudent)

module.exports = router
=======
const express = require("express");
const router = express.Router();

const StudentController = require("../app/controllers/StudentController");

router.get("/getAllStudents", StudentController.getAllStudents);
router.post("/addStudent", StudentController.addStudent);
router.post("/getStudentByCode", StudentController.getStudentByCode);
router.post("/searchStudents", StudentController.searchStudents);
router.post("/getFullInfoStudentByCode", StudentController.getFullInfoStudentByCode);
router.post("/editStudent", StudentController.editStudent);
router.post("/deleteStudent", StudentController.deleteStudent);

router.post("/getStudentByNameAndAcademicYearAndGradeAndClassName", StudentController.getStudentByNameAndAcademicYearAndGradeAndClassName);

module.exports = router;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
