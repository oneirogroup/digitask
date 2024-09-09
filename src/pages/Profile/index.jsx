import { useState, useEffect, useRef } from 'react';
import "./profile.css";
import { FaPhoneAlt, FaChevronRight, FaRegEdit, FaChevronUp, FaChevronDown, FaSave } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";
import axios from 'axios';

const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.put('http://135.181.42.192/accounts/token/refresh/', { refresh: refresh_token });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  } catch (error) {
    console.error('Error refreshing access token', error);
    throw error;
  }
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
    profil_picture: '',
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [groups, setGroups] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [error, setError] = useState(null); // State for handling errors
  const [selectedFile, setSelectedFile] = useState(null);

  const groupDropdownRef = useRef(null);
  const userTypeDropdownRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profil_picture', selectedFile); // Append the photo file to the form data

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch('http://135.181.42.192/accounts/profile_update/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshAccessToken();
          return handlePhotoUpload(); // Retry the upload after refreshing the token
        }
        const errorData = await response.json();
        console.error('Error uploading photo:', errorData);
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      setProfileData((prevState) => ({
        ...prevState,
        profil_picture: data.profil_picture, // Update the photo URL in profile data
      }));
      setSelectedFile(null);
      console.log('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo', error);
      setError('Error uploading photo. Please try again later.');
    }
  };


  const fetchWithAuth = async (url) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token available');
    }

    try {
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
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data. Please try again later.');
      throw error;
    }
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
      setError('No access token available. Please log in again.');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
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
        const errorData = await response.json();
        setError(`Failed to update profile data: ${errorData.detail || 'Unknown error'}`);
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Profile updated successfully:', responseData);
      return responseData;
    } catch (error) {
      setError('Error updating profile data. Please try again later.');
      console.error('Error updating profile data', error);
    }
  };

  const handleEditToggle = async () => {
    if (editMode) {
      const updatedProfileData = {
        ...profileData,
        group: profileData.group || null,
        groupData: undefined,
        groupName: undefined,
      };

      try {
        await updateProfileWithAuth('http://135.181.42.192/accounts/profile_update/', updatedProfileData);
        if (selectedFile) {
          await handlePhotoUpload(); // Upload the photo if a new one is selected
        }
        setEditMode(false);
      } catch (error) {
        console.error('Error saving profile data', error);
      }
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
                <div className="profile-photo">
                  <img src={profileData.profil_picture} alt="Profile" />
                </div>
                {editMode && (
                  <div className="input-group">
                    <label htmlFor="photo">Upload Photo</label>
                    <input type="image" id="photo" onChange={handleFileChange} />
                  </div>
                )}
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