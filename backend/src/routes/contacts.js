const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  deleteSelectedContacts,
  deleteAllContacts,
  deleteContactsBulk
} = require("../controllers/contactController");



const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
// =====================================
// Public
// إرسال رسالة من صفحة Contact Us
// =====================================

router.post("/", createContact);


// =====================================
// Admin
// إدارة رسائل التواصل
// =====================================

// جلب جميع الرسائل
router.get("/",authMiddleware,adminOnly, getAllContacts);

// جلب رسالة واحدة
router.get("/:id",authMiddleware,adminOnly, getContactById);

// تغيير حالة الرسالة
router.put("/:id/status",authMiddleware, adminOnly,updateContactStatus);
// حذف الرسائل المحددة
router.delete(
  "/admin/bulk",
  authMiddleware,
  adminOnly,
  deleteSelectedContacts
);
router.delete(
  "/bulk",
  authMiddleware,
  adminOnly,
  deleteContactsBulk
);
// حذف جميع الرسائل
router.delete(
  "/admin/all",
  authMiddleware,
  adminOnly,
  deleteAllContacts
);
// حذف الرسالة
router.delete("/:id",authMiddleware,adminOnly, deleteContact);


module.exports = router;