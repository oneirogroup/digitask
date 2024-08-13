import { AiOutlineMessage } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { MdPerson } from "react-icons/md";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationModal from "../../../components/NotificationModal";

const Navbar = () => {
    const [notificationNumber, setnotificationNumber] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    const getLinkStyle = (path) => {
        return location.pathname === path ? { color: "#005ABF" } : {};
    };

    let ws3;

    const connectWebSocket3 = () => {
        const token = localStorage.getItem("access_token");
        console.log(token, "Notification");
        const email = localStorage.getItem("saved_email");
        ws3 = new WebSocket(
            `ws://135.181.42.192/notification/?email=${email}&token=${token}`
        );

        ws3.onopen = () => {
            console.log(
                " Notification WebSocket1 connection established.------------------------------------"
            );
        };

        ws3.onmessage = (event) => {
            console.log("Notification Received raw WebSocket1 message:", event.data);

            const data = JSON.parse(event.data);
            console.log(data, "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
            const decodedMessages = data.message.map((notification) => ({
                ...notification,
                message: decodeURI(notification.message),
                user_email: decodeURI(notification.user_email),
            }));
            console.log(data)

            setNotifications(decodedMessages);
            setnotificationNumber(decodedMessages.length);
            console.log(
                decodedMessages,
                "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
            );
        };

        ws3.onerror = (error) => {
            console.error("WebSocket3 error:", error);
        };

        ws3.onclose = (event) => {
            if (event.wasClean) {
                console.log(
                    `WebSocket3 connection closed cleanly, code=${event.code}, reason=${event.reason}`
                );
                setTimeout(connectWebSocket3, 5000);
            } else {
                console.error("WebSocket3 connection died unexpectedly");
                setTimeout(connectWebSocket3, 5000);
            }
        };
    };

    useEffect(() => {
        connectWebSocket3();
        return () => {
            if (ws3 && ws3.readyState === WebSocket.OPEN) {
                ws3.close();
            }
        };
    }, []);

    const handleNotificationClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="navbar-icons">
                <Link to="/chat/" style={getLinkStyle("/chat/")}>
                    <AiOutlineMessage />
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
