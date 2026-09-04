const express = require("express");
const router = express.Router();

const {
  getAbout,
  getAboutAdmin,
  updateAbout,
  createAbout,
  updateAboutStatus,
  deleteAbout,
} = require("../controllers/aboutController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

// =====================================================
// PUBLIC
// =====================================================

router.get(
  "/",
  getAbout
);

// =====================================================
// ADMIN
// =====================================================

// Get About for Admin
router.get(
  "/admin",
  authMiddleware,
  adminOnly,
  getAboutAdmin
);

// Create About
router.post(
  "/",
  authMiddleware,
  adminOnly,
  createAbout
);

// Update About
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateAbout
);

// Update About Status
router.put(
  "/:id/status",
  authMiddleware,
  adminOnly,
  updateAboutStatus
);

// Delete About
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteAbout
);

module.exports = router;