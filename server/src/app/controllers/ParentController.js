require('dotenv').config({ path: '../../../../.env' })
const Parent = require('../models/Parent')
const Student = require('../models/Student')

const ParentController = {
  // xây dựng 1 API để lấy thông tin phụ huynh và lấy thông tin học sinh của phụ huynh đó chỉ cần lấy thông tin phụ huynh và id của học sinh và tên học sinh đó
  getFullParentInfo: async (req, res) => {
    try {
      const { parent_id } = req.body

      // Bước 1: Lấy thông tin phụ huynh
      const parent = await Parent.findById(parent_id)
      if (!parent) {
        return res.status(404).json({ message: 'Không tìm thấy phụ huynh' })
      }

      // Bước 2: Tìm các học sinh có parent_id này
      const students = await Student.find(
        {
          parents: parent_id,
          isDeleted: false,
        },
        'id userName' // Chỉ lấy id và userName của học sinh
      )

      // Bước 3: Kết hợp thông tin và trả về
      const result = {
        parent: {
          _id: parent._id,
          userName: parent.userName,
          dateOfBirth: parent.dateOfBirth,
          phoneNumber: parent.phoneNumber,
          job: parent.job,
          relationship: parent.relationship,
        },
        students: students.map((student) => ({
          student_id: student._id,
          student_name: student.userName,
        })),
      }

      res.status(200).json(result)
    } catch (error) {
      console.error('Error fetching parent and students:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}
module.exports = ParentController
