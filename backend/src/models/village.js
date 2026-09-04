// models/village.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Town = require("./town");

const Village = sequelize.define(
  "Village",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // الاسم القديم - يبقى للتوافق مع البيانات السابقة
    },

    name_ar: {
      type: DataTypes.STRING,
      allowNull: true, // اسم القرية بالعربي
    },

    name_en: {
      type: DataTypes.STRING,
      allowNull: true, // اسم القرية بالإنكليزي
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true, // الوصف القديم - يبقى للتوافق مع البيانات السابقة
    },

    description_ar: {
      type: DataTypes.TEXT,
      allowNull: true, // وصف القرية بالعربي
    },

    description_en: {
      type: DataTypes.TEXT,
      allowNull: true, // وصف القرية بالإنكليزي
    },

    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    population: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    area: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    media_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    town_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = Village;