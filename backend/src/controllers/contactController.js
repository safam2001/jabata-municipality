const Contact = require("../models/contactMessage");

// ===============================
// إنشاء رسالة تواصل
// ===============================

const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: "new",
    });

    return res.status(201).json({
      message: "Message sent successfully",
      contact,
    });

  } catch (error) {
    console.error("Create Contact Error:", error);

    return res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};


// ===============================
// جلب جميع رسائل التواصل - Admin
// ===============================

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(contacts);

  } catch (error) {
    console.error("Get Contacts Error:", error);

    return res.status(500).json({
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
};


// ===============================
// جلب رسالة واحدة - Admin
// ===============================

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    return res.status(200).json(contact);

  } catch (error) {
    console.error("Get Contact By ID Error:", error);

    return res.status(500).json({
      message: "Failed to fetch contact message",
      error: error.message,
    });
  }
};


// ===============================
// تحديث حالة الرسالة - Admin
// ===============================

const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "read",
      "replied",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid contact status",
      });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    contact.status = status;

    await contact.save();

    return res.status(200).json({
      message: "Contact status updated successfully",
      contact,
    });

  } catch (error) {
    console.error("Update Contact Status Error:", error);

    return res.status(500).json({
      message: "Failed to update contact status",
      error: error.message,
    });
  }
};


// ===============================
// حذف رسالة - Admin
// ===============================

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    await contact.destroy();

    return res.status(200).json({
      message: "Contact message deleted successfully",
    });

  } catch (error) {
    console.error("Delete Contact Error:", error);

    return res.status(500).json({
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
};
// ===============================
// حذف رسائل التواصل المحددة - Admin
// ===============================

const deleteSelectedContacts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No contact message IDs provided",
      });
    }

    const deletedCount = await Contact.destroy({
      where: {
        id: ids,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Selected contact messages deleted successfully",
      deletedCount,
    });

  } catch (error) {
    console.error("Delete Selected Contacts Error:", error);

    return res.status(500).json({
      message: "Failed to delete selected contact messages",
      error: error.message,
    });
  }
};


// ===============================
// حذف جميع رسائل التواصل - Admin
// ===============================

const deleteAllContacts = async (req, res) => {
  try {

    const deletedCount = await Contact.destroy({
      where: {},
    });

    return res.status(200).json({
      success: true,
      message: "All contact messages deleted successfully",
      deletedCount,
    });

  } catch (error) {
    console.error("Delete All Contacts Error:", error);

    return res.status(500).json({
      message: "Failed to delete all contact messages",
      error: error.message,
    });
  }
};
const deleteContactsBulk = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No contact message IDs provided",
      });
    }

    const deletedCount = await Contact.destroy({
      where: {
        id: ids,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Selected contact messages deleted successfully",
      deletedCount,
    });

  } catch (error) {
    console.error("Bulk Delete Contact Messages Error:", error);

    return res.status(500).json({
      message: "Failed to delete contact messages",
      error: error.message,
    });
  }
};
// ===============================
// Export
// ===============================

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  deleteAllContacts,
  deleteSelectedContacts,
  deleteContactsBulk
};