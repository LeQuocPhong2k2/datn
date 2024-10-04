const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema(
  {
    subjectName: String,
    subjectCode: String,
    subjectDescription: String,
    subjectCredits: String,
    subjectGrade: String,
    subjectType: String,
  },
  { collection: "Subject" }
);

const Subject = mongoose.model("Subject", SubjectSchema);
