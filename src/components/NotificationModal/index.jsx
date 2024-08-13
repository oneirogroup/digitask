import React from "react";
import "./NotificationModal.css";
import { GrClose } from "react-icons/gr";

const NotificationModal = ({ notifications, isOpen, onClose }) => {
    if (!isOpen) return null;

    const azMonthNames = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
        'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                    {notifications.map((notification, index) => (
                        <div key={index} className="notification-item">
                            <p>
                                <span className="notification-email">
                                    {notification.user_email}
                                </span>
                                <span className="notification-message">{notification.message}
                                </span>
                            </p>
                            <span className="notification-timestamp">
                                {formatTimestamp(notification.created_at)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
