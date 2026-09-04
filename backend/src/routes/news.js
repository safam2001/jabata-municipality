

const express = require("express");
const router = express.Router();
const {
  getNews,
    getDraftNews,
  getNewsById,
  createNews,
  updateNews,

  deleteNews
} = require("../controllers/newsController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

// 🟢 جلب الأخبار (مفتوح للجميع)
router.get("/", getNews);
router.get("/drafts",authMiddleware, adminOnly, getDraftNews);

router.get("/:id", getNewsById);
// 🟢 إضافة خبر (أدمن فقط)
router.post("/", authMiddleware, adminOnly, createNews);

// 🟢 تعديل خبر (أدمن فقط)
router.put("/:id", authMiddleware, adminOnly, updateNews);

// 🟢 حذف خبر (أدمن فقط)
router.delete("/:id", authMiddleware, adminOnly, deleteNews);

module.exports = router;