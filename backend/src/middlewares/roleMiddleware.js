
//  Middleware للتحقق من الصلاحيات 
// دالة عامة تستقبل الدور المطلوب
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {

    // 🔐 التأكد أن المستخدم مسجل دخول
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // 🚫 التحقق من الدور
    if (!req.user.role?.includes(requiredRole)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${requiredRole}`
      });
    }

    // ➡️ السماح بالوصول
    next();
  };
};
//  صلاحيات جاهزة للاستخدام


//  فقط الأدمن
const adminOnly = roleMiddleware("admin");

//  فقط المستخدم العادي
const userOnly = roleMiddleware("user");

module.exports = {
  roleMiddleware,
  adminOnly,
  userOnly
};