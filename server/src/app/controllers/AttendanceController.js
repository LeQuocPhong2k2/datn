require('dotenv').config({ path: '../../../../.env' })
const Student = require('../models/Student')
const Class = require('../models/Class')
const Teacher = require('../models/Teacher')
const Attendance = require('../models/Attendance')

const AttendanceController = {
  // createAttendance: async (req, res) => {
  //   const { class_id, teacher_id, date, attendanceRecords } = req.body
  //   console.log('class_id được truyền qua là:', class_id)
  //   console.log('teacher_id được truyền qua là:', teacher_id)
  //   console.log('date được truyền qua là:', date)
  //   console.log('attendanceRecords được truyền qua là:', attendanceRecords)
  //   try {
  //     const newAttendance = new Attendance({
  //       class_id,
  //       teacher_id,
  //       date,
  //       attendanceRecords,
  //     })
  //     await newAttendance.save()
  //     res.status(200).json(newAttendance)
  //   } catch (error) {
  //     console.error('Lỗi khi tạo điểm danh:', error)
  //     res.status(500).json({ error: error.message })
  //   }
  // },
  createAttendance: async (req, res) => {
    const { class_id, teacher_id, date, attendanceRecords } = req.body
    console.log('class_id được truyền qua là:', class_id)
    console.log('teacher_id được truyền qua là:', teacher_id)
    console.log('date được truyền qua là:', date)
    console.log('attendanceRecords được truyền qua là:', attendanceRecords)

    try {
      // Kiểm tra xem có bản ghi nào trùng lặp không
      const existingAttendance = await Attendance.findOne({ class_id, date })
      if (existingAttendance) {
        return res.status(400).json({
          error:
            'Đã tồn tại bản ghi điểm danh cho lớp này vào ngày này vui lòng liên hệ QTV để được hỗ trợ.',
        })
      }

      const newAttendance = new Attendance({
        class_id,
        teacher_id,
        date,
        attendanceRecords,
      })
      await newAttendance.save()
      res.status(200).json(newAttendance)
    } catch (error) {
      console.error('Lỗi khi tạo điểm danh:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // Lấy danh sách điểm danh của học sinh theo lớp và tới ngày hiện tại
  // getAttendanceByClassAndDateNow: async (req, res) => {
  //   try {
  //     const { class_id } = req.body
  //     const currentDate = new Date()
  //     // chỉnh currentDate + 7 để về giờ VN
  //     currentDate.setHours(currentDate.getHours() + 7)
  //     console.log(currentDate)

  //     const dataDiemDanh = await Attendance.find({
  //       class_id: class_id,
  //       date: { $lte: currentDate },
  //     })
  //       .select('-teacher_id') // Loại bỏ trường teacher_id
  //       .sort({ date: 1 })

  //     if (!dataDiemDanh.length) {
  //       return res.status(404).json({
  //         message: 'No attendance records found',
  //         tongSoNgayDiemDanh: 0,
  //       })
  //     }

  //     // Đếm tổng số ngày đã điểm danh
  //     const tongSoNgayDiemDanh = dataDiemDanh.length

  //     res.status(200).json({ tongSoNgayDiemDanh, dataDiemDanh })
  //   } catch (error) {
  //     console.error('Error fetching attendance records:', error)
  //     res.status(500).json({ message: 'Internal server error' })
  //   }
  // },
  getAttendanceByClassAndDateNow: async (req, res) => {
    try {
      const { class_id } = req.body
      const currentDate = new Date()
      currentDate.setHours(currentDate.getHours() + 7)

      const dataDiemDanh = await Attendance.find({
        class_id: class_id,
        date: { $lte: currentDate },
      })
        .select('-teacher_id')
        .sort({ date: 1 })

      if (!dataDiemDanh.length) {
        return res.status(404).json({
          message: 'No attendance records found',
          tongSoNgayDiemDanh: 0,
        })
      }

      // Thống kê chi tiết trạng thái điểm danh cho từng học sinh
      const studentAttendanceStats = {}

      dataDiemDanh.forEach((attendanceDay) => {
        attendanceDay.attendanceRecords.forEach((record) => {
          const { student_id, student_name, status } = record

          if (!studentAttendanceStats[student_id]) {
            studentAttendanceStats[student_id] = {
              student_name: student_name,
              statusCounts: {
                CM: 0,
                VCP: 0,
                VKP: 0,
              },
            }
          }

          studentAttendanceStats[student_id].statusCounts[status]++
        })
      })

      const tongSoNgayDiemDanh = dataDiemDanh.length

      res.status(200).json({
        tongSoNgayDiemDanh,
        dataDiemDanh,
        studentAttendanceStats,
      })
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}

module.exports = AttendanceController
