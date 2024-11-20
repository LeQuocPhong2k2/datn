const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  process: { type: Number, default: 0 },
});

const WeekSchema = new Schema({
  weekNumber: { type: Number, required: true },
  topics: [TopicSchema],
});

const TeachingPlanSchema = new Schema({
  subject: { type: String, required: true },
  className: { type: String, required: true },
  academicYear: { type: String, required: true },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  },
  weeks: [WeekSchema],
});

const TeachingPlan = mongoose.model("TeachingPlan", TeachingPlanSchema);

module.exports = TeachingPlan;
