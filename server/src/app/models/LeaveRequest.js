const mongoose = require('mongoose')
const Schema = mongoose.Schema

// trạng thái buổi học sáng chiều
const sessionSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  morning: {
    type: Boolean,
    default: false,
  },
  afternoon: {
    type: Boolean,
    default: false,
  },
})

const leaveRequestSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
    },
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    class_id: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    sessions: [sessionSchema],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'LeaveRequest',
  }
)

const LeaveRequest = mongoose.model(
  'LeaveRequest',
  leaveRequestSchema,
  'LeaveRequest'
)

module.exports = LeaveRequest
