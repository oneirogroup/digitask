import { useState, useEffect, useRef } from 'react';
// import { fetchWithAuth, updateProfileWithAuth } from '../../utils/auth';
import "./profile.css";
import { FaPhoneAlt, FaChevronRight, FaRegEdit, FaChevronUp, FaChevronDown, FaSave } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";
import axios from 'axios';

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

const Profile = () => {
  const [profileData, setProfileData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    user_type: '',
    region: '',
    group: '',
    groupData: null,
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [groups, setGroups] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);

  const groupDropdownRef = useRef(null);
  const userTypeDropdownRef = useRef(null);

  const fetchWithAuth = async (url) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken();
        return fetchWithAuth(url);
      }
      throw new Error('Network response was not ok.');
    }

    return response.json();
  };


  const [userTypeOptions] = useState([
    { value: 'Texnik', label: 'Texnik' },
    { value: 'Plumber', label: 'Plumber' },
    { value: 'Ofis menecer', label: 'Ofis menecer' },
    { value: 'Texnik menecer', label: 'Texnik menecer' }
  ]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth('http://135.181.42.192/accounts/profile/');
        setProfileData({
          ...data,
          region: data.group?.region || '',
          group: data.group?.id || '',
          groupName: data.group?.group || '',
          groupData: data.group || {},
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching profile data', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const groupData = await fetchWithAuth('http://135.181.42.192/services/groups/');
        setGroups(groupData);
      } catch (error) {
        console.error('Error fetching groups', error);
      }
    };

    fetchProfileData();
    fetchGroups();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
        setShowGroupDropdown(false);
      }
      if (userTypeDropdownRef.current && !userTypeDropdownRef.current.contains(event.target)) {
        setShowUserTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSelectGroup = (id) => {
    const selectedGroup = groups.find(g => g.id === id) || {};
    setProfileData(prevState => ({
      ...prevState,
      group: id || '',
      groupName: selectedGroup.group || '',
      region: selectedGroup.region || '',
      groupData: selectedGroup
    }));
    setShowGroupDropdown(false);
  };

  const handleSelectUserType = (value) => {
    setProfileData(prevState => ({
      ...prevState,
      user_type: value
    }));
    setShowUserTypeDropdown(false);
  };

  const updateProfileWithAuth = async (url, profileData) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken();
        return updateProfileWithAuth(url, profileData);
      }
      throw new Error('Network response was not ok.');
    }

    return response.json();
  };

  const handleEditToggle = () => {
    if (editMode) {
      const updatedProfileData = {
        ...profileData,
        group: profileData.group || null,
        groupData: undefined,
        groupName: undefined,
      };

      console.log('Updated Profile Data:', updatedProfileData);

      updateProfileWithAuth('http://135.181.42.192/accounts/profile/', updatedProfileData)
        .then(() => setEditMode(false))
        .catch(error => console.error('Error saving profile data', error));
    } else {
      setEditMode(true);
    }
  };


  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="personal-info">
            <div className='profile-edit'>
              <h2>Şəxsi məlumatlar</h2>
              <button onClick={handleEditToggle}>
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
            <div className='profile-table'>
              <div>
                <div className="input-group">
                  <label htmlFor="first_name">Ad</label>
                  <input type="text" id="first_name" value={profileData.first_name} onChange={handleChange} disabled={!editMode} />
                </div>
                <div className="input-group">
                  <label htmlFor="last_name">Soyad</label>
                  <input type="text" id="last_name" value={profileData.last_name} onChange={handleChange} disabled={!editMode} />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">Əlaqə nömrəsi</label>
                  <div>
                    <div>
                      <FaPhoneAlt />
                      <input type="tel" id="phone" value={profileData.phone} onChange={handleChange} disabled={!editMode} />
                    </div>
                    <FaChevronRight />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="email">Mail ünvanı</label>
                  <div>
                    <div>
                      <AiFillMail />
                      <input type="email" id="email" value={profileData.email} onChange={handleChange} disabled={!editMode} />
                    </div>
                    <FaChevronRight />
                  </div>
                </div>
              </div><br />
              <div className="input-group profile-edit-userType-div">
                <label htmlFor="bio">Vəzifə</label>
                {editMode ? (
                  <>
                    <div id="profile-edit-userType" onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}>
                      {profileData.user_type || 'Istifadəçi növü seçin'}
                      {showUserTypeDropdown ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showUserTypeDropdown && (
                      <div className="profile-multi-select-dropdown" ref={userTypeDropdownRef}>
                        <label htmlFor="closeUserTypeDropdown">
                          İstifadəçi növü
                          <span className="close-dropdown" id="closeUserTypeDropdown" onClick={() => setShowUserTypeDropdown(false)}>&times;</span>
                        </label>
                        {userTypeOptions.map(option => (
                          <div
                            key={option.value}
                            onClick={() => handleSelectUserType(option.value)}
                            className={profileData.user_type === option.value ? 'selected' : ''}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <input type="text" id="user_type" value={profileData.user_type || 'İstifadəçi növü daxil edilməyib'} disabled />
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
                    <div id='profile-edit-group' onClick={() => setShowGroupDropdown(!showGroupDropdown)}>
                      {profileData.groupName || 'Qrup seçin'}
                      {showGroupDropdown ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showGroupDropdown && (
                      <div className="profile-multi-select-dropdown" ref={groupDropdownRef}>
                        <label htmlFor="closeGroupsDropdown">
                          Qrup
                          <span className="close-dropdown" id="closeGroupsDropdown" onClick={() => setShowGroupDropdown(false)}>&times;</span>
                        </label>
                        {groups.map(group => (
                          <div
                            key={group.id}
                            onClick={() => handleSelectGroup(group.id)}
                            className={profileData.group === group.id ? 'selected' : ''}
                          >
                            {group.group}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <input type="text" id="group" value={profileData.groupName || 'Qrup seçilməyib'} disabled />
                )}
              </div>
              <div className="input-group">
                <label htmlFor="region">Region</label>
                <input type="text" id="region" value={profileData.region || 'Region məlumatı daxil edilməyib'} disabled />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;