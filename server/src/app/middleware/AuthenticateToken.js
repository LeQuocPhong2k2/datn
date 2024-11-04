require("dotenv").config({ path: "../../../../.env" });
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // get header Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // check token
  if (!token) return res.sendStatus(401);

  // Xác minh token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token has expired" });
      }
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
