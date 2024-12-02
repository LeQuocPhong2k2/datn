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
            const existingReport = {
              academicYear: academicYear,
              className: className,
              teacherCreate: teacher._id,
              dateCreate: date,
              subjectName: subject.subjectName,
            };
            await TeachingReport.deleteMany(existingReport);

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

  async updateTeachingReport(req, res) {
    const { academicYear, className, teachCreate, dataSave } = req.body;
    try {
      const teacher = await Teacher.findById(new ObjectId(teachCreate));
      console.log("teacher: " + teacher);
      console.log("dataSave: " + dataSave);
      if (teacher) {
        for (const [date, subjects] of Object.entries(dataSave)) {
          for (const subject of subjects) {
            const existingReport = await TeachingReport.findOne({
              academicYear: academicYear,
              className: className,
              teacherCreate: teacher._id,
              dateCreate: date,
              subjectName: subject.subjectName,
            });

            if (existingReport) {
              if (subject.delete === 1) {
                console.log("deleting report ..." + existingReport);
                await existingReport.deleteOne();
                continue;
              }
              existingReport.content = subject.content;
              existingReport.note = subject.note;
              console.log("updating report ..." + existingReport);
              await existingReport.save();
            }
          }
        }
      }
      return res.status(200).json({ message: "Teaching report updated successfully" });
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
    const { academicYear, className, dateToStart, dateToEnd, subjectName, teacherId } = req.body;

    try {
      let query = {};

      if (academicYear) {
        query.academicYear = academicYear;
      }

      if (className) {
        query.className = className;
      }

      if (dateToStart) {
        query.dateCreate = dateToStart;
      }

      if (dateToEnd) {
        query.dateCreate = dateToEnd;
      }

      if (dateToStart && dateToEnd) {
        query.dateCreate = { $gte: dateToStart, $lte: dateToEnd };
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

  async getReportByClassAndDay(req, res) {
    const { academicYear, className, date } = req.body;

    try {
      const teachingReports = await TeachingReport.find({ academicYear, className, dateCreate: date });

      res.status(200).json({ teachingReports });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async checkBaoBaiisExsit(req, res) {
    const { academicYear, className, teachCreate, date, subjectName } = req.body;

    try {
      const teacher = await Teacher.findById(new ObjectId(teachCreate));
      if (teacher) {
        const existingReport = await TeachingReport.findOne({
          academicYear: academicYear,
          className: className,
          teacherCreate: teacher._id,
          dateCreate: date,
          subjectName: subjectName,
        });

        if (existingReport) {
          return res.status(400).json({ message: "Báo bài đã tồn tại" });
        }
      }

      return res.status(200).json({ message: "Báo bài chưa tồn tại" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TeachingReportController;
