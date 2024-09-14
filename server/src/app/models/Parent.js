const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParentSchema = new Schema(
  {
    userName: String,
    dateOfBirth: String,
    phoneNumber: String,
    job: String,
    relationship: String,
  },
  { collection: "Parent" }
);

const Parent = mongoose.model("Parent", ParentSchema);

module.exports = Parent;
