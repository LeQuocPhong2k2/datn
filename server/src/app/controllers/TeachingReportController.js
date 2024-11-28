require("dotenv").config({ path: "../../../../.env" });

const Teacher = require("../models/Teacher");
const TeachingReport = require("../models/TeachingReport");
const TeachingPlan = require("../models/TeachingPlan");
const Subject = require("../models/Subject");
const Class = require("../models/Class");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const TeachingReportController = {
  async saveTeachingReport(req, res) {
    const { academicYear, className, teachCreate, dataSave } = req.body;
    try {
      const teacher = await Teacher.findById(new ObjectId(teachCreate));
      if (teacher) {
        for (const [date, subjects] of Object.entries(dataSave)) {
          for (const subject of subjects) {
            const newReport = new TeachingReport({
              academicYear: academicYear, // Replace with the actual academic year
              className: className, // Replace with the actual class name
              teacherCreate: teacher._id, // Replace with the actual teacher ID
              teacherName: teacher.userName, // Replace with the actual teacher name
              dayCreate: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
              dateCreate: date,
              subjectName: subject.subjectName,
              content: subject.content,
              note: subject.note,
            });

            // Check if the teaching report already exists and delete it
            const existingReport = await TeachingReport.findOne({
              academicYear: academicYear,
              className: className,
              teacherCreate: teacher._id,
              dateCreate: date,
              subjectName: subject.subjectName,
            });

            if (existingReport) {
              console.log("deleting report ..." + existingReport);
              await existingReport.deleteOne();
            }

            console.log("saveing report ..." + newReport);
            await newReport.save();
          }
        }
      }
      return res.status(200).json({ message: "Teaching report saved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getTeachingReports(req, res) {
    const { teacherNumber, academicYear, className, date } = req.body;

    try {
      const teacher = await Teacher.findOne({ phoneNumber: teacherNumber });
      let query = {};

      if (teacher) {
        query.teacher = new ObjectId(teacher._id);
      }

      if (academicYear) {
        query.academicYear = academicYear;
      }

      if (className) {
        query.className = className;
      }

      if (date) {
        let dateReport = "";
        if (date !== undefined && date !== null) {
          const newDate = new Date(date);
          const day = newDate.getDate().toString().padStart(2, "0");
          const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
          const year = newDate.getFullYear();
          dateReport = `${day}/${month}/${year}`;
        }

        query.date = dateReport;
      }

      console.log(query);

      const teachingReports = await TeachingReport.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "Subject",
            localField: "subject",
            foreignField: "_id",
            as: "subjectInfo",
          },
        },
        {
          $group: {
            _id: { subject: "$subject", date: "$date" },
            subject: { $first: "$subjectInfo" },
            reports: {
              $push: {
                _id: "$_id",
                className: "$className",
                academicYear: "$academicYear",
                teacher: "$teacher",
                content: "$content",
                process: "$process",
                contentNext: "$contentNext",
                note: "$note",
              },
            },
          },
        },
        {
          $sort: { "_id.date": 1 }, // Sắp xếp theo ngày
        },
      ]);

      res.status(200).json(teachingReports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getReportDetailByDayOrClassOrSubject(req, res) {
    const { academicYear, className, date, subjectName, teacherId } = req.body;

    try {
      let query = {};

      if (academicYear) {
        query.academicYear = academicYear;
      }

      if (className) {
        query.className = className;
      }

      if (date) {
        query.dateCreate = date;
      }

      if (subjectName) {
        query.subjectName = subjectName;
      }

      const teacher = await Teacher.findById(new ObjectId(teacherId));
      if (teacher) {
        const classInfor = await Class.findOne({ className: className, homeRoomTeacher: teacher._id });
        if (!classInfor) {
          query.teacherCreate = new ObjectId(teacherId);
        }
      }

      const teachingReports = await TeachingReport.aggregate([
        {
          $match: query,
        },

        {
          $group: {
            _id: { date: "$dateCreate" },
            reports: {
              $push: {
                _id: "$_id",
                className: "$className",
                academicYear: "$academicYear",
                teacher: "$teacher",
                subjectName: "$subjectName",
                teacherName: "$teacherName",
                content: "$content",
                process: "$process",
                contentNext: "$contentNext",
                note: "$note",
              },
            },
          },
        },
        {
          $sort: { "_id.date": 1 },
        },
      ]);

      res.status(200).json({ teachingReports });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TeachingReportController;
