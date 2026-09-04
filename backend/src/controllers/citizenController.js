const Citizen = require("../models/citizen");
const User = require("../models/user");
const Request = require("../models/request");
const Notification = require("../models/notification");
const logger = require("../logger");

// 🟢 جلب كل المواطنين (أدمن)
const getAllCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    logger.info(`Admin fetched all citizens`);
    res.status(200).json(citizens);

  } catch (err) {
    logger.error(`Error fetching citizens: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 جلب مواطن واحد
const getCitizenById = async (req, res) => {
  try {
    const citizen = await Citizen.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]
        }
      ]
    });

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    logger.info(`Admin fetched citizen ${req.params.id}`);
    res.status(200).json(citizen);

  } catch (err) {
    logger.error(`Error fetching citizen: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 إنشاء مواطن جديد (مستخدم مسجل)
const createCitizen = async (req, res) => {
  try {
    const citizen = await Citizen.create({
      full_name: req.body.full_name,
      national_id: req.body.national_id,
      birth_date: req.body.birth_date,
      address: req.body.address,
      phone: req.body.phone,
      notes: req.body.notes,
      documents: req.files || null,
      user_id: req.user.id,
      status: "pending"
    });

    logger.info(`User ${req.user.id} created citizen record`);
    res.status(201).json({
      message: "Citizen created successfully",
      citizen
    });

  } catch (err) {
    logger.error(`Error creating citizen: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 تحديث حالة المواطن (أدمن)
const updateCitizenStatus = async (req, res) => {
  try {
    const citizen = await Citizen.findByPk(req.params.id);

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    const { status, admin_notes } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    citizen.status = status;
    citizen.admin_notes = admin_notes;
    await citizen.save();

    logger.info(`Admin updated citizen ${citizen.id}`);
    res.status(200).json({
      message: "Status updated successfully",
      citizen
    });

  } catch (err) {
    logger.error(`Error updating citizen status: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 جلب طلبات المواطن + المستندات (الميزة الجديدة)
const getCitizenRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: { citizen_id: req.params.id },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: Citizen, attributes: ["id", "full_name"] },
        { model: Request, attributes: ["id", "status", "admin_notes", "documents"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    logger.info(`Fetched requests for citizen ${req.params.id}`);
    res.status(200).json(requests);

  } catch (err) {
    logger.error(`Error fetching citizen requests: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 جلب طلبات المواطن (للمستخدم نفسه)
const getMyCitizenRequests = async (req, res) => {
  try {
    const citizenRequests = await Citizen.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    logger.info(`User ${req.user.id} fetched their citizen records`);
    res.status(200).json(citizenRequests);

  } catch (err) {
    logger.error(`Error fetching user citizen records: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 حذف مواطن (أدمن)
const deleteCitizen = async (req, res) => {
  try {
    const citizen = await Citizen.findByPk(req.params.id);

    if (!citizen) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    await citizen.destroy();

    logger.info(`Admin deleted citizen ${citizen.id}`);
    res.status(200).json({ message: "Citizen deleted successfully" });

  } catch (err) {
    logger.error(`Error deleting citizen: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCitizens,
  getCitizenById,
  createCitizen,
  updateCitizenStatus,
  getCitizenRequests,
  getMyCitizenRequests,
  deleteCitizen
};