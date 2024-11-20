require("dotenv").config({ path: "../../../../.env" });

const TeachingPlan = require("../models/TeachingPlan");
const Teacher = require("../models/Teacher");

const TeachingPlanController = {
  /**
   *
   * get teaching plan by subject and class and school year
   *
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getTeachingPlanBySubjectAndClassAndSchoolYear(req, res) {
    const { subject, className, academicYear } = req.body;
    try {
      if (subject === undefined || subject === "" || subject === null) {
        return res.status(200).json([]);
      }

      if (className === undefined || className === "" || className === null) {
        return res.status(200).json([]);
      }

      if (academicYear === undefined || academicYear === "" || academicYear === null) {
        return res.status(200).json([]);
      }

      const teachingPlan = await TeachingPlan.findOne({
        subject: subject,
        className: className,
        academicYear: academicYear,
      });

      if (teachingPlan) {
        return res.status(200).json(teachingPlan);
      }

      return res.status(200).json([]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   *
   *
   *
   * find teaching plan by teacher and by class and by school year
   *
   * @param {*} req
   * @param {*} res
   */
  async getTeachingPlanByTeacherAndByClassAndBySchoolYear(req, res) {
    const { teacherId, className, academicYear } = req.body;
    try {
      const teachingPlan = await TeachingPlan.find({
        teacher: teacherId,
        className: className,
        academicYear: academicYear,
      });

      if (teachingPlan) {
        return res.status(200).json(teachingPlan);
      }

      return res.status(200).json([]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   *
   * create teaching plan
   *
   * @param {*} req
   * @param {*} res
   */
  async createTeachingPlan(req, res) {
    const { plans, teacherPhoneNumber, academicYear } = req.body;

    try {
      const teacher = await Teacher.findOne({ phoneNumber: teacherPhoneNumber });
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        let weeks = [];
        for (let j = 0; j < plan.weeks.length; j++) {
          let topics = [];
          for (let k = 0; k < plan.weeks[j].topics.length; k++) {
            topics.push({
              name: plan.weeks[j].topics[k].name,
              duration: plan.weeks[j].topics[k].duration,
            });
          }

          weeks.push({
            weekNumber: plan.weeks[j].weekNumber,
            topics: topics,
          });
        }

        const teachingPlan = new TeachingPlan({
          subject: plan.subject,
          className: plan.className,
          academicYear: academicYear,
          teacher: teacher._id,
          weeks: weeks,
        });

        console.log("saving teaching plan...");
        await teachingPlan.save();
      }

      return res.status(200).json(plans);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TeachingPlanController;
