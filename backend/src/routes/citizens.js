const express = require("express");
const router = express.Router();

const {
  getAllCitizens,
  getCitizenById,
  createCitizen,
  updateCitizenStatus,
  getMyCitizenRequests,
  deleteCitizen
} = require("../controllers/citizenController");
const {
  validateCitizen
} = require("../validations/citizenValidation");
const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const loggerMiddleware=require("../middlewares/loggerMiddleware");

// router.use(loggerMiddleware);
// جلب كل المواطنين (أدمن فقط)
router.get("/", authMiddleware,loggerMiddleware, adminOnly, getAllCitizens);

// جلب مواطن واحد (أدمن فقط)

router.get("/:id", authMiddleware,loggerMiddleware, adminOnly, getCitizenById);

// إنشاء مواطن (مستخدم مسجل)

router.post("/", authMiddleware,loggerMiddleware,validateCitizen, createCitizen);

// تحديث الحالة (أدمن فقط)

router.put("/:id/status", authMiddleware,loggerMiddleware, adminOnly, updateCitizenStatus);

router.get( "/my-requests", authMiddleware,loggerMiddleware, getMyCitizenRequests);



router.delete("/:id", authMiddleware, adminOnly, deleteCitizen);


module.exports = router;