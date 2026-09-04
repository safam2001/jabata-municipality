const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Martyr = sequelize.define("Martyr", {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false, // الاسم الكامل للشهيد
  },
  national_id: {
    type: DataTypes.STRING,
    allowNull: false, // الرقم الوطني أو الهوية
    unique: true,
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: false, // تاريخ الميلاد
  },
  death_date: {
    type: DataTypes.DATE,
    allowNull: false, // تاريخ الاستشهاد
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true, // ملاحظات إضافية يكتبها المواطن
  },
    address: {
    type: DataTypes.STRING,
    allowNull: true, // عنوان السكن
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true, // رقم الهاتف
  },
  documents: {
  type: DataTypes.JSON,   // مصفوفة ملفات
  allowNull: true,
},

  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending", // حالة الطلب (قيد المراجعة، مقبول، مرفوض)
  },
   request_id:{
    type:DataTypes.INTEGER,
    allowNull:true,
  }

}, {
  timestamps: true,
});

// ربط البيانات بالمستخدم اللي أضافها (لازم تسجيل دخول)
Martyr.belongsTo(User, { foreignKey: "user_id", allowNull: false });

module.exports = Martyr;