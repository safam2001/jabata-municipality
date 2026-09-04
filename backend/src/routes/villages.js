const express = require("express");
const router =express.Router();
const{
    getVillages,
    createVillage,
    getVillageById,
    updateVillage,
    deleteVillage,
}=require("../controllers/villageController");

const authMiddleware=require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

//جلب القرى مفتوح للجميع
router.get("/",getVillages);
router.get("/:id", getVillageById);
//اضافه/ تعديل/ حدف ))ادمن فقط
router.post("/",authMiddleware,adminOnly,createVillage);
router.put("/:id",authMiddleware,adminOnly,updateVillage);
router.delete("/:id",authMiddleware,adminOnly,deleteVillage)

module.exports = router;