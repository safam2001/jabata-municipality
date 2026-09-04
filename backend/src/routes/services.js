
const express = require("express");
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  getServiceById,
  deleteService,

} = require("../controllers/serviceController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
//===========================
const loggerMiddleware=require("../middlewares/loggerMiddleware");

//  جلب الخدمات (مفتوح للجميع)
router.get("/", loggerMiddleware,getServices);

//  إضافة خدمة (أدمن فقط)
router.post("/", authMiddleware, loggerMiddleware,adminOnly, createService);

//  تعديل خدمة (أدمن فقط)
router.put("/:id", authMiddleware,loggerMiddleware, adminOnly, updateService);

router.get("/:id", getServiceById);
//  حذف خدمة (أدمن فقط)
router.delete("/:id", authMiddleware,loggerMiddleware, adminOnly, deleteService);



module.exports = router;