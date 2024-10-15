require('dotenv').config({ path: '../../../../.env' })
const LeaveRequest = require('../models/LeaveRequest')

const LeaveRequestController = {
  // tạo đơn xin nghỉ học
  createLeaveRequest: async (req, res) => {
    console.log('đã vào')
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

      const newLeaveRequest = new LeaveRequest({
        student_id,
        parent_id,
        teacher_id,
        class_id,
        start_date,
        end_date,
        reason,
        sessions,
      })

      const savedLeaveRequest = await newLeaveRequest.save()

      res.status(201).json({
        success: true,
        message: 'Đơn xin nghỉ học đã được tạo thành công',
        data: savedLeaveRequest,
      })
    } catch (error) {
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
      console.log('Leave Requests:', leaveRequests)
      res.json(leaveRequests)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  // get all leave requests by student id
  getLeaveRequestsByStudentId: async (req, res) => {
    try {
      const { student_id } = req.body
      const leaveRequests = await LeaveRequest.find({ student_id })
      console.log('Leave Requests:', leaveRequests)
      res.json(leaveRequests)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}
module.exports = LeaveRequestController
