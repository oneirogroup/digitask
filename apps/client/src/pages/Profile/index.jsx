import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { AiFillMail } from "react-icons/ai";
import { FaChevronDown, FaChevronRight, FaChevronUp, FaPhoneAlt, FaRegEdit, FaSave } from "react-icons/fa";

import "./profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const userTypeDropdownRef = useRef();
  const groupDropdownRef = useRef();

  const [userTypeOptions] = useState([
    { value: "Texnik", label: "Texnik" },
    { value: "Plumber", label: "Plumber" },
    { value: "Ofis menecer", label: "Ofis menecer" },
    { value: "Texnik menecer", label: "Texnik menecer" }
  ]);

  const [groups, setGroups] = useState([]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get("http://135.181.42.192/accounts/profile/");
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://135.181.42.192/services/groups/");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  const handleSelectGroup = groupId => {
    const selectedGroup = groups.find(group => group.id === groupId);
    if (selectedGroup) {
      setProfileData(prevData => ({
        ...prevData,
        group: selectedGroup.id,
        groupName: selectedGroup.group,
        region: selectedGroup.region,
        groupData: selectedGroup.id
      }));
    }
    setShowGroupDropdown(false);
  };

  useEffect(() => {
    fetchProfileData();
    fetchGroups();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleProfileUpdate = async () => {
    try {
      const { profil_picture, ...profileWithoutPhoto } = profileData;
      await axios.put("http://135.181.42.192/accounts/profile_update/", {
        ...profileWithoutPhoto,
        group: profileData.group,
        groupName: profileData.groupName,
        groupData: profileData.groupData
      });
      setEditMode(false);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profil_picture", file);
      try {
        await axios.put("http://135.181.42.192/accounts/profile_image_update/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        fetchProfileData();
      } catch (error) {
        console.error("Error updating profile picture", error);
      }
    }
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSelectUserType = userType => {
    setProfileData(prevData => ({ ...prevData, user_type: userType }));
    setShowUserTypeDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
        setShowGroupDropdown(false);
      }
      if (userTypeDropdownRef.current && !userTypeDropdownRef.current.contains(event.target)) {
        setShowUserTypeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="personal-info">
            <div className="profile-edit">
              <h2>Şəxsi məlumatlar</h2>
              <button onClick={editMode ? handleProfileUpdate : handleEditToggle}>
                {editMode ? (
                  <>
                    Yadda saxla <FaSave />
                  </>
                ) : (
                  <>
                    Profili redaktə et <FaRegEdit />
                  </>
                )}
              </button>
            </div>
            <div className="profile-table">
              <div>
                <div className="profile-photo">
                  <img src={profileData.profil_picture} alt="Profile" />
                </div>

                <div className="left">
                  {editMode && <input type="file" accept="image/*" onChange={handleFileChange} />}
                </div>

                <div className="input-group">
                  <label htmlFor="first_name">Ad</label>
                  <input
                    type="text"
                    id="first_name"
                    value={profileData.first_name}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="last_name">Soyad</label>
                  <input
                    type="text"
                    id="last_name"
                    value={profileData.last_name}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">Əlaqə nömrəsi</label>
                  <div>
                    <div>
                      <FaPhoneAlt />
                      <input
                        type="tel"
                        id="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                    <FaChevronRight />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="email">Mail ünvanı</label>
                  <div>
                    <div>
                      <AiFillMail />
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                    <FaChevronRight />
                  </div>
                </div>
              </div>
              <br />
              <div className="input-group profile-edit-userType-div">
                <label htmlFor="user_type">Vəzifə</label>
                {editMode ? (
                  <>
                    <div id="profile-edit-userType" onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}>
                      {profileData.user_type || "Istifadəçi növü seçin"}
                      {showUserTypeDropdown ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showUserTypeDropdown && (
                      <div className="profile-multi-select-dropdown" ref={userTypeDropdownRef}>
                        <label htmlFor="closeUserTypeDropdown">
                          İstifadəçi növü
                          <span
                            className="close-dropdown"
                            id="closeUserTypeDropdown"
                            onClick={() => setShowUserTypeDropdown(false)}
                          >
                            &times;
                          </span>
                        </label>
                        {userTypeOptions.map(option => (
                          <div
                            key={option.value}
                            onClick={() => handleSelectUserType(option.value)}
                            className={profileData.user_type === option.value ? "selected" : ""}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <input
                    type="text"
                    id="user_type"
                    value={profileData.user_type || "İstifadəçi növü daxil edilməyib"}
                    disabled
                  />
                )}
              </div>
            </div>
          </div>
          <div className="address-info">
            <h2>Qrup məlumatları</h2>
            <div>
              <div className="input-group profile-edit-group-div">
                <label htmlFor="group">Qrup</label>
                {editMode ? (
                  <>
                    <div id="profile-edit-group" onClick={() => setShowGroupDropdown(!showGroupDropdown)}>
                      {profileData.groupName || "Qrup seçin"}
                      {showGroupDropdown ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showGroupDropdown && (
                      <div className="profile-multi-select-dropdown" ref={groupDropdownRef}>
                        <label htmlFor="closeGroupDropdown">
                          Qruplar
                          <span
                            className="close-dropdown"
                            id="closeGroupDropdown"
                            onClick={() => setShowGroupDropdown(false)}
                          >
                            &times;
                          </span>
                        </label>
                        {groups.map(group => (
                          <div
                            key={group.id}
                            onClick={() => handleSelectGroup(group.id)}
                            className={profileData.group === group.id ? "selected" : ""}
                          >
                            {group.group}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <input type="text" id="group" value={profileData.groupName || "Qrup daxil edilməyib"} disabled />
                )}
              </div>
              <div className="input-group">
                <label htmlFor="region">Ərazi</label>
                <input type="text" id="region" value={profileData.region || ""} disabled />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
