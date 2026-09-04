import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosInstance";
import "./MangeComments.css";

const ManageComments = () => {

  const { t } = useTranslation();

  const [comments, setComments] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 10;
  // =======================
// Replies


const [expandedComment, setExpandedComment] = useState(null);

const [replies, setReplies] = useState({});

const [replyText, setReplyText] = useState({});

  useEffect(() => {

    fetchComments();

    fetchStats();

  }, []);

  useEffect(() => {

    if (successMessage) {

      const timer = setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [successMessage]);
//  console.log(res.data);
const fetchComments = async () => {

  try {

    setLoading(true);

    const res = await axiosInstance.get("/api/comments");

    console.log(res.data);

    setComments(res.data.rows);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }

};


  const fetchStats = async () => {

    try {

      const res = await axiosInstance.get(
        "/api/comments/stats"
      );

      setStats(res.data);

    } catch (err) {

      console.error(err);

    }

  };
  const updateStatus = async (id, status) => {
    try {

      await axiosInstance.patch(
        `/api/comments/${id}/status`,
        { status }
      );

      setSuccessMessage(
        status === "approved"
          ? t("commentApproved")
          : t("commentRejected")
      );

      fetchComments();
      fetchStats();

    } catch (err) {

      console.error(err);

    }
  };

  const deleteComment = async (id) => {

    const confirmDelete = window.confirm(
      t("confirmDelete")
    );

    if (!confirmDelete) return;

    try {

      await axiosInstance.delete(
        `/api/comments/${id}`
      );

      setSuccessMessage(
        t("commentDeleted")
      );

      fetchComments();
      fetchStats();

    } catch (err) {

      console.error(err);

    }

  };
        // =======================
// جلب ردود تعليق
// =======================

const fetchReplies = async (commentId) => {

  try {

    const res = await axiosInstance.get(
      `/api/replies/comment/${commentId}`
    );

    setReplies((prev) => ({
      ...prev,
      [commentId]: res.data
    }));

  } catch (err) {

    console.error(err);

  }

};


// =======================
// فتح وإغلاق الردود
// =======================

const toggleReplies = async (commentId) => {

  if (expandedComment === commentId) {

    setExpandedComment(null);

    return;

  }

  setExpandedComment(commentId);

  await fetchReplies(commentId);

};


// =======================
// إضافة رد
// =======================

const createReply = async (commentId) => {

  if (!replyText[commentId]?.trim()) return;

  try {
  console.log({
  comment_id: commentId,
  content: replyText[commentId]
});
    await axiosInstance.post("/api/replies", {

      comment_id: commentId,

      content: replyText[commentId]

    });

    setSuccessMessage(t("replyAdded"));

    setReplyText((prev) => ({
      ...prev,
      [commentId]: ""
    }));

    fetchReplies(commentId);

  } catch (err) {

    console.error(err);

  }

};


// =======================
// حذف رد
// =======================

const deleteReply = async (replyId, commentId) => {

  if (!window.confirm(t("confirmDelete"))) return;

  try {

    await axiosInstance.delete(
      `/api/replies/${replyId}`
    );

    setSuccessMessage(t("replyDeleted"));

    fetchReplies(commentId);

  } catch (err) {

    console.error(err);

  }

};
  const filteredComments = comments.filter((item) => {

    const matchSearch =
      item.content
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      `${item.user?.firstName || ""} ${item.user?.lastName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "" ||
      item.status === statusFilter;

    return matchSearch && matchStatus;

  });

  const indexOfLast =
    currentPage * commentsPerPage;

  const indexOfFirst =
    indexOfLast - commentsPerPage;

  const currentComments =
    filteredComments.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages =
    Math.ceil(
      filteredComments.length /
      commentsPerPage
    );

  const nextPage = () => {

    if (currentPage < totalPages) {

      setCurrentPage(currentPage + 1);

    }

  };

  const prevPage = () => {

    if (currentPage > 1) {

      setCurrentPage(currentPage - 1);

    }

  };
  return (
  <div className="manage-comments">

    <div className="page-header">

      <h2>{t("manageComments")}</h2>

      <div className="stats-container">

        <div className="stat-card">
          <h3>{stats.total}</h3>
          <span>{t("totalComments")}</span>
        </div>

        <div className="stat-card">
          <h3>{stats.approved}</h3>
          <span>{t("approved")}</span>
        </div>

        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <span>{t("pending")}</span>
        </div>

        <div className="stat-card">
          <h3>{stats.rejected}</h3>
          <span>{t("rejected")}</span>
        </div>

      </div>

    </div>

    {successMessage && (
      <div className="success-message">
        {successMessage}
      </div>
    )}

    <div className="toolbar">

      <input
        type="text"
        placeholder={t("search")}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">
          {t("all")}
        </option>

        <option value="approved">
          {t("approved")}
        </option>

        <option value="pending">
          {t("pending")}
        </option>

        <option value="rejected">
          {t("rejected")}
        </option>

      </select>

    </div>

    {loading ? (

      <div className="loading-box">
        {t("loading")}
      </div>

    ) : currentComments.length === 0 ? (

      <div className="empty-box">
        {t("noComments")}
      </div>

    ) : (

      <>
        <div className="comments-grid">

          {currentComments.map((comment) => (

            <div
              key={comment.id}
              className="comment-card"
            >

              <div className="comment-top">

                <h3>

                  {comment.user
                    ? `${comment.user.firstName} ${comment.user.lastName}`
                    : t("unknownUser")}

                </h3>

                <span
                  className={`status-badge ${comment.status}`}
                >
                  {t(comment.status)}
                </span>

              </div>

              <p className="comment-content">
                {comment.content}
              </p>

              <div className="comment-info">

                <span>
                  📅 {new Date(comment.createdAt).toLocaleDateString()}
                </span>

                {comment.news && (
                  <span>
                    📰 {comment.news.title}
                  </span>
                )}

                {comment.media && (
                  <span>
                    📷 {comment.media.title}
                  </span>
                )}

              </div>
              <div className="reply-section">

  <button
    className="toggle-replies-btn"
    onClick={() => toggleReplies(comment.id)}
  >
    {/* {expandedComment === comment.id
      ? t("hideReplies")
      : t("showReplies")} */}
      {expandedComment === comment.id
  ? `${t("hideReplies")} (${comment.replyCount})`
  : `${t("showReplies")} (${comment.replyCount})`}
  </button>

  {expandedComment === comment.id && (

    <>

      <div className="reply-list">

        {replies[comment.id]?.length > 0 ? (

          replies[comment.id].map((reply) => (

            <div
              key={reply.id}
              className="reply-card"
            >

              <div className="reply-header">

                <strong>

                  {reply.user
                    ? `${reply.user.firstName} ${reply.user.lastName}`
                    : t("unknownUser")}

                </strong>

                <span>

                  {new Date(reply.createdAt)
                    .toLocaleDateString()}

                </span>

              </div>

              <p>

                {reply.content}

              </p>

              <div className="reply-actions">

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteReply(
                      reply.id,
                      comment.id
                    )
                  }
                >
                  {t("delete")}
                </button>

              </div>

            </div>

          ))

        ) : (

          <p className="no-replies">

            {t("noReplies")}

          </p>

        )}

      </div>

      <div className="reply-form">

        <textarea

          placeholder={t("writeReply")}

          value={replyText[comment.id] || ""}

          onChange={(e) =>
            setReplyText({

              ...replyText,

              [comment.id]: e.target.value

            })
          }

        />

        <button
          className="reply-btn"
          onClick={() =>
            createReply(comment.id)
          }
        >
          {t("send")}
        </button>

      </div>

    </>

  )}

</div>

              <div className="actions">

                {comment.status !== "approved" && (

                  <button
                    className="approve-btn"
                    onClick={() =>
                      updateStatus(comment.id, "approved")
                    }
                  >
                    {t("approve")}
                  </button>

                )}

                {comment.status !== "rejected" && (

                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateStatus(comment.id, "rejected")
                    }
                  >
                    {t("reject")}
                  </button>

                )}

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteComment(comment.id)
                  }
                >
                  {t("delete")}
                </button>

              </div>

            </div>

          ))}

        </div>

        {totalPages > 1 && (

          <div className="pagination">

            <button
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              {t("previous")}
            </button>

            <span>

              {currentPage} / {totalPages}

            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              {t("next")}
            </button>

          </div>

        )}

      </>

    )}

  </div>
);
};
export default ManageComments;