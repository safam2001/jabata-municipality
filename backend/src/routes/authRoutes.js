const express = require("express");
const router = express.Router();

// 🔐 استيراد الكونترولر
const {
  register,
  login,
  getMe
} = require("../controllers/authController");
const {validateRegister,validateLogin} = require("../validations/authValidation");
// 🔐 Middleware التحقق من التوكن
const authMiddleware = require("../middlewares/authMiddleware");


// =========================
// 🟢 AUTH ROUTES

// 🟢 تسجيل مستخدم جديد
router.post("/register",validateRegister, register);


// 🟢 تسجيل الدخول
router.post("/login", validateLogin, login);


// 🟢 جلب بيانات المستخدم الحالي (يتطلب تسجيل دخول)
router.get("/me", authMiddleware, getMe);

// 📦 تصدير الراوتر
module.exports = router;