require('dotenv').config({ path: '../../../../.env' })
const Teacher = require('../models/Teacher')
const Class = require('../models/Class')
const Schedule = require('../models/Schedule')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Account = require('../models/Account')

const GiaoVienController = {
  /**
   * lấy danh sách giáo viên chưa phân công chủ nhiệm
   * @param {namHoc} req
   * @param {*} res
   */
  getGiaoVienChuaPhanCongChuNhiem: async (req, res) => {
    const { namHoc } = req.body
    console.log('Đang truy vấn giáo viên chưa phân công chủ nhiệm...', namHoc)
    try {
      const result = await Teacher.aggregate([
        {
          $lookup: {
            from: 'Class',
            localField: '_id',
            foreignField: 'homeRoomTeacher',
            as: 'class',
          },
        },
        {
          $match: {
            $or: [
              { 'class.academicYear': { $ne: namHoc } },
              { class: { $eq: [] } },
            ],
          },
        },
      ])

      res.status(200).json(result)
    } catch (error) {
      console.error(
        'Lỗi khi truy vấn giáo viên chưa phân công chủ nhiệm:',
        error
      )
      res.status(500).json({ error: error.message })
    }
  },

  /**
   * lấy danh sách giáo viên
   * @param {*} req
   * @param {*} res
   */
  getAllGiaoViens: async (req, res) => {
    try {
      console.log('Đang truy vấn tất cả giáo viên...')
      const giaoViens = await Teacher.find()
      // console.log("Kết quả truy vấn:", giaoViens);
      res.status(200).json(giaoViens)
    } catch (error) {
      console.error('Lỗi khi truy vấn giáo viên:', error)
      res.status(500).json({ error: error.message })
    }
  },

  /**
   *  thêm giáo viên
   * @param {hoTen, namSinh, gioiTinh, trinhDo, sdt, diaChi, ngayBatDauCongTac} req
   * @param {*} res
   * @returns
   */
  addGiaoVien: async (req, res) => {
    const {
      hoTen,
      namSinh,
      gioiTinh,
      trinhDo,
      sdt,
      diaChi,
      ngayBatDauCongTac,
      boMon,
    } = req.body

    try {
      const newGiaoVien = new Teacher({
        userName: hoTen,
        datOfBirth: namSinh,
        gender: gioiTinh,
        phoneNumber: sdt,
        levelOfExpertise: trinhDo,
        address: diaChi,
        department: boMon,
        dateOfEnrollment: ngayBatDauCongTac,
        role: 'teacher',
      })

      // check sdt is unique
      const existingGiaoVien = await Teacher.findOne({
        phoneNumber: sdt,
      })

      if (existingGiaoVien) {
        console.error('Số điện thoại đã tồn tại:', sdt)
        return res.status(400).json({ error: 'Số điện thoại đã tồn tại' })
      }

      const newAccount = new Account({
        userName: sdt,
        password: sdt,
        role: 'Teacher',
      })

      await newAccount.save()
      await newGiaoVien.save()
      console.log('Thêm giáo viên thành công:', newGiaoVien)
      res.status(200).json({ message: 'Thêm giáo viên thành công' })
    } catch (error) {
      console.error('Lỗi khi thêm giáo viên:', error)
      res.status(500).json({ error: error.message })
    }
  },

  getGiaoVienByDepartment: async (req, res) => {
    const { department } = req.body
    console.log('Đang truy vấn giáo viên theo bộ môn...', department)
    try {
      const result = await Teacher.find({ department: department })
      // console.log('Kết quả truy vấn:', result)
      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi truy vấn giáo viên theo bộ môn:', error)
      res.status(500).json({ error: error.message })
    }
  },

  getGiaoVienByClassNameAndSchoolYear: async (req, res) => {
    const { className, schoolYear } = req.body
    try {
      console.log('Đang truy vấn giáo viên theo lớp học...', className)
      const classInfo = await Class.findOne({
        className: className,
        academicYear: schoolYear,
      })
      if (!classInfo) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' })
      } else {
        console.log('classInfo: ', classInfo)
        const result = await Teacher.findOne({ _id: classInfo.homeRoomTeacher })
        res.status(200).json(result)
      }
    } catch (error) {
      console.error('Lỗi khi truy vấn giáo viên theo lớp học:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // get GiaoVien by phoneNumber and check if they are homeRoomTeacher of any class
  getGiaoVienByPhoneNumber: async (req, res) => {
    const { phoneNumber } = req.body
    //console.log("Đang truy vấn giáo viên theo phoneNumber...", phoneNumber);

    try {
      // Tìm giáo viên theo số điện thoại
      const teacher = await Teacher.findOne({ phoneNumber: phoneNumber })
      if (!teacher) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy giáo viên với số điện thoại này' })
      }

      // Tìm các lớp mà giáo viên này là giáo viên chủ nhiệm
      const classes = await Class.aggregate([
        { $match: { homeRoomTeacher: teacher._id } }, // Khớp với trường homeRoomTeacher
        {
          $project: {
            // Chỉ lấy những trường cần thiết
            _id: 1,
            className: 1,
            academicYear: 1,
          },
        },
      ])

      // Thêm thông tin lớp vào kết quả trả về
      const result = {
        ...teacher.toObject(), // Chuyển kết quả giáo viên thành object
        lopChuNhiem: classes, // Thêm danh sách các lớp
      }

      // console.log('Kết quả truy vấn:', result)
      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi truy vấn giáo viên theo phoneNumber:', error)
      res.status(500).json({ error: error.message })
    }
  },

  getTeacherSchedule: async (req, res) => {
    const { teacherId, schoolYear } = req.body
    console.log('Đang truy vấn lịch giáo viên...', teacherId)
    console.log('Năm học:', schoolYear)

    try {
      const result = await Schedule.aggregate([
        {
          $match: {
            scheduleTeacher: new ObjectId(teacherId),
            schoolYear: schoolYear,
          },
        },
      ])

      console.log('Kết quả truy vấn getTeacherSchedule:', result)
      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi truy vấn lịch giáo viên:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // get GiaoVien by phoneNumber and check if they are homeRoomTeacher of any class
  getGiaoVienByPhoneNumber: async (req, res) => {
    const { phoneNumber } = req.body
    // console.log('Đang truy vấn giáo viên theo phoneNumber...', phoneNumber)

    try {
      // Tìm giáo viên theo số điện thoại
      const teacher = await Teacher.findOne({ phoneNumber: phoneNumber })
      if (!teacher) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy giáo viên với số điện thoại này' })
      }

      // Tìm các lớp mà giáo viên này là giáo viên chủ nhiệm
      const classes = await Class.aggregate([
        { $match: { homeRoomTeacher: teacher._id } }, // Khớp với trường homeRoomTeacher
        {
          $project: {
            // Chỉ lấy những trường cần thiết
            _id: 1,
            className: 1,
            academicYear: 1,
          },
        },
      ])

      // Thêm thông tin lớp vào kết quả trả về
      const result = {
        ...teacher.toObject(), // Chuyển kết quả giáo viên thành object
        lopChuNhiem: classes, // Thêm danh sách các lớp
      }

      // console.log('Kết quả truy vấn:', result)
      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi truy vấn giáo viên theo phoneNumber:', error)
      res.status(500).json({ error: error.message })
    }
  },

  getTeacherSchedule: async (req, res) => {
    const { teacherId, schoolYear } = req.body
    console.log('Đang truy vấn lịch giáo viên...', teacherId)
    console.log('Năm học:', schoolYear)

    try {
      const result = await Schedule.aggregate([
        {
          $match: {
            scheduleTeacher: new ObjectId(teacherId),
            schoolYear: schoolYear,
          },
        },
      ])

      console.log('Kết quả truy vấn getTeacherSchedule:', result)
      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi truy vấn lịch giáo viên:', error)
      res.status(500).json({ error: error.message })
    }
  },
}

// get GiaoVien by phoneNumber and check if they are homeRoomTeacher of any class
getGiaoVienByPhoneNumber: async (req, res) => {
  const { phoneNumber } = req.body
  //console.log('Đang truy vấn giáo viên theo phoneNumber...', phoneNumber)

  try {
    // Tìm giáo viên theo số điện thoại
    const teacher = await Teacher.findOne({ phoneNumber: phoneNumber })
    if (!teacher) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy giáo viên với số điện thoại này' })
    }

    // Tìm các lớp mà giáo viên này là giáo viên chủ nhiệm
    const classes = await Class.aggregate([
      { $match: { homeRoomTeacher: teacher._id } }, // Khớp với trường homeRoomTeacher
      {
        $project: {
          // Chỉ lấy những trường cần thiết
          _id: 1,
          className: 1,
          academicYear: 1,
        },
      },
    ])

    // Thêm thông tin lớp vào kết quả trả về
    const result = {
      ...teacher.toObject(), // Chuyển kết quả giáo viên thành object
      lopChuNhiem: classes, // Thêm danh sách các lớp
    }

    //console.log('Kết quả truy vấn:', result)
    res.status(200).json(result)
  } catch (error) {
    console.error('Lỗi khi truy vấn giáo viên theo phoneNumber:', error)
    res.status(500).json({ error: error.message })
  }
},
  (module.exports = GiaoVienController)
