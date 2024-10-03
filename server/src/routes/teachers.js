const express = require('express')
const router = express.Router()

const GiaoVienController = require('../app/controllers/TeacherController')

router.post(
  '/getGiaoVienChuaPhanCongChuNhiem',
  GiaoVienController.getGiaoVienChuaPhanCongChuNhiem
)
router.get('/getAllGiaoViens', GiaoVienController.getAllGiaoViens)
router.post('/addGiaoVien', GiaoVienController.addGiaoVien)
<<<<<<< HEAD
router.post('/searchTeacher', GiaoVienController.searchTeacher)
=======
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

module.exports = router
