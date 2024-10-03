require("dotenv").config({ path: "../../../../.env" });
const Subject = require("../models/Subject");

const SubjectController = {
  async create(req, res) {
    const { subjectName, subjectCode, subjectDescription, subjectCredits, subjectGrade, subjectType } = req.body;

    try {
      const subjectExists = await Subject.findOne({
        subjectCode: subjectCode,
      });

      if (subjectExists) {
        return res.status(400).json({ error: "Subject already exists" });
      }

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

  async read(req, res) {
    try {
      const subjects = await Subject.find();

      return res.status(200).json(subjects);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { subjectName, subjectCode, subjectDescription, subjectCredits, subjectGrade, subjectType } = req.body;

    try {
      const subject = await Subject.findById(id);

      if (subject) {
        subject.subjectName = subjectName;
        subject.subjectCode = subjectCode;
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
};

module.exports = SubjectController;
