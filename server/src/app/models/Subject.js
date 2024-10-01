const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubjectSchema = new Schema(
  {
    subjectName: String,
    class_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    teacher_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
      },
    ],
  },
  { collection: 'Subject' }
)
const Subject = mongoose.model('Subject', SubjectSchema)
// tắt chế dộ strictPopulate để populate các trường ref

module.exports = Subject
