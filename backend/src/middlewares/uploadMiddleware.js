
const multer = require("multer");
const path = require("path");


// مكان حفظ الملفات
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },


  filename: (req, file, cb) => {

    const fileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 100000) +
      path.extname(file.originalname).toLowerCase();


    cb(null, fileName);

  }

});


// أنواع الملفات المسموحة
const fileFilter = (req, file, cb) => {

  const allowedTypes = [

    // صور
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",

    // فيديو
    ".mp4",
    ".webm",
    ".mov",

    // ملفات
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx"

  ];


  const ext =
    path.extname(file.originalname).toLowerCase();


  if (allowedTypes.includes(ext)) {

    cb(null, true);

  } else {

    cb(
      new Error("نوع الملف غير مدعوم"),
      false
    );

  }

};



// إعدادات الرفع
const upload = multer({

  storage,

  fileFilter,

  limits: {

    // الحد الأقصى 100 ميغا
    fileSize: 100 * 1024 * 1024

  }

});


module.exports = upload;