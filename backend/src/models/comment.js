const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Comment = sequelize.define("Comment", {

  content:{
    type:DataTypes.TEXT,
    allowNull:false
  },

  status:{
    type:DataTypes.ENUM(
      "pending",
      "approved",
      "rejected"
    ),
    defaultValue:"approved"
  },

  news_id:{
    type:DataTypes.INTEGER,
    allowNull:true
  },

  media_id:{
    type:DataTypes.INTEGER,
    allowNull:true
  },

  user_id:{
    type:DataTypes.INTEGER,
    allowNull:false
  }

},{
  timestamps:true
});


module.exports = Comment;