import { useRef, useState } from "react";
import { CiMail } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import CheckButton from "react-validation/build/button";
// import { logout } from "../../actions/auth";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

import { login } from "../../actions/auth";
import { message } from "antd"
import ovalbottom from "../../assets/images/Oval bottom.svg";
import ovaltop from "../../assets/images/Oval top.svg";
import "./login.css";


const Login = props => {
  let navigate = useNavigate();

  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const onChangeEmail = e => {
    const email = e.target.value.toLowerCase();
    setEmail(email);
  };

  const onChangePassword = e => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = e => {
    e.preventDefault();
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context && checkBtn.current.context._errors.length === 0) {
      dispatch(login(email, password))
        .then(() => {
          navigate("/");
          window.location.reload();
        })
        .catch(() => {
          message.error('Giriş məlumatları düzgün daxil edin!')
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/tasks/" />;
  }

  return (
    <div style={{ position: "absolute", left: "0px", top: "0px" }} className="bg-color">
      <img src={ovaltop} alt="" />
      <div className="container">
        <div className="login-page">
          <div className="login-text">
            <hr />
            <h5>Daxil ol</h5>
            <hr />
          </div>
          <Form onSubmit={handleLogin} ref={form}>
            <div className="login-mail-password">
              <div>
                <p>Mail ünvanınız</p>
                <label htmlFor="">
                  <CiMail />
                  <Input
                    type="text"
                    placeholder="Mail ünvanınız"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                  // validations={[required]}
                  />
                </label>
                {/* {errors.email && <div className="error-message">{errors.email}</div>} */}
              </div>
              <div>
                <p>Şifrəniz</p>
                <label htmlFor="">
                  <IoKeyOutline />
                  <div className="login-eye">
                    <input
                      type="password"
                      placeholder="*****"
                      name="password"
                      value={password}
                      onChange={onChangePassword}
                    // validations={[required]}
                    />

                  </div>
                </label>
                {/* {errors.password && <div className="error-message">{errors.password}</div>} */}
              </div>

              {loading && <span className="spinner-border spinner-border-sm"></span>}
              <button type="submit">Daxil ol</button>
            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
      </div>
      <img style={{ width: "50%" }} src={ovalbottom} alt="" />
    </div>
  );
};

export default Login;
