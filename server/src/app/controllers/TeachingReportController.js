require("dotenv").config({ path: "../../../../.env" });

const Teacher = require("../models/Teacher");
const TeachingReport = require("../models/TeachingReport");
const TeachingPlan = require("../models/TeachingPlan");
const Subject = require("../models/Subject");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const TeachingReportController = {
  async saveTeachingReport(req, res) {
    const { academicYear, className, teacherNumber, date, reports } = req.body;

    try {
      let dateReport = "";
      if (date !== undefined && date !== null) {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, "0");
        const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
        const year = newDate.getFullYear();
        dateReport = `${day}/${month}/${year}`;
      }

      const teacher = await Teacher.findOne({ phoneNumber: teacherNumber });
      console.log(teacher);
      if (teacher) {
        for (let i = 0; i < reports.length; i++) {
          const report = reports[i];
          const teachingReport = new TeachingReport({
            subject: new ObjectId(report.subject),
            className: className,
            academicYear: academicYear,
            teacher: teacher._id,
            date: dateReport,
            content: report.content,
            contentNext: report.contentNext,
            process: report.process,
            note: report.note,
          });

          // check if the teaching report is already existed
          const existedReport = await TeachingReport.findOne({
            subject: new ObjectId(report.subject),
            className: className,
            academicYear: academicYear,
            teacher: teacher._id,
            date: dateReport,
            content: report.content,
          });

          if (existedReport) {
            console.log("Teaching report existed");
            continue;
          }

          await TeachingPlan.updateOne(
            {
              "weeks.topics.name": report.content,
            },
            {
              $set: {
                "weeks.$.topics.$[topic].process": report.process,
              },
            },
            {
              arrayFilters: [{ "topic.name": report.content }],
            }
          )
            .then((result) => {
              console.log("Update thành công:", result);
            })
            .catch((error) => {
              console.error("Lỗi khi cập nhật:", error);
            });
          console.log("Teaching report saved");
          await teachingReport.save();
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
};

module.exports = TeachingReportController;
