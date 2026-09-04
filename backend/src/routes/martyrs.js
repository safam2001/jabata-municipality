const express = require("express");
const router = express.Router();

const {
  getAllMartyrs,
  createMartyr,
  updateMartyrStatus,
  getMyMartyrRequests,
  getMartyrById,
  deleteMartyr
} = require("../controllers/martyrController");
const {validateMartyr}=require("../validations/martyrValidation");


const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const loggerMiddleware=require("../middlewares/loggerMiddleware");
router.use(loggerMiddleware);
//const loggerMiddleware=express.require("../middlewares/loggerMiddleware")
// جلب كل الطلبات (أدمن فقط)

router.get("/", authMiddleware, adminOnly, getAllMartyrs);
// إنشاء طلب (مستخدم مسجل دخول)

router.post("/", authMiddleware,validateMartyr, createMartyr);
// تعديل الحالة (أدمن فقط)
router.put("/:id/status", authMiddleware, adminOnly, updateMartyrStatus);

router.get("/my-requests",authMiddleware,getMyMartyrRequests);
// حذف (أدمن فقط)
router.get("/:id", authMiddleware, adminOnly, getMartyrById);
router.delete("/:id", authMiddleware, adminOnly, deleteMartyr);


module.exports = router;