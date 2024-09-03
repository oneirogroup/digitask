import { BsChatTextFill } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { MdPerson, MdMenu } from "react-icons/md";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationModal from "../../../components/NotificationModal";
import axios from 'axios';

const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('http://135.181.42.192/accounts/token/refresh/', { refresh: refresh_token });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
};

const Navbar = ({ onToggleSidebar }) => {
    const [notificationNumber, setnotificationNumber] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    const getLinkStyle = (path) => {
        return location.pathname === path ? { color: "#005ABF" } : {};
    };

    let ws3;

    const connectWebSocket3 = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error('No access token available');
            }

            const email = localStorage.getItem("saved_email");
            ws3 = new WebSocket(
                `ws://135.181.42.192/notification/?email=${email}&token=${token}`
            );

            ws3.onopen = () => {
                console.log("WebSocket connection established.");
            };

            ws3.onmessage = (event) => {
                console.log("Notification Received raw WebSocket message:", event.data);

                const data = JSON.parse(event.data);
                const decodedMessages = data.message.map((notification) => ({
                    ...notification,
                    message: decodeURI(notification.message),
                    user_email: decodeURI(notification.user_email),
                }));

                setNotifications(decodedMessages);
                setnotificationNumber(decodedMessages.filter(message => !message.read_by).length);
            };

            ws3.onerror = async (error) => {
                console.error("WebSocket error:", error);

                try {
                    await refreshAccessToken();
                    connectWebSocket3();
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                }
            };

            ws3.onclose = async (event) => {
                if (event.wasClean) {
                    console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
                    setTimeout(connectWebSocket3, 5000);
                } else {
                    console.error("WebSocket connection died unexpectedly");
                    try {
                        await refreshAccessToken();
                        setTimeout(connectWebSocket3, 5000);
                    } catch (refreshError) {
                        console.error('Error refreshing token:', refreshError);
                    }
                }
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
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

    const markNotificationsAsRead = async (notificationIds) => {
        try {
      
            const accessToken = localStorage.getItem('access_token');
    
            if (!accessToken) {
                throw new Error('Access token not found');
            }
    
   
            const apiEndpoint = 'http://135.181.42.192/accounts/notifications/mark-as-read/';
    
            const payload = {
                notification_ids: notificationIds,
            };
    
            // Make the POST request
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, 
                },
                body: JSON.stringify(payload),
            });
  
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Notification status updated:', data);
         
            return data;
        } catch (error) {
   
            console.error('Error marking notifications as read:', error);

        }
    };

    const handleNotificationClick = () => {
        setIsModalOpen(true);
        
        markNotificationsAsRead(notifications
            .filter(notification => notification.id)  
            .map(notification => notification.id))
        setnotificationNumber('0')
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>

            <div className="navbar-icons">
                <a onClick={onToggleSidebar} className="menu-toggle">
                    <MdMenu />
                </a>
                <Link to="/chat/" style={getLinkStyle("/chat/")}>
                    <BsChatTextFill />
                </Link>
                <div
                    onClick={handleNotificationClick}
                    style={getLinkStyle("/notifications/")}
                >
                    <IoNotifications />
                    <span>{notificationNumber}</span>
                </div>
                <Link to="/profile/" style={getLinkStyle("/profile/")}>
                    <MdPerson />
                </Link>
            </div>
            <NotificationModal
                notifications={notifications}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default Navbar;
