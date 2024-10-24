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
  // get all requests by teacher id
  getLeaveRequestsByTeacherId: async (req, res) => {
    try {
      const { teacher_id } = req.body
      const leaveRequests = await LeaveRequest.find({ teacher_id })
      console.log('Leave Requests:', leaveRequests)
      res.json(leaveRequests)
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
module.exports = LeaveRequestController
