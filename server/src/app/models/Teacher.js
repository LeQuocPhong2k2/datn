const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GiaoVienSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    userName: String,
    datOfBirth: String,
    gender: String,
    phoneNumber: String,
    levelOfExpertise: String,
    address: String,
    dateOfEnrollment: Date,
  },
  { collection: "Teacher" }
);

const GiaoVien = mongoose.model("Teacher", GiaoVienSchema);

module.exports = GiaoVien;
