
const express = require("express");
const router = express.Router();
const logMiddleware = require("../middlewares/loggerMiddleware");

// طبق الـ Middleware على كل المسارات داخل هذا الراوتر
router.use(logMiddleware);

// مثال لمسارات تجريبية
router.get("/test", (req, res) => {
  res.send("Log middleware works!");
});

module.exports = router;