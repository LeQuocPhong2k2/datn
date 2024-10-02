const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema(
  {
    userName: String,
    password: String,
    role: String,
    refreshToken: String,
  },
  { collection: 'Account' }
) // Chỉ định rõ tên collection

module.exports = mongoose.model('Account', AccountSchema)
