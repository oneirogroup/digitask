import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    user_type: '',
    region: '', 
    postal_code: 'RT235'
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://135.181.42.192/accounts/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfileData({
          ...response.data,
          region: response.data.group?.region || '', 
          postal_code: 'RT235' 
        });
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  return (
    <div className="profile-container">
      <div className="personal-info">
        <h2>Şəxsi məlumatlar</h2>
        <div className='profile-table'>
          <div>
            <div className="input-group">
              <label htmlFor="first_name">Ad</label>
              <input type="text" id="first_name" value={profileData.first_name} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="last_name">Soyad</label>
              <input type="text" id="last_name" value={profileData.last_name} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Əlaqə nömrəsi</label>
              <input type="text" id="phone" value={profileData.phone} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="email">Mail adresi</label>
              <input type="text" id="email" value={profileData.email} onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={profileData.user_type} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="address-info">
        <h2>Ünvan</h2>
        <div>
          <div className="input-group">
            <label htmlFor="region">Region</label>
            <input type="text" id="region" value={profileData.region} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label htmlFor="postal_code">Poçt Kodu</label>
            <input type="text" id="postal_code" value={profileData.postal_code} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
