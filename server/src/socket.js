let io

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: 'http://localhost:3000', // Thay bằng địa chỉ client của bạn
        methods: ['GET', 'POST'],
        credentials: true,
      },
    })

    io.on('connection', (socket) => {
      console.log('Client kết nối socket thành công:', socket.id)

      socket.on('disconnect', () => {
        console.log('Client ngừng kết nối:', socket.id)
      })
    })

    console.log('Socket.io đã được khởi tạo!')
    return io
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io không được khởi tạo!')
    }
    return io
  },
}
