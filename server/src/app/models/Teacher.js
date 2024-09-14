const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GiaoVienSchema = new Schema(
  {
    hoTen: String,
    namSinh: String,
    gioiTinh: String,
    trinhDo: String,
    sdt: String,
    diaChi: String,
    ngayBatDauCongTac: Date,
  },
  { collection: "Teacher" }
);

const GiaoVien = mongoose.model("Teacher", GiaoVienSchema);

module.exports = GiaoVien;
