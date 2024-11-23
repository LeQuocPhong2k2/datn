require("dotenv").config({ path: "../../../../.env" });
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Class = require("../models/Class");
const Account = require("../models/Account");
const socket = require("../../socket");
const Schedule = require("../models/Schedule");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");

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
        {
          $sort: {
            academicYear: 1, // Sắp xếp theo academicYear tăng dần
            grade: 1, // Sắp xếp theo grade tăng dần
            className: 1, // Sắp xếp theo className tăng dần
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

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  deleteClass: async (req, res) => {
    const { idClass } = req.body;
    try {
      const classInfo = await Class.findById(idClass);
      if (!classInfo) {
        return res.status(404).json({ message: "Không tìm thấy lớp học" });
      }
      //1.Xóa lịch học
      await Schedule.deleteMany({
        className: classInfo.className,
        schoolYear: classInfo.academicYear,
      });

      // 1. Xóa lớp
      await Class.findByIdAndDelete(idClass);

      // 2. Trả về kết quả
      res.status(200).json({ message: "Xóa lớp học thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa lớp học:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  importStudents: async (req, res) => {
    const { mshs, classId } = req.body;
    try {
      const student = await Student.findOne({ studentCode: mshs });
      if (!student) {
        return res.status(404).json({ message: "Không tìm thấy học sinh" });
      }

      const classInfo = await Class.findOne({ _id: classId });
      if (!classInfo) {
        return res.status(404).json({ message: "Không tìm thấy lớp học" });
      }

      const studentExistClass = await Class.findOne({
        studentList: student._id,
        academicYear: classInfo.academicYear,
      });
      if (studentExistClass) {
        return res.status(400).json({
          message: "Học sinh đã có lớp trong năm học này",
          student: student,
        });
      }

      if (classInfo.studentList.length >= classInfo.maxStudents) {
        return res.status(405).json({ message: "Sỉ số lớp đã đầy" });
      }

      classInfo.studentList.push(student._id);
      await classInfo.save();
      res.status(200).json({ message: "Import học sinh thành công" });
    } catch (error) {
      console.error("Lỗi khi import học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  importNewProfileStudent: async (req, res) => {
    const { student, namHoc, khoiLop, tenLop } = req.body;
    try {
      console.log("Thông tin học sinh namHoc:", req.body);
      // 1. kiểm tra học sinh có tồn tại
      const checkStudent = await Student.findOne({
        firstName: student.ho,
        lastName: student.ten,
        phoneNumber: student.sdt,
      });
      if (checkStudent) {
        return res.status(400).json({ message: "Hồ sơ học sinh đã tồn tại", student: checkStudent });
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

  /**
   *
   *
   *
   *
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getListStudentByClassId: async (req, res) => {
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

      // Filter students with status "Đang học"
      let studentList = [];
      for (let i = 0; i < classInfo.studentList.length; i++) {
        const student = await Student.findById(classInfo.studentList[i]);
        studentList.push(student);
      }

      studentList = studentList.filter((student) => student.status === "Đang học");

      const splitAcademicYear = classInfo.academicYear.split("-");
      const newAcademicYear = parseInt(splitAcademicYear[1]) + 1;
      const newAcademicYearString = splitAcademicYear[1] + "-" + newAcademicYear;

      const newStartDate = new Date(startDate);
      newStartDate.setFullYear(newStartDate.getFullYear() + 1);

      const incrementedClassName = incrementClassName(className);

      const newClass = new Class({
        academicYear: newAcademicYearString,
        grade: parseInt(grade) + 1,
        className: incrementedClassName,
        classSession: classSession,
        startDate: newStartDate,
        maxStudents: maxStudents,
        homeRoomTeacher: homeRoomTeacher,
        studentList: studentList,
      });

      const classExist = await Class.findOne({
        academicYear: newAcademicYearString,
        grade: parseInt(grade) + 1,
        className: incrementedClassName,
      });

      if (classExist) {
        return res.status(400).json({ message: "Lớp đã tồn tại" });
      }

      console.log("Lớp mới:", newClass);

      await newClass.save();
      res.status(200).json({ message: "Tự động nâng lớp thành công" });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *
   *
   *
   *
   * @param {*} req
   * @param {*} res
   */
  autoUpClass: async (req, res) => {
    const { namHoc } = req.body;

    try {
      const classes = await Class.find({ academicYear: namHoc });

      for (let i = 0; i < classes.length; i++) {
        const classInfo = classes[i];
        const grade = classInfo.grade;
        const className = classInfo.className;
        const classSession = classInfo.classSession;
        const startDate = classInfo.startDate;
        const maxStudents = classInfo.maxStudents;
        const homeRoomTeacher = classInfo.homeRoomTeacher;

        // Filter students with status "Đang học"
        let studentList = [];
        for (let i = 0; i < classInfo.studentList.length; i++) {
          const student = await Student.findById(classInfo.studentList[i]);
          studentList.push(student);
        }

        studentList = studentList.filter((student) => student.status === "Đang học");

        const splitAcademicYear = classInfo.academicYear.split("-");
        const newAcademicYear = parseInt(splitAcademicYear[1]) + 1;
        const newAcademicYearString = splitAcademicYear[1] + "-" + newAcademicYear;

        const newStartDate = new Date(startDate);
        newStartDate.setFullYear(newStartDate.getFullYear() + 1);

        const incrementedClassName = incrementClassName(className);

        const newClass = new Class({
          academicYear: newAcademicYearString,
          grade: parseInt(grade) + 1,
          className: incrementedClassName,
          classSession: classSession,
          startDate: newStartDate,
          maxStudents: maxStudents,
          homeRoomTeacher: homeRoomTeacher,
          studentList: studentList,
        });

        const classExist = await Class.findOne({
          academicYear: newAcademicYearString,
          grade: parseInt(grade) + 1,
          className: incrementedClassName,
        });

        if (classExist) {
          continue;
        }
        await newClass.save();
      }

      res.status(200).json({ message: "Tự động nâng lớp thành công" });
    } catch (error) {
      console.error("Lỗi khi tự động nâng lớp:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *
   *
   *
   *
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getStudentListByClassNameAndAcademicYear: async (req, res) => {
    const { className, academicYear } = req.body;
    try {
      const classInfo = await Class.findOne({
        className: className,
        academicYear: academicYear,
      });
      if (!classInfo) {
        return res.status(404).json({ message: "Không tìm thấy lớp học" });
      }

      // Lấy danh sách học sinh từ classInfo
      const students = await Student.find({
        _id: { $in: classInfo.studentList },
      });
      // .select("_id studentCode userName ");
      console.log("số lượng học sinh trong lớp:", students.length);
      // chỉ lấy các trường cần thiết là _id, studentCode, userName

      // Trả về danh sách học sinh
      res.status(200).json({
        class_id: classInfo._id,
        students: students,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   *
   *
   *
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  getClassInfoByHomeRoomTeacher: async (req, res) => {
    const { teacherId } = req.body;
    try {
      const classInfo = await Class.findOne({ homeRoomTeacher: teacherId });
      if (!classInfo) {
        return res.status(404).json({ message: "Không tìm thấy lớp học" });
      }

      // Lấy danh sách học sinh từ classInfo
      const students = await Student.find({
        _id: { $in: classInfo.studentList },
      });
      // .select("_id studentCode userName ");
      console.log("số lượng học sinh trong lớp:", students.length);
      // chỉ lấy các trường cần thiết là _id, studentCode, userName

      // Trả về danh sách học sinh
      res.status(200).json({
        class_id: classInfo._id,
        students: students,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getHomRoomTeacherCurrent: async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      const teacher = await Teacher.findOne({ phoneNumber: phoneNumber });

      if (!teacher) {
        return res.status(404).json({ message: "Không tìm thấy giáo viên" });
      }

      const currentSchoolYear = getCurrentSchoolYear();
      const classInfo = await Class.findOne({ academicYear: currentSchoolYear, homeRoomTeacher: teacher._id });

      const result = {
        teacher_id: teacher._id,
        userName: teacher.userName,
        class_id: classInfo ? classInfo._id : "",
        className: classInfo ? classInfo.className : "",
      };

      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin lớp học:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getAllClassTeacher: async (req, res) => {
    const { phoneNumber, academicYear } = req.body;
    try {
      let result = [];
      let groupedResult = {}; // Đối tượng để nhóm các record theo className

      const currentSchoolYear = getCurrentSchoolYear();
      const teacher = await Teacher.findOne({ phoneNumber: phoneNumber });

      if (teacher) {
        const classInfo = await Class.findOne({ academicYear: academicYear, homeRoomTeacher: teacher._id });
        if (classInfo) {
          const resultElm = {
            teacher_id: teacher._id,
            userName: teacher.userName,
            grade: classInfo.grade,
            class_id: classInfo._id,
            className: classInfo.className,
            subject_id: "ALL",
            subjectName: "ALL",
          };
          // Nhóm theo className
          if (!groupedResult[classInfo.className]) {
            groupedResult[classInfo.className] = [];
          }
          groupedResult[classInfo.className].push(resultElm);
        }
      }

      const listTeacherSchedule = await Schedule.find({ scheduleTeacher: teacher._id, schoolYear: currentSchoolYear });
      for (let i = 0; i < listTeacherSchedule.length; i++) {
        const classInfo = await Class.findOne({ academicYear: currentSchoolYear, className: listTeacherSchedule[i].className });
        if (classInfo) {
          const subject = await Subject.findById(listTeacherSchedule[i].subject);
          const resultElm = {
            teacher_id: teacher._id,
            userName: teacher.userName,
            grade: classInfo ? classInfo.grade : "",
            class_id: classInfo ? classInfo._id : "",
            className: classInfo ? classInfo.className : "",
            subject_id: subject._id,
            subjectName: subject.subjectName,
          };

          // Nhóm theo className
          if (!groupedResult[classInfo.className]) {
            groupedResult[classInfo.className] = [];
          }
          groupedResult[classInfo.className].push(resultElm);
        }
      }

      // Chuyển đổi nhóm lại thành mảng
      for (let className in groupedResult) {
        result.push({
          className: className,
          records: groupedResult[className], // Các record cùng className
        });
      }

      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp học:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

/**
 *
 *  get current school year
 * @returns
 */
function getCurrentSchoolYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (currentMonth >= 8) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
}

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

/**
 * Increment the className by one unit.
 * For example, "1A3" => "1A4".
 * @param {string} className - The original className.
 * @returns {string} - The incremented className.
 */
function incrementClassName(className) {
  const match = className.match(/^\d+[A-Za-z]\d+$/);
  if (!match) {
    throw new Error("Invalid className format");
  }

  const grade = parseInt(className[0]);
  const prefix = className[1];
  const number = parseInt(className[2], 10);

  const incrementedNumber = grade + 1;

  return `${incrementedNumber}${prefix}${number}`;
}

module.exports = ClassController;
