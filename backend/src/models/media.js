const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Village = require("./village");
const User = require("./user");

const Media = sequelize.define(
  "Media",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "image",
        "video",
        "document"
      ),
      allowNull: false,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "active",
        "inactive"
      ),
      defaultValue: "active",
    },
    news_id: {
  type: DataTypes.INTEGER,
  allowNull: true,
},

village_id: {
  type: DataTypes.INTEGER,
  allowNull: true,
},

admin_id: {
  type: DataTypes.INTEGER,
  allowNull: true,
},
  },
  {
    timestamps: true,
  }
);


module.exports = Media;