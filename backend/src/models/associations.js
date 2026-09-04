
const News = require("./news");
const Media = require("./media");
const Village = require("./village");
const User = require("./user");

const Comment = require("./comment");
const Reply = require("./reply");

const Notification = require("./notification");

const Town=require("./town")
// =========================
// News - Media
// =========================

// الخبر يحتوي على عدة صور وفيديوهات
News.hasMany(Media, {
  foreignKey: "news_id",
  as: "media"
});

Media.belongsTo(News, {
  foreignKey: "news_id",
  as: "news"
});




// القرية التابعة للخبر
News.belongsTo(Village,{
  foreignKey:"village_id",
  as:"village"
});


// الأدمن الذي نشر الخبر
News.belongsTo(User,{
  foreignKey:"admin_id",
  as:"publishedBy"
});


// الوسيط تابع لقرية
Media.belongsTo(Village,{
  foreignKey:"village_id",
  as:"village"
});


// الأدمن الذي رفع الملف
Media.belongsTo(User,{
  foreignKey:"admin_id",
  as:"uploadedBy"
});

// =========================
// News - Comments
// =========================

// الخبر يحتوي على عدة تعليقات
News.hasMany(Comment, {
  foreignKey: "news_id",
  as: "comments"
});

Comment.belongsTo(News, {
  foreignKey: "news_id",
  as: "news"
});



// =========================
// Media - Comments
// =========================

// الوسائط تحتوي على عدة تعليقات
Media.hasMany(Comment, {
  foreignKey: "media_id",
  as: "comments"
});

Comment.belongsTo(Media, {
  foreignKey: "media_id",
  as: "media"
});



// =========================
// User - Comments
// =========================

// المستخدم يكتب عدة تعليقات
User.hasMany(Comment, {
  foreignKey: "user_id",
  as: "comments"
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});



// =========================
// Comments - Replies
// =========================

// التعليق يحتوي على عدة ردود
Comment.hasMany(Reply, {
  foreignKey: "comment_id",
  as: "replies"
});

Reply.belongsTo(Comment, {
  foreignKey: "comment_id",
  as: "comment"
});



// =========================
// User - Replies
// =========================

// المستخدم يكتب عدة ردود
User.hasMany(Reply, {
  foreignKey: "user_id",
  as: "replies"
});

Reply.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});



// =========================
// User - Notifications
// =========================

User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications"
});

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});
// Town - Village

Town.hasMany(Village,{
  foreignKey:"town_id",
  as:"villages"
});

Village.belongsTo(Town,{
  foreignKey:"town_id",
  as:"town"
});
Village.hasMany(News, {
  foreignKey: "village_id",
  as: "news"
});
// ============================ add
User.hasMany(News,{
  foreignKey:"admin_id",
  as:"publishedNews"
});
Village.hasMany(Media,{
  foreignKey:"village_id",
  as:"media"
});