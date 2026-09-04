import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosInstance";

import {
    FaArrowLeft,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaEye,
    FaUserShield,
    FaDownload,
    FaVideo,
    FaFilePdf,
    FaShareAlt,
    FaLink,
    FaNewspaper,
    FaComments,
    FaArrowRight
} from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./NewsDetails.css";
import { API_URL } from "../config/api";

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const isArabic = i18n.language === "ar";

    const [news, setNews] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [similarNews, setSimilarNews] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyComment, setReplyComment] = useState(null);
    const [showReplies, setShowReplies] = useState({});

    // =========================
    // Copy Toast
    // =========================

    const [copied, setCopied] = useState(false);

    // =========================
    // مشاركة الخبر
    // =========================

    const shareNews = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: news.title,
                    text: news.title,
                    url: window.location.href,
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            shareLink();
        }
    };

    // =========================
    // جلب الخبر
    // =========================

    const fetchNews = async () => {
        try {
            const res = await axiosInstance.get(
                `/api/news/${id}`
            );

            setNews(res.data);

            const related = await axiosInstance.get(
                "/api/news"
            );

            const filtered = related.data.filter(
                item =>
                    item.id !== res.data.id &&
                    item.village_id === res.data.village_id
            );

            setRelatedNews(
                filtered.slice(0, 4)
            );

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // الأخبار المشابهة
    // =========================

    const fetchSimilarNews = async () => {
        try {
            const res = await axiosInstance.get(
                `/api/news?village_id=${news.village_id}`
            );

            setSimilarNews(
                res.data.filter(
                    item => item.id !== news.id
                )
            );

        } catch (err) {
            console.log(err);
        }
    };

    // =========================
    // جلب التعليقات
    // =========================

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(
                `/api/comments?news_id=${id}`
            );

            setComments(res.data.rows);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchNews();
        fetchComments();
    }, [id]);

    // =========================
    // الصور
    // =========================

    const getImages = () => {
        if (!news?.media) return [];

        return news.media.filter(
            item => item.type === "image"
        );
    };

    // =========================
    // الفيديوهات
    // =========================

    const getVideos = () => {
        if (!news?.media) return [];

        return news.media.filter(
            item => item.type === "video"
        );
    };

    // =========================
    // المستندات
    // =========================

    const getDocuments = () => {
        if (!news?.media) return [];

        return news.media.filter(
            item => item.type === "document"
        );
    };

    // =========================
    // صورة الخبر
    // =========================

    const getImage = (item) => {
        if (item?.media?.length) {
            const image = item.media.find(
                media => media.type === "image"
            );

            if (image) {
                return `${API_URL}/${image.file_path}`;
            }
        }

        return "/images/news-default.jpg";
    };

    // =========================
    // إضافة تعليق
    // =========================

    const addComment = async () => {
        try {
            if (!commentText.trim()) return;

            await axiosInstance.post(
                "/api/comments",
                {
                    news_id: id,
                    content: commentText
                }
            );

            setCommentText("");

            fetchComments();

        } catch (err) {
            console.error(
                "Add Comment Error:",
                err
            );
        }
    };

    // =========================
    // إضافة رد
    // =========================

    const addReply = async () => {
        try {
            if (!replyText.trim()) return;

            await axiosInstance.post(
                "/api/replies",
                {
                    content: replyText,
                    comment_id: replyComment
                }
            );

            setReplyText("");
            setReplyComment(null);

            fetchComments();

        } catch (err) {
            console.error(
                "Add Reply Error:",
                err
            );
        }
    };

    // =========================
    // نسخ الرابط
    // =========================

    const shareLink = async () => {
        try {
            await navigator.clipboard.writeText(
                window.location.href
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2500);

        } catch (err) {
            console.error(
                "Copy Link Error:",
                err
            );
        }
    };

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div className="news-loading">
                {t("loading")}
            </div>
        );
    }

    // =========================
    // الخبر غير موجود
    // =========================

    if (!news) {
        return (
            <div className="news-loading">
                {t("newsNotFound")}
            </div>
        );
    }

    const images = getImages();
    const videos = getVideos();
    const documents = getDocuments();

    return (

        <div className="news-details-page">

            {/* =========================
                BACK
            ========================= */}

            <div className="news-top">

                <button
                    className="st-back-btn"
                    onClick={() => navigate(-1)}
                >

                    {isArabic
                        ? <FaArrowRight />
                        : <FaArrowLeft />
                    }

                    {t("back")}

                </button>

            </div>


            {/* =========================
                NEWS CARD
            ========================= */}

            <div className="news-main-card">

                {/* العنوان */}

                <div className="news-title">

                    <h1>
                        {news.title}
                    </h1>

                </div>


                {/* المعلومات */}

                <div className="news-meta">

                    <span>

                        <FaCalendarAlt />

                        {new Date(
                            news.createdAt
                        ).toLocaleDateString()}

                    </span>


                    <span>

                        <FaMapMarkerAlt />

                        {news.village
                            ? news.village.name
                            : t("general")
                        }

                    </span>


                    <span>

                        <FaEye />

                        {news.views}

                    </span>


                    <span>

                        <FaUserShield />

                        {news.source_name}

                    </span>

                </div>


                {/* =========================
                    IMAGES
                ========================= */}

                {images.length > 0 && (

                    <Swiper
                        modules={[
                            Navigation,
                            Pagination
                        ]}
                        navigation
                        pagination={{
                            clickable: true
                        }}
                        className="news-slider"
                    >

                        {images.map(img => (

                            <SwiperSlide
                                key={img.id}
                            >

                                <img
                                    src={`${API_URL}/${img.file_path}`}
                                    alt={img.title}
                                    className="news-slider-image"
                                />

                            </SwiperSlide>

                        ))}

                    </Swiper>

                )}


                {/* =========================
                    CONTENT
                ========================= */}

                <div className="news-content">

                    {news.content}

                </div>


                {/* =========================
                    VIDEOS
                ========================= */}

                {videos.length > 0 && (

                    <div className="media-section">

                        <h2>

                            <FaVideo />

                            {t("videos")}

                        </h2>


                        <div className="video-grid">

                            {videos.map(video => (

                                <video
                                    key={video.id}
                                    controls
                                    className="news-video"
                                >

                                    <source
                                        src={`${API_URL}/${video.file_path}`}
                                    />

                                </video>

                            ))}

                        </div>

                    </div>

                )}


                {/* =========================
                    DOCUMENTS
                ========================= */}

                {documents.length > 0 && (

                    <div className="media-section">

                        <h2>

                            <FaFilePdf />

                            {t("documents")}

                        </h2>


                        <div className="documents-list">

                            {documents.map(file => (

                                <a
                                    key={file.id}
                                    href={`${API_URL}/${file.file_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="document-item"
                                >

                                    <FaDownload />

                                    {file.title ||
                                        file.file_name}

                                </a>

                            ))}

                        </div>

                    </div>

                )}


                {/* =========================
                    SHARE
                ========================= */}

                <div className="share-section">

                    <button onClick={shareNews}>

                        <FaShareAlt />

                        {t("share")}

                    </button>


                    <button
                        onClick={shareLink}
                        title={t("copyLink")}
                    >

                        <FaLink />

                    </button>

                </div>


                {/* =========================
                    COPY TOAST
                ========================= */}

                {copied && (

                    <div className="copy-toast">

                        {t("linkCopied")}

                    </div>

                )}

            </div>


            {/* =========================
                SIMILAR NEWS
            ========================= */}

            <div className="similar-news-section">

                <h2>

                    <FaNewspaper />

                    {t("relatedNews")}

                </h2>


                <div className="similar-news-grid">

                    {similarNews.length > 0 &&

                        similarNews.map(item => (

                            <div
                                key={item.id}
                                className="similar-news-card"
                                onClick={() =>
                                    navigate(
                                        `/news/${item.id}`
                                    )
                                }
                            >

                                <img
                                    src={getImage(item)}
                                    alt={item.title}
                                />


                                <div>

                                    <h3>
                                        {item.title}
                                    </h3>


                                    <span>

                                        <FaCalendarAlt />

                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}

                                    </span>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>


            {/* =========================
                COMMENTS
            ========================= */}

            <div className="comments-section">

                <h2>

                    <FaComments />

                    {t("comments")}

                </h2>


                {comments.length === 0 ? (

                    <p className="no-comments">

                        {t("noCommentsYet")}

                    </p>

                ) : (

                    comments.map(comment => (

                        <div
                            key={comment.id}
                            className="comment-card"
                        >

                            <div className="comment-header">

                                <strong>

                                    {comment.user
                                        ? `${comment.user.firstName} ${comment.user.lastName}`
                                        : t("user")
                                    }

                                </strong>


                                <span>

                                    {new Date(
                                        comment.createdAt
                                    ).toLocaleDateString()}

                                </span>

                            </div>


                            <p>

                                {comment.content}

                            </p>


                            {/* Reply */}

                            <button
                                className="reply-btn"
                                onClick={() =>
                                    setReplyComment(
                                        comment.id
                                    )
                                }
                            >

                                {t("reply")}

                            </button>


                            {/* Show Replies */}

                            {comment.replies?.length > 0 && (

                                <button
                                    className="show-replies-btn"
                                    onClick={() =>
                                        setShowReplies({
                                            ...showReplies,
                                            [comment.id]:
                                                !showReplies[
                                                    comment.id
                                                ]
                                        })
                                    }
                                >

                                    {showReplies[comment.id]
                                        ? t("hideReplies")
                                        : `${t("showReplies")} (${comment.replies.length})`
                                    }

                                </button>

                            )}


                            {/* Replies */}

                            {showReplies[comment.id] &&

                                comment.replies?.map(
                                    reply => (

                                        <div
                                            key={reply.id}
                                            className="reply-card"
                                        >

                                            <strong>

                                                {reply.user
                                                    ? `${reply.user.firstName} ${reply.user.lastName}`
                                                    : t("user")
                                                }

                                            </strong>


                                            <p>

                                                {reply.content}

                                            </p>


                                            <span>

                                                {new Date(
                                                    reply.createdAt
                                                ).toLocaleDateString()}

                                            </span>

                                        </div>

                                    )
                                )

                            }

                        </div>

                    ))

                )}

            </div>


            {/* =========================
                ADD COMMENT
            ========================= */}

            <div className="add-comment-section">

                <h3>

                    {t("addComment")}

                </h3>


                <textarea
                    placeholder={t(
                        "writeYourComment"
                    )}
                    value={commentText}
                    onChange={e =>
                        setCommentText(
                            e.target.value
                        )
                    }
                />


                <button
                    className="comment-submit-btn"
                    onClick={addComment}
                >

                    {t("sendComment")}

                </button>

            </div>


            {/* =========================
                REPLY BOX
            ========================= */}

            {replyComment && (

                <div className="reply-box">

                    <h3>

                        {t("writeReply")}

                    </h3>


                    <textarea
                        placeholder={t(
                            "writeYourReply"
                        )}
                        value={replyText}
                        onChange={e =>
                            setReplyText(
                                e.target.value
                            )
                        }
                    />


                    <div className="reply-actions">

                        <button
                            onClick={addReply}
                            className="reply-send-btn"
                        >

                            {t("sendReply")}

                        </button>


                        <button
                            onClick={() =>
                                setReplyComment(null)
                            }
                            className="cancel-reply-btn"
                        >

                            {t("cancel")}

                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};

export default NewsDetails;