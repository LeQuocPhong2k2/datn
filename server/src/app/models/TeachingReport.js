const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeachingReportSchema = new Schema({
  academicYear: { type: String, required: true },
  className: { type: String, required: true },
  teacherCreate: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  },
  dayCreate: { type: String, required: true },
  dateCreate: { type: String, required: true },
  subjectName: { type: String, required: true },
  content: { type: String, required: true },
  note: { type: String, required: false },
});

const TeachingReport = mongoose.model("TeachingReport", TeachingReportSchema);
module.exports = TeachingReport;
