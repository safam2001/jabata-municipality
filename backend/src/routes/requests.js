
const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  getMyRequests,
   getMyRequestById,
   deleteSelectedRequests,

  deleteRequest
} = require("../controllers/requestController");
const {validateBasicRequest}=require("../validations/basicRequestValidation");
const uploadRequest=require("../middlewares/uploadRequest")
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const loggerMiddleware = require("../middlewares/loggerMiddleware");

// 🟢 تفعيل اللوجر على كل الراوتس

// 🟢 إضافة طلب جديد (مواطن مسجل دخول)
router.post("/", authMiddleware,uploadRequest.array("documents"), validateBasicRequest,createRequest);

// 🟢 جلب كل الطلبات (أدمن فقط)
router.get("/", authMiddleware, adminOnly, getRequests);
router.get("/my-requests",authMiddleware,getMyRequests);
// 🟢 جلب طلب واحد (أدمن فقط)
router.get("/:id", authMiddleware, adminOnly, getRequestById);
router.get(
 "/my-requests/:id",
 authMiddleware,
 getMyRequestById
);

// 🟢 تحديث حالة الطلب (أدمن فقط)
router.put("/:id/status", authMiddleware, adminOnly, updateRequestStatus);

// 🟢 حذف عدة طلبات دفعة واحدة (أدمن فقط)
router.delete(
  "/bulk-delete",
  authMiddleware,
  adminOnly,
  deleteSelectedRequests
);
// 🟢 حذف طلب (أدمن فقط)
router.delete("/:id", authMiddleware, adminOnly, deleteRequest);

module.exports = router;