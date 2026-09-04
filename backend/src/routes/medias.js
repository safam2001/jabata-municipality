
const express = require("express");
const router = express.Router();

const {
getMedia,
createMedia,
updateMedia,
deleteMedia
}=require("../controllers/mediaController");

const authMiddleware = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

// const upload = require("../middlewares/upload");
const uploadMedia=require("../middlewares/uploadMedia")


// عرض الوسائط
router.get("/", getMedia);


// رفع عدة ملفات
router.post(
"/",
authMiddleware,
adminOnly,
uploadMedia.array("files",10),
createMedia
);


// تعديل
router.put(
"/:id",
authMiddleware,
adminOnly,
updateMedia
);


// حذف
router.delete(
"/:id",
authMiddleware,
adminOnly,
deleteMedia
);


module.exports=router;