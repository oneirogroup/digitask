import { message } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import useRefreshToken from "../../common/refreshToken";

import "./adduser.css";

const AddUserModal = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    group: "",
    position: "",
    username: "",
    password: "",
    password2: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [groupOptions, setGroupOptions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedUserTypeLabel, setSelectedUserTypeLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const refreshAccessToken = useRefreshToken();

  const fetchPositions = async () => {
    try {
      const response = await axios.get("https://app.desgah.az/accounts/positions/positions/");
      setPositions(response.data);
      initializePositionModals(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response.status == 403) {
        await fetchPositions();
        message.error("Vəzifə göstərilərkən xəta baş verdi");
      }
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const groupDropdownRef = useRef(null);
  const userTypeDropdownRef = useRef(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("https://app.desgah.az/services/groups/");
        setGroupOptions(response.data);
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchGroups();
        }
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFormErrors({
      ...formErrors,
      [name]: ""
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name) errors.first_name = "Ad boş buraxıla bilməz";
    if (!formData.last_name) errors.last_name = "Soyad boş buraxıla bilməz";
    if (!formData.email) errors.email = "Email boş buraxıla bilməz";
    if (!formData.username) errors.username = "İstifadəçi adı boş buraxıla bilməz";
    if (!formData.group) errors.group = "Qrup seçilməlidir";
    if (!formData.position) errors.position = "Vəzifə seçilməlidir";
    if (!formData.password) errors.password = "Şifrə boş buraxıla bilməz";
    if (formData.password !== formData.password2) errors.password2 = "Şifrələr uyğun deyil";
    if (!formData.phone) errors.phone = "Nömrə boş buraxıla bilməz";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGroupDropdownToggle = () => {
    setShowGroupDropdown(!showGroupDropdown);
  };

  const handleUserTypeDropdownToggle = () => {
    setShowUserTypeDropdown(!showUserTypeDropdown);
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

  const handleSelectGroup = (id, groupName) => {
    setFormData({
      ...formData,
      group: id
    });
    setSelectedGroupName(groupName);
    setShowGroupDropdown(false);
    setFormErrors({
      ...formErrors,
      group: ""
    });
  };

  const handleSelectUserType = userType => {
    const selectedPosition = positions.find(option => option.id === userType);
    setFormData({
      ...formData,
      position: userType
    });
    setSelectedUserTypeLabel(selectedPosition ? selectedPosition.name : "");
    setShowUserTypeDropdown(false);
    setFormErrors({
      ...formErrors,
      position: ""
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post("https://app.desgah.az/accounts/register/", formData);
        onUserAdded(response.data);
        onClose();
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          handleSubmit(e, true);
        } else {
          setFormErrors({
            ...formErrors,
            submit: "Qeydiyyat zamanı bir xəta baş verdi. Xahiş olunur, yenidən cəhd edin."
          });
        }
      }
    }
  };

  return (
    <div className="add-user-modal" onClick={e => e.stopPropagation()}>
      <div className="add-user-modal-content" onClick={e => e.stopPropagation()}>
        <div className="add-user-modal-title">
          <h5>Yeni istifadəçi</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <div className="form-group">
              <label>Ad</label>
              <input
                type="text"
                placeholder="Adı daxil edin"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {formErrors.first_name && <span className="error-message">{formErrors.first_name}</span>}
            </div>
            <div className="form-group">
              <label>Soyad</label>
              <input
                type="text"
                placeholder="Soyadı daxil edin"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {formErrors.last_name && <span className="error-message">{formErrors.last_name}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="E-poçt ünvanınızı daxil edin"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
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
              {formErrors.username && <span className="error-message">{formErrors.username}</span>}
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
                        onClick={() => handleSelectGroup(group.id, group.group)}
                        className={formData.group === group.id ? "selected" : ""}
                      >
                        {group.group}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.group && <span className="error-message">{formErrors.group}</span>}
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
                    {positions.map(option => (
                      <div
                        key={option.id}
                        onClick={() => handleSelectUserType(option.id)}
                        className={formData.position.name === option.name ? "selected" : ""}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.position && <span className="error-message">{formErrors.position}</span>}
            </div>
            <div className="form-group">
              <label>Şifrə</label>
              <input
                type="password"
                placeholder="Şifrə daxil edin"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && <span className="error-message">{formErrors.password}</span>}
            </div>
            <div className="form-group">
              <label>Şifrə (təkrar)</label>
              <input
                type="password"
                placeholder="Şifrəni təkrar daxil edin"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
              />
              {formErrors.password2 && <span className="error-message">{formErrors.password2}</span>}
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
              {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
            </div>
          </div>
          <button type="submit">İstifadəçi əlavə et</button>
          {formErrors.submit && <div className="error-message submit-error-message">{formErrors.submit}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
