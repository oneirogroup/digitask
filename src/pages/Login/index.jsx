import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import axios from 'axios';
import "./login.css";
import ovaltop from "../../assets/images/Oval top.svg";
import ovalbottom from "../../assets/images/Oval bottom.svg";
import { CiMail } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { logout } from "../../actions/auth";

const required = (value) => {
    if (!value) {
        return "Bu xananın doldurulması məcburidir!";
    }
};

const Login = (props) => {
    let navigate = useNavigate();

    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});

    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    useEffect(() => {
        const savedEmail = localStorage.getItem('saved_email') || sessionStorage.getItem('saved_email');
        const savedPassword = localStorage.getItem('saved_password') || sessionStorage.getItem('saved_password');
        if (savedEmail) {
            setEmail(savedEmail);
        }
        if (savedPassword) {
            setPassword(savedPassword);
        }
        const savedRememberMe = localStorage.getItem('remember_me') === 'true';
        setRememberMe(savedRememberMe);

        const refreshTokenIfNeeded = async () => {
            const access_token = localStorage.getItem('access_token');
            const refresh_token = localStorage.getItem('refresh_token');
            if (access_token && refresh_token) {
                try {
                    const response = await axios.post(
                        'http://135.181.42.192/accounts/gettoken/',
                        { refresh: refresh_token },
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                    const new_access_token = response.data.access;
                    localStorage.setItem('access_token', new_access_token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${new_access_token}`;
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    dispatch(logout());
                }
            }
        };

        const interval = setInterval(refreshTokenIfNeeded, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [dispatch]);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        form.current.validateAll();

        const newErrors = {};

        if (!email) {
            newErrors.email = "Emaili daxil edin!";
        }
        if (!password) {
            newErrors.password = "Şifrəni daxil edin!";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://135.181.42.192/accounts/login/',
                { email: email, password: password },
                { headers: { 'Content-Type': 'application/json' } },
                { withCredentials: true }
            );

            const { access_token, refresh_token, user_type, is_admin } = response.data;
            if (rememberMe) {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('saved_email', email);
                localStorage.setItem('saved_password', password);
                localStorage.setItem('remember_me', 'true');
                localStorage.setItem('user_type', user_type);
                localStorage.setItem('is_admin', is_admin);
            } else {
                sessionStorage.setItem('access_token', access_token);
                sessionStorage.setItem('refresh_token', refresh_token);
                sessionStorage.setItem('saved_email', email);
                sessionStorage.setItem('saved_password', password);
                localStorage.setItem('remember_me', 'false');
                sessionStorage.setItem('user_type', user_type);
                sessionStorage.setItem('is_admin', is_admin);
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            navigate("/");
            window.location.reload();
        } catch (error) {
            setLoading(false);
            setErrors({ global: "Giriş zamanı xətaya yol verildi. Yenidən cəhd edin." });
            if (error.response) {
                console.error("Login error: ", error.response.data);
            } else if (error.request) {
                console.error("Login error: No response received", error.request);
            } else {
                console.error("Login error: ", error.message);
            }
        }
    };


    if (isLoggedIn) {
        return <Navigate to="/tasks/" />;
    }

    const storedUserType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
    const storedUserEmail = localStorage.getItem('saved_email') || sessionStorage.getItem('saved_email');

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
                                <p>Mail adresiniz</p>
                                <label htmlFor="">
                                    <CiMail />
                                    <input type="text" placeholder="Mail adresiniz" name="email"
                                        value={email}
                                        onChange={onChangeEmail}
                                    />
                                </label>
                                {errors.email && <div className="error-message">{errors.email}</div>}

                            </div>
                            <div>
                                <p>Şifrəniz</p>
                                <label htmlFor="">
                                    <IoKeyOutline />
                                    <div className="login-eye">
                                        <input type={showPassword ? "text" : "password"} placeholder="*****" name="password"
                                            value={password}
                                            onChange={onChangePassword}
                                        />
                                        <button
                                            type="button"
                                            className="eye-icon"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </label>
                                {errors.password && <div className="error-message">{errors.password}</div>}

                            </div>
                            <div className="remember-me">
                                <p onClick={toggleRememberMe}>
                                    {rememberMe ? <MdCheckBox /> : <MdOutlineCheckBoxOutlineBlank />}
                                    Məni xatırla
                                </p>
                                <Link to="/re-password">Şifrəni unutmusunuz?</Link>
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
