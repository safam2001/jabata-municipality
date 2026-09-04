const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const { getStats } = require("../controllers/statsController");

router.get("/", authMiddleware, adminOnly, getStats);

module.exports = router;