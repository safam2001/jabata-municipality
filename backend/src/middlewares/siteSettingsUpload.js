const multer = require("multer");
const path = require("path");
const fs = require("fs");

const logoPath = "uploads/site-settings/logo/";
const mapPath = "uploads/site-settings/map/";

[logoPath, mapPath].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") {
      cb(null, logoPath);
    } else if (file.fieldname === "mapImage") {
      cb(null, mapPath);
    } else {
      cb(new Error("Unsupported image field"));
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

const fileFilter = (req, file, cb) => {
  const allowed = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const ext = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported image type"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});