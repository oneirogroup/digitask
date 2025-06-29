import axios from "axios";
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";

import ovalbottom from "../../assets/images/Oval bottom.svg";
import ovaltop from "../../assets/images/Oval top.svg";
import "./onetimepassword.css";

const OneTimePassword = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const form = useRef(null);
  const checkBtn = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handleChangeOtp = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleKeyUp = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key !== "Backspace" && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (form.current) {
      form.current.validateAll();
    }

    if (checkBtn.current && checkBtn.current.context && checkBtn.current.context._errors.length === 0) {
      try {
        const response = await axios.post(
          "https://app.digitask.store/accounts/verify-otp/",
          { otp: otp.join("") },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );

        if (response.status === 200) {
          const { token } = response.data;
          navigate("/set-new-password", { state: { token } });
        }
      } catch (error) {
        setLoading(false);
        setMessage(`Verification failed: ${error.response?.data.message || "Unknown error"}`);
      }
    } else {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await axios.post(
        "https://app.digitask.store/accounts/resend-otp/",
        { email },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setMessage("Yeni OTP kodu e-poçtunuza göndərildi.");
    } catch (error) {
      setMessage("Xəta baş verdi. Zəhmət olmasa bir daha cəhd edin.");
    }
    setResendLoading(false);
  };

  return (
    <div className="bg-color">
      <img src={ovaltop} alt="" />
      <div className="container">
        <div className="onetimepassword-page">
          <div className="onetimepassword-text">
            <hr />
            <h5>Kodu daxil et</h5>
            <hr />
          </div>
          <Form onSubmit={handleSubmit} ref={form}>
            <div className="onetimepassword-mail-password">
              <div>
                <p>
                  <a>{email}</a> ünvanına göndərdiyimiz 4 rəqəmli kodu daxil edin
                </p>
                <div>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      name={`otp-${index}`}
                      value={digit}
                      onChange={e => handleChangeOtp(e, index)}
                      onKeyUp={e => handleKeyUp(e, index)}
                      maxLength="1"
                      placeholder="0"
                    />
                  ))}
                </div>
              </div>
              <div>
                <p>Kod gəlmədi?</p>
                <a onClick={handleResendOtp}>{resendLoading ? "Gönderiliyor..." : "Təkrar göndər"}</a>
              </div>
              {loading && <span className="spinner-border spinner-border-sm"></span>}
              <button type="submit">Daxil ol</button>
            </div>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          {token && (
            <div className="response-data">
              <h5>Verification Successful!</h5>
              <p>
                <strong>Token:</strong> {token}
              </p>
            </div>
          )}
        </div>
      </div>
      <img src={ovalbottom} alt="" />
    </div>
  );
};

export default OneTimePassword;
