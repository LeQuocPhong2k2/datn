require("dotenv").config({ path: "../../../../.env" });
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Class = require("../models/Class");
const Account = require("../models/Account");
const socket = require("../../socket");

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

      // Sắp xếp danh sách học sinh theo tên
      students.studentList.sort((a, b) => a.lastName.localeCompare(b.lastName));

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
    const { namHoc, khoiLop, tenLop, idGiaoVienChuNhiem, ngayBatDau, typeFileImport } = req.body;
    try {
      // 1. Kiểm tra xem lớp đã tồn tại chưa
      const checkClass = await Class.findOne({
        academicYear: namHoc,
        grade: khoiLop,
        className: tenLop,
      });
      if (checkClass) {
        return res.status(400).json({ message: "Lớp đã tồn tại" });
      }

      // 2. Tạo lớp mới
      const newClass = new Class({
        academicYear: namHoc,
        grade: khoiLop,
        className: tenLop,
        homeRoomTeacher: idGiaoVienChuNhiem,
        startDate: ngayBatDau,
        maxStudents: 40,
        studentList: [],
      });

      // 3. Lưu lớp mới
      console.log("Đang lưu lớp mới...");
      await newClass.save();

      // 4. Trả về kết quả
      console.log("Thêm lớp học thành công:", newClass);
      res.status(200).json(newClass);
    } catch (error) {
      console.error("Lỗi khi thêm lớp học:", error);
      res.status(500).json({ error: error.message });
    }
  },

  importNewProfileStudent: async (req, res) => {
    const { student, namHoc, khoiLop, tenLop } = req.body;
    try {
      // 1. kiểm tra học sinh có tồn tại
      const checkStudent = await Student.findOne({
        firstName: student.ho,
        lastName: student.ten,
        phoneNumber: student.sdt,
      });
      if (checkStudent) {
        return res.status(400).json({ message: "Học sinh đã tồn tại", student: checkStudent });
      }

      // 2. Parent
      let parent1 = null;
      let parent2 = null;
      let parent3 = null;
      let parents = [];
      if (student.moiQuanHeKhac) {
        const checkParent = await Parent.findOne({
          userName: student.hoTenNguoiGiamHo,
          phoneNumber: student.sdtNguoiGiamHo,
        });
        if (!checkParent) {
          parent1 = new Parent({
            userName: student.hoTenNguoiGiamHo,
            dateOfBirth: student.namSinhNguoiGiamHo,
            job: student.ngheNghiepNguoiGiamHo,
            phoneNumber: student.sdtNguoiGiamHo,
            relationship: student.moiQuanHe,
          });
          parents.push(parent1._id);
        } else {
          parents.push(checkParent._id);
        }
      } else {
        if (student.moiQuanHeCha) {
          const checkParent = await Parent.findOne({
            userName: student.hoTenCha,
            phoneNumber: student.sdtCha,
          });
          if (!checkParent) {
            parent2 = new Parent({
              userName: student.hoTenCha,
              dateOfBirth: student.namSinhCha,
              job: student.ngheNghiepCha,
              phoneNumber: student.sdtCha,
              relationship: "Cha",
            });
            parents.push(parent2._id);
          } else {
            parents.push(checkParent._id);
          }
        }
        if (student.moiQuanHeMe) {
          const checkParent = await Parent.findOne({
            userName: student.hoTenMe,
            phoneNumber: student.sdtMe,
          });
          if (!checkParent) {
            parent3 = new Parent({
              userName: student.hoTenMe,
              dateOfBirth: student.namSinhMe,
              job: student.ngheNghiepMe,
              phoneNumber: student.sdtMe,
              relationship: "Me",
            });
            parents.push(parent3._id);
          } else {
            parents.push(checkParent._id);
          }
        }
      }

      // 3. Tạo học sinh
      let studentCodeGen = "";
      do {
        const yearOfEnrollment = new Date(student.ngayVaoTruong).getFullYear();
        studentCodeGen = generateStudentID(yearOfEnrollment);
        const checkStudentCode = await Student.findOne({
          studentCode: studentCodeGen,
        });

        if (!checkStudentCode) {
          break;
        }
      } while (true);

      // 4. Tạo tài khoản học sinh
      const accountStudent = new Account({
        userName: studentCodeGen,
        password: studentCodeGen,
        role: "Student",
      });

      // 5. Tạo học sinh
      let hoTen = student.ho + " " + student.ten;
      const newStudent = new Student({
        studentCode: studentCodeGen,
        userName: hoTen,
        firstName: student.ho,
        lastName: student.ten,
        dateOfBirth: student.namSinh,
        gender: student.gioiTinh,
        dateOfEnrollment: student.ngayVaoTruong,
        phoneNumber: student.sdt,
        address: student.diaChi,
        relationshipOther: student.moiQuanHeKhac,
        parents: parents,
        account: accountStudent._id,
        status: "Đang học",
        ethnicGroups: student.danToc,
      });

      // 6. Cập nhật danh sách học sinh vào lớp
      const classInfo = await Class.findOne({
        academicYear: namHoc,
        grade: khoiLop,
        className: tenLop,
      });

      parent1 && (await parent1.save());
      parent2 && (await parent2.save());
      parent3 && (await parent3.save());
      await accountStudent.save();
      await newStudent.save();

      if (!classInfo) {
        return res.status(404).json({ message: "Không tìm thấy lớp học" });
      } else {
        if (classInfo.studentList.length >= classInfo.maxStudents) {
          return res.status(405).json({ message: "Sỉ số lớp đã đầy", student: newStudent });
        }
        classInfo.studentList.push(newStudent._id);
        await classInfo.save();
      }
      res.status(200).json({ message: "Import học sinh thành công" });
    } catch (error) {
      console.error("Lỗi khi import học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

/**
 * function tạo mã số sinh viên bao gồm 4 số đầu là năm nhập học và 6 số cuối là số ngẫu nhiên
 * @param {*} yearOfEnrollment
 * @returns
 */
function generateStudentID(yearOfEnrollment) {
  const randomSixDigits = Math.floor(1000 + Math.random() * 9000);

  const studentID = yearOfEnrollment.toString() + randomSixDigits.toString();

  return studentID;
}

module.exports = ClassController;
