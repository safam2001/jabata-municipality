require("dotenv").config();
const express = require('express');
const cors = require('cors');

//  تعريف sequelize 
const sequelize = require('./src/config/database');

const app = express();
app.use(cors());
app.use(express.json());



// 2استدعاء الـ routes


app.use("/api/users", require("./src/routes/users"));
app.use("/api/auth", require("./src/routes/authRoutes"));
//===============
app.use("/api/villages",require("./src/routes/villages"));
app.use("/api/towns",require("./src/routes/towns"));
//===============
app.use("/api/martyrs", require("./src/routes/martyrs"));
app.use("/api/citizens", require("./src/routes/citizens"));
app.use("/api/special-needs", require("./src/routes/specialNeedsRoutes"));
//===============
app.use("/api/medias", require("./src/routes/medias"));
app.use("/api/news", require("./src/routes/news"));
app.use("/api/services",require("./src/routes/services"));
//================
app.use("/api/comments", require("./src/routes/comments"));
app.use("/api/replies", require("./src/routes/replies"));
//================================
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads",require("./src/routes/uploads"))
//==================================
app.use("/api/notifications",require("./src/routes/notifications"));

//===================
app.use("/api/loggers",require("./src/routes/loggersRoutes"))

// app.use("/api/stats", require("./src/routes/stats"));
app.use("/api/stats",require("./src/routes/stats"));
//===============================
app.use("/api/requests",require("./src/routes/requests"));

//==========================
app.use("/api/service-types",require("./src/routes/serviceTypes"));
// ====================================
app.use("/api/site-settings",require("./src/routes/sitSettingRoutes"));
// =================================
app.use("/api/contacts",require("./src/routes/contacts"));
//==============================
app.use("/api/about",require("./src/routes/abouts"));
//================================
require("./src/models/associations");
// 3️⃣ مزامنة الجداول وتشغيل السيرفر
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // await sequelize.sync({ alter: true }); // إنشاء/تعديل الجداول
   await sequelize.sync();
    console.log("✅ Database synced");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ DB error:", err); // لو حصل خطأ في الاتصال بالقاعدة
    process.exit(1);
  }
})();