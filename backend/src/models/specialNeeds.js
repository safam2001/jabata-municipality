const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User=require("./user")

const SpecialNeeds = sequelize.define(
    "SpecialNeeds",
    {
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        national_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        // تاريخ الميلاد
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        // عنوان السكن
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // رقم الهاتف
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
          // نوع الإعاقة
    disability_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // ملاحظات إضافية
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // حالة الطلب
    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "rejected"
      ),
      defaultValue: "pending",

    },
     request_id:{
    type:DataTypes.INTEGER,
    allowNull:true,
  }

},
  {
    timestamps: true,
  }
);
// المستخدم الذي أنشأ الطلب
SpecialNeeds.belongsTo(User,{
    foreignkey:"user_id",
    as:"createdBy"
});
module.exports=SpecialNeeds