const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Notification = sequelize.define("Notification", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
requestId: {
  type: DataTypes.INTEGER,
  allowNull: true
},
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "unread",
      "read"
    ),
    defaultValue: "unread"
  },

  target: {
    type: DataTypes.ENUM(
      "user",
      "admin"
    ),
    defaultValue: "user",
    allowNull:false
  },

  type: {
    type: DataTypes.STRING,
    defaultValue: "general",
    allowNull:false
  }

}, {
  tableName:"notifications",
  timestamps:true
});


module.exports = Notification;