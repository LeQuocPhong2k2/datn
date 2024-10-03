<<<<<<< HEAD
require('dotenv').config({ path: '../../../../.env' })
const Student = require('../models/Student')
const Parent = require('../models/Parent')
const Class = require('../models/Class')
const Teacher = require('../models/Teacher')

const StudentController = {
=======
require("dotenv").config({ path: "../../../../.env" });
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const Account = require("../models/Account");

const StudentController = {
  getStudentByNameAndAcademicYearAndGradeAndClassName: async (req, res) => {
    const { userName } = req.body;
    try {
      console.log("Thông tin tìm kiếm:", userName);

      const students = await Student.find({ userName: { $regex: String(userName), $options: "i" } });

      //sort theo tên học sinh
      students.sort((a, b) => a.lastName.localeCompare(b.lastName));

      if (students.length === 0) {
        console.log("Không tìm thấy học sinh");
        return res.status(404).json({ message: "Không tìm thấy học sinh" });
      }

      console.log(`Tìm kiếm thành công, đã tìm thấy ${students.length} học sinh`);
      res.status(200).json(students);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },

>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
  /**
   * find student by student code
   * @param {*} req
   * @param {*} res
   */
  getStudentByCode: async (req, res) => {
<<<<<<< HEAD
    const { studentCode } = req.body
    console.log('Mã số sinh viên:', studentCode)
    try {
      if (!studentCode) {
        return res.status(200).json([])
      }

      const student = await Student.find(
        { studentCode: { $regex: `^${studentCode}`, $options: 'i' } },
        // Chỉ lấy các trường cần thiết, ví dụ: studentCode và Họ tên		Ngày sinh	Giới Tính	Dân tộc	Tên lớp	Trạng Thái
        { studentCode: 1, userName: 1 }
        // { studentCode: 1, userName: 1, dateOfBirth: 1,gender: 1, ethnicGroups: 1,}
      )

      console.log('Thông tin học sinh:', student)
      res.status(200).json(student)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin học sinh:', error)
      res.status(500).json({ error: error.message })
    }
  },
  getFullInfoStudentByCode: async (req, res) => {
    const { studentCode } = req.body
    console.log('Mã số sinh viên:', studentCode)
    try {
      if (!studentCode) {
        return res.status(200).json([])
=======
    const { studentCode } = req.body;
    console.log("Mã số sinh viên:", studentCode);
    try {
      if (!studentCode) {
        return res.status(200).json([]);
      }

      const student = await Student.find(
        { studentCode: { $regex: `^${studentCode}`, $options: "i" } },
        // Chỉ lấy các trường cần thiết, ví dụ: studentCode và Họ tên		Ngày sinh	Giới Tính	Dân tộc	Tên lớp	Trạng Thái
        { studentCode: 1, userName: 1 }
        // { studentCode: 1, userName: 1, dateOfBirth: 1,gender: 1, ethnicGroups: 1,}
      );

      console.log("Thông tin học sinh:", student);
      res.status(200).json(student);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },
  getFullInfoStudentByCode: async (req, res) => {
    const { studentCode } = req.body;
    console.log("Mã số sinh viên:", studentCode);
    try {
      if (!studentCode) {
        return res.status(200).json([]);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      }

      // Tìm học sinh theo mã số sinh viên
      const student = await Student.findOne(
<<<<<<< HEAD
        { studentCode: { $regex: `^${studentCode}`, $options: 'i' } },
=======
        { studentCode: { $regex: `^${studentCode}`, $options: "i" } },
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
        {
          studentCode: 1,
          userName: 1,
          phoneNumber: 1,
          dateOfBirth: 1,
          gender: 1,
          dateOfEnrollment: 1,
          address: 1,
          relationshipOther: 1,
          parents: 1,
          ethnicGroups: 1,
          status: 1,
        }
<<<<<<< HEAD
      ).populate('parents') // Lấy thông tin phụ huynh

      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy học sinh' })
=======
      ).populate("parents"); // Lấy thông tin phụ huynh

      if (!student) {
        return res.status(404).json({ message: "Không tìm thấy học sinh" });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      }

      // Tìm thông tin lớp học
      const classInfo = await Class.findOne({
        studentList: student._id,
<<<<<<< HEAD
      }).select('academicYear grade className homeRoomTeacher maxStudents')

      // Lấy tên giáo viên chủ nhiệm
      let homeRoomTeacherName = ''
      if (classInfo && classInfo.homeRoomTeacher) {
        const teacher = await Teacher.findById(classInfo.homeRoomTeacher)
        homeRoomTeacherName = teacher ? teacher.userName : 'Không có thông tin'
=======
      }).select("academicYear grade className homeRoomTeacher maxStudents");

      // Lấy tên giáo viên chủ nhiệm
      let homeRoomTeacherName = "";
      if (classInfo && classInfo.homeRoomTeacher) {
        const teacher = await Teacher.findById(classInfo.homeRoomTeacher);
        homeRoomTeacherName = teacher ? teacher.userName : "Không có thông tin";
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      }

      // Tạo đối tượng kết quả
      const result = {
        ...student.toObject(), // Chuyển đổi student thành đối tượng
<<<<<<< HEAD
        academicYear: classInfo ? classInfo.academicYear : 'N/A',
        grade: classInfo ? classInfo.grade : 'N/A',
        className: classInfo ? classInfo.className : 'N/A',
        homeRoomTeacherName: homeRoomTeacherName,
        maxStudents: classInfo ? classInfo.maxStudents : 'N/A',
      }

      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin học sinh:', error)
      res.status(500).json({ error: error.message })
=======
        academicYear: classInfo ? classInfo.academicYear : "N/A",
        grade: classInfo ? classInfo.grade : "N/A",
        className: classInfo ? classInfo.className : "N/A",
        homeRoomTeacherName: homeRoomTeacherName,
        maxStudents: classInfo ? classInfo.maxStudents : "N/A",
      };

      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin học sinh:", error);
      res.status(500).json({ error: error.message });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
    }
  },

  /**
   * lấy danh sách học sinh
   * @param {*} req
   * @param {*} res
   */
  getAllStudents: async (req, res) => {
    try {
<<<<<<< HEAD
      console.log('Đang truy vấn tất cả học sinh...')
      const students = await Student.find()
      console.log('Kết quả truy vấn:', students)
      res.status(200).json(students)
    } catch (error) {
      console.error('Lỗi khi truy vấn học sinh:', error)
      res.status(500).json({ error: error.message })
=======
      console.log("Đang truy vấn tất cả học sinh...");
      const students = await Student.find();
      console.log("Kết quả truy vấn:", students);
      res.status(200).json(students);
    } catch (error) {
      console.error("Lỗi khi truy vấn học sinh:", error);
      res.status(500).json({ error: error.message });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
    }
  },

  /**
   *  thêm học sinh
   * @param {mssv,hoTen,namSinh,gioiTinh,ngayVaoTruong,sdt,diaChi,moiQuanHeKhac,hoTenCha,namSinhCha,ngheNghiepCha,sdtCha,hoTenMe,namSinhMe,ngheNghiepMe,sdtMe,moiQuanHe,hoTenNguoiGiamHo,namSinhNguoiGiamHo,ngheNghiepNguoiGiamHo,sdtNguoiGiamHo,namHoc,khoiLop,lopHoc} req
   * @param {*} res
   * @returns
   */
  addStudent: async (req, res) => {
    const {
      mssv,
<<<<<<< HEAD
      hoTen,
      namSinh,
      gioiTinh,
=======
      firstName,
      lastName,
      namSinh,
      gioiTinh,
      danToc,
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      ngayVaoTruong,
      sdt,
      diaChi,
      moiQuanHeKhac,
      moiQuanHeCha,
      moiQuanHeMe,
      hoTenCha,
      namSinhCha,
      ngheNghiepCha,
      sdtCha,
      hoTenMe,
      namSinhMe,
      ngheNghiepMe,
      sdtMe,
      moiQuanHe,
      hoTenNguoiGiamHo,
      namSinhNguoiGiamHo,
      ngheNghiepNguoiGiamHo,
      sdtNguoiGiamHo,
      namHoc,
      khoiLop,
      lopHoc,
<<<<<<< HEAD
    } = req.body

    console.log('Thông tin học sinh:', req.body)

    let studentCodeGen = ''
    try {
      const yearOfEnrollment = new Date(ngayVaoTruong).getFullYear()
      studentCodeGen = generateStudentID(yearOfEnrollment)

      /**
       * kiểm tra xem mã số sinh viên đã tồn tại chưa
       */
      const checkStudentCode = await Student.findOne({
        studentCode: studentCodeGen,
      })
      if (checkStudentCode) {
        return res.status(401).json({ message: 'Mã số sinh viên đã tồn tại' })
      }
=======
    } = req.body;

    let hoTen = firstName + " " + lastName;
    let parent1;
    let parent2;
    let parent3;

    let studentCodeGen = "";
    try {
      const yearOfEnrollment = new Date(ngayVaoTruong).getFullYear();
      studentCodeGen = generateStudentID(yearOfEnrollment);

      do {
        studentCodeGen = generateStudentID(yearOfEnrollment);
        const checkStudentCode = await Student.findOne({
          studentCode: studentCodeGen,
        });

        if (!checkStudentCode) {
          break;
        }
      } while (true);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

      /**
       * kiểm tra xem số điện thoại đã được đăng ký chưa
       */
      const checkStudentByPhoneNumberAndName = await Student.findOne({
        userName: hoTen,
        phoneNumber: sdt,
<<<<<<< HEAD
      })

      if (checkStudentByPhoneNumberAndName) {
        return res
          .status(402)
          .json({ message: 'Số điện thoại đã được đăng ký cho tên này' })
=======
      });

      if (checkStudentByPhoneNumberAndName) {
        return res.status(402).json({ message: "Số điện thoại đã được đăng ký cho tên này", student: req.body });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      }

      /**
       * lấy danh sách phụ huynh
       */
<<<<<<< HEAD
      let parents = []
=======
      let parents = [];
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      if (moiQuanHeKhac) {
        const checkParentByPhoneNumberAndName = await Parent.findOne({
          userName: hoTenNguoiGiamHo,
          phoneNumber: sdtNguoiGiamHo,
<<<<<<< HEAD
        })

        if (checkParentByPhoneNumberAndName) {
          parents.push(checkParentByPhoneNumberAndName._id)
=======
        });

        if (checkParentByPhoneNumberAndName) {
          parents.push(checkParentByPhoneNumberAndName._id);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
        } else {
          const newParent = new Parent({
            userName: hoTenNguoiGiamHo,
            dateOfBirth: namSinhNguoiGiamHo,
            job: ngheNghiepNguoiGiamHo,
            phoneNumber: sdtNguoiGiamHo,
            relationship: moiQuanHe,
<<<<<<< HEAD
          })

          console.log('Đang lưu phụ huynh...')
          await newParent.save()
          parents.push(newParent._id)
        }
      } else {
        if (!moiQuanHeCha) {
          const checkParentByPhoneNumberAndNameFather = await Parent.findOne({
            userName: hoTenCha,
            phoneNumber: sdtCha,
          })

          if (checkParentByPhoneNumberAndNameFather) {
            parents.push(checkParentByPhoneNumberAndNameFather._id)
=======
          });

          console.log("Đang lưu phụ huynh...");
          parent1 = newParent;
          parents.push(newParent._id);
        }
      } else {
        if (moiQuanHeCha) {
          const checkParentByPhoneNumberAndNameFather = await Parent.findOne({
            userName: hoTenCha,
            phoneNumber: sdtCha,
          });

          if (checkParentByPhoneNumberAndNameFather) {
            parents.push(checkParentByPhoneNumberAndNameFather._id);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
          } else {
            const newParent = new Parent({
              userName: hoTenCha,
              dateOfBirth: namSinhCha,
              job: ngheNghiepCha,
              phoneNumber: sdtCha,
<<<<<<< HEAD
              relationship: 'Cha',
            })

            console.log('Đang lưu phụ huynh 1...')
            await newParent.save()
            parents.push(newParent._id)
          }
        }

        if (!moiQuanHeMe) {
          const checkParentByPhoneNumberAndNameMother = await Parent.findOne({
            userName: hoTenMe,
            phoneNumber: sdtMe,
          })

          if (checkParentByPhoneNumberAndNameMother) {
            parents.push(checkParentByPhoneNumberAndNameMother._id)
          } else {
            const newParent2 = new Parent({
=======
              relationship: "Cha",
            });

            console.log("Đang lưu phụ huynh 1...");
            parent2 = newParent;
            parents.push(newParent._id);
          }
        }

        if (moiQuanHeMe) {
          const checkParentByPhoneNumberAndNameMother = await Parent.findOne({
            userName: hoTenMe,
            phoneNumber: sdtMe,
          });

          if (checkParentByPhoneNumberAndNameMother) {
            parents.push(checkParentByPhoneNumberAndNameMother._id);
          } else {
            const newParent = new Parent({
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
              userName: hoTenMe,
              dateOfBirth: namSinhMe,
              job: ngheNghiepMe,
              phoneNumber: sdtMe,
<<<<<<< HEAD
              relationship: 'Mẹ',
            })

            console.log('Đang lưu phụ huynh 2...')
            await newParent2.save()
            parents.push(newParent2._id)
=======
              relationship: "Mẹ",
            });

            console.log("Đang lưu phụ huynh 2...");
            parent3 = newParent;
            parents.push(newParent._id);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
          }
        }
      }

      /**
<<<<<<< HEAD
=======
       * Tạo tài khoản cho học sinh
       */
      const newAccount = new Account({
        userName: studentCodeGen,
        password: studentCodeGen,
        role: "student",
      });

      /**
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
       * tạo học sinh mới
       */
      const newStudent = new Student({
        studentCode: studentCodeGen,
        userName: hoTen,
<<<<<<< HEAD
=======
        firstName: firstName,
        lastName: lastName,
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
        dateOfBirth: namSinh,
        gender: gioiTinh,
        dateOfEnrollment: ngayVaoTruong,
        phoneNumber: sdt,
        address: diaChi,
        relationshipOther: moiQuanHeKhac,
        parents: parents,
<<<<<<< HEAD
      })
=======
        account: newAccount._id,
        status: "Đang học",
        ethnicGroups: danToc,
      });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

      /**
       * update lại sỉ số lớp
       */
      const classInfo = await Class.findOne({
        academicYear: namHoc,
        grade: khoiLop,
        className: lopHoc,
<<<<<<< HEAD
      })

      if (!classInfo) {
        return res.status(403).json({ message: 'Không tìm thấy lớp' })
      } else {
        // check sỉ số lớp > sỉ số tối đa
        if (classInfo.studentList.length >= classInfo.maxStudents) {
          return res.status(404).json({ message: 'Sỉ số lớp đã đầy' })
        }
        classInfo.studentList.push(newStudent._id)
        await classInfo.save()
      }

      console.log('Đang lưu học sinh...')
      await newStudent.save()
      res.status(201).json(newStudent)
    } catch (error) {
      console.error('Lỗi khi thêm học sinh:', error)
      res.status(500).json({ error: error.message })
    }
    console.log('Đang thêm học sinh...', req.body)
=======
      });

      if (!classInfo) {
        return res.status(403).json({ message: "Không tìm thấy lớp", student: req.body });
      } else {
        /**
         * check sỉ số lớp > sỉ số tối đa
         */
        if (classInfo.studentList.length >= classInfo.maxStudents) {
          return res.status(404).json({ message: "Sỉ số lớp đã đầy", student: req.body });
        }
        classInfo.studentList.push(newStudent._id);
        console.log("Đang câp nhật sỉ số lớp...");
        await classInfo.save();
      }

      if (parent1) {
        console.log("Đang lưu phụ huynh 1...");
        await parent1.save();
      }

      if (parent2) {
        console.log("Đang lưu phụ huynh 2...");
        await parent2.save();
      }

      if (parent3) {
        console.log("Đang lưu phụ huynh 3...");
        await parent3.save();
      }

      console.log("Đang lưu tài khoản...");
      await newAccount.save();
      console.log("Đang lưu học sinh...");
      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (error) {
      console.error("Lỗi khi thêm học sinh:", error);
      res.status(500).json({ error: error.message });
    }
    console.log("Đang thêm học sinh...", req.body);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
  },

  // lưu ý khi tìm kiếm học sinh thì phải chắc chắn học sinh đó có trong lớp học mới xoá được nếu học sinh không có trong lớp học thì sẽ không thể tìm thấy học sinh đó

  searchStudents: async (req, res) => {
<<<<<<< HEAD
    const {
      grade,
      className,
      academicYear,
      gender,
      userName,
      studentCode,
      status,
      ethnicGroups,
    } = req.body

    try {
      console.log('Thông tin tìm kiếm:', req.body)

      const classFilter = {}
      if (grade) classFilter.grade = grade
      if (className) classFilter.className = className
      if (academicYear) classFilter.academicYear = academicYear

      // Tìm tất cả các lớp học thỏa mãn các tiêu chí đã cho
      const classes = await Class.find(classFilter).select('studentList')

      // Lấy danh sách tất cả các _id học sinh từ các lớp đã tìm thấy
      let studentIds = []
      if (classes.length > 0) {
        studentIds = classes.flatMap((c) => c.studentList)
=======
    const { grade, className, academicYear, gender, userName, studentCode, status, ethnicGroups } = req.body;

    try {
      console.log("Thông tin tìm kiếm:", req.body);

      const classFilter = {};
      if (grade) classFilter.grade = grade;
      if (className) classFilter.className = className;
      if (academicYear) classFilter.academicYear = academicYear;

      // Tìm tất cả các lớp học thỏa mãn các tiêu chí đã cho
      const classes = await Class.find(classFilter).select("studentList");

      // Lấy danh sách tất cả các _id học sinh từ các lớp đã tìm thấy
      let studentIds = [];
      if (classes.length > 0) {
        studentIds = classes.flatMap((c) => c.studentList);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      }

      const studentFilter = {
        _id: { $in: studentIds }, // Lọc danh sách học sinh dựa trên các _id trong lớp
        isDeleted: false, // Thêm điều kiện kiểm tra học sinh chưa bị xóa
        $or: [],
<<<<<<< HEAD
      }
=======
      };
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

      // Chỉ thêm vào bộ lọc nếu có giá trị
      if (userName) {
        studentFilter.$or.push({
<<<<<<< HEAD
          userName: { $regex: userName, $options: 'i' },
        })
=======
          userName: { $regex: userName, $options: "i" },
        });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      }

      if (studentCode) {
        studentFilter.$or.push({
<<<<<<< HEAD
          studentCode: { $regex: `^${studentCode}`, $options: 'i' },
        })
      }

      if (gender) {
        studentFilter.$or.push({ gender })
      }

      if (ethnicGroups) {
        studentFilter.$or.push({ ethnicGroups })
      }

      if (status) {
        studentFilter.$or.push({ status })
      }

      if (studentFilter.$or.length === 0) {
        delete studentFilter.$or
      }

      // Lọc danh sách học sinh không có thông tin lớp học
      const studentsNoClass = await Student.find(studentFilter)

      // Nếu không tìm thấy học sinh
      if (studentsNoClass.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy học sinh' })
      }

      // Lấy danh sách _id của các học sinh đã tìm được
      const studentIdsFromNoClass = studentsNoClass.map(
        (student) => student._id
      )
=======
          studentCode: { $regex: `^${studentCode}`, $options: "i" },
        });
      }

      if (gender) {
        studentFilter.$or.push({ gender });
      }

      if (ethnicGroups) {
        studentFilter.$or.push({ ethnicGroups });
      }

      if (status) {
        studentFilter.$or.push({ status });
      }

      if (studentFilter.$or.length === 0) {
        delete studentFilter.$or;
      }

      // Lọc danh sách học sinh không có thông tin lớp học
      const studentsNoClass = await Student.find(studentFilter);

      // Nếu không tìm thấy học sinh
      if (studentsNoClass.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy học sinh" });
      }

      // Lấy danh sách _id của các học sinh đã tìm được
      const studentIdsFromNoClass = studentsNoClass.map((student) => student._id);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

      // Thực hiện aggregate với lookup để lấy thông tin lớp học cho các học sinh
      const students = await Student.aggregate([
        {
          $match: {
            _id: { $in: studentIdsFromNoClass }, // Lọc học sinh theo danh sách _id đã tìm thấy
          },
        },
        {
          $lookup: {
<<<<<<< HEAD
            from: 'Class', // Tên collection 'Class'
            let: { studentId: '$_id' }, // Biến để tham chiếu trong pipeline của lookup
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$$studentId', '$studentList'] }, // So sánh studentId với studentList của Class
=======
            from: "Class", // Tên collection 'Class'
            let: { studentId: "$_id" }, // Biến để tham chiếu trong pipeline của lookup
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$$studentId", "$studentList"] }, // So sánh studentId với studentList của Class
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
                  ...classFilter, // Áp dụng bộ lọc cho Class
                },
              },
            ],
<<<<<<< HEAD
            as: 'classInfo', // Tên kết quả gắn vào
          },
        },
        {
          $unwind: { path: '$classInfo', preserveNullAndEmptyArrays: true }, // Mở rộng classInfo và giữ lại học sinh không có lớp
=======
            as: "classInfo", // Tên kết quả gắn vào
          },
        },
        {
          $unwind: { path: "$classInfo", preserveNullAndEmptyArrays: true }, // Mở rộng classInfo và giữ lại học sinh không có lớp
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
        },
        {
          $project: {
            _id: 1,
            studentCode: 1,
            userName: 1,
            phoneNumber: 1,
            dateOfBirth: 1,
            gender: 1,
            dateOfEnrollment: 1,
            address: 1,
            relationshipOther: 1,
            parents: 1,
            ethnicGroups: 1,
            status: 1,

<<<<<<< HEAD
            grade: { $ifNull: ['$classInfo.grade', 'N/A'] }, // Lấy thông tin từ classInfo hoặc 'N/A' nếu không có
            className: { $ifNull: ['$classInfo.className', 'N/A'] },
            homeRoomTeacher: { $ifNull: ['$classInfo.homeRoomTeacher', 'N/A'] },
            isDeleted: 1,
          },
        },
      ])

      if (students.length === 0) {
        console.log('Không tìm thấy học sinh')
        return res.status(404).json({ message: 'Không tìm thấy học sinh' })
      }

      console.log(
        `Tìm kiếm thành công, đã tìm thấy ${students.length} học sinh`
      )
      res.status(200).json(students)
    } catch (error) {
      console.error('Lỗi khi tìm kiếm học sinh:', error)
      res.status(500).json({ error: error.message })
=======
            grade: { $ifNull: ["$classInfo.grade", "N/A"] }, // Lấy thông tin từ classInfo hoặc 'N/A' nếu không có
            className: { $ifNull: ["$classInfo.className", "N/A"] },
            homeRoomTeacher: { $ifNull: ["$classInfo.homeRoomTeacher", "N/A"] },
            isDeleted: 1,
          },
        },
      ]);

      if (students.length === 0) {
        console.log("Không tìm thấy học sinh");
        return res.status(404).json({ message: "Không tìm thấy học sinh" });
      }

      console.log(`Tìm kiếm thành công, đã tìm thấy ${students.length} học sinh`);
      res.status(200).json(students);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm học sinh:", error);
      res.status(500).json({ error: error.message });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
    }
  },

  // làm chức năng sửa thông tin học sinh
  editStudent: async (req, res) => {
    const {
      studentCode,
      userName,
      dateOfBirth,
      gender,
      ethnicGroups,
      address,
      phoneNumber,

      parents, // Giả sử bạn gửi thông tin phụ huynh trong body
<<<<<<< HEAD
    } = req.body

    try {
      // Tìm học sinh theo mã số sinh viên
      const student = await Student.findOne({ studentCode })
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy học sinh' })
      }

      // Cập nhật thông tin học sinh
      student.userName = userName || student.userName
      student.dateOfBirth = dateOfBirth || student.dateOfBirth
      student.gender = gender || student.gender
      student.address = address || student.address
      student.phoneNumber = phoneNumber || student.phoneNumber
      student.ethnicGroups = ethnicGroups || student.ethnicGroups
=======
    } = req.body;

    try {
      // Tìm học sinh theo mã số sinh viên
      const student = await Student.findOne({ studentCode });
      if (!student) {
        return res.status(404).json({ message: "Không tìm thấy học sinh" });
      }

      // Cập nhật thông tin học sinh
      student.userName = userName || student.userName;
      student.dateOfBirth = dateOfBirth || student.dateOfBirth;
      student.gender = gender || student.gender;
      student.address = address || student.address;
      student.phoneNumber = phoneNumber || student.phoneNumber;
      student.ethnicGroups = ethnicGroups || student.ethnicGroups;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      // Cập nhật thông tin phụ huynh nếu có
      if (parents && Array.isArray(parents)) {
        const updatedParents = await Promise.all(
          parents.map(async (parent) => {
<<<<<<< HEAD
            const existingParent = await Parent.findById(parent._id)
            if (existingParent) {
              // Cập nhật thông tin phụ huynh
              existingParent.userName =
                parent.userName || existingParent.userName
              existingParent.dateOfBirth =
                parent.dateOfBirth || existingParent.dateOfBirth
              existingParent.phoneNumber =
                parent.phoneNumber || existingParent.phoneNumber
              existingParent.job = parent.job || existingParent.job
              existingParent.relationship =
                parent.relationship || existingParent.relationship
              await existingParent.save() // Lưu thay đổi
              return existingParent // Trả về thông tin phụ huynh đã cập nhật
            }
            return null // Nếu không tìm thấy phụ huynh
          })
        )

        student.parents = updatedParents
          .filter((parent) => parent !== null)
          .map((parent) => parent._id) // Cập nhật danh sách ID phụ huynh
      }

      await student.save() // Lưu thay đổi
=======
            const existingParent = await Parent.findById(parent._id);
            if (existingParent) {
              // Cập nhật thông tin phụ huynh
              existingParent.userName = parent.userName || existingParent.userName;
              existingParent.dateOfBirth = parent.dateOfBirth || existingParent.dateOfBirth;
              existingParent.phoneNumber = parent.phoneNumber || existingParent.phoneNumber;
              existingParent.job = parent.job || existingParent.job;
              existingParent.relationship = parent.relationship || existingParent.relationship;
              await existingParent.save(); // Lưu thay đổi
              return existingParent; // Trả về thông tin phụ huynh đã cập nhật
            }
            return null; // Nếu không tìm thấy phụ huynh
          })
        );

        student.parents = updatedParents.filter((parent) => parent !== null).map((parent) => parent._id); // Cập nhật danh sách ID phụ huynh
      }

      await student.save(); // Lưu thay đổi
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

      // Tìm thông tin lớp học
      const classInfo = await Class.findOne({
        studentList: student._id,
<<<<<<< HEAD
      }).select('academicYear grade className homeRoomTeacher maxStudents')

      // Lấy tên giáo viên chủ nhiệm
      let homeRoomTeacherName = ''
      if (classInfo && classInfo.homeRoomTeacher) {
        const teacher = await Teacher.findById(classInfo.homeRoomTeacher)
        homeRoomTeacherName = teacher ? teacher.userName : 'Không có thông tin'
=======
      }).select("academicYear grade className homeRoomTeacher maxStudents");

      // Lấy tên giáo viên chủ nhiệm
      let homeRoomTeacherName = "";
      if (classInfo && classInfo.homeRoomTeacher) {
        const teacher = await Teacher.findById(classInfo.homeRoomTeacher);
        homeRoomTeacherName = teacher ? teacher.userName : "Không có thông tin";
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
      }

      // Tạo đối tượng kết quả
      const result = {
        ...student.toObject(), // Chuyển đổi student thành đối tượng
<<<<<<< HEAD
        academicYear: classInfo ? classInfo.academicYear : 'N/A',
        grade: classInfo ? classInfo.grade : 'N/A',
        className: classInfo ? classInfo.className : 'N/A',
        homeRoomTeacherName: homeRoomTeacherName,
        maxStudents: classInfo ? classInfo.maxStudents : 'N/A',
      }
      console.log('Đã cập nhật thông tin học sinh:', result)
      res.status(200).json(result) // Trả về thông tin học sinh đã cập nhật
    } catch (error) {
      console.error('Lỗi khi sửa thông tin học sinh:', error)
      res.status(500).json({ error: error.message })
=======
        academicYear: classInfo ? classInfo.academicYear : "N/A",
        grade: classInfo ? classInfo.grade : "N/A",
        className: classInfo ? classInfo.className : "N/A",
        homeRoomTeacherName: homeRoomTeacherName,
        maxStudents: classInfo ? classInfo.maxStudents : "N/A",
      };
      console.log("Đã cập nhật thông tin học sinh:", result);
      res.status(200).json(result); // Trả về thông tin học sinh đã cập nhật
    } catch (error) {
      console.error("Lỗi khi sửa thông tin học sinh:", error);
      res.status(500).json({ error: error.message });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
    }
  },
  // làm chức năng xóa học sinh
  deleteStudent: async (req, res) => {
<<<<<<< HEAD
    const { studentCode } = req.body

    try {
      // Tìm học sinh theo mã số sinh viên
      const student = await Student.findOne({ studentCode })
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy học sinh' })
      }

      // Đánh dấu học sinh là đã xóa
      student.isDeleted = true
      await student.save() // Lưu thay đổi

      res.status(200).json({ message: 'Học sinh đã được xóa thành công' })
    } catch (error) {
      console.error('Lỗi khi xóa học sinh:', error)
      res.status(500).json({ error: error.message })
    }
  },
}
=======
    const { studentCode } = req.body;

    try {
      // Tìm học sinh theo mã số sinh viên
      const student = await Student.findOne({ studentCode });
      if (!student) {
        return res.status(404).json({ message: "Không tìm thấy học sinh" });
      }

      // Đánh dấu học sinh là đã xóa
      student.isDeleted = true;
      await student.save(); // Lưu thay đổi

      res.status(200).json({ message: "Học sinh đã được xóa thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa học sinh:", error);
      res.status(500).json({ error: error.message });
    }
  },
};
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

/**
 * function tạo mã số sinh viên bao gồm 4 số đầu là năm nhập học và 6 số cuối là số ngẫu nhiên
 * @param {*} yearOfEnrollment
 * @returns
 */
function generateStudentID(yearOfEnrollment) {
<<<<<<< HEAD
  const randomSixDigits = Math.floor(1000 + Math.random() * 9000)

  const studentID = yearOfEnrollment.toString() + randomSixDigits.toString()

  return studentID
}

module.exports = StudentController
=======
  const randomSixDigits = Math.floor(1000 + Math.random() * 9000);

  const studentID = yearOfEnrollment.toString() + randomSixDigits.toString();

  return studentID;
}

module.exports = StudentController;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
