import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { login } from "../../actions/auth";

import "./login.css";
import ovaltop from "../../assets/images/Oval top.svg";
import ovalbottom from "../../assets/images/Oval bottom.svg";
import { CiMail } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";


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
    const [userData, setUserData] = useState({});

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

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(email, password))
                .then(() => {
                    navigate("/");
                    window.location.reload();
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    const handleRegisterData = (data) => {
        setUserData(data);
    };

    if (isLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div className='bg-color'>
            <img src={ovaltop} alt="" />
            <div className='container'>
                <div className="login-page">
                    <div className="login-text">
                        <hr />
                        <h5>
                            Daxil ol
                        </h5>
                        <hr />
                    </div>
                    <Form onSubmit={handleLogin} ref={form}>
                        <div className="login-mail-password">
                            <div>
                                <p>Mail adresiniz</p>
                                <label htmlFor="">
                                    <CiMail />
                                    <input type="text" placeholder="Mail adresiniz" name="email"
                                        value={email}
                                        onChange={onChangeEmail}
                                        validations={[required]} />
                                </label>
                            </div>
                            <div>
                                <p>Şifrəniz</p>
                                <label htmlFor="">
                                    <IoKeyOutline />
                                    <input type="password" id="" placeholder="*****" name="password"
                                        value={password}
                                        onChange={onChangePassword}
                                        validations={[required]} />
                                </label>
                            </div>
                            <div>
                                <MdOutlineCheckBoxOutlineBlank />
                                Məni xatırla
                            </div>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <button>Daxil ol</button>
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
                </div>
            </div>
            <img src={ovalbottom} alt="" />
        </div>
    );
}

export default Login;
