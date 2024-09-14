const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    studentCode: String,
    userName: String,
    phoneNumber: String,
    dateOfBirth: String,
    gender: String,
    dateOfEnrollment: Date,
    address: String,
    parents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Parent",
      },
    ],
    role: String,
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  { collection: "Student" }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
