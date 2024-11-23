require("dotenv").config({ path: "../../../../.env" });
const Student = require("../models/Student");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const Attendance = require("../models/Attendance");

const AttendanceController = {
  // createAttendance: async (req, res) => {
  //   const { class_id, teacher_id, date, attendanceRecords, leaveRequest_id } =
  //     req.body
  //   console.log('class_id được truyền qua là:', class_id)
  //   console.log('teacher_id được truyền qua là:', teacher_id)
  //   console.log('date được truyền qua là:', date)
  //   console.log('attendanceRecords được truyền qua là:', attendanceRecords)
  //   console.log('leaveRequest_id được truyền qua là:', leaveRequest_id)

  //   try {
  //     // Kiểm tra xem có bản ghi nào trùng lặp không
  //     const existingAttendance = await Attendance.findOne({ class_id, date })
  //     if (existingAttendance) {
  //       return res.status(400).json({
  //         error:
  //           'Đã tồn tại bản ghi điểm danh cho lớp này vào ngày này vui lòng liên hệ QTV để được hỗ trợ.',
  //       })
  //     }

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
    const { class_id, teacher_id, date, attendanceRecords, leaveRequest_id } = req.body;
    console.log("Thông tin điểm danh:", {
      class_id,
      teacher_id,
      date,
      attendanceRecords,
      leaveRequest_id,
    });

    try {
      // Kiểm tra xem đã tồn tại bản ghi điểm danh cho lớp và ngày này chưa
      let existingAttendance = await Attendance.findOne({ class_id, date });

      if (existingAttendance) {
        // Kiểm tra và loại bỏ các học sinh đã tồn tại
        const newRecords = [];
        for (const newRecord of attendanceRecords) {
          const isDuplicate = existingAttendance.attendanceRecords.some((existingRecord) => existingRecord.student_id.toString() === (newRecord.student_id.$oid || newRecord.student_id));

          if (!isDuplicate) {
            newRecords.push(newRecord);
          }
        }

        // Nếu có bản ghi mới, cập nhật
        if (newRecords.length > 0) {
          existingAttendance.attendanceRecords.push(...newRecords);
          await existingAttendance.save();
          return res.status(200).json(existingAttendance);
        } else {
          // Nếu tất cả học sinh đã tồn tại, thay thế toàn bộ bản ghi
          existingAttendance.attendanceRecords = attendanceRecords;
          await existingAttendance.save();
          return res.status(200).json(existingAttendance);
        }
      }

      // Nếu chưa tồn tại bản ghi, tạo mới
      const newAttendance = new Attendance({
        class_id,
        teacher_id,
        date,
        attendanceRecords,
      });

      await newAttendance.save();
      res.status(200).json(newAttendance);
    } catch (error) {
      console.error("Lỗi khi tạo điểm danh:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getAttendanceByClassAndDateNow: async (req, res) => {
    try {
      const { class_id } = req.body;
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 7);

      const dataDiemDanh = await Attendance.find({
        class_id: class_id,
        // date: { $lte: currentDate },
      })
        .select("-teacher_id")
        .sort({ date: 1 });

      if (!dataDiemDanh.length) {
        return res.status(404).json({
          message: "No attendance records found",
          tongSoNgayDiemDanh: 0,
        });
      }

      // Thống kê chi tiết trạng thái điểm danh cho từng học sinh
      const studentAttendanceStats = {};

      dataDiemDanh.forEach((attendanceDay) => {
        attendanceDay.attendanceRecords.forEach((record) => {
          const { student_id, student_name, status } = record;

          if (!studentAttendanceStats[student_id]) {
            studentAttendanceStats[student_id] = {
              student_name: student_name,
              statusCounts: {
                CM: 0,
                VCP: 0,
                VKP: 0,
              },
            };
          }

          studentAttendanceStats[student_id].statusCounts[status]++;
        });
      });

      const tongSoNgayDiemDanh = dataDiemDanh.length;

      res.status(200).json({
        tongSoNgayDiemDanh,
        dataDiemDanh,
        studentAttendanceStats,
      });
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = AttendanceController;
