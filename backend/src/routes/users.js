const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  getCurrentUser,
  changePassword,
  toggleBlockUser,
  updateUserByAdmin
} = require("../controllers/userController");

const { validateUpdateUser,validateChangePassword,} = require("../validations/userValidation");
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");


// =======================
// User Self Routes

router.get("/me", authMiddleware, getCurrentUser);
router.put("/me", authMiddleware,validateUpdateUser, updateUser);
router.put("/me/change-password", authMiddleware,validateChangePassword, changePassword);


// =======================
//  Admin Routes

router.get("/", authMiddleware,adminOnly, getAllUsers);

router.post("/", authMiddleware, adminOnly, createUser);

router.get("/:id", authMiddleware, adminOnly, getUserById);

router.put("/:id", authMiddleware, adminOnly, updateUserByAdmin);

router.patch("/:id/block", authMiddleware, adminOnly, toggleBlockUser);


module.exports = router;