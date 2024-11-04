const express = require("express");
const router = express.Router();

const AccountController = require("../app/controllers/AccountController");
const authenticateToken = require("../app/middleware/AuthenticateToken");

router.get("/getAllAccounts", authenticateToken, AccountController.getAllAccounts);
router.post("/login", AccountController.login);
router.post("/findAccountById", authenticateToken, AccountController.findAccountById);
router.post("/refreshToken", AccountController.refreshToken);
router.post("/changePassword", authenticateToken, AccountController.changePassword);
router.post("/verifyAccessToken", AccountController.verifyAccessToken);

module.exports = router;
