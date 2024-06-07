// LogoutModal.jsx
import React from 'react';
import './logoutModal.css';

const LogoutModal = ({ showModal, handleClose, handleLogout }) => {
    return (
        showModal ? (
            <div className="logout-modal-overlay">
                <div className="logout-modal-content">
                    <h2>Çıxış</h2>
                    <p>Çıxış etmək istədiyinizdən əminsiniz?</p>
                    <div>
                        <button onClick={handleClose} className="cancel-logout">Ləğv et</button>
                        <button onClick={handleLogout} className="confirm-logout">Çıxış et</button>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default LogoutModal;
