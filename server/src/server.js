require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT_SERVER

// Thêm middleware để phân tích cú pháp body của request
app.use(express.json())
// import connectDB từ file index.js trong folder config/db
const connectDB = require('./config/db/db.js')
// sử dụng cors để cho phép truy cập từ các nguồn khác
app.use(cors())
// lấy api route từ file index.js trong folder routes
const route = require('./routes/index.js')
route(app)

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error)
    process.exit(1)
  })
