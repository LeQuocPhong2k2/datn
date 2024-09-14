require("dotenv").config({ path: "../../../../.env" });
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const socket = require("../../socket");
const { get } = require("mongoose");

const ClassController = {
  /**
   * lấy danh sách lớp
   * @param {*} req
   * @param {*} res
   */
  getAllClasses: async (req, res) => {
    try {
      console.log("Đang truy vấn tất cả lớp...");
      const classes = await Class.find();
      console.log("Kết quả truy vấn:", classes);
      res.status(200).json(classes);
    } catch (error) {
      console.error("Lỗi khi truy vấn lớp:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getClassesByAcademicYearAndGrade: async (req, res) => {
    const { academicYear, grade } = req.body;
    try {
      const classes = await Class.aggregate([
        {
          $match: {
            academicYear: academicYear,
            grade: grade,
          },
        },
        {
          $lookup: {
            from: "Teacher",
            localField: "homeRoomTeacher",
            foreignField: "_id",
            as: "teacherInfo",
          },
        },
        {
          $addFields: {
            totalStudents: { $size: "$studentList" },
          },
        },
        {
          $project: {
            academicYear: 1,
            grade: 1,
            className: 1,
            classSession: 1,
            startDate: 1,
            maxStudents: 1,
            totalStudents: 1,
            homeRoomTeacher: 1,
            teacherInfo: {
              $arrayElemAt: ["$teacherInfo", 0],
            },
          },
        },
      ]);
      console.log("Kết quả truy vấn:", classes);
      res.status(200).json(classes);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp học:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *  thêm lớp
   * @param {namHoc, khoiLop, tenLop, idGiaoVienChuNhiem, ngayBatDau, buoiHoc} req
   * @param {*} res
   * @returns
   */
  addClass: async (req, res) => {
    const { namHoc, khoiLop, tenLop, idGiaoVienChuNhiem, ngayBatDau, buoiHoc } = req.body;

    try {
      const newClass = new Class({
        academicYear: namHoc,
        grade: khoiLop,
        className: tenLop,
        classSession: buoiHoc,
        startDate: ngayBatDau,
        maxStudents: 0,
        homeRoomTeacher: idGiaoVienChuNhiem,
        studentList: [],
      });

      await newClass.save();
      const io = socket.getIo();
      io.emit("addClass", newClass);
      res.status(201).json(newClass);
    } catch (error) {
      console.error("Lỗi khi thêm lớp:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ClassController;
