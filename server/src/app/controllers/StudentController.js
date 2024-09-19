require('dotenv').config({ path: '../../../../.env' })
const Student = require('./Student')
const Parent = require('../models/Parent')
const Class = require('../models/Class')

const StudentController = {
  /**
   * find student by student code
   * @param {*} req
   * @param {*} res
   */
  getStudentByCode: async (req, res) => {
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

  /**
   * lấy danh sách học sinh
   * @param {*} req
   * @param {*} res
   */
  getAllStudents: async (req, res) => {
    try {
      console.log('Đang truy vấn tất cả học sinh...')
      const students = await Student.find()
      console.log('Kết quả truy vấn:', students)
      res.status(200).json(students)
    } catch (error) {
      console.error('Lỗi khi truy vấn học sinh:', error)
      res.status(500).json({ error: error.message })
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
      hoTen,
      namSinh,
      gioiTinh,
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

      /**
       * kiểm tra xem số điện thoại đã được đăng ký chưa
       */
      const checkStudentByPhoneNumberAndName = await Student.findOne({
        userName: hoTen,
        phoneNumber: sdt,
      })

      if (checkStudentByPhoneNumberAndName) {
        return res
          .status(402)
          .json({ message: 'Số điện thoại đã được đăng ký cho tên này' })
      }

      /**
       * lấy danh sách phụ huynh
       */
      let parents = []
      if (moiQuanHeKhac) {
        const checkParentByPhoneNumberAndName = await Parent.findOne({
          userName: hoTenNguoiGiamHo,
          phoneNumber: sdtNguoiGiamHo,
        })

        if (checkParentByPhoneNumberAndName) {
          parents.push(checkParentByPhoneNumberAndName._id)
        } else {
          const newParent = new Parent({
            userName: hoTenNguoiGiamHo,
            dateOfBirth: namSinhNguoiGiamHo,
            job: ngheNghiepNguoiGiamHo,
            phoneNumber: sdtNguoiGiamHo,
            relationship: moiQuanHe,
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
          } else {
            const newParent = new Parent({
              userName: hoTenCha,
              dateOfBirth: namSinhCha,
              job: ngheNghiepCha,
              phoneNumber: sdtCha,
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
              userName: hoTenMe,
              dateOfBirth: namSinhMe,
              job: ngheNghiepMe,
              phoneNumber: sdtMe,
              relationship: 'Mẹ',
            })

            console.log('Đang lưu phụ huynh 2...')
            await newParent2.save()
            parents.push(newParent2._id)
          }
        }
      }

      /**
       * tạo học sinh mới
       */
      const newStudent = new Student({
        studentCode: studentCodeGen,
        userName: hoTen,
        dateOfBirth: namSinh,
        gender: gioiTinh,
        dateOfEnrollment: ngayVaoTruong,
        phoneNumber: sdt,
        address: diaChi,
        relationshipOther: moiQuanHeKhac,
        parents: parents,
      })

      /**
       * update lại sỉ số lớp
       */
      const classInfo = await Class.findOne({
        academicYear: namHoc,
        grade: khoiLop,
        className: lopHoc,
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
  },

  searchStudents: async (req, res) => {
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
      }

      const studentFilter = {
        _id: { $in: studentIds }, // Lọc danh sách học sinh dựa trên các _id trong lớp
        $or: [],
      }

      if (userName) {
        studentFilter.$or.push({
          userName: { $regex: userName, $options: 'i' },
        })
      }

      if (studentCode && typeof studentCode === 'string') {
        studentFilter.$or.push({ studentCode })
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

      // Thực hiện aggregate với lookup để lấy thông tin lớp học cho các học sinh
      const students = await Student.aggregate([
        {
          $match: {
            _id: { $in: studentIdsFromNoClass }, // Lọc học sinh theo danh sách _id đã tìm thấy
          },
        },
        {
          $lookup: {
            from: 'Class', // Tên collection 'Class'
            let: { studentId: '$_id' }, // Biến để tham chiếu trong pipeline của lookup
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$$studentId', '$studentList'] }, // So sánh studentId với studentList của Class
                  ...classFilter, // Áp dụng bộ lọc cho Class
                },
              },
            ],
            as: 'classInfo', // Tên kết quả gắn vào
          },
        },
        {
          $unwind: { path: '$classInfo', preserveNullAndEmptyArrays: true }, // Mở rộng classInfo và giữ lại học sinh không có lớp
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
            grade: { $ifNull: ['$classInfo.grade', 'N/A'] }, // Lấy thông tin từ classInfo hoặc 'N/A' nếu không có
            className: { $ifNull: ['$classInfo.className', 'N/A'] },
            homeRoomTeacher: { $ifNull: ['$classInfo.homeRoomTeacher', 'N/A'] },
          },
        },
      ])

      if (students.length === 0) {
        console.log('Không tìm thấy học sinh')
        return res.status(404).json({ message: 'Không tìm thấy học sinh' })
      }

      res.status(200).json(students)
      console.log('Kết quả tìm kiếm:', students)
    } catch (error) {
      console.error('Lỗi khi tìm kiếm học sinh:', error)
      res.status(500).json({ error: error.message })
    }
  },
}

/**
 * function tạo mã số sinh viên bao gồm 4 số đầu là năm nhập học và 6 số cuối là số ngẫu nhiên
 * @param {*} yearOfEnrollment
 * @returns
 */
function generateStudentID(yearOfEnrollment) {
  const randomSixDigits = Math.floor(1000 + Math.random() * 9000)

  const studentID = yearOfEnrollment.toString() + randomSixDigits.toString()

  return studentID
}

module.exports = StudentController
