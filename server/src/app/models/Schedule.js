const mongoose = require("mongoose");
const { schema } = require("./Subject");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema(
  {
    scheduleTitle: String,
    scheduleCode: String,
    scheduleLesson: String,
    scheduleSession: String,
    scheduleDays: String,
    schemaTimeStart: Date,
    schemaTimeEnd: Date,
    scheduleTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { collection: "Schedule" }
);
