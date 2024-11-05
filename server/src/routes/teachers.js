const express = require("express");
const router = express.Router();

const GiaoVienController = require("../app/controllers/TeacherController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.post("/getGiaoVienChuaPhanCongChuNhiem", authenticateToken, GiaoVienController.getGiaoVienChuaPhanCongChuNhiem);
router.get("/getAllGiaoViens", authenticateToken, GiaoVienController.getAllGiaoViens);
router.post("/addGiaoVien", authenticateToken, GiaoVienController.addGiaoVien);
router.post("/getGiaoVienByDepartment", authenticateToken, GiaoVienController.getGiaoVienByDepartment);
router.post("/getGiaoVienByPhoneNumber", authenticateToken, GiaoVienController.getGiaoVienByPhoneNumber);
router.post("/getGiaoVienByClassNameAndSchoolYear", authenticateToken, GiaoVienController.getGiaoVienByClassNameAndSchoolYear);
router.post("/getTeacherSchedule", authenticateToken, GiaoVienController.getTeacherSchedule);

module.exports = router;
