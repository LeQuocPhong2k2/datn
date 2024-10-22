const mongoose = require("mongoose");
const { schema } = require("./Subject");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema(
  {
    schoolYear: String,
    className: String,
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    scheduleTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
    scheduleTitle: String,
    semester1: Boolean,
    semester2: Boolean,
    timesSlot: [
      {
        lessonNumber: String,
        scheduleDay: String,
      },
    ],
  },
  { collection: "Schedule" }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);
module.exports = Schedule;
