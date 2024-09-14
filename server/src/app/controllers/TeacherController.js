require("dotenv").config({ path: "../../../../.env" });
const GiaoVien = require("../models/Teacher");

const GiaoVienController = {
  getAllGiaoViens: async (req, res) => {
    try {
      console.log("Đang truy vấn tất cả giáo viên...");
      const giaoViens = await GiaoVien.find();
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
