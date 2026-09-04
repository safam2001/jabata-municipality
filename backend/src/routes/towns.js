const express = require("express");
const router = express.Router();
const {
  getTowns,
  createTown,
  updateTown,
  deleteTown
} = require("../controllers/townController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

// جلب البلدة (مفتوح للجميع)
router.get("/", getTowns);

// إضافة / تعديل / حذف (أدمن فقط)
router.post("/", authMiddleware, adminOnly, createTown);
router.put("/:id", authMiddleware, adminOnly, updateTown);
router.delete("/:id", authMiddleware, adminOnly, deleteTown);

module.exports = router;