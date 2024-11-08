const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdministratorSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'Administrator', // Chỉ định tên collection là 'Administrator'
  }
)

const Administrator = mongoose.model('Administrator', AdministratorSchema)

module.exports = Administrator
