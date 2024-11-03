import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import useRefreshToken from "../../common/refreshToken";
import PasswordChangeModal from "../PasswordChangeModal";

import "./updateuser.css";

const UpdateUserModal = ({ isOpen, onClose, employee, onUpdateUser }) => {
  if (!isOpen) return null;

  const formRef = useRef(null);
  const groupDropdownRef = useRef(null);
  const userTypeDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    user_type: "",
    username: "",
    group: "",
    group_id: "",
    groupRegion: "",
    first_name: "",
    last_name: ""
  });

  const [groupOptions, setGroupOptions] = useState([]);
  const [userTypeOptions] = useState([
    { value: "Texnik", label: "Texnik" },
    { value: "Plumber", label: "Plumber" },
    { value: "Ofis menecer", label: "Ofis menecer" },
    { value: "Texnik menecer", label: "Texnik menecer" }
  ]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedUserTypeLabel, setSelectedUserTypeLabel] = useState("");
  const [groupChanged, setGroupChanged] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://135.181.42.192/services/groups/");
        setGroupOptions(response.data);
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchGroups(true);
        }
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (employee && employee.id) {
      setFormData({
        email: employee.email || "",
        phone: employee.phone || "",
        user_type: employee.user_type || "",
        username: employee.username || "",
        group: employee.group?.group || "",
        group_id: employee.group?.id || "",
        groupRegion: employee.group?.region || "",
        first_name: employee.first_name || "",
        last_name: employee.last_name || ""
      });
      setSelectedGroupName(employee.group?.group || "");
      setSelectedUserTypeLabel(userTypeOptions.find(option => option.value === employee.user_type)?.label || "");
    }
  }, [employee, userTypeOptions]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && formRef.current) {
      formRef.current.focus();
    }
  }, [isOpen]);

  const handleGroupDropdownToggle = () => {
    setShowGroupDropdown(!showGroupDropdown);
  };

  const handleSelectGroup = (groupId, group, region) => {
    setFormData({
      ...formData,
      group_id: groupId,
      group: group,
      groupRegion: region
    });
    setSelectedGroupName(group);
    setShowGroupDropdown(false);
    setGroupChanged(true);
  };

  const handleUserTypeDropdownToggle = () => {
    setShowUserTypeDropdown(!showUserTypeDropdown);
  };

  const handleSelectUserType = userType => {
    setFormData({
      ...formData,
      user_type: userType
    });
    setSelectedUserTypeLabel(userTypeOptions.find(option => option.value === userType)?.label || "");
    setShowUserTypeDropdown(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!employee || !employee.id) {
      console.error("Selected employee or employee ID is missing");
      return;
    }

    const updatedFormData = { ...formData };

    if (!groupChanged) {
      updatedFormData.group = employee.group?.group;
      updatedFormData.groupId = employee.group?.id;
      updatedFormData.groupRegion = employee.group?.region;
    }

    console.log("Payload being sent:", updatedFormData);

    try {
      const response = await axios.put(`http://135.181.42.192/accounts/update_user/${employee.id}/`, updatedFormData);
      console.log("User updated successfully:", response.data);
      onUpdateUser(response.data);
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Update error:", error.response.data);
      } else {
        console.error("Update error:", error.message);
      }
    }
  };

  return (
    <div className="add-user-modal" onClick={onClose}>
      <div className="add-user-modal-content" onClick={e => e.stopPropagation()}>
        <div className="add-user-modal-title">
          <h5>İstifadəçi məlumatlarını yenilə</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <form ref={formRef} onSubmit={handleSubmit}>
          <div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="E-poçt ünvanınızı daxil edin"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>İstifadəçi adı</label>
              <input
                type="text"
                placeholder="İstifadəçi adını daxil edin"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Qrup</label>
              <div className="multi-select-container update-user-modal" ref={groupDropdownRef}>
                <button type="button" className="multi-select-button" onClick={handleGroupDropdownToggle}>
                  {selectedGroupName ? selectedGroupName : "Qrup seçin"}
                  <span>{showGroupDropdown ? <FaChevronUp /> : <FaChevronDown />}</span>
                </button>
                {showGroupDropdown && (
                  <div className="multi-select-dropdown">
                    <label htmlFor="closeGroupsDropdown">
                      Qrup
                      <span
                        className="close-dropdown"
                        id="closeGroupsDropdown"
                        onClick={() => setShowGroupDropdown(false)}
                      >
                        &times;
                      </span>
                    </label>
                    {groupOptions.map(group => (
                      <div
                        key={group.id}
                        className="multi-select-item"
                        onClick={() => handleSelectGroup(group.id, group.group, group.region)}
                      >
                        {group.group} ({group.region})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Vəzifə</label>
              <div className="multi-select-container update-user-modal" ref={userTypeDropdownRef}>
                <button type="button" className="multi-select-button" onClick={handleUserTypeDropdownToggle}>
                  {selectedUserTypeLabel ? selectedUserTypeLabel : "Vəzifəni seçin"}
                  <span>{showUserTypeDropdown ? <FaChevronUp /> : <FaChevronDown />}</span>
                </button>
                {showUserTypeDropdown && (
                  <div className="multi-select-dropdown">
                    <label htmlFor="closeUserTypeDropdown">
                      Vəzifə
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
                        className="multi-select-item"
                        onClick={() => handleSelectUserType(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group passwordButton">
              <label htmlFor="">Şifrə</label>
              <button type="button" className="change-password-btn" onClick={() => setShowPasswordModal(true)}>
                Şifrəni yenilə
              </button>
            </div>
            <div className="form-group">
              <label>Nömrə</label>
              <input
                type="text"
                placeholder="Nömrəni daxil edin"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <br />
          </div>
          <button type="submit" className="add-user-modal-btn update-btn">
            Yenilə
          </button>
        </form>
      </div>
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        employee={employee}
        onPasswordChange={() => console.log("Password changed successfully")}
      />
    </div>
  );
};

UpdateUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
  onUpdateUser: PropTypes.func.isRequired
};

export default UpdateUserModal;
