const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Town = require("./town");
const Village = require("./village");
const User = require("./user"); // الأدمن

const Service = sequelize.define("Service", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon:{
type:DataTypes.STRING,
allowNull:true,
  },

  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
 

}, {
  timestamps: true,
});

// العلاقات
Service.belongsTo(Town, { foreignKey: "town_id", allowNull: true });
Service.belongsTo(Village, { foreignKey: "village_id", allowNull: true });
Service.belongsTo(User, { foreignKey: "admin_id", allowNull: true }); // الأدمن اللي نشر الخدمة


module.exports = Service;