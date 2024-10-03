<<<<<<< HEAD
const mongoose = require('mongoose')
const Schema = mongoose.Schema
=======
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

const GiaoVienSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
<<<<<<< HEAD
      ref: 'Account',
    },
    userName: String,
    dateOfBirth: String,
=======
      ref: "Account",
    },
    userName: String,
    datOfBirth: String,
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
    gender: String,
    phoneNumber: String,
    levelOfExpertise: String,
    address: String,
    dateOfEnrollment: Date,
<<<<<<< HEAD
    role: String,
    isDeleted: { type: Boolean, default: false }, // Thêm trường xoá teacher mặc định là false
  },
  { collection: 'Teacher' }
)

const GiaoVien = mongoose.model('Teacher', GiaoVienSchema)

module.exports = GiaoVien
=======
  },
  { collection: "Teacher" }
);

const GiaoVien = mongoose.model("Teacher", GiaoVienSchema);

module.exports = GiaoVien;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
