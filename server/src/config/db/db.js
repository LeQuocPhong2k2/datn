const mongoose = require('mongoose')
require('dotenv').config({ path: '../../../../.env' })

const MONGO_URL_SERVER = process.env.MONGO_URL_SERVER

const connectDB = async () => {
  try {
    await mongoose
      .connect(MONGO_URL_SERVER)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error('Failed to connect to MongoDB', err))
  } catch (error) {
    console.error('Failed to connect to MongoDB', error)
  }
}

module.exports = connectDB
