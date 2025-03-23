import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

import useRefreshToken from "../../common/refreshToken";

import "./passwordchangemodal.css";

const PasswordChangeModal = ({ isOpen, onClose, employee, onPasswordChange }) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const refreshAccessToken = useRefreshToken();

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    if (name === "password2") setPassword2(value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setPasswordError("Şifreler uyuşmuyor.");
      return;
    }
    try {
      await axios.put(`https://app.desgah.az/accounts/update_user/${employee.id}/`, { password, password2 });
      onPasswordChange();
      onClose();
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleSubmit();
      }
      console.error("Password change error:", error);
    }
  };

  return (
    <div className="password-change-modal" onClick={onClose}>
      <div className="password-change-modal-content" onClick={e => e.stopPropagation()}>
        <div className="password-change-modal-title">
          <h5>Şifrəni yenilə</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Şifrə</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Yeni şifrənizi daxil edin"
            />
          </div>
          <div className="form-group">
            <label>Şifrəni təkrar daxil edin</label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={handlePasswordChange}
              placeholder="Yeni şifrənizi təkrar daxil edin"
            />
          </div>
          {passwordError && <div className="error-message">{passwordError}</div>}
          <button type="submit" className="submit-btn">
            Təsdiqlə
          </button>
        </form>
      </div>
    </div>
  );
};

PasswordChangeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
  onPasswordChange: PropTypes.func.isRequired
};

export default PasswordChangeModal;
