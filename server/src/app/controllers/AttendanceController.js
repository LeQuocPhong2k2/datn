const Student = require('../models/Student')
const Class = require('../models/Class')
const Teacher = require('../models/Teacher')
const Attendance = require('../models/Attendance')

const AttendanceController = {
  createAttendance: async (req, res) => {
    const { class_id, teacher_id, date, attendanceRecords, leaveRequest_id } =
      req.body
    console.log('Thông tin điểm danh:', {
      class_id,
      teacher_id,
      date,
      attendanceRecords,
      leaveRequest_id,
    })

    try {
      // Kiểm tra xem đã tồn tại bản ghi điểm danh cho lớp và ngày này chưa
      let existingAttendance = await Attendance.findOne({ class_id, date })

      if (existingAttendance) {
        // Kiểm tra và loại bỏ các học sinh đã tồn tại
        const newRecords = []
        for (const newRecord of attendanceRecords) {
          const isDuplicate = existingAttendance.attendanceRecords.some(
            (existingRecord) =>
              existingRecord.student_id.toString() ===
              (newRecord.student_id.$oid || newRecord.student_id)
          )

          if (!isDuplicate) {
            newRecords.push(newRecord)
          }
        }

        // Nếu có bản ghi mới, cập nhật
        if (newRecords.length > 0) {
          existingAttendance.attendanceRecords.push(...newRecords)
          await existingAttendance.save()
          return res.status(200).json(existingAttendance)
        } else {
          // Nếu tất cả học sinh đã tồn tại, thay thế toàn bộ bản ghi
          existingAttendance.attendanceRecords = attendanceRecords
          await existingAttendance.save()
          return res.status(200).json(existingAttendance)
        }
      }

      // Nếu chưa tồn tại bản ghi, tạo mới
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

  // getAttendanceByClassAndDateNow: async (req, res) => {
  //   try {
  //     const { class_id } = req.body

  //     if (!class_id) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'class_id chưa được cung cấp',
  //       })
  //     }

  //     const dataDiemDanh = await Attendance.find({
  //       class_id: class_id,
  //       // date: { $lte: currentDate },
  //     })
  //       .select('-teacher_id')
  //       .sort({ date: 1 })

  //     if (!dataDiemDanh.length) {
  //       return res.status(404).json({
  //         message: 'No attendance records found',
  //         tongSoNgayDiemDanh: 0,
  //       })
  //     }

  //     // Thống kê chi tiết trạng thái điểm danh cho từng học sinh
  //     const studentAttendanceStats = {}

  //     dataDiemDanh.forEach((attendanceDay) => {
  //       attendanceDay.attendanceRecords.forEach((record) => {
  //         const { student_id, student_name, status } = record

  //         if (!studentAttendanceStats[student_id]) {
  //           studentAttendanceStats[student_id] = {
  //             student_name: student_name,
  //             statusCounts: {
  //               CM: 0,
  //               VCP: 0,
  //               VKP: 0,
  //             },
  //           }
  //         }

  //         studentAttendanceStats[student_id].statusCounts[status]++
  //       })
  //     })

  //     const tongSoNgayDiemDanh = dataDiemDanh.length

  //     res.status(200).json({
  //       tongSoNgayDiemDanh,
  //       dataDiemDanh,
  //       studentAttendanceStats,
  //     })
  //   } catch (error) {
  //     console.error('Error fetching attendance records:', error)
  //     res.status(500).json({ message: 'Internal server error' })
  //   }
  // },

  // api thống kê dựa của attendance theo class_id và dựa theo tháng và năm

  getAttendanceByClassAndDateNow: async (req, res) => {
    try {
      const { class_id, month, year } = req.body

      // Kiểm tra các tham số bắt buộc
      if (!class_id) {
        return res.status(400).json({
          success: false,
          message: 'class_id chưa được cung cấp',
        })
      }

      // Tạo khoảng ngày đầu và cuối tháng
      const startOfMonth = new Date(year, month - 1, 1)
      const endOfMonth = new Date(year, month, 0)

      const dataDiemDanh = await Attendance.find({
        class_id: class_id,
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
        .select('-teacher_id')
        .sort({ date: 1 })

      if (!dataDiemDanh.length) {
        return res.status(404).json({
          message: 'No attendance records found',
          tongSoNgayDiemDanh: 0,
        })
      }

      // Gộp các bản ghi có cùng ngày
      const mergedAttendance = dataDiemDanh.reduce((acc, current) => {
        const existingDateIndex = acc.findIndex(
          (item) =>
            item.date.toISOString().split('T')[0] ===
            current.date.toISOString().split('T')[0]
        )

        if (existingDateIndex !== -1) {
          // Gộp các attendanceRecords
          acc[existingDateIndex].attendanceRecords.push(
            ...current.attendanceRecords
          )
        } else {
          acc.push(current)
        }

        return acc
      }, [])

      // Thống kê chi tiết trạng thái điểm danh cho từng học sinh
      const studentAttendanceStats = {}

      mergedAttendance.forEach((attendanceDay) => {
        attendanceDay.attendanceRecords.forEach((record) => {
          const { student_id, student_name, status } = record

          if (!studentAttendanceStats[student_id]) {
            studentAttendanceStats[student_id] = {
              student_name: student_name || 'Học sinh không có tên',
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

      const tongSoNgayDiemDanh = mergedAttendance.length

      res.status(200).json({
        tongSoNgayDiemDanh,
        dataDiemDanh: mergedAttendance,
        studentAttendanceStats,
      })
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  getAttendanceStatsByClassAndMonth: async (req, res) => {
    try {
      const { class_id, month, year } = req.body

      // Tạo ngày đầu và cuối của tháng
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)

      const attendanceData = await Attendance.find({
        class_id,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ date: 1 })

      if (!attendanceData.length) {
        return res.status(404).json({
          message: 'Không tìm thấy dữ liệu điểm danh trong tháng này',
        })
      }

      const studentMap = new Map()
      let tongSoHocSinhCoMat = 0
      let tongSoHocSinhVangCoPhep = 0
      let tongSoHocSinhVangKhongPhep = 0

      attendanceData.forEach((record) => {
        const currentDate = new Date(record.date).toLocaleDateString('vi-VN', {
          day: '2-digit',
        })

        record.attendanceRecords.forEach((student) => {
          const { student_id, student_name, status, reason } = student
          const studentKey = student_id.toString()

          if (!studentMap.has(studentKey)) {
            studentMap.set(studentKey, {
              _id: studentKey,
              hoTen: student_name,
              ngayCoMat: [],
              ngayVangCoPhep: [],
              ngayVangKhongPhep: [],
              trangThaiHienTai: status,
              lyDoHienTai: reason,
            })
          }

          const studentData = studentMap.get(studentKey)

          switch (status) {
            case 'CM':
              tongSoHocSinhCoMat++
              studentData.ngayCoMat.push(currentDate)
              break
            case 'VCP':
              tongSoHocSinhVangCoPhep++
              studentData.ngayVangCoPhep.push(currentDate)
              break
            case 'VKP':
              tongSoHocSinhVangKhongPhep++
              studentData.ngayVangKhongPhep.push(currentDate)
              break
          }
        })
      })

      const danhSachHocSinh = Array.from(studentMap.values())

      const result = {
        tongSoHocSinh: studentMap.size,
        tongSoHocSinhCoMat,
        tongSoHocSinhVangCoPhep,
        tongSoHocSinhVangKhongPhep,
        danhSachHocSinh,
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi lấy thống kê điểm danh:', error)
      return res.status(500).json({ message: 'Lỗi server' })
    }
  },
}

module.exports = AttendanceController
