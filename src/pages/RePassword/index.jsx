import { useState, useRef } from "react";

import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import axios from 'axios';

import "./login.css";
import ovaltop from "../../assets/images/Oval top.svg";
import ovalbottom from "../../assets/images/Oval bottom.svg";
import { CiMail } from "react-icons/ci";

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://135.181.42.192/accounts/password-reset/', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (

        <div className='bg-color'>
            <img src={ovaltop} alt="" />
            <div className='container'>
                <div className="login-page">
                    <div className="login-text">
                        <hr />
                        <h5>
                            Şifrəni yenilə
                        </h5>
                        <hr />
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <div className="login-mail-password re-password-page">
                            <p>Mail adresinizi daxil edin.</p>
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
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
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
