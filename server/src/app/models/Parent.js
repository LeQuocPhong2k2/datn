const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParentSchema = new Schema(
  {
    userName: String,
    birthDay: String,
    phoneNumber: String,
    address: String,
    job: String,
    childs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { collection: "Parent" }
);

const Parent = mongoose.model("Parent", ParentSchema);

module.exports = Parent;
