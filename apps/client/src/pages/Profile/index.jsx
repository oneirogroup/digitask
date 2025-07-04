import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { AiFillMail } from "react-icons/ai";
import { FaChevronDown, FaChevronRight, FaChevronUp, FaPhoneAlt, FaRegEdit, FaSave } from "react-icons/fa";
import { message } from "antd";

import { EditFilled } from "@ant-design/icons";

import useRefreshToken from "../../common/refreshToken";

import "./profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const userTypeDropdownRef = useRef();
  const groupDropdownRef = useRef();
  const refreshAccessToken = useRefreshToken();

  const [userTypeOptions, setUserTypeOptions] = useState([]);
  const [groups, setGroups] = useState([]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get("https://app.digitask.store/accounts/profile/");
      setProfileData({
        ...response.data,
        groupName: response.data.group?.group || "",
        region: response.data.group?.region_name || ""
      });
    } catch (error) {
      if (error.status == 403) {
        refreshAccessToken();
        fetchProfileData();
      }
      console.error("Error fetching profile data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get("https://app.digitask.store/accounts/positions/positions/");
      setUserTypeOptions(response?.data?.map(item => ({ id: item?.id, name: item?.name })));
    } catch (error) {
      if (error.status == 403) {
        refreshAccessToken();
        fetchUserTypes();
      }
      console.error("Error fetching profile data", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchGroups();
    fetchUserTypes();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("https://app.digitask.store/services/user_groups/");
      await refreshAccessToken();
      setGroups(response.data);
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchGroups();
      }
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
        region: selectedGroup.region_name,
        region_name: selectedGroup.region_name,
        groupData: selectedGroup.id
      }));
    }
    setShowGroupDropdown(false);
  };


  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleProfileUpdate = async () => {
    try {
      const { profil_picture, ...profileWithoutPhoto } = profileData;
      console.log(profileData);

      await axios.put("https://app.digitask.store/accounts/profile_update/", {
        ...profileWithoutPhoto,
        group: profileData?.group?.id || profileData.group,
        groupName: profileData.groupName,
        groupData: profileData.groupData,
        position: profileData?.position?.id
      });


      console.log(profileData);
      setEditMode(false);
      fetchProfileData();
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleProfileUpdate();
      }
      console.error("Error updating profile", error);
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      await axios.delete("https://app.digitask.store/accounts/profile_image_update/");
      fetchProfileData();
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        await axios.delete("https://app.digitask.store/accounts/profile_image_update/");
        fetchProfileData();
      }
      console.error("Profil şəkli silinərkən xəta baş verdi", error);
    }
  };


  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error("Profil şəkli 5MB-dan böyükdür. Şəkli yükləmək üçün daha kiçik ölçüdə bir şəkil seçin.");
        return;
      }
      const formData = new FormData();
      formData.append("profil_picture", file);
      try {
        await axios.put("https://app.digitask.store/accounts/profile_image_update/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        fetchProfileData();
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          await axios.put("https://app.digitask.store/accounts/profile_image_update/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          fetchProfileData();
        }
        console.log("Error updating profile picture", error);
      }
    }
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSelectUserType = userType => {
    const position = userTypeOptions?.find(item => item?.id == userType);
    setProfileData(prevData => ({ ...prevData, position: position }));
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
              <div className="profile-photo">
                {profileData.profil_picture ? (
                  <div className="pp-div">
                    <img
                      src={profileData.profil_picture}
                      alt="Profile"
                      className={`image-preview ${editMode && "blurPic"}`}
                      onClick={() => handleImageClick(profileData.profil_picture)}
                    />
                    {editMode && (
                      <div className="pp-controls">
                        <label htmlFor="passport" className="upload-label-profile">
                          <div className="labelDiv">
                            <EditFilled style={{ fontSize: "30px", color: "#247bd7" }} />
                          </div>
                        </label>
                        <button
                          className="delete-profile-btn"
                          onClick={handleDeleteProfilePicture}
                        >
                          <i className="fa-solid fa-trash" style={{ fontSize: "30px", color: "#d9534f" }}></i>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  editMode && (
                    <label htmlFor="passport" className="profile-upload-label">
                      <span className="upload-text">Yükləmək üçün klikləyin</span>
                      <div className="profile-upload-icon">
                      </div>
                    </label>

                  )
                )}
                {editMode && (
                  <input
                    type="file"
                    id="passport"
                    name="passport"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                )}
              </div>
              <div>
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
                      {userTypeOptions?.find(item => item?.id == profileData?.position?.id)?.name ||
                        "Istifadəçi növü seçin"}
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
                            key={option.id}
                            onClick={() => handleSelectUserType(option.id)}
                            className={profileData?.position === option.id ? "selected" : ""}
                          >
                            {option.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <input
                    type="text"
                    id="user_type"
                    value={
                      userTypeOptions?.find(item => item?.id == profileData?.position?.id)?.name ||
                      "İstifadəçi növü daxil edilməyib"
                    }
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
                <label htmlFor="region_name">Ərazi</label>
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
