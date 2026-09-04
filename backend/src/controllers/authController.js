const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// إعدادات JWT
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");



// 🟢 تسجيل مستخدم جديد (Register)
// =========================
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // 🔍 التحقق من الحقول المطلوبة
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 🔍 التحقق إذا الإيميل موجود مسبقًا
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // 🔐 تشفير كلمة المرور قبل التخزين
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // 🟢 إنشاء المستخدم في قاعدة البيانات
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
            role: ["user", "admin"].includes(role) ? role : "user"
      
    });

    // 🔑 إنشاء JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 📤 إرسال الرد
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("register error:",err)
    res.status(500).json({
      message: err.message
    });
  }
};


// =========================
// 🟢 تسجيل الدخول (Login)
// =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 التحقق من الإدخال
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 🔍 البحث عن المستخدم
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 🚫 منع المستخدم المحظور
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked"
      });
    }
console.log("EMAIL:", email);
console.log("USER:", user.email);
console.log("ROLE:", user.role);
console.log("HASH:", user.password);
    // 🔐 مقارنة كلمة المرور
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = await user.comparePassword(password);
console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 🔑 إنشاء Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 📤 إرسال البيانات
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


// =========================
// 🟢 جلب بيانات المستخدم الحالي (Get Me)
// =========================
const getMe = async (req, res) => {
  try {
    // 🔐 يتم أخذ ID من التوكن (authMiddleware)
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "email", "role", "phone"]
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// =========================
// 📦 تصدير الدوال
// =========================
module.exports = {
  register,
  login,
  getMe
};