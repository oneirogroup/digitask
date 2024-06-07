import React from 'react';
import "./profile.css"

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="personal-info">
        <h2>Şəxsi məlumatlar</h2>
        <div className='profile-table'>
          <div>
            <div className="input-group">
              <label htmlFor="name">Ad</label>
              <input type="text" id="name" value="Nadir" />
            </div>
            <div className="input-group">
              <label htmlFor="surname">Soyad</label>
              <input type="text" id="surname" value="Mammadov" />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Əlaqə nömrəsi</label>
              <input type="text" id="phone" value="(051) 555-5555" />
            </div>
            <div className="input-group">
              <label htmlFor="email">Mail adresi</label>
              <input type="text" id="email" value="texnik@gmail.com" />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value="Team Manager" />
          </div>
        </div>
      </div>
      <div className="address-info">
        <h2>Ünvan</h2>
        <div>
          <div className="input-group">
            <label htmlFor="city">Şəhər</label>
            <input type="text" id="city" value="Bakı" />
          </div>
          <div className="input-group">
            <label htmlFor="postalCode">Poçt Kodu</label>
            <input type="text" id="postalCode" value="RT235" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;