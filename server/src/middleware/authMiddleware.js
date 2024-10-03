const jwt = require('jsonwebtoken')
// file này dùng để kiểm tra token có hợp lệ hay không
const JWT_SECRET = process.env.JWT_SECRET
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  console.log('Token:', token)
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' })
  }
}

module.exports = authMiddleware
