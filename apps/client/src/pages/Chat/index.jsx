import { Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsFillSendFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaCirclePlus } from "react-icons/fa6";
import { IoFilterOutline, IoSearchOutline } from "react-icons/io5";
import { MdGroups, MdMenu } from "react-icons/md";

import { DeleteOutlined } from "@ant-design/icons";

import useRefreshToken from "../../common/refreshToken";
import AddRoomModal from "../../components/AddRoomModal";
import ChatModal from "../../components/ChatModal";

import "./chat.css";

const Chat = () => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [page, setPage] = useState(2);
  const [hasPage, setHasPage] = useState(false);
  const [room, setRoom] = useState("");
  const [groups, setGroups] = useState([]);
  const [messagess, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [inputValue, setInputValue] = useState("");
  const wsChat = useRef(null);
  const divRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);

  const refreshAccessToken = useRefreshToken();

  const colors = ["#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#33fff7", "#f7ff33"];

  const connectWebSocketChat = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token available");
      }

      const email = localStorage.getItem("saved_email");

      wsChat.current = new WebSocket(`wss://app.digitask.store/chat/?email=${email}&token=${token}`);

      wsChat.current.onopen = () => {
        console.log("WebSocketChat connection established.");
      };

      wsChat.current.onmessage = event => {
        console.log("Chat Received raw WebSocket message:", event.data);

        const data = JSON.parse(event.data);

        const email = data?.email;
        if (email) {
          localStorage.setItem("socketEmail", email);
        } else {
          const socketEmail = localStorage.getItem("socketEmail");
          const typeM = data.user.email === socketEmail ? "sent" : "received";
          data.typeM = typeM;
          setShouldScroll(true);
          setMessages(prevMessages => {
            const isDuplicate = prevMessages.some(message => message.id === data.id);
            if (!isDuplicate) {
              return [...prevMessages, data];
            }
            return prevMessages;
          });
        }
      };

      wsChat.current.onerror = async error => {
        console.error("WebSocketChat error:", error);

        try {
          connectWebSocketChat();
        } catch (refreshError) {
          if (refreshError.status == 403) {
            await refreshAccessToken();
            connectWebSocketChat();
          }
        }
      };

      wsChat.current.onclose = async event => {
        if (event.wasClean) {
          console.log(`WebSocketChat connection closed cleanly, code=${event.code}, reason=${event.reason}`);
          setTimeout(connectWebSocketChat, 5000);
        } else {
          console.error("WebSocketChat connection died unexpectedly");
          try {
            setTimeout(connectWebSocketChat, 5000);
          } catch (refreshError) {
            console.error("Chat Error refreshing token:", refreshError);
          }
        }
      };
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        connectWebSocketChat();
      }
      console.error("WebSocketChat connection error:", error);
    }
  };

  const sendMessage = () => {
    refreshAccessToken();
    if (wsChat.current) {
      wsChat.current.send(
        JSON.stringify({
          room: activeGroup,
          content: inputValue
        })
      );
    }
  };

  const handleDeleteGroup = id => {
    if (!id) return;
    fetch(`https://app.digitask.store/accounts/remove_group/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.ok) {
        fetchData();
      }
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      return;
    }
    sendMessage();
    setInputValue("");
  };

  // const formatDate = (dateString) => {
  //     const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, locale: 'az-AZ' };
  //     const date = new Date(dateString);
  //     return new Intl.DateTimeFormat('az-AZ', options).format(date);
  // };

  useEffect(() => {
    connectWebSocketChat();

    return () => {
      if (wsChat.current && wsChat.current.readyState === WebSocket.OPEN) {
        wsChat.current.close();
      }
    };
  }, []);

  const initializeEmployeeModals = groups => {
    const initialModals = {};
    groups.forEach(group => {
      initialModals[group.id] = false;
    });
    setGroups(initialModals);
  };

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Access token is not available");
      }

      const response = await fetch("https://app.digitask.store/accounts/RoomsApiView/", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setGroups(data);
      initializeGroupModals(data);
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchData();
      }
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAddRoomModal]);

  useEffect(() => {
    fetchMessages();
  }, [activeGroup]);

  useEffect(() => {
    if (shouldScroll) {
      if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }
    }
  }, [messagess, activeGroup]);

  const handleMessagePage = () => {
    if (room == activeGroup) {
      setPage(prevPage => Number(prevPage) + 1);
    } else {
      setRoom(activeGroup);
      setPage(page);
    }
  };

  const fetchMessages = async (arg = false) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Access token is not available");
      }
      const params = new URLSearchParams();

      if (room && page) {
        params.append("room", room);
        params.append("page", page);
      }

      const response = await fetch(`https://app.digitask.store/accounts/messages/?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const count = data.filter(item => item.room === activeGroup).length;
      setHasPage(count % 30 == 0 && count != 0);

      if (arg) {
        setShouldScroll(false);
      } else {
        setShouldScroll(true);
      }

      ///////////////////////////
      const result = [];
      let lastDate = null;

      data.reverse().forEach(message => {
        // Tarihi sadece YYYY-MM-DD formatında al
        const dateObj = new Date(message.timestamp);
        const currentDate = `${String(dateObj.getDate()).padStart(2, "0")}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${dateObj.getFullYear()}`;

        // Eğer tarih değişmişse, yeni bir separator ekle
        if (lastDate !== currentDate) {
          result.push({
            typeM: "date",
            content: currentDate,
            timestamp: message.timestamp,
            room: message.room
          });
          lastDate = currentDate;
        }

        result.push(message);
      });
      setMessages(result);
      ///////////////////////////
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchMessages();
      }
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    const arg = room && page;
    fetchMessages(arg);
  }, [room, page]);

  useEffect(() => {
    const updateLastMessages = () => {
      const latestMessages = {};

      messagess.forEach(message => {
        const { room, timestamp } = message;
        if (!latestMessages[room] || new Date(latestMessages[room].timestamp) < new Date(timestamp)) {
          latestMessages[room] = message;
        }
      });

      setLastMessages(latestMessages);
    };

    updateLastMessages();
  }, [messagess]);

  const renderMessages = () => {
    return messagess
      .filter(message => message.room === activeGroup)
      .map((message, index, filteredMessages) => {
        const isSameAsPrevious =
          index > 0 &&
          filteredMessages[index - 1].typeM === message.typeM &&
          filteredMessages[index - 1].user.first_name === message.user.first_name;

        const color = colors[index % colors.length];
        if (message.typeM == "date") {
          console.log(message, "mesage");
        }
        return (
          <div key={message.id} className={`${message.typeM}`}>
            {!isSameAsPrevious && message.typeM !== "sent" && message.typeM !== "date" && (
              <div className="avatar-column">
                <div className="avatar" style={{ color }}>
                  {message.user?.first_name ? message.user.first_name.charAt(0) : ""}
                </div>
              </div>
            )}

            <div className={`message ${isSameAsPrevious ? "indented" : ""}`}>
              {!isSameAsPrevious && message.typeM !== "sent" && message.typeM !== "date" && (
                <div className="name" style={{ color }}>
                  {message.user.first_name}
                </div>
              )}

              <div className="text">{message.content}</div>

              <div className="time">{message.typeM !== "date" ? formatDate(message.timestamp) : ""}</div>
            </div>
          </div>
        );
      });
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleOpenModal = group => {
    setSelectedGroup(group);
    const mygroupName = groups.find(g => g.id === group)?.name || [];
    const groupMembers = groups.find(g => g.id === group)?.members || [];
    const groupAdminId = groups.find(g => g.id === group)?.admin?.id || [];
    setAdminId(groupAdminId);
    setGroupName(mygroupName);
    setMembers(groupMembers);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGroup(null);
  };

  useEffect(() => {
    refreshAccessToken();
    if (selectedGroup) {
      const mygroupName = groups.find(g => g.id === selectedGroup)?.name || [];
      const groupMembers = groups.find(g => g.id === selectedGroup)?.members || [];
      setGroupName(mygroupName);
      setMembers(groupMembers);
    }
  }, [groups, selectedGroup]);

  const handleMembersUpdated = () => {
    fetchData();
  };

  const handleRoomAdded = async newGroup => {
    setGroups(prevEmployees => [...prevEmployees, newGroup]);

    initializeEmployeeModals([...groups, newGroup]);

    await fetchEmployees();
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = dateString => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    return new Intl.DateTimeFormat("az-AZ", options).format(new Date(dateString));
  };

  const openAddGroupModal = () => {
    setIsAddRoomModal(true);
  };

  const closeAddRoomModal = () => {
    setIsAddRoomModal(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850 || window.innerWidth <= 850);

  const sidebarRef = useRef(null);
  const buttonRef = useRef(null); // Reference for the button

  const toggleSidebar = () => {
    if (window.innerWidth <= 850) {
      setIsSidebarOpen(prev => !prev);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      // Check if the click is outside the sidebar and not on the button
      if (
        window.innerWidth <= 850 &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className={`chat-sidebar ${isSidebarOpen ? "open" : "closed"}`} ref={sidebarRef}>
        <div className="chat-header">
          <h2 className="chat-title">
            Chat <FaCirclePlus onClick={openAddGroupModal} className="add-icon" />
          </h2>
          <div className="chat-search">
            <IoSearchOutline className="search-icon" />
            <input value={searchTerm} onChange={handleSearchChange} type="text" placeholder="Axtar" />
            <IoFilterOutline className="sort-icon" />
          </div>
        </div>
        <div className="chat-list">
          {groups
            .filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(group => {
              const lastMessage = lastMessages[group.id];
              const limitedContent =
                lastMessage?.content?.length > 80
                  ? `${lastMessage?.content.substring(0, 80)}...`
                  : lastMessage?.content;
              const userName =
                lastMessage?.typeM === "received"
                  ? `${lastMessage.user?.first_name} ${lastMessage.user?.last_name}`
                  : "Mən";
              return (
                <div
                  key={group.id}
                  className={`chat-list-item ${activeGroup === group.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveGroup(group.id);
                    toggleSidebar();
                  }}
                >
                  <div className="avatar">
                    <MdGroups />
                  </div>
                  <div className="chat-info">
                    <h4>{group.name}</h4>
                    <p>
                      <div>
                        {limitedContent ? (
                          <>
                            {userName}: <span>{limitedContent}</span>
                          </>
                        ) : (
                          <span>Məktub yoxdur</span>
                        )}
                      </div>
                    </p>
                  </div>
                  <div className="chat-meta">{/* <span className="time">{lastMessage?.timestamp[0:10]}</span> */}</div>
                </div>
              );
            })}
        </div>
      </div>

      <div className={`chat-content ${isSidebarOpen ? "closeChatContent" : "openChatContent"}`}>
        {activeGroup ? (
          <>
            <div className="chat-content-header">
              {isSidebarOpen ? (
                <button onClick={toggleSidebar} ref={buttonRef} className="sidebar-toggle-button closeChatSidebar">
                  <MdMenu />
                </button>
              ) : (
                <button onClick={toggleSidebar} ref={buttonRef} className="sidebar-toggle-button openChatSidebar">
                  <MdMenu />
                </button>
              )}
              <div className="chat-header-avatar-user" onClick={() => handleOpenModal(activeGroup)}>
                <div className="avatar">
                  <MdGroups />
                </div>
                <div className="chat-content-user-info">
                  <h3>{groups.find(group => group.id === activeGroup)?.name}</h3>
                  <span className="chat-users">
                    {groups
                      .find(group => group.id === activeGroup)
                      ?.members.map(member => `${member.first_name} ${member.last_name}`)
                      .join(", ")}
                  </span>
                </div>
              </div>
              <div className="chat-content-actions">
                <Popconfirm
                  title="Qrupu silmək istədiyinizdən əminsiniz ?"
                  description="Qrupu sildikdən sonra məlumatları geri qaytarmaq mümkün olmayacaq"
                  onConfirm={() => handleDeleteGroup(groups.find(group => group.id === activeGroup)?.id)}
                  okText="Sil"
                  cancelText="Ləğv et"
                >
                  <DeleteOutlined className="deleteIconChat" />
                </Popconfirm>
              </div>
            </div>
            <div ref={divRef} className="chat-messages">
              {hasPage ? (
                <div class="loadMessages">
                  <button class="loadButton" onClick={() => handleMessagePage()}>
                    Daha çox məktub ↻
                  </button>
                </div>
              ) : (
                <></>
              )}

              {renderMessages()}
            </div>
            <div className="chat-input">
              <div className="chat-input-icon">
                <input
                  class="messageInput"
                  onKeyDown={handleKeyDown}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  type="text"
                  placeholder="Mesaj yaz"
                />
                <BsFillSendFill onClick={handleSendMessage} className="send-icon" />
              </div>
            </div>
          </>
        ) : (
          ""
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
        admin={adminId}
      />
      {isAddRoomModal && (
        <AddRoomModal isOpen={isAddRoomModal} onClose={closeAddRoomModal} onGroupAdded={handleRoomAdded} />
      )}
    </div>
  );
};

export default Chat;
