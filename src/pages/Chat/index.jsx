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
    const [messagess, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('');
    const wsChat = useRef(null);

    const colors = [
        "#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#33fff7", "#f7ff33"
    ];

    
    

        const connectWebSocketChat = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    throw new Error('No access token available');
                }
                console.log(groups,'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
                const email = localStorage.getItem("saved_email");
    
                wsChat.current = new WebSocket(
                    `ws://135.181.42.192/chat/?email=${email}&token=${token}`
                );

                wsChat.current.onopen = () => {
                    console.log("WebSocketChat connection established.");
                };

                wsChat.current.onmessage = (event) => {
                    console.log("Chat Received raw WebSocket message:", event.data);

                    const data = JSON.parse(event.data);
                    console.log(data,messagess,'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')

                    setMessages(prevMessages => {
                        // Check if the message with the same ID already exists
                        const isDuplicate = prevMessages.some(message => message.id === data.id);
                    
                        // Only add the new message if it's not a duplicate
                        if (!isDuplicate) {
                            return [...prevMessages, data];
                        }
                    
                        // Return the previous state if it's a duplicate
                        return prevMessages;
                    });
                    console.log(messagess,data,'---------------------------------------')
                };

                wsChat.current.onerror = async (error) => {
                    console.error("WebSocketChat error:", error);

                    try {
                        await refreshAccessToken();
                        connectWebSocketChat();
                    } catch (refreshError) {
                        console.error('Chat Error refreshing token:', refreshError);
                    }
                };

                wsChat.current.onclose = async (event) => {
                    if (event.wasClean) {
                        console.log(`WebSocketChat connection closed cleanly, code=${event.code}, reason=${event.reason}`);
                        setTimeout(connectWebSocketChat, 5000);
                    } else {
                        console.error("WebSocketChat connection died unexpectedly");
                        try {
                            await refreshAccessToken();
                            setTimeout(connectWebSocketChat, 5000);
                        } catch (refreshError) {
                            console.error('Chat Error refreshing token:', refreshError);
                        }
                    }
                };
            } catch (error) {
                console.error('WebSocketChat connection error:', error);
            }
        };

        const sendMessage = () => {
            
            console.log('pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp',wsChat.current)
            if (wsChat.current) {
            wsChat.current.send(JSON.stringify({
               room:activeGroup,
               content:inputValue
            }))
            console.log('oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',wsChat.current)
        }
        }

        useEffect(() => {
            connectWebSocketChat();
          
            return () => {
                if (wsChat.current && wsChat.current.readyState === WebSocket.OPEN) {
                    wsChat.current.close();
                }
            };
        }, []);

    const fetchData = async () => {
        try {

            const accessToken = localStorage.getItem('access_token');
    
            if (!accessToken) {
                throw new Error('Access token is not available');
            }
    
            const response = await fetch('http://135.181.42.192/accounts/RoomsApiView/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' 
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setGroups(data);
    
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
  

    useEffect(() => {
       
        fetchData();
    }, []);


    const fetchMessages = async () => {
        try {
            
            const accessToken = localStorage.getItem('access_token');
    
            if (!accessToken) {
                throw new Error('Access token is not available');
            }
    
            const response = await fetch('http://135.181.42.192/accounts/messages/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' 
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(data,';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
            
            setMessages(data.results.reverse());
    
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
  
    useEffect(() => {
       
        fetchMessages();
    }, []);
   
    const renderMessages = () => {
        return messagess
            .filter((message) => message.room === activeGroup)
            .map((message, index, filteredMessages) => {
                const isSameAsPrevious =
                    index > 0 &&
                    filteredMessages[index - 1].typeM === message.typeM &&
                    filteredMessages[index - 1].user.first_name === message.user.first_name;

                const color = colors[index % colors.length];

                return (
                    <div key={message.id} className={`${message.typeM}`}>
                        {!isSameAsPrevious && message.typeM !== "sent" && (
                            <div className="avatar-column">
                                <div className="avatar" style={{ color }}>
                                    {message.user?.first_name ? message.user.first_name.charAt(0) : ''}
                                </div>
                            </div>
                        )}

                        <div className={`message ${isSameAsPrevious ? "indented" : ""}`}>
                            {!isSameAsPrevious && message.typeM !== "sent" && (
                                <div className="name" style={{ color }}>
                                    {message.user.first_name}
                                </div>
                            )}
                            <div className="text">{message.content}</div>
                            <div className="time">{message.timestamp}</div>
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
        const mygroupName = groups.find(g => g.id === group)?.name || []
        const groupMembers = groups.find(g => g.id === group)?.members || [];
        setGroupName(mygroupName);
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

  
    useEffect(() => {
        if (selectedGroup) {
            const mygroupName = groups.find(g => g.id === selectedGroup)?.name || [];
            const groupMembers = groups.find(g => g.id === selectedGroup)?.members || [];
            setGroupName(mygroupName);
            setMembers(groupMembers);
            console.log(groupMembers, '0000000000000000000000000000000000000000000000000');
        }
    }, [groups, selectedGroup]);


    const handleMembersUpdated = () => {
        fetchData();
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
                    {groups.map(group => (
                        <div
                            key={group.id}
                            className={`chat-list-item ${activeGroup === group.id ? "active" : ""}`}
                            onClick={() => setActiveGroup(group.id)}
                        >
                            <div className="avatar"><MdGroups /></div>
                            <div className="chat-info">
                                <h4>{group.name}</h4>
                                <p>İlkin Əliyev: <span>Bu tapşırığı götürürəm</span></p>
                            </div>
                            <div className="chat-meta">
                                <span className="time">12m</span>
                            </div>
                        </div>
                    ))}
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
                            <RiAttachmentLine onClick={handleAttachmentClick} className="attachment-icon" />                            
                            <div className="chat-input-icon">
                                <input   value={inputValue} onChange={(e) => setInputValue(e.target.value)}  type="text" placeholder="Mesaj yaz" />
                                <BsFillSendFill onClick={sendMessage} className="send-icon" />
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
