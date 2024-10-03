const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GiaoVienSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    userName: String,
    dateOfBirth: String,
    gender: String,
    phoneNumber: String,
    levelOfExpertise: String,
    address: String,
    dateOfEnrollment: Date,
    role: String,
    isDeleted: { type: Boolean, default: false }, // Thêm trường xoá teacher mặc định là false
  },
  { collection: 'Teacher' }
)

const GiaoVien = mongoose.model('Teacher', GiaoVienSchema)

module.exports = GiaoVien
