import axios from "axios";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";

import useRefreshToken from "../../common/refreshToken";

import ovalbottom from "../../assets/images/Oval bottom.svg";
import ovaltop from "../../assets/images/Oval top.svg";
import "./repassword.css";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const refreshAccessToken = useRefreshToken();

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post("https://app.digitask.store/accounts/password-reset/", { email });
      const { email: responseEmail } = response.data;
      navigate("/re-password-code", { state: { email: responseEmail } });
    } catch (error) {
      if (response.status == 403) {
        await refreshAccessToken();
        handleSubmit();
      }
      setMessage("Xəta baş verdi. Zəhmət olmasa bir daha cəhd edin.");
    }
  };

  return (
    <div className="bg-color">
      <img src={ovaltop} alt="" />
      <div className="container">
        <div className="re-password-div">
          <div className="login-text">
            <hr />
            <h5>Şifrəni yenilə</h5>
            <hr />
          </div>
          <Form onSubmit={handleSubmit}>
            <div className="re-password-page">
              <div>
                <p>Mail ünvanınızı daxil edin.</p>
              </div>
              <div className="re-password-mail">
                <p>Mail ünvanınız</p>
                <label htmlFor="">
                  <CiMail />
                  <input
                    type="email"
                    placeholder="Mail ünvanınız"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>
              <button type="submit">Daxil ol</button>
            </div>
            {message && <p>{message}</p>}
          </Form>
        </div>
      </div>
      <img src={ovalbottom} alt="" />
    </div>
  );
};

export default PasswordResetRequest;
