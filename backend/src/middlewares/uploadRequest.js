const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imagePath = "uploads/requests/images/";
const documentPath = "uploads/requests/documents/";

// إنشاء المجلدات إذا لم تكن موجودة
[imagePath, documentPath].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imagePath);
    } else {
      cb(null, documentPath);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",

  ".pdf",

  ".doc",
  ".docx",

  ".xls",
  ".xlsx",

  ".ppt",
  ".pptx",

  ".txt",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
});