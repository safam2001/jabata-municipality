const Service = require("../models/service");
const Town = require("../models/town");
const Village = require("../models/village");
const User = require("../models/user");

//  جلب الخدمات (مفتوح للجميع)
const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        { model: Town, attributes: ["id", "name"] },
        { model: Village, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "firstName"] }
      ]
    });



    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  إضافة خدمة (أدمن فقط)
const createService = async (req, res) => {
  try {
    const {
      title, description, type, status, link, fee, duration,
      town_id, village_id, hasRequestForm, detailsText, requestText
    } = req.body;

    const service = await Service.create({
      title,
      description,
      type,
      status: status || "active",
      link,
      fee,
      duration,
      town_id: town_id || null,
      village_id: village_id || null,
      admin_id: req.user.id,
      hasRequestForm: hasRequestForm || false,
      detailsText: detailsText || "عرض التفاصيل",
      requestText: requestText || "تقديم طلب"
    });

    res.status(201).json({
      message: "Service created successfully",
      service
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 تعديل خدمة (أدمن فقط)
const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const { title, description, type, status, icon } = req.body;

    service.title = title || service.title;
    service.description = description || service.description;
    service.type = type || service.type;
    service.status = status || service.status;
    service.icon = icon || service.icon;

    await service.save();

    res.json({
      message: "Service updated successfully",
      service
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب خدمة واحدة
const getServiceById = async (req, res) => {
  try {
   const service = await Service.findByPk(req.params.id, {
  include: [
    { model: Town, attributes: ["id", "name"] },
    { model: Village, attributes: ["id", "name"] },
    { model: User, attributes: ["id", "firstName"] }
  ]
}); // إذا كنت تستخدم Sequelize
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service", error });
  }
};

//  حذف خدمة (أدمن فقط)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.destroy();
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getServices,
  createService,
  updateService,
  getServiceById,
  deleteService,
  //  rateService
};