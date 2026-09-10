
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../api/axiosInstance";
import "./AdminNotifications.css";
import { showAppModal } from "../../utils/modal";

const AdminNotifications = () => {

    const { t } = useTranslation();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    // الإشعارات المحددة
    const [selectedIds, setSelectedIds] = useState([]);

    // وضع التحديد
    const [selectionMode, setSelectionMode] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    // =========================
    // Fetch Notifications
    // =========================

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const res = await axiosInstance.get(
                "/api/notifications/admin"
            );

            setNotifications(res.data);
            setSelectedIds([]);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    // =========================
    // Mark One As Read
    // =========================

    const markAsRead = async (id) => {

        try {

            await axiosInstance.patch(
                `/api/notifications/${id}/read`
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            status: "read"
                        }
                        : item
                )
            );

        } catch (err) {

            console.error(err);

        }

    };

    // =========================
    // Toggle Selection
    // =========================

    const toggleSelect = (id) => {

        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter(
                    (selectedId) => selectedId !== id
                )
                : [...prev, id]
        );

    };

    // =========================
    // Select All
    // =========================

    const selectAll = () => {

        if (
            selectedIds.length ===
            filteredNotifications.length
        ) {

            setSelectedIds([]);

        } else {

            setSelectedIds(
                filteredNotifications.map(
                    (item) => item.id
                )
            );

        }

    };

    // =========================
    // Cancel Selection
    // =========================

    const cancelSelection = () => {

        setSelectionMode(false);
        setSelectedIds([]);

    };

    // =========================
    // Delete Selected
    // =========================

    const deleteSelected = async () => {

        if (selectedIds.length === 0) return;

        const confirmed = await showAppModal(
            t("confirmDeleteSelectedNotifications"),
            { type: "confirm" }
        );

        if (!confirmed) return;

        try {

            await axiosInstance.delete(
                "/api/notifications/admin/bulk",
                {
                    data: {
                        ids: selectedIds
                    }
                }
            );

            setNotifications((prev) =>
                prev.filter(
                    (item) =>
                        !selectedIds.includes(item.id)
                )
            );

            setSelectedIds([]);
            setSelectionMode(false);

        } catch (err) {

            console.error(err);

        }

    };

    // =========================
    // Delete All
    // =========================

    const deleteAll = async () => {

        if (notifications.length === 0) return;

        const confirmed = await showAppModal(
            t("confirmDeleteAllNotifications"),
            { type: "confirm" }
        );

        if (!confirmed) return;

        try {

            await axiosInstance.delete(
                "/api/notifications/admin/all"
            );

            setNotifications([]);
            setSelectedIds([]);
            setSelectionMode(false);

        } catch (err) {

            console.error(err);

        }

    };

    // =========================
    // Mark All As Read
    // =========================

    const markAllAsRead = async () => {

        try {

            await axiosInstance.patch(
                "/api/notifications/admin/read/all"
            );

            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    status: "read"
                }))
            );

        } catch (err) {

            console.error(err);

        }

    };

    // =========================
    // Filter
    // =========================

    const filteredNotifications =
        notifications.filter((item) => {

            if (filter === "unread") {
                return item.status === "unread";
            }

            if (filter === "read") {
                return item.status === "read";
            }

            return true;

        });

    // =========================
    // Notification Message
    // =========================

    const getNotificationMessage = (item) => {

        if (item.type === "new_request") {

            const message = item.message || "";

            if (message.includes("citizen")) {

                const name = message.replace(
                    "New citizen request submitted by ",
                    ""
                );

                return t(
                    "newCitizenRequest",
                    { name }
                );

            }

            if (message.includes("martyr")) {

                const name = message.replace(
                    "New martyr request submitted by ",
                    ""
                );

                return t(
                    "newMartyrRequest",
                    { name }
                );

            }

            if (message.includes("specialNeeds")) {

                const name = message.replace(
                    "New specialNeeds request submitted by ",
                    ""
                );

                return t(
                    "newSpecialNeedsRequest",
                    { name }
                );

            }

        }

        if (item.type === "request_status") {

            const status = item.message
                ?.replace(
                    "Your request has been ",
                    ""
                );

            return t(
                "requestStatusNotification",
                {
                    status: t(
                        `requestStatuses.${status}`
                    )
                }
            );

        }

        return item.message;

    };

    // =========================
    // Select All State
    // =========================

    const allSelected =
        filteredNotifications.length > 0 &&
        selectedIds.length ===
        filteredNotifications.length;

    return (

        <div className="admin-notifications-page">

            {/* =========================
                Header
            ========================= */}

            <div className="notifications-header">

                <h2>
                    {t("adminNotifications")}
                </h2>

                <button
                    onClick={fetchNotifications}
                    className="refresh-btn"
                >
                    🔄 {t("refresh")}
                </button>

            </div>


            {/* =========================
                Filters
            ========================= */}

            <div className="notification-filter">

                <button
                    className={
                        filter === "all"
                            ? "active"
                            : ""
                    }
                    onClick={() => setFilter("all")}
                >
                    {t("all")}
                </button>

                <button
                    className={
                        filter === "unread"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("unread")
                    }
                >
                    {t("unread")}
                </button>

                <button
                    className={
                        filter === "read"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("read")
                    }
                >
                    {t("read")}
                </button>

            </div>


            {/* =========================
                Actions
            ========================= */}

            {!loading &&
                notifications.length > 0 && (

                    <div className="notification-actions">

                        {!selectionMode ? (

                            <>
                                <button
                                    className="select-btn"
                                    onClick={() =>
                                        setSelectionMode(true)
                                    }
                                >
                                    ☑️ {t("select")}
                                </button>

                                <button
                                    className="delete-all-btn"
                                    onClick={deleteAll}
                                >
                                    🗑️ {t("deleteAll")}
                                </button>
                            </>

                        ) : (

                            <>

                                <label className="select-all">

                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={selectAll}
                                    />

                                    <span>
                                        {t("selectAll")}
                                    </span>

                                </label>


                                <button
                                    className="mark-all-read-btn"
                                    onClick={markAllAsRead}
                                >
                                    ✓ {t("markAllAsRead")}
                                </button>


                                <button
                                    className="delete-selected-btn"
                                    onClick={deleteSelected}
                                    disabled={
                                        selectedIds.length === 0
                                    }
                                >
                                    🗑️ {t("deleteSelected")}

                                    {selectedIds.length > 0 &&
                                        ` (${selectedIds.length})`
                                    }
                                </button>


                                <button
                                    className="cancel-selection-btn"
                                    onClick={cancelSelection}
                                >
                                    ✕ {t("cancel")}
                                </button>

                            </>

                        )}

                    </div>
                )
            }


            {/* =========================
                Loading
            ========================= */}

            {loading ? (

                <p className="loading">
                    {t("loading")}
                </p>

            ) : filteredNotifications.length === 0 ? (

                <p className="empty">
                    {t("noNotifications")}
                </p>

            ) : (

                <div className="notifications-list">

                    {filteredNotifications.map((item) => (

                        <div
                            key={item.id}
                            className={
                                `notification-card ${item.status} ${
                                    selectedIds.includes(item.id)
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={() => {

                                if (selectionMode) {
                                    return;
                                }

                                if (item.status === "unread") {
                                    markAsRead(item.id);
                                }

                            }}
                        >

                            {/* =========================
                                Checkbox
                            ========================= */}

                            {selectionMode && (

                                <div
                                    className="notification-checkbox"
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedIds.includes(
                                                item.id
                                            )
                                        }
                                        onChange={() =>
                                            toggleSelect(
                                                item.id
                                            )
                                        }
                                    />

                                </div>

                            )}


                            {/* =========================
                                Icon
                            ========================= */}

                            <div className="notification-icon">

                                {
                                    item.type === "new_request"
                                        ? "📝"
                                        : item.type === "comment"
                                            ? "💬"
                                            : item.type === "comment_reply"
                                                ? "↩️"
                                                : "🔔"
                                }

                            </div>


                            {/* =========================
                                Content
                            ========================= */}

                            <div className="notification-content">

                                <p>
                                    {getNotificationMessage(item)}
                                </p>

                                <div className="notification-meta">

                                    <span>
                                        {item.type}
                                    </span>

                                    <small>
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString()}
                                    </small>

                                </div>

                            </div>


                            {/* =========================
                                Unread
                            ========================= */}

                            {item.status === "unread" && (

                                <span className="unread-dot"></span>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default AdminNotifications;