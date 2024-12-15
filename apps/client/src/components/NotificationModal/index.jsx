import React from "react";
import { GrClose } from "react-icons/gr";

import "./NotificationModal.css";

const NotificationModal = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null;

  const azMonthNames = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr"
  ];

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const now = new Date();

    const timeDiff = Math.floor((now - date) / 1000);
    const minutes = Math.floor(timeDiff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (date.toDateString() === now.toDateString()) {
      if (hours < 1) {
        return `${Math.max(minutes, 1)} dəqiqə əvvəl`;
      }
      return `${hours} saat əvvəl`;
    } else {
      const day = date.getDate();
      const month = azMonthNames[date.getMonth()];
      return `${day} ${month}`;
    }
  };

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="notification-modal-header">
          <h3>Bildirişlər</h3>
          <button className="notification-modal-close" onClick={onClose}>
            <GrClose />
          </button>
        </div>
        <div className="notification-modal-content">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                <p>
                  <span className="notification-email">
                    {notification.user_email && notification.user_email != "null" ? notification.user_email : ""}
                  </span>
                  <span className="notification-message">{notification.message}</span>
                </p>
                <span className="notification-timestamp">{formatTimestamp(notification.created_at)}</span>
              </div>
            ))
          ) : (
            <span className="no-notification">Bildiriş yoxdur !</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
