import axios from "axios";
import { useEffect, useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

import useRefreshToken from "../../common/refreshToken";

import ovalbottom from "../../assets/images/Oval bottom.svg";
import ovaltop from "../../assets/images/Oval top.svg";
import "./setnewpassword.css";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    if (location.state?.token) {
      setToken(location.state.token);
    }
  }, [location.state?.token]);

  const handleSubmit = async event => {
    event.preventDefault();

    if (password !== repassword) {
      setMessage("Şifrələr uyğun gəlmir. Zəhmət olmasa təkrar cəhd edin.");
      return;
    }

    try {
      const response = await axios.post("http://37.61.77.5/accounts/set-new-password/", {
        password,
        confirm_password: repassword,
        token
      });
      setMessage("Şifrə uğurla yeniləndi.");
      navigate("/login");
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleSubmit();
      }
      setMessage(`Xəta baş verdi: ${error.response?.data?.detail || "Bir problem meydana gəldi."}`);
    }
  };

  return (
    <div className="bg-color">
      <img src={ovaltop} alt="" />
      <div className="container">
        <div className="set-password-div">
          <div className="login-text">
            <hr />
            <h5>Şifrə yenilənməsi</h5>
            <hr />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="set-password-page">
              <div>
                <p>Şifrənizi daxil edin.</p>
              </div>
              <div className="set-password-mail">
                <p>Yeni Şifrə</p>
                <label>
                  <IoKeyOutline />
                  <input
                    type="password"
                    placeholder="Şifrəniz"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </label>
                <p>Şifrəni Təkrar Daxil Edin</p>
                <label>
                  <IoKeyOutline />
                  <input
                    type="password"
                    placeholder="Şifrəni Təkrar Daxil Edin"
                    value={repassword}
                    onChange={e => setRePassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <button type="submit">Daxil ol</button>
            </div>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
      <img src={ovalbottom} alt="" />
    </div>
  );
};

export default SetNewPassword;
