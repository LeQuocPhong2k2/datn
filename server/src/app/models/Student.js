const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema(
  {
    studentCode: String,
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
        ref: 'Parent',
      },
    ],
    role: String,
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    ethnicGroups: String,
    status: String,
  },
  { collection: 'Student' }
)

const Student = mongoose.model('Student', StudentSchema)
// tắt chế dộ strictPopulate để populate các trường ref
// StudentSchema.set('strictPopulate', false)

module.exports = Student
