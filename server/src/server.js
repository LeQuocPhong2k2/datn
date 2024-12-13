require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const port = process.env.PORT_SERVER
const socketInit = require('./socket')
const path = require('path')

// Thêm middleware để phân tích cú pháp body của request
app.use(express.json())
// import connectDB từ file index.js trong folder config/db
const connectDB = require('./config/db/db.js')
// sử dụng cors để cho phép truy cập từ các nguồn khác
app.use(
  cors({
    origin: 'https://iuhschool.id.vn',
    // origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Increase payload size limit
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
// lấy api route từ file index.js trong folder routes
const route = require('./routes/index.js')
route(app)

// Endpoint để phục vụ file Excel mẫu
app.get('/download-template', (req, res) => {
  const file = path.join(
    __dirname,
    '../public/templates/tempalate-them-hoc-sinh.csv'
  )
  res.download(file, 'tempalate-them-hoc-sinh.csv', (err) => {
    if (err) {
      console.error('Lỗi khi tải file:', err)
      res.status(500).send('Lỗi khi tải file')
    }
  })
})

const server = http.createServer(app)
const io = socketInit.init(server)

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error)
    process.exit(1)
  })
