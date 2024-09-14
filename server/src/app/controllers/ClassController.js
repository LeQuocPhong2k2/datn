require("dotenv").config({ path: "../../../../.env" });
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");

const ClassController = {
  /**
   * lấy danh sách lớp
   * @param {*} req
   * @param {*} res
   */
  getAllClasses: async (req, res) => {
    try {
      console.log("Đang truy vấn tất cả lớp...");
      const classes = await Class.find();
      console.log("Kết quả truy vấn:", classes);
      res.status(200).json(classes);
    } catch (error) {
      console.error("Lỗi khi truy vấn lớp:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *  thêm lớp
   * @param {namHoc, khoiLop, tenLop, idGiaoVienChuNhiem, ngayBatDau, buoiHoc} req
   * @param {*} res
   * @returns
   */
  addClass: async (req, res) => {
    const { namHoc, khoiLop, tenLop, idGiaoVienChuNhiem, ngayBatDau, buoiHoc } = req.body;

    try {
      const newClass = new Class({
        academicYear: namHoc,
        grade: khoiLop,
        className: tenLop,
        classSession: buoiHoc,
        startDate: ngayBatDau,
        maxStudents: 0,
        homeRoomTeacher: idGiaoVienChuNhiem,
        studentList: [],
      });

      await newClass.save();
      res.status(201).json(newClass);
    } catch (error) {
      console.error("Lỗi khi thêm lớp:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ClassController;
