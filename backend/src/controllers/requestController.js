
const Request = require("../models/request");
const Citizen = require("../models/citizen");
const Martyr = require("../models/martyr");
const SpecialNeeds = require("../models/specialNeeds");
const Service = require("../models/service");
const ServiceType = require("../models/serviceType");
const Notification = require("../models/notification");
const logger = require("../logger");

// 🟢 إنشاء طلب جديد
const createRequest = async (req, res) => {
  try {
    const {
      type,
      full_name,
      national_id,
      birth_date,
      address,
      phone,
      notes,
      death_date,        
      disability_type,
      service_id,
      service_type_id
    } = req.body;

    let citizen_id = null;
    let martyr_id = null;
    let specialNeeds_id = null;

    if (type === "citizen") {
      const citizen = await Citizen.create({
        full_name,
        national_id,
        birth_date,
        address,
        phone,
        notes,
        user_id: req.user.id
      });
      citizen_id = citizen.id;
    }

    if (type === "martyr") {

      const martyr = await Martyr.create({
        full_name,
        national_id,
        birth_date,
        death_date,   // ✔ يطابق العمود والفرونت
        address,
        phone,
        notes,
        user_id: req.user.id
      });
      martyr_id = martyr.id;
    }

    if (type === "specialNeeds") {
      const specialNeeds = await SpecialNeeds.create({
        full_name,
        national_id,
        birth_date,
        address,
        phone,
        disability_type,
        notes,
        user_id: req.user.id
      });
      specialNeeds_id = specialNeeds.id;
    }
console.log("req.user =", req.user);
console.log("req.user.id =", req.user?.id);
    const request = await Request.create({
        user_id: req.user.id,
        full_name,
        national_id,
        phone,
        address,
       
        
      citizen_id,
      martyr_id,
      specialNeeds_id,
      service_id,
      service_type_id,
      notes,
      documents: req.files || null,
      status: "pending"
    });
    // ربط الطلب بالمواطن
if (citizen_id) {
  await Citizen.update(
    { request_id: request.id },
    { where: { id: citizen_id } }
  );
}

// ربط الطلب بالشهيد
if (martyr_id) {
  await Martyr.update(
    { request_id: request.id },
    { where: { id: martyr_id } }
  );
}

// ربط الطلب بذوي الاحتياجات
if (specialNeeds_id) {
  await SpecialNeeds.update(
    { request_id: request.id },
    { where: { id: specialNeeds_id } }
  );
}
  

await Notification.create({
  userId: null,
requestId: request.id,
  target: "admin",
  message: `New ${type} request submitted by ${full_name}`,
  status: "unread",
  type: "new_request"
});
logger.info(`New ${type} request notification sent to admin`);
 res.status(201).json({
      message: "Request created successfully",
      request
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 🟢 جلب كل الطلبات (أدمن)
const getRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: Citizen, attributes: ["id", "full_name", "national_id"] },
        { model: Martyr, attributes: ["id", "full_name", "national_id"] },
        { model: SpecialNeeds, attributes: ["id", "full_name", "national_id"] },
        { model: Service, attributes: ["id", "title"] },
        { model: ServiceType, attributes: ["id", "title", "fee"] }
      ],
      order: [["createdAt", "DESC"]]
    });
    console.log(requests)
    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 جلب طلب واحد
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id, {
      include: [
        { model: Citizen, attributes: ["id", "full_name", "national_id"] },
        { model: Martyr, attributes: ["id", "full_name", "national_id"] },
        { model: SpecialNeeds, attributes: ["id", "full_name", "national_id"] },
        { model: Service, attributes: ["id", "title"] },
        { model: ServiceType, attributes: ["id", "title", "fee"] }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateRequestStatus = async (req, res) => {
  try {
    const { status, admin_notes } = req.body;

    const request = await Request.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
console.log("status =", status);
    // تحديث الطلب
    request.status = status;
    request.admin_notes = admin_notes;
    await request.save();
console.log("citizen_id =", request.citizen_id);
    // تحديث المواطن
    if (request.citizen_id) {
      await Citizen.update(
        {
          status,
          admin_notes,
        },
        {
          where: { id: request.citizen_id },
        }
      );
    }
console.log("martyr_id =", request.martyr_id);
    // تحديث الشهيد
    if (request.martyr_id) {
      await Martyr.update(
        {
          status,
          admin_notes,
        },
        {
          where: { id: request.martyr_id },
        }
      );
    }

console.log("specialNeeds_id =", request.specialNeeds_id);
    // تحديث ذوي الاحتياجات
    if (request.specialNeeds_id) {
      await SpecialNeeds.update(
        {
          status,
          admin_notes,
        },
        {
          where: { id: request.specialNeeds_id },
        }
      );
    }
     console.log("request.user_id",request.user_id)
    // إرسال إشعار للمستخدم
await Notification.create({
  userId: request.user_id,
  requestId: request.id,
  target: "user",
  message: `Your request has been ${status}`,
  status: "unread",
  type: "request_status"
});
logger.info(`Notification sent to user ${request.user_id} about request ${request.id}`);
    return res.json({
      message: "Request updated successfully",
      request,
    });

  } catch (err) {
  console.log(err);
  console.log(err.message);
  res.status(500).json({ message: err.message });
}
};
const getMyRequests=async(req,res)=>{
  const userId=req.user.id;
  try{
//     console.log("req.user =", req.user);
// console.log("userId =", userId);
// console.log("وصلت إلى getMyRequests");
 const requests=await Request.findAll({
    where:{
      user_id:userId
    },
         include: [
        { model: Citizen, attributes: ["id", "full_name", "national_id"] },
        { model: Martyr, attributes: ["id", "full_name", "national_id"] },
        { model: SpecialNeeds, attributes: ["id", "full_name", "national_id"] },
        { model: Service, attributes: ["id", "title"] },
        { model: ServiceType, attributes: ["id", "title", "fee"] }
      ],
    order: [["createdAt", "DESC"]],
    });

    res.json(requests);
    
 
  }catch(err){
res.status(500).json({
      message: err.message,
 
 
})
  }};
  // 🟢 جلب طلب واحد للمستخدم نفسه
const getMyRequestById = async (req, res) => {

  try {

    const userId = req.user.id;

    const request = await Request.findOne({

      where: {
        id: req.params.id,
        user_id: userId
      },

      include: [

        {
          model: Citizen,
          attributes: [  "id", "full_name", "national_id"]
        },

        {
          model: Martyr,
          attributes: [ "id",  "full_name", "national_id"]
        },

        {
          model: SpecialNeeds,
          attributes: [ "id", "full_name",  "national_id" ]
        },

        {
          model: Service,
          attributes: [  "id", "title" ]
        },

        {
          model: ServiceType,
          attributes: [   "id",   "title", "fee"]
        }

      ]

    });
    if (!request) {

      return res.status(404).json({

        message:"Request not found"

      });
    }

    res.json(request);

  } catch(err) {
    console.log(err);
    res.status(500).json({  message:err.message  });
  }

};
// 🟢 حذف عدة طلبات دفعة واحدة (أدمن فقط)
const deleteSelectedRequests = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No requests selected",
      });
    }

    await Request.destroy({
      where: {
        id: ids,
      },
    });

    res.json({
      message: "Selected requests deleted successfully",
    });

  } catch (err) {
    console.error("Delete Selected Requests Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
// 🟢 حذف طلب
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await request.destroy();

    res.json({ message: "Request deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
   getMyRequests,
   getMyRequestById,

  deleteRequest,
  deleteSelectedRequests
};