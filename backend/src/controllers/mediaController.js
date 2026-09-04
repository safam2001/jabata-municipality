
const Media = require("../models/media");
const News = require("../models/news");
const Village = require("../models/village");
const User = require("../models/user");
const logger = require("../logger");


// =========================
// جلب جميع الوسائط
// =========================
const getMedia = async (req, res) => {
  try {

  const media = await Media.findAll({
    where:{
   status:"active"
 },
  include: [
    {
      model: News,
      as: "news",
      attributes: ["id", "title"]
    },
    {
      model: Village,
      as: "village",
      attributes: ["id", "name"]
    },
    {
      model: User,
      as: "uploadedBy",
      attributes: ["id", "firstName", "lastName"]
    }
  ],
  order: [["createdAt", "DESC"]]
});

    res.status(200).json(media);

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};


// =========================
// رفع وسيط جديد


const createMedia = async (req, res) => {
  try {
    const { title, description, news_id, village_id } = req.body;
 console.log("BODY:",req.body);
 console.log("files",req.files)
    // التحقق من وجود ملفات
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Files are required"
      });
    }

    const medias = [];

    for (let file of req.files) {
      // تحديد نوع الملف
      let type = "document";
      if (file.mimetype.startsWith("image/")) {
        type = "image";
      } else if (file.mimetype.startsWith("video/")) {
        type = "video";
      }

      const media = await Media.create({
      title: title || file.originalname,
       description: description || null,
        file_name: file.filename,
        // file_path: file.path,
        file_path: file.path.replace(/\\/g, "/"),
        type,
        size: file.size,
        news_id: news_id || null,
        village_id: village_id || null,
        admin_id: req.user.id
      });

      medias.push(media);
    }

    logger.info(`Admin ${req.user.id} uploaded ${medias.length} media files`);

    res.status(201).json({
      message: "Media uploaded successfully",
      medias
    });

  } catch (err) {
    logger.error(err.message);
    res.status(500).json({
      message: err.message
    });
  }
};

// =========================
// تعديل بيانات الوسيط
// =========================
const updateMedia = async (req, res) => {
  try {

    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        message: "Media not found"
      });
    }

    const {
      title,
      description,
      status
    } = req.body;

    if (title !== undefined) {
      media.title = title;
    }

    if (description !== undefined) {
      media.description = description;
    }

    if (status !== undefined) {
      media.status = status;
    }

    await media.save();

    logger.info(
      `Admin ${req.user.id} updated media ${media.id}`
    );

    res.status(200).json({
      message: "Media updated successfully",
      media
    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};


// =========================
// حذف وسيط
// =========================
const deleteMedia = async (req, res) => {
  try {

    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        message: "Media not found"
      });
    }

    await media.destroy();

    logger.info(
      `Admin ${req.user.id} deleted media ${media.id}`
    );

    res.status(200).json({
      message: "Media deleted successfully"
    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};


module.exports = {
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia
};