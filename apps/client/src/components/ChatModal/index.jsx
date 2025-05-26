import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline, IoPersonRemove } from "react-icons/io5";

import useRefreshToken from "../../common/refreshToken";

import "./chatModal.css";

const ChatModal = ({ isOpen, onClose, groupName, members, group, onMembersUpdated, admin }) => {
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [removeMemberId, setRemoveMemberId] = useState(null);
  const modalRef = useRef(null);
  const removeModalRef = useRef(null);
  const [localMembers, setLocalMembers] = useState(members);

  useEffect(() => {
    if (isOpen) {
      setLocalMembers(members);
    }
  }, [isOpen, members]);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    if (showAddMemberModal) {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const response = await axios.get("https://app.desgah.az/accounts/users/", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const nonMembers = response.data.filter(user => !members.some(member => member.id === user.id));
          setAllUsers(nonMembers);
        } catch (error) {
          if (error.status == 403) {
            await refreshAccessToken();
            fetchUsers();
          }
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [showAddMemberModal, members]);

  const handleCloseModal = () => {
    onClose();
  };

  const handleAddMemberClick = () => {
    setShowAddMemberModal(true);
  };

  const handleAddMembers = async () => {
    try {
      const usersToAdd = Array.from(selectedUsers);
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `https://app.desgah.az/accounts/rooms/${group}/add-members/`,
        { members: usersToAdd },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setSelectedUsers(new Set());
      setShowAddMemberModal(false);

      if (onMembersUpdated) {
        onMembersUpdated();
      }
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleAddMembers();
      }
      console.error("Error adding members:", error.response ? error.response.data : error.message);
    }
  };

  const handleRemoveMember = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `https://app.desgah.az/accounts/rooms/${group}/remove-members/`,
        { members: [removeMemberId] },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setRemoveMemberId(null);

      if (onMembersUpdated) {
        onMembersUpdated();
      }
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleRemoveMember();
      }
      console.error("Error removing member:", error.response ? error.response.data : error.message);
    }
  };

  const handleUserSelection = userId => {
    setSelectedUsers(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return newSelection;
    });
  };

  const handleOverlayClick = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowAddMemberModal(false);
    }
    if (removeModalRef.current && !removeModalRef.current.contains(e.target)) {
      setRemoveMemberId(null);
    }
  };

  const handleRemoveButtonClick = userId => {
    setRemoveMemberId(userId);
  };

  const filteredUsers = allUsers.filter(
    user =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="chatModal-overlay" onClick={handleOverlayClick}>
      <div className="chatModal-content" ref={modalRef}>
        <div className="chatModal-header">
          <h2 className="chatModal-header-text">{groupName}</h2>
          <span className="close" onClick={handleCloseModal}>
            &times;
          </span>
        </div>
        <div className="chatModal-body">
          <div className="members-list">
            <div className="chatModal-members-add">
              <h3>Üzvlər</h3>
              <button onClick={handleAddMemberClick}>Üzv əlavə et</button>
            </div>
            <div className="member-list-style">
              {localMembers.map(member => (
                <div key={member.id} className="member-item">
                  <div className="member-info">
                    <div className="avatar">{member.first_name.charAt(0)}</div>
                    <div className="member-name">
                      {member.first_name} {member.last_name}
                      <span className="adminText">{member.id === admin && " (qrup admini)"}</span>
                    </div>
                  </div>
                  {member.id !== admin && <IoPersonRemove onClick={() => handleRemoveButtonClick(member.id)} />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chatModal-footer"></div>
      </div>
      {showAddMemberModal && (
        <div className="addMemberModal-overlay" onClick={handleOverlayClick}>
          <div className="addMemberModal-content" ref={modalRef} onClick={e => e.stopPropagation()}>
            <h3>Üzv əlavə et</h3>
            <div className="chatModal-search">
              <CiSearch />
              <input
                type="search"
                placeholder="Üzvləri axtarın..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <IoFilterOutline />
            </div>
            <div className="user-list">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${selectedUsers.has(user.id) ? "selected" : ""}`}
                  onClick={() => handleUserSelection(user.id)}
                >
                  <div className="user-info">
                    <div className="user-avatar">{user.first_name.charAt(0)}</div>
                    <div className="user-name">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chatModal-selectChoose">
              <button onClick={handleAddMembers}>Üzv əlavə et</button>
              <button onClick={() => setShowAddMemberModal(false)}>İmtina et</button>
            </div>
          </div>
        </div>
      )}
      {removeMemberId && (
        <div className="removeMemberModal-overlay" onClick={handleOverlayClick}>
          <div className="removeMemberModal-content" ref={removeModalRef} onClick={e => e.stopPropagation()}>
            <h3>Üzvü silmək istədiyinizdən əminsiniz?</h3>
            <div>
              <button onClick={handleRemoveMember}>Sil</button>
              <button onClick={() => setRemoveMemberId(null)}>İmtina et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
