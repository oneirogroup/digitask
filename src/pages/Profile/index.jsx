import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./profile.css";
import { FaPhoneAlt } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";

const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }
  try {
    const response = await axios.post('http://135.181.42.192/accounts/token/refresh/', {
      refresh: refresh_token
    });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
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
    postal_code: 'RT235',
    bio: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async (isRetry = false) => {
      const token = localStorage.getItem('access_token');
      setLoading(true);
      try {
        const response = await axios.get('http://135.181.42.192/accounts/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfileData({
          ...response.data,
          region: response.data.group?.region || '',
          postal_code: 'RT235',
          bio: response.data.bio || ''
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !isRetry) {
          try {
            const newAccessToken = await refreshAccessToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            await fetchProfileData(true);
          } catch (refreshError) {
            console.error('Error: Token refresh failed:', refreshError);
          }
        } else {
          console.error('Error fetching profile data', error);
        }
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
                  <div>
                    <div>
                      <FaPhoneAlt />
                      <input type="tel" id="phone" value={profileData.phone} onChange={handleChange} />
                    </div>
                    <FaChevronRight />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="email">Mail adresi</label>
                  <div>
                    <div>
                      <AiFillMail />
                      <input type="email" id="email" value={profileData.email} onChange={handleChange} />
                    </div>
                    <FaChevronRight />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" value={profileData.bio} onChange={handleChange} />
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
        </>
      )}
    </div>
  );
};

export default Profile;
