const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Reply = sequelize.define(
  "Reply",
  {

    content:{
      type:DataTypes.TEXT,
      allowNull:false
    },

    comment_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },

    user_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    status: {
  type: DataTypes.ENUM(
    "approved",
    "pending",
    "rejected"
  ),
  defaultValue: "approved"
},

  },
  {
    timestamps:true
  }
);


module.exports = Reply;