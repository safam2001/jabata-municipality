const Martyr = require("../models/martyr");
const User = require("../models/user");
const logger=require("../logger");
const { request } = require("express");


// =========================
// جلب كل السجلات (أدمن فقط)
// =========================
const getAllMartyrs = async (req, res) => {
  try {
    const martyrs = await Martyr.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
//سجل العمليه
logger.info(`Admin fetched all martyrs`)
    res.status(200).json(martyrs);

  } catch (err) {
    logger.error(`Error fetching martyrs: ${err.message}`)
    res.status(500).json({ message: err.message });
  }
};


// =========================
// إنشاء طلب شهيد (مستخدم عادي)
// =========================


// إنشاء سجل شهيد + طلب خدمة
const createMartyr = async (req, res) => {
  try {
    const { full_name, national_id, birth_date, death_date, phone, address, notes, service_id } = req.body;

    // إنشاء سجل شهيد
    const martyr = await Martyr.create({
      full_name,
      national_id,
      birth_date,
      death_date,
      address,
      phone,
      notes,
      user_id: req.user.id,
      status: "pending",
    
    
    });

 

    logger.info(`User ${req.user.id} created martyr + request: ${full_name}`);

    res.status(201).json({
      message: "Martyr and request created successfully",
      martyr,
      request
    });
  } catch (err) {
    logger.error(`Error creating martyr + request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};


// تحديث الحالة (أدمن فقط)
const updateMartyrStatus = async (req, res) => {
  try {
    const martyr = await Martyr.findByPk(req.params.id);

    if (!martyr) {
      return res.status(404).json({ message: "Martyr not found" });
    }

    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    martyr.status = status;
    await martyr.save();

logger.info(`Admin updated martyr ${martyr.id} status  to ${status}`);
    res.status(200).json({
      message: "Status updated successfully",
      martyr
    });

  } catch (err) {
     logger.error(`Error updating martyr status :${err.message}`)
    res.status(500).json({ message: err.message });
  }
};
// =========================

const getMyMartyrRequests = async (req, res) => {
  try {
    const martyrRequests = await Martyr.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });
  logger.info(`User ${req.user.id}fetched their martyr requests`)
    res.status(200).json(martyrRequests);
 
  } catch (err) {
     logger.error(`Error fetching usermartyr requests:${err.message}`)
    res.status(500).json({
      message: err.message,
    });
  }
};
const getMartyrById = async (req, res) => {
  try {
    const martyr = await Martyr.findByPk(req.params.id);

    if (!martyr) {
      return res.status(404).json({
        message: "Martyr not found"
      });
    }

    res.json(martyr);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
// حذف سجل (أدمن فقط)
// =========================
const deleteMartyr = async (req, res) => {
  try {
    const martyr = await Martyr.findByPk(req.params.id);

    if (!martyr) {
      return res.status(404).json({ message: "Martyr not found" });
    }

    await martyr.destroy();
   logger.info(`Admin deleted martyr ${martyr.id}`)
    res.status(200).json({
      message: "Martyr deleted successfully" });

  } catch (err) {
    logger.error(`Error deleting martyr: ${err.message}`)
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getAllMartyrs,
  createMartyr,
  updateMartyrStatus,
  getMyMartyrRequests,
  getMartyrById,
  deleteMartyr
};