import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import axios from 'axios';

import "./repassword.css";
import ovaltop from "../../assets/images/Oval top.svg";
import ovalbottom from "../../assets/images/Oval bottom.svg";
import { CiMail } from "react-icons/ci";

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://135.181.42.192/accounts/password-reset/', { email });
            const { email: responseEmail } = response.data; 
            navigate('/re-password-code', { state: { email: responseEmail } }); 
        } catch (error) {
            setMessage('Xəta baş verdi. Zəhmət olmasa bir daha cəhd edin.');
        }
    };

    return (
        <div className='bg-color'>
            <img src={ovaltop} alt="" />
            <div className='container'>
                <div className="re-password-div">
                    <div className="login-text">
                        <hr />
                        <h5>Şifrəni yenilə</h5>
                        <hr />
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <div className="re-password-page">
                            <div>
                                <p>Mail adresinizi daxil edin.</p>
                            </div>
                            <div className="re-password-mail">
                                <p>Mail adresiniz</p>
                                <label htmlFor="">
                                    <CiMail />
                                    <input
                                        type="email"
                                        placeholder="Mail adresiniz"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
