const logger = require("../logger");
const SpecialNeeds = require("../models/specialNeeds");
const User = require("../models/user");
const Request =require("../models/request");
const  Notification=require("../models/notification")
// جلب جميع الطلبات (أدمن فقط)
const getAllSpecialNeeds = async (req, res) => {
  try {
    const records = await SpecialNeeds.findAll({
      include: [
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    logger.info(`Admin fetched all special needs requests`);
    res.status(200).json(records);

  } catch (err) {
    logger.error(`Error fetching special needs: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// إنشاء طلب جديد (مستخدم)
// إنشاء طلب جديد (مستخدم)
const createSpecialNeeds = async (req, res) => {
  try {
    const { full_name, national_id, birth_date, address, phone, disability_type, notes, service_id } = req.body;

    if (!full_name || !national_id || !birth_date || !address || !phone || !disability_type) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // إنشاء سجل لذوي الاحتياجات الخاصة
    const specialNeeds = await SpecialNeeds.create({
      full_name,
      national_id,
      birth_date,
      address,
      phone,
      disability_type,
      notes,
      user_id: req.user.id,
      status: "pending"
    });
  


    logger.info(`User ${req.user.id} created special needs + request: ${full_name}`);
    res.status(201).json({ message: "Special needs and request created successfully", specialNeeds, request });

  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "National ID already exists" });
    }
    logger.error(`Error creating special needs + request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// تحديث حالة الطلب (أدمن فقط)
const updateSpecialNeedsStatus = async (req, res) => {
  try {
    const specialNeeds = await SpecialNeeds.findByPk(req.params.id);

    if (!specialNeeds) {
      return res.status(404).json({ message: "Record not found" });
    }

    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    specialNeeds.status = status;
    await specialNeeds.save();


    logger.info(`Admin updated special needs ${specialNeeds.id} status to ${status}`);
    res.status(200).json({ message: "Status updated successfully", specialNeeds });

  } catch (err) {
    logger.error(`Error updating special needs status: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// جلب طلبات المستخدم الحالي
const getMySpecialNeedsRequests = async (req, res) => {
  try {
    const requests = await SpecialNeeds.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    logger.info(`User ${req.user.id} fetched all special needs requests`);
    res.status(200).json(requests);

  } catch (err) {
    logger.error(`Error fetching user special needs requests: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
const getSpecialNeedsById = async (req, res) => {
  try {
    const item = await SpecialNeeds.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Special needs record not found"
      });
    }

    res.json(item);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// حذف طلب (أدمن فقط)
const deleteSpecialNeeds = async (req, res) => {
  try {
    const specialNeeds = await SpecialNeeds.findByPk(req.params.id);

    if (!specialNeeds) {
      return res.status(404).json({ message: "Record not found" });
    }

    await specialNeeds.destroy();
    logger.info(`Admin deleted special needs ${specialNeeds.id}`);
    res.status(200).json({ message: "Record deleted successfully" });

  } catch (err) {
    logger.error(`Error deleting special needs: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSpecialNeeds,
  createSpecialNeeds,
  updateSpecialNeedsStatus,
  deleteSpecialNeeds,
  getSpecialNeedsById,
  getMySpecialNeedsRequests,
};