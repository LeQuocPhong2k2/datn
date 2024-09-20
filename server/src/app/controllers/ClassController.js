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

  /**
   * getDsStudentByClass
   * @param {*} req
   * @param {*} res
   */
  getDsStudentByClass: async (req, res) => {
    const { idClass } = req.body;
    console.log("ID lớp học:", idClass);
    try {
      const students = await Class.findById(idClass).populate({
        path: "studentList",
        populate: {
          path: "parents",
          model: "Parent",
        },
      });
      console.log(JSON.stringify(students, null, 2));
      console.log("Danh sách học sinh trong lớp:", students);
      res.status(200).json(students.studentList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * get Classes By AcademicYear Or Grade Or ClassName Or ClassSession
   * @param {*} req
   * @param {*} res
   */
  getClassesByAcademicYearOrGradeOrClassNameOrClassSession: async (req, res) => {
    const { academicYear, grade, className, classSession } = req.body;
    console.log("Thông tin tìm kiếm:", academicYear, grade, className, classSession);
    try {
      let query = {};

      if (academicYear) {
        query.academicYear = academicYear;
      }
      if (grade) {
        query.grade = grade;
      }
      if (className) {
        query.className = { $regex: className, $options: "i" };
      }
      if (classSession) {
        query.classSession = classSession;
      }

      const classes = await Class.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "Teacher", // Tên của collection chứa thông tin giáo viên
            localField: "homeRoomTeacher", // Trường trong collection Class
            foreignField: "_id", // Trường trong collection Teacher
            as: "teacherInfo", // Tên biến chứa thông tin giáo viên
          },
        },
        {
          $unwind: {
            path: "$homeRoomTeacher",
            preserveNullAndEmptyArrays: true, // Giữ lại các lớp không có giáo viên chủ nhiệm
          },
        },
        {
          $lookup: {
            from: "Student", // Tên của collection chứa thông tin học sinh
            localField: "studentList", // Trường trong collection Class chứa danh sách ID học sinh
            foreignField: "_id", // Trường trong collection Student
            as: "students", // Tên biến chứa thông tin học sinh
          },
        },
        {
          $addFields: {
            totalStudents: { $size: "$students" }, // Đếm số lượng học sinh trong lớp
            maleStudents: {
              $size: {
                $filter: {
                  input: "$students",
                  as: "student",
                  cond: { $eq: ["$$student.gender", "Nam"] },
                },
              },
            },
            femaleStudents: {
              $size: {
                $filter: {
                  input: "$students",
                  as: "student",
                  cond: { $eq: ["$$student.gender", "Nữ"] },
                },
              },
            },
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
            maleStudents: 1,
            femaleStudents: 1,
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
   * getClasses By AcademicYear And Grade
   * @param {*} req
   * @param {*} res
   */
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
        maxStudents: 40,
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
