import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import axios from 'axios';

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
                Bu xananın doldurulması məcburidir!
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

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            try {
                const response = await axios.post(
                    'http://135.181.42.192/accounts/gettoken/',
                    { email: email, password: password },
                    { headers: { 'Content-Type': 'application/json' } },
                    { withCredentials: true }
                );

                const { access, refresh } = response.data;
                localStorage.clear();
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                navigate("/");
                window.location.reload();
            } catch (error) {
                setLoading(false);
                if (error.response) {
                    console.error("Login error: ", error.response.data);
                    alert(`Login failed: ${error.response.data.detail || 'Unknown error'}`);
                } else if (error.request) {
                    console.error("Login error: No response received", error.request);
                    alert("Login failed: No response from server.");
                } else {
                    console.error("Login error: ", error.message);
                    alert(`Login failed: ${error.message}`);
                }
            }
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
                                <p>
                                    <MdOutlineCheckBoxOutlineBlank />
                                    Məni xatırla
                                </p>
                                <a href="">
                                    Şifrəni unutmusunuz?
                                </a>
                            </div>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
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
                </div>
            </div>
            <img src={ovalbottom} alt="" />
        </div>
    );
}

export default Login;
