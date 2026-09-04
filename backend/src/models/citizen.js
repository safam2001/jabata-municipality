const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
// const Request = require("./request");

const Citizen = sequelize.define("Citizen", {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  national_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  birth_date: {
    type: DataTypes.DATE,
    allowNull: true,   // المواطن إجباري من الـ validation – الإدمن اختياري
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,   // ملاحظات المواطن
  },

  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true,   // ملاحظات الإدمن
  },

  documents: {
    type: DataTypes.JSON,
    allowNull: true,   // مصفوفة ملفات – المواطن يرسلها، الإدمن اختياري
  },

  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  request_id:{
    type:DataTypes.INTEGER,
    allowNull:true,
  }
}, {
  timestamps: true,
});

// ربط المواطن بالمستخدم الذي أنشأه (مواطن أو إدمن)
Citizen.belongsTo(User, { foreignKey: "user_id", allowNull: false });


module.exports = Citizen;