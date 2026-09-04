const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Citizen = require("./citizen");
const Martyr = require("./martyr");
const SpecialNeeds = require("./specialNeeds");
const Service = require("./service");
const ServiceType = require("./serviceType");
const User = require("./user");
const Request = sequelize.define("Request", {
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  national_id: {
    type: DataTypes.STRING,
    allowNull: false,
 
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },


  // ⭐ المستندات التي يرفعها المستخدم
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
  },
user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},

}, {
  timestamps: true,
});

// ⭐ العلاقات
Request.belongsTo(Citizen, { foreignKey: "citizen_id" });
Request.belongsTo(Martyr, { foreignKey: "martyr_id" });
Request.belongsTo(SpecialNeeds, { foreignKey: "specialNeeds_id" });
Request.belongsTo(Service, { foreignKey: "service_id" });
Request.belongsTo(ServiceType, { foreignKey: "service_type_id" });
Request.belongsTo(User, {foreignKey: "user_id",});
module.exports = Request;