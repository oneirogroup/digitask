import axios from "axios";
import { useEffect, useState } from "react";
import { BsChatTextFill } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { MdMenu, MdPerson } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

import NotificationModal from "../../../components/NotificationModal";

import "./navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  const [notificationNumber, setNotificationNumber] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const location = useLocation();

  const getLinkStyle = path => {
    return location.pathname === path ? { color: "#005ABF" } : {};
  };

  let ws3;

  const connectWebSocket3 = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token available");
      }

      const email = localStorage.getItem("saved_email");
      ws3 = new WebSocket(`ws://135.181.42.192/notification/?email=${email}&token=${token}`);

      ws3.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws3.onmessage = event => {
        const data = JSON.parse(event.data);
        const decodedMessages = data.message.map(notification => ({
          ...notification,
          message: decodeURI(notification.message),
          user_email: decodeURI(notification.user_email)
        }));
        console.log(decodedMessages);
        setNotifications(decodedMessages);
        setNotificationNumber(decodedMessages.filter(message => !message.read_by).length);
      };

      ws3.onerror = async error => {
        console.error("WebSocket error:", error);

        try {
          connectWebSocket3();
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
        }
      };

      ws3.onclose = async event => {
        if (event.wasClean) {
          setTimeout(connectWebSocket3, 5000);
        } else {
          console.error("WebSocket connection died unexpectedly");
          try {
            setTimeout(connectWebSocket3, 5000);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        }
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  };

  useEffect(() => {
    connectWebSocket3();
    return () => {
      if (ws3 && ws3.readyState === WebSocket.OPEN) {
        ws3.close();
      }
    };
  }, []);

  const markNotificationsAsRead = async notificationIds => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const apiEndpoint = "http://135.181.42.192/accounts/notifications/mark-as-read/";

      const payload = {
        notification_ids: notificationIds
      };

      // Make the POST request
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleNotificationClick = () => {
    setIsModalOpen(true);

    markNotificationsAsRead(notifications.filter(notification => notification.id).map(notification => notification.id));
    setNotificationNumber("0");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get("http://135.181.42.192/accounts/profile/", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProfilePicture(response.data.profil_picture);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
    <div className="navbar-icons">
      <MdMenu className="burger-icon" onClick={onToggleSidebar} />

      {/* Chat icon */}
      <Link reloadDocument to="/chat/" style={getLinkStyle("/chat/")}>
        <BsChatTextFill />
      </Link>

      {/* Notifications icon */}
      <div onClick={handleNotificationClick} style={getLinkStyle("/notifications/")} className="notification-icon-div">
        <IoNotifications />
        <span>{notificationNumber}</span>
      </div>

      {/* Profile icon */}
      <Link to="/profile/" style={getLinkStyle("/profile/")}>
        {profilePicture ? (
          <img src={profilePicture} alt="Profile" className="profile-picture" />
        ) : (
          <div className="profile-placeholder">
            <MdPerson />
          </div>
        )}
      </Link>

      {/* Notification Modal */}
      <NotificationModal notifications={notifications} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Navbar;
