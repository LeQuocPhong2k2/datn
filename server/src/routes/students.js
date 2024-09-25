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
