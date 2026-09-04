const ServiceType = require("../models/serviceType");
const Service = require("../models/service");

// جميع الأنواع
const getAllServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.findAll({
      include: [{
        model: Service,
        attributes: ["id", "title"],
      }],
      order: [["createdAt", "DESC"]],
    });

    res.json(serviceTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// نوع واحد
const getServiceTypeById = async (req, res) => {
  try {
    const serviceType = await ServiceType.findByPk(req.params.id, {
      include: Service,
    });

    if (!serviceType) {
      return res.status(404).json({ message: "Service Type not found" });
    }

    res.json(serviceType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getServiceTypePublic = async (req, res) => {
  try {
    const serviceType = await ServiceType.findByPk(req.params.id, {
      include: [
        {
          model: Service,
          attributes: ["id", "title"],
        },
      ],
    });

    if (!serviceType) {
      return res.status(404).json({ message: "Service Type not found" });
    }

    res.json({
      id: serviceType.id,
      service_id: serviceType.service_id,
      title: serviceType.title,
      description: serviceType.description,
      requirements: serviceType.requirements,
      fee: serviceType.fee,
      link: serviceType.link,
      hasRequestForm: serviceType.hasRequestForm,

      // أضيفي هذا السطر
      person_type: serviceType.person_type,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// إضافة
const createServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.create(req.body);
    res.status(201).json(serviceType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // تعديل
// const updateServiceType = async (req, res) => {
//   try {
//     const serviceType = await ServiceType.findByPk(req.params.id);

//     if (!serviceType) {
//       return res.status(404).json({ message: "Service Type not found" });
//     }

//     await serviceType.update(req.body);

//     res.json(serviceType);
//     } catch (err) {
//   console.log(err);
// //   console.log(err.message);
// //   console.log(err.parent);

//   res.status(500).json({
//     message: err.message,
//     error: err.parent?.sqlMessage 
//   });
// }
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// };
const updateServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findByPk(req.params.id);

    if (!serviceType) {
      return res.status(404).json({
        message: "Service Type not found",
      });
    }

    if (req.body.fee === "") {
      req.body.fee = null;
    }

    await serviceType.update(req.body);

    res.json(serviceType);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
const getServiceTypesByService = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.findAll({
      where: {
        service_id: req.params.serviceId,
        status: "active",
      },
      include: [
        {
          model: Service,
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(serviceTypes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// حذف
const deleteServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findByPk(req.params.id);

    if (!serviceType) {
      return res.status(404).json({ message: "Service Type not found" });
    }

    await serviceType.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllServiceTypes,
  getServiceTypeById,
getServiceTypePublic,
  createServiceType,
  updateServiceType,
  getServiceTypesByService,
  deleteServiceType,
};