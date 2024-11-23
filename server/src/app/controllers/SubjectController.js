require("dotenv").config({ path: "../../../../.env" });
const Subject = require("../models/Subject");
const Schedule = require("../models/Schedule");

const SubjectController = {
  async getSubjectByGrade(req, res) {
    const { grade } = req.body;
    console.log(req.body);
    try {
      const subject = await Subject.aggregate([
        {
          $match: {
            subjectGrade: grade + "",
          },
        },
        {
          $lookup: {
            from: "Teacher",
            localField: "subjectType",
            foreignField: "department",
            as: "teachers",
          },
        },
        {
          $project: {
            subjectName: 1,
            subjectCode: 1,
            subjectDescription: 1,
            subjectCredits: 1,
            subjectGrade: 1,
            subjectType: 1,
            teachers: {
              _id: 1,
              userName: 1,
            },
          },
        },
      ]);

      if (subject) {
        console.log("subject by grade", subject);
        return res.status(200).json(subject);
      }

      return res.status(404).json({ error: "Subject not found" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async addSubject(req, res) {
    const { subjectName, subjectDescription, subjectCredits, subjectGrade, subjectType } = req.body;
    console.log(req.body);
    try {
      /**
       * Generate a random 6-digit subject code
       */
      let subjectCode = generateSubjectCode();
      do {
        subjectCode = generateSubjectCode();
        const subjectExists = await Subject.findOne({
          subjectCode: subjectCode,
        });

        if (!subjectExists) {
          break;
        }
      } while (true);

      /**
       * Check if the subject already exists
       */
      const subjectExists = await Subject.findOne({
        subjectName: subjectName,
        subjectGrade: subjectGrade,
      });
      if (subjectExists) {
        return res.status(400).json({ error: "Subject already exists" });
      }

      /**
       * Create a new subject
       */
      const subject = await Subject.create({
        subjectName,
        subjectCode,
        subjectDescription,
        subjectCredits,
        subjectGrade,
        subjectType,
      });

      return res.status(201).json(subject);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async findAllSubject(req, res) {
    try {
      // sort by subjectGrade and subjectName
      const subjects = await Subject.find().sort({ subjectGrade: 1, subjectName: 1 });

      return res.status(200).json(subjects);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateSubject(req, res) {
    const { subjectName, subjectCode, subjectDescription, subjectCredits, subjectGrade, subjectType } = req.body;

    console.log(req.body);

    try {
      const subject = await Subject.findOne({
        subjectCode: subjectCode,
      });

      if (subject) {
        subject.subjectName = subjectName;
        subject.subjectDescription = subjectDescription;
        subject.subjectCredits = subjectCredits;
        subject.subjectGrade = subjectGrade;
        subject.subjectType = subjectType;

        await subject.save();

        return res.status(200).json(subject);
      }

      return res.status(404).json({ error: "Subject not found" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteSubject(req, res) {
    const { subjectCode } = req.body;

    try {
      const subject = await Subject.findOne({
        subjectCode: subjectCode,
      });

      if (subject) {
        const schedule = await Schedule.findOne({
          subject: subject._id,
        });
        if (schedule) {
          await schedule.deleteOne();
        }
        await subject.deleteOne();
        return res.status(200).json({ message: "Subject deleted" });
      }

      return res.status(404).json({ error: "Subject not found" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getSubjectAssignments(req, res) {
    const { subjectName } = req.body;
    try {
      const subject = await Subject.aggregate([
        {
          $match: {
            subjectName: subjectName,
          },
        },
        {
          $lookup: {
            from: "Teacher",
            localField: "subjectType",
            foreignField: "department",
            as: "teachers",
          },
        },
        {
          $project: {
            subjectName: 1,
            subjectCode: 1,
            subjectDescription: 1,
            subjectCredits: 1,
            subjectGrade: 1,
            subjectType: 1,
            teachers: {
              _id: 1,
              userName: 1,
            },
          },
        },
      ]);

      if (subject) {
        return res.status(200).json(subject);
      }
      return res.status(404).json({ error: "Subject not found" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

function generateSubjectCode() {
  const randomSixDigits = Math.floor(1000 + Math.random() * 9000);
  return randomSixDigits;
}

module.exports = SubjectController;
