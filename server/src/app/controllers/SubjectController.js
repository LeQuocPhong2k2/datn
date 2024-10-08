require("dotenv").config({ path: "../../../../.env" });
const Subject = require("../models/Subject");

const SubjectController = {
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
        await subject.deleteOne();
        return res.status(200).json({ message: "Subject deleted" });
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
