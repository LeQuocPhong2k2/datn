require("dotenv").config({ path: "../../../../.env" });
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");

const GiaoVienController = {
  // get danh sách giáo viên chưa phân công chủ nhiệm trong năm học này
  getGiaoVienChuaPhanCongChuNhiem: async (req, res) => {
    const { namHoc } = req.body;
    const result = await Class.aggregate([
      {
        $match: {
          namHoc: namHoc,
        },
      },
      {
        $lookup: {
          from: "Teacher",
          localField: "giaoVienChuNhiem",
          foreignField: "_id",
          as: "giaoVienChuNhiem",
        },
      },
      {
        $unwind: "$giaoVienChuNhiem",
      },
      {
        $project: {
          giaoVienChuNhiem: 1,
        },
      },
    ]);
  },

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

  addGiaoVien: async (req, res) => {
    const { hoTen, namSinh, gioiTinh, trinhDo, sdt, diaChi, ngayBatDauCongTac } = req.body;

    try {
      const newGiaoVien = new GiaoVien({
        hoTen,
        namSinh,
        gioiTinh,
        trinhDo,
        sdt,
        diaChi,
        ngayBatDauCongTac,
      });

      // check sdt is unique
      const existingGiaoVien = await GiaoVien.findOne({
        sdt: sdt,
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
};

module.exports = GiaoVienController;
