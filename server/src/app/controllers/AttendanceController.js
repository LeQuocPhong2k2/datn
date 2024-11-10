require('dotenv').config({ path: '../../../../.env' })
const Student = require('../models/Student')
const Class = require('../models/Class')
const Teacher = require('../models/Teacher')
const Attendance = require('../models/Attendance')

const AttendanceController = {
  createAttendance: async (req, res) => {
    const { class_id, teacher_id, date, attendanceRecords } = req.body
    console.log('class_id được truyền qua là:', class_id)
    console.log('teacher_id được truyền qua là:', teacher_id)
    console.log('date được truyền qua là:', date)
    console.log('attendanceRecords được truyền qua là:', attendanceRecords)
    try {
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
}
const attendanceRecordsTest = [
  {
    student_id: '671b92bdad6448c934e53d11', // student ID
    status: 'CM',
    reason: 'Học sinh có mặt',
  },
  {
    student_id: '671b92bdad6448c934e53d1d', // student ID
    status: 'VCP',
    leaveRequest_id: '671a0f54c616586002aa6b9e',
    reason: 'Cháu bị ốm ạ',
  },
  {
    student_id: '671b92bead6448c934e53d28', // student ID
    status: 'VKP',
    reason: 'Học sinh vắng không phép',
  },
  {
    student_id: '671b92bead6448c934e53d33', // student ID
    status: 'VKP',
    reason: 'Học sinh vắng không phép',
  },
]

module.exports = AttendanceController
