const Reply = require("../models/reply");
const Comment = require("../models/comment");
const Notification = require("../models/notification");
const User = require("../models/user");
const logger = require("../logger");
// جلب الردود
const getReplies = async (req, res) => {
    try {

        const replies = await Reply.findAll({
            include: [
                {
                    model: Comment,
                    as: "comment"
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "firstName", "lastName"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });


        res.json(replies);


    } catch (err) {

        logger.error(err.message);

        res.status(500).json({
            message: err.message
        });

    }

};

// إضافة رد
const createReply = async (req, res) => {
    try {


        const {
            content,
            comment_id
        } = req.body;



        const comment =
            await Comment.findByPk(comment_id);



        if (!comment)
            return res.status(404).json({
                message: "Comment not found"
            });

        console.log(req.user);

        const reply = await Reply.create({
            content,
            comment_id,
            user_id: req.user.id
        });


        // إشعار صاحب التعليق
        if (comment.user_id !== req.user.id) {

            await Notification.create({
                userId: comment.user_id,
                target: "user",
                message: `${req.user.firstName} ${req.user.lastName} has replied to your comment`,
                status: "unread",
                type: "comment_reply"
            });

        }


        res.status(201).json({
            message: "Reply created successfully",
            reply
        });
        logger.info(
            `User ${req.user.id} created reply ${reply.id}`
        );
        res.status(201).json({

            message: "Reply created successfully",

            reply

        });
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data);
        console.error(err);
    }

};

// تعديل رد
const updateReply = async (req, res) => {
    try {


        const reply =
            await Reply.findByPk(req.params.id);



        if (!reply)
            return res.status(404).json({
                message: "Reply not found"
            });



        if (
            reply.user_id !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Not allowed"
            });
        }



        reply.content =
            req.body.content ?? reply.content;


        await reply.save();



        res.json({
            message: "Reply updated successfully",
            reply
        });



    } catch (err) {

        logger.error(err.message);

        res.status(500).json({
            message: err.message
        });

    }

};

// حذف رد
const deleteReply = async (req, res) => {
    try {


        const reply =
            await Reply.findByPk(req.params.id);



        if (!reply)
            return res.status(404).json({
                message: "Reply not found"
            });



        if (
            reply.user_id !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Not allowed"
            });
        }



        await reply.destroy();



        res.json({
            message: "Reply deleted successfully"
        });


    } catch (err) {

        logger.error(err.message);

        res.status(500).json({
            message: err.message
        });

    }

};

const getRepliesByComment = async (req, res) => {

    try {

        const replies = await Reply.findAll({

            where: {
                comment_id: req.params.commentId
            },

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

            order: [["createdAt", "ASC"]]

        });

        res.json(replies);

    } catch (err) {

        logger.error(err.message);

        res.status(500).json({
            message: err.message
        });

    }

};
const updateReplyStatus = async (req, res) => {

    try {

        const reply = await Reply.findByPk(req.params.id);

        if (!reply) {
            return res.status(404).json({
                message: "Reply not found"
            });
        }

        reply.status = req.body.status;

        await reply.save();

        res.json({
            message: "Reply status updated",
            reply
        });

    } catch (err) {

        logger.error(err.message);

        res.status(500).json({
            message: err.message
        });

    }

};
const getReplyStats = async (req, res) => {

    try {

        const total = await Reply.count();

        const approved = await Reply.count({
            where: { status: "approved" }
        });

        const pending = await Reply.count({
            where: { status: "pending" }
        });

        const rejected = await Reply.count({
            where: { status: "rejected" }
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

module.exports = {
    getReplies,
    createReply,
    updateReply,
    getReplyStats,
    updateReplyStatus,
    getRepliesByComment,
    deleteReply
};