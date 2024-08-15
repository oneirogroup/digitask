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
import { logout } from "../../actions/auth";

const required = (value) => {
    if (!value) {
        return "Bu xananın doldurulması məcburidir!";
    }
};

const Login = (props) => {
    let navigate = useNavigate();

    // const form = useRef();
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
        setErrors({});

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
                { email, password, remember_me: rememberMe },
                { headers: { 'Content-Type': 'application/json' } },
                { withCredentials: true }
            );

            console.log('Login successful:', response.data);

            const { access_token, refresh_token, user_type, is_admin } = response.data;

            // Save tokens and user details
            if (rememberMe) {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('saved_email', email);
                localStorage.setItem('saved_password', password);
                localStorage.setItem('remember_me', 'true');
                localStorage.setItem('user_type', user_type);
                localStorage.setItem('is_admin', is_admin);
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('saved_email');
                localStorage.removeItem('saved_password');
                localStorage.removeItem('remember_me');
                localStorage.removeItem('user_type');
                localStorage.removeItem('is_admin');
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            navigate("/");
            window.location.reload();
        } catch (error) {
            console.log('Login failed:', error.response ? error.response.data : error.message);

            setLoading(false);

            const newErrors = {};

            if (error.response && error.response.data) {
                const serverErrors = error.response.data;

                if (serverErrors.detail) {
                    newErrors.global = "Giriş Məlumatları Yanlışdır.\nYanlış e-poçt ünvanı və ya şifrə.";
                } else if (serverErrors.non_field_errors) {
                    newErrors.global = serverErrors.non_field_errors[0];
                } else {
                    newErrors.global = "Giriş Məlumatları Yanlışdır.\nYanlış e-poçt ünvanı və ya şifrə.";
                }

                setErrors(newErrors);
            } else {
                setErrors({ global: "Giriş zamanı xətaya yol verildi. Yenidən cəhd edin." });
            }
        }
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
                        <h5>Daxil ol</h5>
                        <hr />
                    </div>
                    <form onSubmit={handleLogin}>
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
                                <label>
                                    <input type="checkbox" name="" id="" checked={rememberMe}
                                        onChange={toggleRememberMe} />
                                    Məni xatırla
                                </label>
                                <Link to="/re-password">Şifrəni unutmusunuz?</Link>
                            </div>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <button type="submit">Daxil ol</button>
                        </div>
                        {errors.global ? (
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
                        )}
                    </form>
                </div>
            </div>
            <img src={ovalbottom} alt="" />
        </div>
    );
};

export default Login;
