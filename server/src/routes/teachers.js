const express = require("express");
const router = express.Router();

const GiaoVienController = require("../app/controllers/TeacherController");

router.get("/getAllGiaoViens", GiaoVienController.getAllGiaoViens);
router.post("/addGiaoVien", GiaoVienController.addGiaoVien);

module.exports = router;
