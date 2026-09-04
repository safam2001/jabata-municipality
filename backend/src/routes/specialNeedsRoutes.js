const express = require("express");
const router = express.Router();

const {
  getAllSpecialNeeds,
  createSpecialNeeds,
  updateSpecialNeedsStatus,
   getSpecialNeedsById,
  deleteSpecialNeeds,
  getMySpecialNeedsRequests,
} = require("../controllers/specialNeedsController");
const {
  validateSpecialNeeds
} = require("../validations/specialNeedsValidation.");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const loggerMiddleware=require("../middlewares/loggerMiddleware");
router.use(loggerMiddleware)
// جلب جميع طلبات ذوي الاحتياجات الخاصة
// Admin Only

router.get("/",authMiddleware,adminOnly, getAllSpecialNeeds);



// إنشاء طلب جديد
// User & Admin (أي مستخدم مسجل دخول)
// =========================
router.post("/",authMiddleware, validateSpecialNeeds,createSpecialNeeds);

// تحديث حالة الطلب
// Admin Only
// pending | approved | rejected

router.put(  "/:id/status",authMiddleware,adminOnly,updateSpecialNeedsStatus);

router.get(
  "/my-requests",authMiddleware, getMySpecialNeedsRequests);

  router.get("/:id", authMiddleware, adminOnly, getSpecialNeedsById);
// حذف طلب
// Admin Only

router.delete("/:id",authMiddleware,adminOnly, deleteSpecialNeeds);

module.exports = router;