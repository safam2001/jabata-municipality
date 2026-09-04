
const express = require("express");
const router = express.Router();

const {

  getComments,
  getCommentStats,

  createComment,

  updateComment,

  updateCommentStatus,

  deleteComment

} = require("../controllers/commentController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const loggerMiddleware = require("../middlewares/loggerMiddleware");

router.use(loggerMiddleware);

// ==========================
// Public
// ==========================

// جميع التعليقات
router.get("/", getComments);

// إحصائيات التعليقات (للأدمن)
router.get(
  "/stats",
  authMiddleware,
  adminOnly,
  getCommentStats
);

// ==========================
// User
// ==========================

// إضافة تعليق
router.post(
  "/",
  authMiddleware,
  createComment
);

// تعديل تعليق
router.put(
  "/:id",
  authMiddleware,
  updateComment
);

// ==========================
// Admin
// ==========================

// تغيير حالة التعليق
router.patch(
  "/:id/status",
  authMiddleware,
  adminOnly,
  updateCommentStatus
);

// حذف تعليق
router.delete(
  "/:id",
  authMiddleware,
  deleteComment
);

module.exports = router;