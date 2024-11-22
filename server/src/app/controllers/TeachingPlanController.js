require("dotenv").config({ path: "../../../../.env" });

const TeachingPlan = require("../models/TeachingPlan");
const Teacher = require("../models/Teacher");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
      const teachingPlan = await TeachingPlan.aggregate([
        {
          $match: {
            teacher: new ObjectId(teacherId),
            className: className,
            academicYear: academicYear,
          },
        },
        {
          $unwind: "$weeks",
        },
        {
          $lookup: {
            from: "Subject",
            localField: "subject",
            foreignField: "subjectCode",
            as: "subjectInfo",
          },
        },
        {
          $unwind: "$subjectInfo",
        },
        {
          $group: {
            _id: {
              weekNumber: "$weeks.weekNumber",
              subject: "$subjectInfo.subjectName",
            },
            weekNumber: { $first: "$weeks.weekNumber" },
            subject: { $first: "$subjectInfo" },
            topics: { $push: "$weeks.topics" },
          },
        },
        {
          $group: {
            _id: "$weekNumber",
            weekNumber: { $first: "$weekNumber" },
            subjects: {
              $push: {
                subject: "$subject",
                topics: "$topics",
              },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      if (teachingPlan.length > 0) {
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
          academicYear: academicYear,
          grade: plan.grade,
          subject: plan.subject,
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

  /**
   * get teaching plan by teacher and by grade and by school year
   *
   *
   *
   *
   * @param {*} req
   * @param {*} res
   */
  async getTeachingPlanByTeacherAndByGradeAndBySchoolYear(req, res) {
    const { teacherId, grade, academicYear } = req.body;
    try {
      const teachingPlan = await TeachingPlan.aggregate([
        {
          $match: {
            teacher: new ObjectId(teacherId),
            grade: grade,
            academicYear: academicYear,
          },
        },
        {
          $unwind: "$weeks",
        },
        {
          $lookup: {
            from: "Subject",
            localField: "subject",
            foreignField: "subjectCode",
            as: "subjectInfo",
          },
        },
        {
          $unwind: "$subjectInfo",
        },
        {
          $group: {
            _id: {
              weekNumber: "$weeks.weekNumber",
              subjectName: "$subjectInfo.subjectName",
              subjectCode: "$subjectInfo.subjectCode",
              subjectDescription: "$subjectInfo.subjectDescription",
              subjectCredits: "$subjectInfo.subjectCredits",
              subjectGrade: "$subjectInfo.subjectGrade",
              subjectType: "$subjectInfo.subjectType",
            },
            weekNumber: { $first: "$weeks.weekNumber" },
            subjectName: { $first: "$subjectInfo.subjectName" },
            subjectCode: { $first: "$subjectInfo.subjectCode" },
            subjectDescription: { $first: "$subjectInfo.subjectDescription" },
            subjectCredits: { $first: "$subjectInfo.subjectCredits" },
            subjectGrade: { $first: "$subjectInfo.subjectGrade" },
            subjectType: { $first: "$subjectInfo.subjectType" },
            topics: { $push: "$weeks.topics" },
          },
        },
        {
          $sort: {
            weekNumber: 1, // Sắp xếp tăng dần. Dùng -1 để sắp xếp giảm dần.
          },
        },
        {
          $group: {
            _id: "$subjectCode",
            subjectName: { $first: "$subjectName" },
            week: {
              $push: {
                weekNumber: "$weekNumber",
                topics: "$topics",
              },
            },
          },
        },
        {
          $sort: {
            subjectName: 1, // Sắp xếp tăng dần theo tên môn học
          },
        },
      ]);

      if (teachingPlan.length > 0) {
        return res.status(200).json(teachingPlan);
      }

      return res.status(200).json([]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TeachingPlanController;
