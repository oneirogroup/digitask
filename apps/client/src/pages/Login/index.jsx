import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./login.css";
import ovaltop from "../../assets/images/Oval top.svg";
import ovalbottom from "../../assets/images/Oval bottom.svg";
import { CiMail } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { logout } from "../../actions/auth";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { login } from "../../actions/auth";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const Login = (props) => {
    let navigate = useNavigate();

    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Form reference:', form.current);
        console.log('Check button reference:', checkBtn.current);

        form.current.validateAll();

        if (checkBtn.current.context && checkBtn.current.context._errors.length === 0) {
            dispatch(login(email, password))
                .then(() => {
                    navigate("/profile");
                    window.location.reload();
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };


    if (isLoggedIn) {
        return <Navigate to="/profile" />;
    }

    return (
        <div className='bg-color'>
            <img src={ovaltop} alt="" />
            <div className='container'>
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
                                    <Input type="text" placeholder="Mail ünvanınız" name="email"
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
                                        <input type="password" placeholder="*****" name="password"
                                            value={password}
                                            onChange={onChangePassword}
                                            // validations={[required]}
                                        />
                                        {/* <button
                                            type="button"
                                            className="eye-icon"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button> */}
                                    </div>
                                </label>
                                {/* {errors.password && <div className="error-message">{errors.password}</div>} */}
                            </div>
                            <div className="remember-me">
                                {/* <label>
                                    <input type="checkbox" name="" id="" checked={rememberMe}
                                        onChange={toggleRememberMe} />
                                    Məni xatırla
                                </label> */}
                                <Link to="/re-password">Şifrəni unutmusunuz?</Link>
                            </div>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <button type="submit">Daxil ol</button>
                        </div>
                        {/* {errors.global ? (
                            <div className="form-group">
                                <div className="alert alert-danger login-alert-text" role="alert" style={{ marginTop: '10px' }}>
                                    {errors.global}
                                </div>
                            </div>
                        ) : (
                            <div className="form-group">
                                <button
                                    style={{ display: "none" }}
                                    ref={checkBtn}
                                ></button>
                            </div>
                        )} */}
                        <CheckButton style={{ display: "none" }} ref={checkBtn} />
                    </Form>
                </div>
            </div>
            <img src={ovalbottom} alt="" />
        </div>
    );
};

export default Login;
