import { useState, useRef } from "react";
import "./chat.css";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { MdGroups } from "react-icons/md";
import { RiAttachmentLine } from "react-icons/ri";


const Chat = () => {
    const [activeGroup, setActiveGroup] = useState(null);
    const fileInputRef = useRef(null);

    const messages = [
        {
            id: 1,
            groupId: 1,
            full_name: "İlkin Əliyev",
            text: "Bu tapşırığı götürürəm",
            time: "19:34",
            type: "received"
        },
        {
            id: 2,
            groupId: 1,
            full_name: "Ayaz Osmanov",
            text: "Mən də burada kömək edəcəyəm.",
            time: "19:34",
            type: "received"
        },
        {
            id: 3,
            groupId: 1,
            full_name: "Nadir Osmanov",
            text: "Əla, birlikdə işləyək!",
            time: "19:34",
            type: "received"
        },
        {
            id: 4,
            groupId: 2,
            full_name: "Aytac",
            text: "Problem var",
            time: "19:34",
            type: "sent"
        },
        {
            id: 5,
            groupId: 2,
            full_name: "İlkin Əliyev",
            text: "Nə problemi?",
            time: "19:34",
            type: "received"
        },
        {
            id: 6,
            groupId: 2,
            full_name: "Aytac",
            text: "Socket",
            time: "19:34",
            type: "sent"
        }
    ];

    const colors = [
        "#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#33fff7", "#f7ff33"
    ];

    const renderMessages = () => {
        return messages
            .filter((message) => message.groupId === activeGroup)
            .map((message, index, filteredMessages) => {
                const isSameAsPrevious =
                    index > 0 &&
                    filteredMessages[index - 1].type === message.type &&
                    filteredMessages[index - 1].full_name === message.full_name;

                const color = colors[index % colors.length];

                return (
                    <div key={message.id} className={`${message.type}`}>
                        {!isSameAsPrevious && message.type !== "sent" && (
                            <div className="avatar-column">
                                <div className="avatar" style={{ color }}>
                                    {message.full_name.charAt(0)}
                                </div>
                            </div>
                        )}

                        <div className={`message ${isSameAsPrevious ? "indented" : ""}`}>
                            {!isSameAsPrevious && message.type !== "sent" && (
                                <p style={{ color }}>{message.full_name}</p>
                            )}
                            <div className="message-content">
                                <p>{message.text}</p>
                                <span className="message-time">{message.time}</span>
                            </div>
                        </div>
                    </div>
                );
            });
    };

    const handleAttachmentClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };

    return (
        <div className="chat-container">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="chat-header">
                    <h2 className="chat-title">
                        Chat <FaCirclePlus className="add-icon" />
                    </h2>
                    <div className="chat-search">
                        <IoSearchOutline className="search-icon" />
                        <input type="text" placeholder="Axtar" />
                        <IoFilterOutline className="sort-icon" />
                    </div>
                </div>
                <div className="chat-list">
                    <div
                        className={`chat-list-item ${activeGroup === 1 ? "active" : ""}`}
                        onClick={() => setActiveGroup(1)}
                    >
                        <div className="avatar"><MdGroups /></div>
                        <div className="chat-info">
                            <h4>Qrup 1</h4>
                            <p>İlkin Əliyev: <span>Bu tapşırığı götürürəm</span></p>
                        </div>
                        <div className="chat-meta">
                            <span className="time">12m</span>
                        </div>
                    </div>
                    <div
                        className={`chat-list-item ${activeGroup === 2 ? "active" : ""}`}
                        onClick={() => setActiveGroup(2)}
                    >
                        <div className="avatar"><MdGroups /></div>
                        <div className="chat-info">
                            <h4>Qrup 2</h4>
                            <p>Nicat Məmmədli: <span>Problem var</span></p>
                        </div>
                        <div className="chat-meta">
                            <span className="time">5m</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-content">
                {activeGroup ? (
                    <>
                        <div className="chat-content-header">
                            <div className="chat-header-avatar-user">
                                <div className="avatar"><MdGroups /></div>
                                <div className="chat-content-user-info">
                                    <h3>Qrup {activeGroup}</h3>
                                    <span className="chat-users">İlkin Əliyev, Ayaz Osmanov, Nadir Osmanov</span>
                                </div>
                            </div>
                            <div className="chat-content-actions">
                                <BsThreeDotsVertical className="action-icon" />
                            </div>
                        </div>
                        <div className="chat-messages">
                            {renderMessages()}
                        </div>
                        <div className="chat-input">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <RiAttachmentLine onClick={handleAttachmentClick} className="attachment-icon" />                            <div className="chat-input-icon">
                                <input type="text" placeholder="Mesaj yaz" />
                                <BsFillSendFill className="send-icon" />
                            </div>
                        </div>
                    </>
                ) : (''
                    // <div className="chat-placeholder">
                    //     <h3>Qrup mesajlarını görmək üçün bir qrupa klikləyin</h3>
                    // </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
