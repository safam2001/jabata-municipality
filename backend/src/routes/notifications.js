// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();

const {
  createNotification,
  getUserNotification,
  markAsRead,
  getAdminNotifications,
  getUnreadCount,
  deleteNotification,
  deleteReadNotifications,
  deleteAdminNotifications,
  deleteAllAdminNotifications,
  markAllAdminNotificationsAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
//=================
const loggerMiddleware=require("../middlewares/loggerMiddleware");

router.use(loggerMiddleware)

// ➕ إنشاء إشعار (أدمن فقط)
router.post("/", authMiddleware, adminOnly, createNotification);

// 📩 جلب إشعارات المواطن (مستخدم مسجل دخول)
router.get("/my-notifications", authMiddleware, getUserNotification);

// ✅ تحديث حالة الإشعار (مقروء) (مستخدم مسجل دخول)
router.patch("/:id/read", authMiddleware, markAsRead);
router.get(
  "/admin",
  authMiddleware,
  adminOnly,
  getAdminNotifications
);
// عدد الإشعارات غير المقروءة
// للجرس 🔔
// =========================

router.get(
"/unread-count",
authMiddleware,
getUnreadCount
);
//===========
router.delete(
  "/admin/all",
  authMiddleware,
  adminOnly,
  deleteAllAdminNotifications
);

router.delete(
  "/admin/bulk",
  authMiddleware,
  adminOnly,
  deleteAdminNotifications
);

router.patch(
  "/admin/read/all",
  authMiddleware,
  adminOnly,
  markAllAdminNotificationsAsRead
);
// حذف إشعار واحد
// =========================

router.delete(
"/:id",
authMiddleware,
deleteNotification
);



// =========================
// حذف كل الإشعارات المقروءة
// =========================

router.delete(
"/read/all",
authMiddleware,
deleteReadNotifications
);
module.exports = router;