const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeachingReportSchema = new Schema({
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
  },
  className: { type: String, required: true },
  academicYear: { type: String, required: true },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  },
  date: { type: String, required: true },
  content: { type: String, required: true },
  contentNext: { type: String, required: true },
  process: { type: Number, required: true },
  note: { type: String, required: false },
});

const TeachingReport = mongoose.model("TeachingReport", TeachingReportSchema);
module.exports = TeachingReport;
