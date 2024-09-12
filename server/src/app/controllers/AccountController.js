require('dotenv').config({ path: '../../../../.env' })
const Account = require('../models/Account')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const JWT_SECRET = process.env.JWT_SECRET

const AccountController = {
  getAllAccounts: async (req, res) => {
    try {
      console.log('Đang truy vấn tất cả tài khoản...')
      const accounts = await Account.find()
      console.log('Kết quả truy vấn:', accounts)
      res.status(200).json(accounts)
    } catch (error) {
      console.error('Lỗi khi truy vấn tài khoản:', error)
      res.status(500).json({ error: error.message })
    }
  },

  login: async (req, res) => {
    console.log('JWT_SECRET là :', JWT_SECRET)
    const { userName, password } = req.body
    try {
      const account = await Account.findOne({ userName })
      if (!account) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
      // // sử dụng bcrypt để so sánh password
      // const isMatch = await bcrypt.compare(password, account.password)
      // if (!isMatch) {
      //   return res.status(401).json({ error: 'Invalid credentials' })
      // }

      // sử dụng jwt để tạo token
      const token = jwt.sign({ id: account._id }, JWT_SECRET, {
        expiresIn: '1h',
      })
      console.log('Token:', token)

      // Gửi token về client
      res.status(200).json({
        message: 'Login successful',
        token: token,
        account: { id: account._id, userName: account.userName },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
}

module.exports = AccountController
