const express = require("express");

const router = express.Router();


const {
  getSiteSetting,
  createSiteSetting,
  updateSiteSetting

} = require("../controllers/siteSettingController");



const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const upload = require("../middlewares/siteSettingsUpload");



// =======================================
// Public
// جلب إعدادات الموقع
// يستخدم بالـ Navbar + Footer + Home
// =======================================

router.get(
  "/",
  getSiteSetting
);





// =======================================
// Admin
// إنشاء إعدادات الموقع لأول مرة
// =======================================
router.post(
  "/",
  authMiddleware,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "mapImage", maxCount: 1 }
  ]),
  createSiteSetting
);





// =======================================
// Admin
// تعديل إعدادات الموقع
// =======================================


router.put(
  "/",
  authMiddleware,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "mapImage", maxCount: 1 }
  ]),
  updateSiteSetting
);




module.exports = router;