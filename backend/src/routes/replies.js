const express = require("express");
const router = express.Router();


const {
getReplies,
createReply,
getRepliesByComment,
getReplyStats,
updateReply,
updateReplyStatus,
deleteReply
}=require("../controllers/replyController");
const authMiddleware =require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const loggerMiddleware = require("../middlewares/loggerMiddleware");
router.use(loggerMiddleware);


// جلب الردود
router.get("/",getReplies);

// ردود تعليق معين
router.get("/comment/:commentId",getRepliesByComment);

// إحصائيات الردود
router.get("/stats",authMiddleware,adminOnly,  getReplyStats);
// إضافة رد
router.post("/",authMiddleware,createReply);


// تعديل رد (صاحب الرد أو الأدمن)
router.put(
"/:id",
authMiddleware,
updateReply
);


// =======================
// Admin
// =======================

// تغيير حالة الرد
router.patch(
  "/:id/status",
  authMiddleware,
  adminOnly,
  updateReplyStatus
);


// حذف رد (صاحب الرد أو الأدمن)
router.delete(
"/:id",
authMiddleware,
deleteReply
);


module.exports = router;