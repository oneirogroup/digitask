import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./adduser.css";

const AddUserModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    group: '',
    user_type: '',
    username: '',
    password: '',
    password2: ''
  });

  const [groupOptions, setGroupOptions] = useState([]);
  const [userTypeOptions] = useState([
    { value: 'Texnik', label: 'Texnik' },
    { value: 'Plumber', label: 'Plumber' },
    { value: 'Ofis meneceri', label: 'Ofis meneceri' },
    { value: 'Texnik meneceri', label: 'Texnik meneceri' }
  ]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [selectedUserTypeLabel, setSelectedUserTypeLabel] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://135.181.42.192/services/groups/');
        setGroupOptions(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGroupDropdownToggle = () => {
    setShowGroupDropdown(!showGroupDropdown);
  };

  const handleSelectGroup = (groupId, groupName) => {
    setFormData({
      ...formData,
      group: groupId
    });
    setSelectedGroupName(groupName);
    setShowGroupDropdown(false);
  };

  const handleUserTypeDropdownToggle = () => {
    setShowUserTypeDropdown(!showUserTypeDropdown);
  };

  const handleSelectUserType = (userType) => {
    setFormData({
      ...formData,
      user_type: userType
    });
    setSelectedUserTypeLabel(userTypeOptions.find(option => option.value === userType)?.label || '');
    setShowUserTypeDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://135.181.42.192/accounts/register/', formData);
      console.log('User registered successfully:', response.data);
      onClose();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="add-user-modal" onClick={onClose}>
      <div className="add-user-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className='add-user-modal-title'>
          <h5>Yeni istifadəçi</h5>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder='E-poçt ünvanınızı daxil edin' name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Istifadəçi adı</label>
              <input type="text" placeholder='Istifadəçi adını daxil edin' name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ad</label>
              <input type="text" placeholder='Adı daxil edin' name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Soyad</label>
              <input type="text" placeholder='Soyadı daxil edin' name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Qrup</label>
              <div className="multi-select-container">
                <button type="button" className="multi-select-button" onClick={handleGroupDropdownToggle}>
                  {selectedGroupName ? selectedGroupName : 'Qrup seçin'}
                </button>
                {showGroupDropdown && (
                  <div className="multi-select-dropdown">
                    <label htmlFor="closeGroupsDropdown">
                      Qrup
                      <span className="close-dropdown" id="closeGroupsDropdown" onClick={() => setShowGroupDropdown(false)}>&times;</span>
                    </label>
                    {groupOptions.map(group => (
                      <div
                        key={group.id}
                        onClick={() => handleSelectGroup(group.id, group.group)}
                        className={formData.group === group.id ? 'selected' : ''}
                      >
                        {group.group}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>İstifadəçi növü</label>
              <div className="multi-select-container">
                <button type="button" className="multi-select-button" onClick={handleUserTypeDropdownToggle}>
                  {selectedUserTypeLabel ? selectedUserTypeLabel : 'İstifadəçi növünü daxil edin'}
                </button>
                {showUserTypeDropdown && (
                  <div className="multi-select-dropdown">
                    <label htmlFor="closeUserTypeDropdown">
                      İstifadəçi növü
                      <span className="close-dropdown" id="closeUserTypeDropdown" onClick={() => setShowUserTypeDropdown(false)}>&times;</span>
                    </label>
                    {userTypeOptions.map(option => (
                      <div
                        key={option.value}
                        onClick={() => handleSelectUserType(option.value)}
                        className={formData.user_type === option.value ? 'selected' : ''}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Şifrə</label>
              <input type="password" placeholder='Şifrəni daxil edin' name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Şifrəni təsdiqlə</label>
              <input type="password" placeholder='Şifrəni təkrar daxil edin' name="password2" value={formData.password2} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit">Əlavə et</button>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
