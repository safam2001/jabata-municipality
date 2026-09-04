const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");

router.post("/", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    fileUrl: `/uploads/${req.file.filename}`
  });
});

module.exports = router;