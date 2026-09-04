const Village = require("../models/village");
const Town = require("../models/town");
const News = require("../models/news");
// ========================================
// جلب جميع القرى - مفتوح للجميع
// ========================================
const getVillages = async (req, res) => {
  try {
    const villages = await Village.findAll({
      include: [
        {
          model: Town,
          as: "town",
          attributes: ["id", "name"],
        },
      ],
    });

    res.json(villages);
  } catch (err) {
    console.error("========== GET VILLAGES ERROR ==========");
    console.error(err);
    console.error("MESSAGE:", err.message);
    console.error("PARENT:", err.parent);
    console.error("ORIGINAL:", err.original);
    console.error("=========================================");

    res.status(500).json({
      message: err.message,
    });
  }
};

// ========================================
// إضافة قرية - أدمن فقط
// ========================================
const createVillage = async (req, res) => {
  try {
    const {
      name,
      name_ar,
      name_en,
      description,
      description_ar,
      description_en,
      latitude,
      longitude,
      population,
      area,
      media_url,
      town_id,
    } = req.body;

    // الاسم القديم مطلوب في قاعدة البيانات
    // لذلك إذا لم يُرسل نستخدم الاسم العربي ثم الإنكليزي
    const villageName =
      name?.trim() ||
      name_ar?.trim() ||
      name_en?.trim();

    if (!villageName) {
      return res.status(400).json({
        message: "Village name is required",
      });
    }

    const village = await Village.create({
      // البيانات القديمة
      name: villageName,

      // اللغات
      name_ar: name_ar?.trim() || villageName,
      name_en: name_en?.trim() || null,

      description: description?.trim() || null,
      description_ar: description_ar?.trim() || null,
      description_en: description_en?.trim() || null,

      // الأرقام
      latitude:
        latitude === "" || latitude == null
          ? null
          : Number(latitude),

      longitude:
        longitude === "" || longitude == null
          ? null
          : Number(longitude),

      population:
        population === "" || population == null
          ? null
          : Number(population),

      area:
        area === "" || area == null
          ? null
          : Number(area),

      media_url: media_url?.trim() || null,

      town_id:
        town_id === "" || town_id == null
          ? null
          : Number(town_id),
    });

    res.status(201).json({
      message: "Village created successfully",
      village,
    });

  } catch (err) {
    console.error("========== CREATE VILLAGE ERROR ==========");
    console.error(err);
    console.error("MESSAGE:", err.message);
    console.error("PARENT:", err.parent);
    console.error("ORIGINAL:", err.original);
    console.error("==========================================");

    res.status(500).json({
      message: err.message,
    });
  }
};

const getVillageById = async (req, res) => {
  try {
    const village = await Village.findByPk(req.params.id, {
      include: [
        {
          model: Town,
          as: "town",
          attributes: ["id", "name"],
        },
        {
          model: News,
          as: "news",
          where: {
            status: "published",
          },
          required: false,
          order: [["published_at", "DESC"]],
        },
      ],
    });

    if (!village) {
      return res.status(404).json({
        message: "Village not found",
      });
    }

    res.json(village);

  } catch (err) {
    console.error("========== GET VILLAGE ERROR ==========");
    console.error(err);
    console.error("MESSAGE:", err.message);
    console.error("PARENT:", err.parent);
    console.error("ORIGINAL:", err.original);
    console.error("=========================================");

    res.status(500).json({
      message: err.message,
    });
  }
};
// ========================================
// تعديل قرية - أدمن فقط
// ========================================
const updateVillage = async (req, res) => {
  try {
    const village = await Village.findByPk(req.params.id);

    if (!village) {
      return res.status(404).json({
        message: "Village not found",
      });
    }

    const {
      name,
      name_ar,
      name_en,
      description,
      description_ar,
      description_en,
      latitude,
      longitude,
      population,
      area,
      media_url,
      town_id,
    } = req.body;

    // البيانات القديمة
    village.name = name ?? village.name;
    village.description =
      description ?? village.description;

    // العربي والإنكليزي
    village.name_ar =
      name_ar ?? village.name_ar;

    village.name_en =
      name_en ?? village.name_en;

    village.description_ar =
      description_ar ?? village.description_ar;

    village.description_en =
      description_en ?? village.description_en;

    // باقي البيانات
    village.latitude =
      latitude ?? village.latitude;

    village.longitude =
      longitude ?? village.longitude;

    village.population =
      population ?? village.population;

    village.area =
      area ?? village.area;

    village.media_url =
      media_url ?? village.media_url;

    village.town_id =
      town_id === "" || town_id == null
        ? null
        : Number(town_id);

    await village.save();

    res.json({
      message: "Village updated successfully",
      village,
    });
  } catch (err) {
    console.error("========== UPDATE VILLAGE ERROR ==========");
    console.error(err);
    console.error("MESSAGE:", err.message);
    console.error("PARENT:", err.parent);
    console.error("ORIGINAL:", err.original);
    console.error("==========================================");

    res.status(500).json({
      message: err.message,
    });
  }
};

// ========================================
// حذف قرية - أدمن فقط
// ========================================
const deleteVillage = async (req, res) => {
  try {
    const village = await Village.findByPk(req.params.id);

    if (!village) {
      return res.status(404).json({
        message: "Village not found",
      });
    }

    await village.destroy();

    res.json({
      message: "Village deleted successfully",
    });
  } catch (err) {
    console.error("========== DELETE VILLAGE ERROR ==========");
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ========================================
// Export
// ========================================
module.exports = {
  getVillages,
  createVillage,
  getVillageById,
  updateVillage,
  deleteVillage,
};