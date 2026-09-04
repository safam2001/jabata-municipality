const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Village = require("./village");
const User = require("./user");

const News = sequelize.define(
  "News",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "draft",
        "published",
        "archived"
      ),
      defaultValue: "draft",
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // القرية التابعة للخبر
    village_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },


    // الأدمن الذي نشر الخبر
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },


    // مصدر الخبر للمواطن
    source_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "بلدية جباثا الخشب",
    },
  },
  {
    timestamps: true,
  }
);



module.exports = News;