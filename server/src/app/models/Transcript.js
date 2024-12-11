const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TranscriptSchema = new Schema(
  {
    studentCode: String,
    userName: String,
    lastName: String,
    dateOfBirth: String,
    className: String,
    schoolYear: String,
    subjectCode: String,
    hk1Gk: Number,
    hk1Ck: {
      type: String,
    },
    hk1Tb: {
      type: String,
    },
    hk2Gk: {
      type: String,
    },
    hk2Ck: {
      type: String,
    },
    hk2Tb: {
      type: String,
    },
    allYear: {
      type: String,
    },
    remarks: String,
  },
  { collection: "Transcript" }
);

const Transcript = mongoose.model("Transcript", TranscriptSchema);
module.exports = Transcript;
