const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Service=require("./service");

const ServiceType = sequelize.define("ServiceType", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  requirements: {
    type: DataTypes.TEXT,
  },

  fee: {
    type: DataTypes.FLOAT,
  },

  link: {
    type: DataTypes.STRING,
  },

  hasRequestForm: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  detailsText: {
    type: DataTypes.STRING,
    defaultValue: "عرض التفاصيل",
  },

  requestText: {
    type: DataTypes.STRING,
    defaultValue: "تقديم طلب",
  },
  icon: {
  type: DataTypes.STRING,
  defaultValue: "FaFileAlt",
},

  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },

person_type: {
  type: DataTypes.ENUM(
    "citizen",
    "martyr",
    "specialNeeds",
    "general"
  ),
  allowNull: false,
  defaultValue: "general"
},
   
}, {
  timestamps: true,
});


Service.hasMany(ServiceType, {
    foreignKey: "service_id"
});

ServiceType.belongsTo(Service, {
    foreignKey: "service_id"
});
module.exports = ServiceType ;