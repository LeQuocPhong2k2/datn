require("dotenv").config({ path: "../../../../.env" });
const Teacher = require("../models/Teacher");

const GiaoVienController = {
  /**
   * lấy danh sách giáo viên chưa phân công chủ nhiệm
   * @param {namHoc} req
   * @param {*} res
   */
  getGiaoVienChuaPhanCongChuNhiem: async (req, res) => {
    const { namHoc } = req.body;
    console.log("Đang truy vấn giáo viên chưa phân công chủ nhiệm...", namHoc);
    try {
      const result = await Teacher.aggregate([
        {
          $lookup: {
            from: "Class",
            localField: "_id",
            foreignField: "homeRoomTeacher",
            as: "class",
          },
        },
        {
          $match: {
            $or: [{ "class.academicYear": { $ne: namHoc } }, { class: { $eq: [] } }],
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi truy vấn giáo viên chưa phân công chủ nhiệm:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * lấy danh sách giáo viên
   * @param {*} req
   * @param {*} res
   */
  getAllGiaoViens: async (req, res) => {
    try {
      console.log("Đang truy vấn tất cả giáo viên...");
      const giaoViens = await Teacher.find();
      console.log("Kết quả truy vấn:", giaoViens);
      res.status(200).json(giaoViens);
    } catch (error) {
      console.error("Lỗi khi truy vấn giáo viên:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *  thêm giáo viên
   * @param {hoTen, namSinh, gioiTinh, trinhDo, sdt, diaChi, ngayBatDauCongTac} req
   * @param {*} res
   * @returns
   */
  addGiaoVien: async (req, res) => {
    const { hoTen, namSinh, gioiTinh, trinhDo, sdt, diaChi, ngayBatDauCongTac, boMon } = req.body;

    try {
      const newGiaoVien = new Teacher({
        userName: hoTen,
        datOfBirth: namSinh,
        gender: gioiTinh,
        phoneNumber: sdt,
        levelOfExpertise: trinhDo,
        address: diaChi,
        department: boMon,
        dateOfEnrollment: ngayBatDauCongTac,
        role: "teacher",
      });

      // check sdt is unique
      const existingGiaoVien = await Teacher.findOne({
        phoneNumber: sdt,
      });

      if (existingGiaoVien) {
        console.error("Số điện thoại đã tồn tại:", sdt);
        return res.status(400).json({ error: "Số điện thoại đã tồn tại" });
      }

      await newGiaoVien.save();
      console.log("Thêm giáo viên thành công:", newGiaoVien);
      res.status(200).json({ message: "Thêm giáo viên thành công" });
    } catch (error) {
      console.error("Lỗi khi thêm giáo viên:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getGiaoVienByDepartment: async (req, res) => {
    const { department } = req.body;
    console.log("Đang truy vấn giáo viên theo bộ môn...", department);
    try {
      const result = await Teacher.find({ department: department });
      console.log("Kết quả truy vấn:", result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi truy vấn giáo viên theo bộ môn:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = GiaoVienController;
