const express = require("express");
const router = express.Router();

const {
  getAllServiceTypes,
  getServiceTypeById,
getServiceTypePublic,
  createServiceType,
  updateServiceType,
  getServiceTypesByService,
  deleteServiceType,
  
} = require("../controllers/serviceTypeController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");


// ======================
// Public Routes (الموقع)
// ======================

// جميع أنواع خدمة معينة
router.get("/service/:serviceId", getServiceTypesByService);

// تفاصيل نوع خدمة
router.get("/public/:id", getServiceTypePublic);


// ======================
// Admin Routes (لوحة التحكم)
// ======================

// جميع الأنواع
router.get(
  "/",
  authMiddleware,
  adminOnly,
  getAllServiceTypes
);

// نوع واحد
router.get(
  "/:id",
  authMiddleware,
  adminOnly,
  getServiceTypeById
);

// إضافة
router.post(
  "/",
  authMiddleware,
  adminOnly,
  createServiceType
);

// تعديل
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateServiceType
);

// حذف
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteServiceType
);

module.exports = router;