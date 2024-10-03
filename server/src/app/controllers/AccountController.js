require("dotenv").config({ path: "../../../../.env" });
const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

const AccountController = {
  getAllAccounts: async (req, res) => {
    try {
      console.log("Đang truy vấn tất cả tài khoản...");
      const accounts = await Account.find();
      console.log("Kết quả truy vấn:", accounts);
      res.status(200).json(accounts);
    } catch (error) {
      console.error("Lỗi khi truy vấn tài khoản:", error);
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    console.log("JWT_SECRET là :", JWT_SECRET);
    const { userName, password } = req.body;

    try {
      const account = await Account.findOne({ userName });
      if (!account) {
        return res.status(401).json({ error: "Tài khoản không tồn tại" });
      }
      if (account.password !== password) {
        return res.status(402).json({ error: "Mật khẩu không chính xác" });
      }

      // sử dụng jwt để tạo token với vai trò
      const token = jwt.sign({ id: account._id, role: account.role }, JWT_SECRET, {
        expiresIn: "1h",
      });
      // Tạo refresh token
      const refreshToken = jwt.sign({ id: account._id, role: account.role }, JWT_SECRET, {
        expiresIn: "7d", // Thời gian sống lâu hơn
      });
      console.log("Token:", token);
      console.log("Refresh Token:", refreshToken);

      // Lưu refresh token vào cơ sở dữ liệu
      await Account.updateOne({ _id: account._id }, { refreshToken: refreshToken });

      res.status(200).json({
        message: "Login successful",
        token: token,
        account: {
          id: account._id,
          userName: account.userName,
          role: account.role,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  findAccountById: async (req, res) => {
    const { account_id } = req.body;
    console.log("Đang truy vấn tài khoản với id:", account_id);
    try {
      const account = await Account.findById({
        _id: account_id,
      });
      if (!account) {
        return res.status(404).json({ error: "Tài khoản không tồn tại" });
      }
      res.status(200).json(account);
    } catch (error) {
      console.error("Lỗi khi truy vấn tài khoản:", error);
      res.status(500).json({ error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token không hợp lệ" });
    }

    try {
      // Kiểm tra refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const account = await Account.findById(decoded.id);

      if (!account || account.refreshToken !== refreshToken) {
        return res.status(403).json({ error: "Refresh token không hợp lệ" });
      }

      // Tạo access token mới
      const token = jwt.sign({ id: account._id, role: account.role }, JWT_SECRET, { expiresIn: "1h" });
      console.log("Refresh token thành công ");
      console;

      res.status(200).json({
        message: "Refresh token thành công",
        token: token,
        account: {
          id: account._id,
          userName: account.userName,
          role: account.role,
        },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = AccountController;
