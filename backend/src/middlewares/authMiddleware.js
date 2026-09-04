const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

// 🔐 Middleware التحقق من تسجيل الدخول (Authentication)
const authMiddleware = (req, res, next) => {

  //  جلب الهيدر Authorization من الطلب
  const authHeader = req.headers.authorization;

  //  إذا لم يتم إرسال التوكن أو الصيغة غير صحيحة
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: Token not provided"
    });
  }

  //  استخراج التوكن من الهيدر
  const token = authHeader.split(" ")[1];

  try {
    //  فك التوكن والتحقق من صحته
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("DECODED TOKEN:", decoded); // ا

    // حفظ بيانات المستخدم داخل req.user
    // مثال: { id: 1, role: "admin" }
    req.user = decoded;

    //  الانتقال إلى الراوت التالي
    next();

  } catch (err) {
    //  في حال التوكن غير صالح أو منتهي
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;