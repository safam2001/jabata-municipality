// models/town.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Town = sequelize.define("Town", {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // اسم البلدة (إجباري)
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // وصف البلدة (معلومات عامة أو تاريخية)
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true, // خط العرض (للموقع الجغرافي على الخريطة)
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true, // خط الطول (للموقع الجغرافي على الخريطة)
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: true, // عدد السكان (إحصائية تقريبية)
  },
  area: {
    type: DataTypes.FLOAT,
    allowNull: true, // مساحة البلدة بالكيلومتر المربع
  },
  logo_url: {
    type: DataTypes.STRING,
    allowNull: true, // رابط شعار أو صورة للبلدة
  },

}, {
  timestamps: true, // يحفظ وقت الإنشاء والتعديل تلقائيًا
});

module.exports = Town;