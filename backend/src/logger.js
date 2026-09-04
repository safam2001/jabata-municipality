const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "info", // مستوى التسجيل الافتراضي
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // يضيف وقت لكل سجل
    format.json() // يخزن السجلات بصيغة JSON
  ),
  transports: [
    // ملف للأخطاء فقط
    new transports.File({ filename: "logs/error.log", level: "error" }),
    // ملف لكل العمليات (نجاح + تحذير + أخطاء)
    new transports.File({ filename: "logs/app.log" }),
  ],
});

// إذا كنا في بيئة تطوير، نعرض السجلات أيضًا في الكونسول
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;