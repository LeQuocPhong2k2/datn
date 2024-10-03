const express = require('express')
const router = express.Router()

const GiaoVienController = require('../app/controllers/TeacherController')

router.post(
  '/getGiaoVienChuaPhanCongChuNhiem',
  GiaoVienController.getGiaoVienChuaPhanCongChuNhiem
)
router.get('/getAllGiaoViens', GiaoVienController.getAllGiaoViens)
router.post('/addGiaoVien', GiaoVienController.addGiaoVien)
router.post('/searchTeacher', GiaoVienController.searchTeacher)

module.exports = router
