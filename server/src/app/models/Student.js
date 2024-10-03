<<<<<<< HEAD
const mongoose = require('mongoose')
const Schema = mongoose.Schema
=======
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

const StudentSchema = new Schema(
  {
    studentCode: String,
<<<<<<< HEAD
=======
    firstName: String,
    lastName: String,
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
    userName: String,
    phoneNumber: String,
    dateOfBirth: String,
    gender: String,
    dateOfEnrollment: Date,
    address: String,
    relationshipOther: String,
    parents: [
      {
        type: Schema.Types.ObjectId,
<<<<<<< HEAD
        ref: 'Parent',
      },
    ],
    role: String,
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
=======
        ref: "Parent",
      },
    ],
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
    },
    ethnicGroups: String,
    status: String,
    isDeleted: { type: Boolean, default: false }, // Thêm trường xoá học sinh mặc định là false
  },
<<<<<<< HEAD
  { collection: 'Student' }
)

const Student = mongoose.model('Student', StudentSchema)
// tắt chế dộ strictPopulate để populate các trường ref
// StudentSchema.set('strictPopulate', false)

module.exports = Student
=======
  { collection: "Student" }
);

const Student = mongoose.model("Student", StudentSchema);
// tắt chế dộ strictPopulate để populate các trường ref
// StudentSchema.set('strictPopulate', false)

module.exports = Student;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
