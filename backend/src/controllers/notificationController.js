const Notification = require("../models/notification");
const logger = require("../logger");

// 🟢 إنشاء إشعار جديد
const createNotification = async (req,res)=>{
try{

const {
userId,
message,
target,
type
}=req.body;


const notification = await Notification.create({

userId:userId || null,

message,

target:target || "user",

type:type || "general",

status:"unread"

});


logger.info(
`Notification created ${notification.id}`
);


res.status(201).json({
success:true,
notification
});


}catch(error){

logger.error(error.message);

res.status(500).json({
message:error.message
});

}

};
// 🟢 جلب إشعارات المستخدم
const getUserNotification = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId ,target:"user"},
      order: [["createdAt", "DESC"]]
    });
  logger.info(`User ${userId} fetched notifications`);
    res.status(200).json(notifications);
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 تحديث حالة الإشعار إلى read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.status = "read";
    await notification.save();
   
    logger.info(`Notification ${id} marked as read`);
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    logger.error(`Error marking notification as read: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
const getAdminNotifications = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const notifications = await Notification.findAll({
      where: {
        target: "admin"
      },
      order: [
        ["createdAt", "DESC"]
      ]
    });

    logger.info(
      `Admin ${req.user.id} fetched notifications`
    );

    res.json(notifications);

  } catch (err) {

    logger.error(
      `Error fetching admin notifications: ${err.message}`
    );

    res.status(500).json({
      message: err.message
    });

  }
};
const getUnreadCount = async(req,res)=>{
try{

const count = await Notification.count({
 where:{
   userId:req.user.id,
   target:"user",
   status:"unread"
 }
});


res.json({
 count
});


}catch(err){

logger.error(err.message);

res.status(500).json({
 message:err.message
});

}

};

// حذف إشعار
const deleteNotification = async(req,res)=>{

try{


const notification =
await Notification.findByPk(
req.params.id
);



if(!notification){

return res.status(404).json({
message:"Notification not found"
});

}



await notification.destroy();



res.json({

message:"Notification deleted successfully"

});



}catch(err){

logger.error(err.message);

res.status(500).json({
message:err.message
});

}

};
const deleteReadNotifications = async(req,res)=>{
try{

await Notification.destroy({
 where:{
   userId:req.user.id,
   status:"read"
 }
});


res.json({
message:"Read notifications deleted"
});


}catch(err){

res.status(500).json({
message:err.message
});

}

};
// حذف الإشعارات المحددة للـ Admin
const deleteAdminNotifications = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No notification IDs provided"
      });
    }

    const deletedCount = await Notification.destroy({
      where: {
        id: ids,
        target: "admin"
      }
    });

    logger.info(
      `Admin ${req.user.id} deleted ${deletedCount} notifications`
    );

    res.json({
      success: true,
      message: "Selected notifications deleted successfully",
      deletedCount
    });

  } catch (err) {
    logger.error(
      `Error deleting admin notifications: ${err.message}`
    );

    res.status(500).json({
      message: err.message
    });
  }
};


// حذف كل إشعارات الـ Admin
const deleteAllAdminNotifications = async (req, res) => {
  try {

    const deletedCount = await Notification.destroy({
      where: {
        target: "admin"
      }
    });

    logger.info(
      `Admin ${req.user.id} deleted all admin notifications`
    );

    res.json({
      success: true,
      message: "All admin notifications deleted successfully",
      deletedCount
    });

  } catch (err) {
    logger.error(
      `Error deleting all admin notifications: ${err.message}`
    );

    res.status(500).json({
      message: err.message
    });
  }
};


// تحديد كل إشعارات الـ Admin كمقروءة
const markAllAdminNotificationsAsRead = async (req, res) => {
  try {

    const [updatedCount] = await Notification.update(
      {
        status: "read"
      },
      {
        where: {
          target: "admin",
          status: "unread"
        }
      }
    );

    logger.info(
      `Admin ${req.user.id} marked ${updatedCount} notifications as read`
    );

    res.json({
      success: true,
      message: "All admin notifications marked as read",
      updatedCount
    });

  } catch (err) {
    logger.error(
      `Error marking admin notifications as read: ${err.message}`
    );

    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  createNotification,
  getUserNotification,
  getUnreadCount,
  markAsRead,
  deleteNotification,
  deleteReadNotifications,
  getAdminNotifications,
  deleteAdminNotifications,
  deleteAllAdminNotifications,
  markAllAdminNotificationsAsRead
};