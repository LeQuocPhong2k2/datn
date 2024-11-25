require('dotenv').config({ path: '../../../../.env' })
const LeaveRequest = require('../models/LeaveRequest')
const Student = require('../models/Student')
const Parent = require('../models/Parent')
const Class = require('../models/Class')

const LeaveRequestController = {
  // tạo đơn xin nghỉ học
  //  createLeaveRequest: async (req, res) => {
  //   try {
  //     const {
  //       student_id,
  //       parent_id,
  //       teacher_id,
  //       class_id,
  //       start_date,
  //       end_date,
  //       reason,
  //       sessions,
  //     } = req.body

  //     // Kiểm tra xem đã có đơn xin nghỉ cho học sinh này và ngày này chưa
  //     const existingLeaveRequest = await LeaveRequest.findOne({
  //       student_id,
  //       start_date: {
  //         $gte: new Date(start_date).setHours(0, 0, 0, 0),
  //         $lt: new Date(start_date).setHours(23, 59, 59, 999),
  //       },
  //       $or: [{ status: 'pending' }, { status: 'approved' }],
  //     })

  //     // Nếu đã tồn tại đơn xin nghỉ
  //     if (existingLeaveRequest) {
  //       return res.status(400).json({
  //         success: false,
  //         message:
  //           'Đã tồn tại đơn xin nghỉ học cho ngày  , vui lòng kiểm tra lại thông tin',
  //         existingRequest: existingLeaveRequest,
  //       })
  //     }

  //     // Nếu không có đơn trùng, tạo đơn mới
  //     const newLeaveRequest = new LeaveRequest({
  //       student_id,
  //       parent_id,
  //       teacher_id,
  //       class_id,
  //       start_date,
  //       end_date,
  //       reason,
  //       sessions,
  //       status: 'pending', // Mặc định trạng thái là đang chờ duyệt
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     })

  //     const savedLeaveRequest = await newLeaveRequest.save()

  //     res.status(201).json({
  //       success: true,
  //       message: 'Đơn xin nghỉ học đã được tạo thành công',
  //       data: savedLeaveRequest,
  //     })

  //     console.log(
  //       'Đơn xin nghỉ học đã được tạo thành công:',
  //       savedLeaveRequest._id
  //     )
  //   } catch (error) {
  //     console.error('Lỗi khi tạo đơn xin nghỉ học:', error)
  //     res.status(500).json({
  //       success: false,
  //       message: 'Có lỗi xảy ra khi tạo đơn xin nghỉ học',
  //       error: error.message,
  //     })
  //   }
  // },
  createLeaveRequest: async (req, res) => {
    try {
      const {
        student_id,
        parent_id,
        teacher_id,
        class_id,
        start_date,
        end_date,
        reason,
        sessions,
      } = req.body

      // Chuyển đổi ngày thành đối tượng Date
      const startDate = new Date(start_date)
      const endDate = new Date(end_date)

      // Tạo mảng các ngày trong khoảng
      const dateRange = []
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        dateRange.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Kiểm tra các ngày đã có đơn xin nghỉ - Sửa cách query
      const existingLeaveRequests = await LeaveRequest.find({
        student_id,
        $or: dateRange.map((date) => ({
          start_date: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999)),
          },
        })),
        status: { $in: ['pending', 'approved'] },
      })

      // Lọc ra các ngày đã có đơn
      const existingDates = existingLeaveRequests.map(
        (req) => new Date(req.start_date).toISOString().split('T')[0]
      )

      // Lọc ra các ngày chưa có đơn
      const availableDates = dateRange.filter(
        (date) => !existingDates.includes(date.toISOString().split('T')[0])
      )

      // Nếu không còn ngày nào để tạo đơn
      if (availableDates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Tất cả các ngày đã có đơn xin nghỉ',
          existingRequests: existingLeaveRequests,
        })
      }

      // Tạo sessions mới cho các ngày còn lại
      const newSessions = availableDates.map((date) => ({
        date: date,
        morning: sessions[0]?.morning || false,
        afternoon: sessions[0]?.afternoon || false,
      }))

      // Nếu còn ngày để tạo đơn
      const newLeaveRequest = new LeaveRequest({
        student_id,
        parent_id,
        teacher_id,
        class_id,
        start_date: availableDates[0], // Lấy ngày đầu tiên
        end_date: availableDates[availableDates.length - 1], // Lấy ngày cuối cùng
        reason,
        sessions: newSessions,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      })

      const savedLeaveRequest = await newLeaveRequest.save()

      res.status(201).json({
        success: true,
        message: `Đơn xin nghỉ học đã được tạo thành công cho ${availableDates.length} ngày`,
        data: savedLeaveRequest,
        availableDates: availableDates.map(
          (date) => date.toISOString().split('T')[0]
        ),
        existingDates: existingDates,
      })

      console.log(
        'Đơn xin nghỉ học đã được tạo thành công:',
        savedLeaveRequest._id
      )
    } catch (error) {
      console.error('Lỗi khi tạo đơn xin nghỉ học:', error)
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi tạo đơn xin nghỉ học',
        error: error.message,
      })
    }
  },

  getAllLeaveRequests: async (req, res) => {
    try {
      const leaveRequests = await LeaveRequest.find({})
      //console.log('Leave Requests:', leaveRequests)
      res.json(leaveRequests)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  getLeaveRequestsByStudentId: async (req, res) => {
    try {
      const { student_id } = req.body

      // Lấy thông tin đơn xin nghỉ và populate thông tin học sinh
      const leaveRequests = await LeaveRequest.find({ student_id }).lean()

      // Lấy thông tin học sinh
      const student = await Student.findById(student_id)
        .select('userName')
        .lean()

      // Thêm tên học sinh vào mỗi đơn xin nghỉ
      const leaveRequestsWithStudentName = leaveRequests.map((request) => ({
        ...request,
        student_name: student.userName,
      }))

      console.log('Leave Requests:', leaveRequestsWithStudentName)
      res.json(leaveRequestsWithStudentName)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  // get all requests by teacher id

  getLeaveRequestsByTeacherId: async (req, res) => {
    try {
      const { teacher_id } = req.body

      // Get basic leave requests
      const leaveRequests = await LeaveRequest.find({ teacher_id })

      // Get detailed information for each request
      const detailedRequests = await Promise.all(
        leaveRequests.map(async (request) => {
          // Get student info with null check
          const student = await Student.findById(request.student_id)
          if (!student) {
            return {
              ...request.toObject(),
              student_name: 'Không tìm thấy',
              parent_name: 'Không tìm thấy',
              class_name: 'Không tìm thấy',
            }
          }

          // Get parent info with null check
          const parent = await Parent.findById(student.parents[0])

          // Get class info with fixed query
          const classInfo = await Class.findOne({
            studentList: { $in: [student._id] },
          })

          return {
            ...request.toObject(),
            student_name: student.userName || 'Không tìm thấy',
            parent_name: parent?.userName || 'Không tìm thấy',
            class_name: classInfo?.className || 'Không tìm thấy',
          }
        })
      )

      // console.log('Detailed Leave Requests:', detailedRequests)
      res.json(detailedRequests)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  // by cha mẹ

  getLeaveRequestsByParentId: async (req, res) => {
    try {
      const { parent_id } = req.body

      // Tìm tất cả đơn xin nghỉ có parent_id tương ứng
      const leaveRequests = await LeaveRequest.find({ parent_id }).lean()

      // Lấy danh sách student_id từ các đơn xin nghỉ
      const studentIds = [
        ...new Set(leaveRequests.map((request) => request.student_id)),
      ]

      // Lấy thông tin tên của tất cả học sinh liên quan
      const students = await Student.find(
        { _id: { $in: studentIds } },
        { userName: 1 }
      ).lean()

      // Tạo map để mapping student_id với userName
      const studentMap = students.reduce((map, student) => {
        map[student._id.toString()] = student.userName
        return map
      }, {})

      // Thêm student_name vào mỗi đơn xin nghỉ
      const leaveRequestsWithStudentName = leaveRequests.map((request) => ({
        ...request,
        student_name: studentMap[request.student_id.toString()],
      }))

      res.status(200).json(leaveRequestsWithStudentName)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  // làm sự kiện chấp nhận , từ chối đơn xin nghỉ học
  updateLeaveRequest: async (req, res) => {
    try {
      const { leaveRequest_id, status } = req.body
      const leaveRequest = await LeaveRequest.findOneAndUpdate(
        { _id: leaveRequest_id },
        { status },
        { new: true }
      )
      res.json(leaveRequest)
    } catch (error) {
      console.error('Error updating leave request:', error)
      res.status(500).json({ message: 'Internal server error' })
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
module.exports = LeaveRequestController
