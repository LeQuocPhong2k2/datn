const express = require('express')
const router = express.Router()

const GiaoVienController = require('../app/controllers/TeacherController')
const authenticateToken = require('../app/middleware/AuthenticateToken')

router.post(
  '/getGiaoVienChuaPhanCongChuNhiem',
  GiaoVienController.getGiaoVienChuaPhanCongChuNhiem
)
router.get('/getAllGiaoViens', GiaoVienController.getAllGiaoViens)
router.post('/addGiaoVien', GiaoVienController.addGiaoVien)
router.post(
  '/getGiaoVienByDepartment',
  GiaoVienController.getGiaoVienByDepartment
)
router.post(
  '/getGiaoVienByPhoneNumber',
  GiaoVienController.getGiaoVienByPhoneNumber
)
router.post(
  '/getGiaoVienByClassNameAndSchoolYear',
  GiaoVienController.getGiaoVienByClassNameAndSchoolYear
)
router.post('/getTeacherSchedule', GiaoVienController.getTeacherSchedule)

module.exports = router
