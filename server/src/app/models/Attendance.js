const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AttendanceSchema = new Schema(
  {
    class_id: { type: Schema.Types.ObjectId, required: true },
    teacher_id: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    attendanceRecords: [
      {
        student_id: { type: Schema.Types.ObjectId, required: true },
        student_name: { type: String },
        status: { type: String, required: true },
        reason: { type: String },
        leaveRequest_id: { type: Schema.Types.ObjectId }, // Optional field
      },
    ],
  },
  { collection: 'Attendance' }
) // Chỉ định rõ tên collection
module.exports = mongoose.model('Attendance', AttendanceSchema)
