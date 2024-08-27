import { useState, useEffect, useRef } from "react";
import "./chat.css";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5";
import { BsThreeDotsVertical, BsFillSendFill } from "react-icons/bs";
import { MdGroups } from "react-icons/md";
import { RiAttachmentLine } from "react-icons/ri";
import ChatModal from "../../components/ChatModal";
import axios from "axios"

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


const Chat = () => {
    const [activeGroup, setActiveGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const fileInputRef = useRef(null);

    const colors = [
        "#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#33fff7", "#f7ff33"
    ];

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

    useEffect(() => {
        fetch('http://135.181.42.192/accounts/RoomsApiView/')
            .then(response => response.json())
            .then(data => {
                setGroups(data);
            });
    }, []);

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
                                <div className="name" style={{ color }}>
                                    {message.full_name}
                                </div>
                            )}
                            <div className="text">{message.text}</div>
                            <div className="time">{message.time}</div>
                        </div>
                    </div>
                );
            });
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState('');

    const handleOpenModal = (group) => {
        setSelectedGroup(group);
        const groupName = groups.find(g => g.id === group)?.name || []
        const groupMembers = groups.find(g => g.id === group)?.members || [];
        setGroupName(groupName);
        setMembers(groupMembers);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedGroup(null);
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

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://135.181.42.192/accounts/RoomsApiView/');
            setGroups(response.data);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);


    const handleMembersUpdated = () => {
        fetchMembersList();
    };

    const fetchMembersList = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://135.181.42.192/accounts/rooms/{groupId}/members/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMembers(response.data);
        } catch (error) {
            await refreshAccessToken();
            console.error("Error fetching members:", error);
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
                            <div className="chat-header-avatar-user" onClick={() => handleOpenModal(activeGroup)}>
                                <div className="avatar"><MdGroups /></div>
                                <div className="chat-content-user-info">
                                    <h3>{groups.find(group => group.id === activeGroup)?.name}</h3>
                                    <span className="chat-users">
                                        {groups
                                            .find(group => group.id === activeGroup)
                                            ?.members
                                            .map(member => `${member.first_name} ${member.last_name}`)
                                            .join(", ")}
                                    </span>
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
            <ChatModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                groupName={groupName}
                members={members}
                group={selectedGroup}
                onMembersUpdated={handleMembersUpdated}
            />
        </div>
    );
};

export default Chat;
