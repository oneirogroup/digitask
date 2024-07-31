import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/auth';
import "./profile.css";
import { FaPhoneAlt } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    user_type: '',
    region: '',
    group: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth('http://135.181.42.192/accounts/profile/');
        setProfileData({
          ...data,
          region: data.group?.region || '',
          group: data.group?.group || '',
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
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
              </div><br />
              <div className="input-group">
                <label htmlFor="bio">Istifadəçi növü</label>
                <textarea id="bio" value={profileData.user_type} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="address-info">
            <h2>Qrup məlumatları</h2>
            <div>
              <div className="input-group">
                <label htmlFor="postal_code">Qrup</label>
                <input type="text" id="postal_code" value={profileData.group ? profileData.group : 'Qrup daxil edilməyib'} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label htmlFor="region">Region</label>
                <input type="text" id="region" value={profileData.region ? profileData.region : 'Region daxil edilməyib'} onChange={handleChange} />
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
