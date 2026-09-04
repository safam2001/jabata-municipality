import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from '../api/axiosInstance';
import "./Notifications.css";
import { useNavigate } from "react-router-dom";
const Notifications = () => {
  const { t } = useTranslation();
const navigate=useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/notifications/my-notifications"
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };
const handleNotificationClick = async (notification) => {
  try {
    if (notification.status === "unread") {
      await axiosInstance.patch(
        `/api/notifications/${notification.id}/read`
      );
    }

    if (notification.requestId) {
      navigate(`/my-requests/${notification.requestId}`);
    }

    fetchNotifications();

  } catch (err) {
    console.log(err);
  }
};
const getNotificationMessage = (item) => {
  if (item.type === "request_status") {
    const status = item.message?.replace(
      "Your request has been ",
      ""
    );

    return t("requestStatusNotification", {
      status: t(`requestStatuses.${status}`)
    });
  }

  return item.message;
};
  return (
    <div className="notifications-page">
      <h2>{t("notifications")}</h2>

      {notifications.length === 0 ? (
        <p>{t("noNotifications")}</p>
      ) : (
        notifications.map((item) => (
          <div
            key={item.id} onClick={()=> handleNotificationClick(item)}
            className={`notification-card ${item.status}`}
          >
        <p>{getNotificationMessage(item)}</p>

            <small>
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;