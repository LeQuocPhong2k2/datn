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
<<<<<<< HEAD
    console.log('JWT_SECRET là :', JWT_SECRET)
    const { userName, password } = req.body
=======
    console.log("JWT_SECRET là :", JWT_SECRET);
    const { userName, password } = req.body;
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

    try {
      const account = await Account.findOne({ userName });
      if (!account) {
<<<<<<< HEAD
        return res.status(401).json({ error: 'Tài khoản không tồn tại' })
      }
      if (account.password !== password) {
        return res.status(402).json({ error: 'Mật khẩu không chính xác' })
      }

      // sử dụng jwt để tạo token với vai trò
      const token = jwt.sign(
        { id: account._id, role: account.role },
        JWT_SECRET,
        {
          expiresIn: '1h',
        }
      )
      console.log('Token:', token)
      // // Kiểm tra vai trò của tài khoản
      // const role = account.role
=======
        return res.status(401).json({ error: "Tài khoản không tồn tại" });
      }
      if (account.password !== password) {
        return res.status(402).json({ error: "Mật khẩu không chính xác" });
      }

      // sử dụng jwt để tạo token
      const token = jwt.sign({ id: account._id }, JWT_SECRET, {
        expiresIn: "24h",
      });
      console.log("Token:", token);
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca

      res.status(200).json({
        message: "Login successful",
        token: token,
<<<<<<< HEAD
        account: {
          id: account._id,
          userName: account.userName,
          role: account.role,
        },
      })
=======
        account: { id: account._id, userName: account.userName, role: account.role },
      });
>>>>>>> a05d443a96399c7b88f95cce1e54e526bf66d2ca
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
};

module.exports = AccountController;
