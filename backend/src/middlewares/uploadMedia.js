
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imagePath = "uploads/news/images/";
const videoPath = "uploads/news/videos/";
const documentPath = "uploads/news/documents/";

// إنشاء المجلدات
[imagePath, videoPath, documentPath].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

      cb(null, imagePath);

    } else if (file.mimetype.startsWith("video/")) {

      cb(null, videoPath);

    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {

      cb(null, documentPath);

    } else {

      cb(new Error("Unsupported media type"));
    }
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  }
});


const fileFilter = (req, file, cb) => {

  console.log("UPLOAD FILE:", {
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  const allowedExtensions = [
    // Images
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",

    // Videos
    ".mp4",
    ".webm",
    ".mov",

    // Documents
    ".pdf",
    ".doc",
    ".docx"
  ];

  const ext = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowedExtensions.includes(ext)) {

    cb(null, true);

  } else {

    console.log("REJECTED FILE:", {
      name: file.originalname,
      ext: ext,
      mimetype: file.mimetype
    });

    cb(new Error("Unsupported media type"), false);
  }
};


module.exports = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024
  }

});