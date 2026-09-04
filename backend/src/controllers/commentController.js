
const Comment = require("../models/comment");
const News = require("../models/news");
const Media = require("../models/media");
const User = require("../models/user");
const Reply = require("../models/reply");
const logger = require("../logger");
const Notification=require("../models/notification")
const createComment = async (req, res) => {
  try {

    const {
      content,
      news_id,
      media_id
    } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Comment content is required"
      });
    }

    const comment = await Comment.create({

      content,

      news_id: news_id || null,

      media_id: media_id || null,

      user_id: req.user.id,

      // إذا أردت موافقة الأدمن أولاً غيّريها إلى pending
      status: "approved"

    });
  await Notification.create({
 message:"New comment added",
 target:"admin",
 type:"comment"
});
    logger.info(
      `User ${req.user.id} created comment ${comment.id}`
    );

    res.status(201).json({

      message: "Comment created successfully",

      comment

    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};
const getComments = async (req, res) => {
  try {

    const {
      page = 1,
      limit = 10,
      status,
      news_id,
      media_id,
      user_id,
      search,
      sort = "newest"
    } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (news_id) {
      where.news_id = news_id;
    }

    if (media_id) {
      where.media_id = media_id;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    if (search) {
      where.content = {
        [Op.iLike]: `%${search}%`
      };
    }

    const order =
      sort === "oldest"
        ? [["createdAt", "ASC"]]
        : [["createdAt", "DESC"]];

    const comments = await Comment.findAndCountAll({

      where,

      include: [

        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName"
          ]
        },

        {
          model: News,
          as: "news",
          attributes: [
            "id",
            "title"
          ]
        },

        {
          model: Media,
          as: "media",
          attributes: [
            "id",
            "title",
            "file_path"
          ]
        },
           {
  model: Reply,
  as: "replies",
  include: [
    {
      model: User,
      as: "user",
      attributes: [
        "id",
        "firstName",
        "lastName"
      ]
    }
  ],
  attributes: [
    "id",
    "content",
    "createdAt"
  ]
}
        // {
        //   model: Reply,
        //   as: "replies",
        //   attributes: ["id"]
        // }

      ],

      distinct: true,

      limit: Number(limit),

      offset: (Number(page) - 1) * Number(limit),

      order

    });

    const rows = comments.rows.map((comment) => ({

      ...comment.toJSON(),

      replyCount: comment.replies
        ? comment.replies.length
        : 0

    }));

    res.json({

      total: comments.count,

      page: Number(page),

      pages: Math.ceil(
        comments.count / Number(limit)
      ),

      rows

    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};
const updateComment = async (req, res) => {
  try {

    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    // يسمح فقط لصاحب التعليق أو الأدمن
    if (
      comment.user_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed"
      });
    }

    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Comment content is required"
      });
    }

    comment.content = content;

    // إذا عدّل المستخدم التعليق يرجع للمراجعة
    if (req.user.role !== "admin") {
      comment.status = "pending";
    }

    await comment.save();

    logger.info(
      `Comment ${comment.id} updated by user ${req.user.id}`
    );

    res.json({
      message: "Comment updated successfully",
      comment
    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};
const getCommentStats = async (req, res) => {
  try {

    const total = await Comment.count();

    const approved = await Comment.count({
      where: {
        status: "approved"
      }
    });

    const pending = await Comment.count({
      where: {
        status: "pending"
      }
    });

    const rejected = await Comment.count({
      where: {
        status: "rejected"
      }
    });

    res.json({
      total,
      approved,
      pending,
      rejected
    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};
const updateCommentStatus = async (req, res) => {
  try {

    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    const { status } = req.body;

    if (
      !["approved", "pending", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    comment.status = status;

    await comment.save();

    logger.info(
      `Admin ${req.user.id} changed comment ${comment.id} status to ${status}`
    );

    res.json({
      message: "Comment status updated successfully",
      comment
    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};
const deleteComment = async (req, res) => {
  try {

    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (
      comment.user_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed"
      });
    }

    logger.info(
      `Comment ${comment.id} deleted by user ${req.user.id}`
    );

    await comment.destroy();

    res.json({
      message: "Comment deleted successfully"
    });

  } catch (err) {

    logger.error(err.message);

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = {

  getComments,

  getCommentStats,

  createComment,

  updateComment,

  updateCommentStatus,

  deleteComment

};