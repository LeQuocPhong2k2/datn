const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema(
  {
    academicYear: String,
    grade: String,
    className: String,
    classSession: String,
    startDate: Date,
    maxStudents: Number,
    homeRoomTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
    studentList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { collection: "Class" }
);

const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;
