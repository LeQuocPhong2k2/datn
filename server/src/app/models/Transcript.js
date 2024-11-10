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
      type: Number,
      min: 0,
      max: 10,
    },
    hk1Tb: {
      type: Number,
      min: 0,
      max: 10,
    },
    hk2Gk: {
      type: Number,
      min: 0,
      max: 10,
    },
    hk2Ck: {
      type: Number,
      min: 0,
      max: 10,
    },
    hk2Tb: {
      type: Number,
      min: 0,
      max: 10,
    },
    allYear: {
      type: Number,
      min: 0,
      max: 10,
    },
    remarks: String,
  },
  { collection: "Transcript" }
);

const Transcript = mongoose.model("Transcript", TranscriptSchema);
module.exports = Transcript;
