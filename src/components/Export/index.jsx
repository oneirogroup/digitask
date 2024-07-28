import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "./export.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('http://135.181.42.192/accounts/token/refresh/', { refresh: refresh_token });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
};

const DecrementItemForm = ({ onClose, itemId }) => {
    const [texnikUsers, setTexnikUsers] = useState([]);
    const [company, setCompany] = useState("");
    const [authorizedPerson, setAuthorizedPerson] = useState("");
    const [number, setNumber] = useState("");
    const [texnikUserId, setTexnikUserId] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
    const [selectedUserTypeLabel, setSelectedUserTypeLabel] = useState("");
    const [companyError, setCompanyError] = useState("");
    const [authorizedPersonError, setAuthorizedPersonError] = useState("");
    const [numberError, setNumberError] = useState("");
    const [texnikUserError, setTexnikUserError] = useState("");
    const [dateError, setDateError] = useState("");

    useEffect(() => {
        fetchTexnikUsers();
    }, []);

    const fetchTexnikUsers = async (isRetry = false) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await axios.get("http://135.181.42.192/services/texnik-users/", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setTexnikUsers(response.data);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403) && !isRetry) {
                try {
                    await refreshAccessToken();
                    await fetchTexnikUsers(true);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            } else {
                console.error("Error fetching texnik users:", error);
            }
        }
    };

    const handleSelectUserType = (userId, label) => {
        setTexnikUserId(userId);
        setSelectedUserTypeLabel(label);
        setShowUserTypeDropdown(false);
        setTexnikUserError("");
    };

    const handleUserTypeDropdownToggle = () => {
        setShowUserTypeDropdown(!showUserTypeDropdown);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        let valid = true;

        if (!company) {
            setCompanyError("Bu sahəni doldurmalısınız");
            valid = false;
        } else {
            setCompanyError("");
        }

        if (!authorizedPerson) {
            setAuthorizedPersonError("Bu sahəni doldurmalısınız");
            valid = false;
        } else {
            setAuthorizedPersonError("");
        }

        if (!number) {
            setNumberError("Bu sahəni doldurmalısınız");
            valid = false;
        } else {
            setNumberError("");
        }

        if (!texnikUserId) {
            setTexnikUserError("Bu sahəni doldurmalısınız");
            valid = false;
        } else {
            setTexnikUserError("");
        }

        if (!date) {
            setDateError("Bu sahəni doldurmalısınız");
            valid = false;
        } else {
            setDateError("");
        }

        if (!valid) return;

        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No token found");
            return;
        }

        const data = {
            item_id: itemId,
            company: company,
            authorized_person: authorizedPerson,
            number: number,
            texnik_user: texnikUserId,
            date: date,
        };

        try {
            const response = await axios.post("http://135.181.42.192/services/export/", data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setSuccess(response.data.message);
                fetchTexnikUsers();
                onClose();
            }
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                try {
                    await refreshAccessToken();
                    await handleSubmit(e);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            } else {
                console.error('An error occurred:', error);
                setError("An error occurred");
            }
        }
    };

    return (
        <div className="export-modal">
            <div className="export-modal-content">
                <div className="export-modal-title">
                    <h5>Ixrac</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="export-form">
                        <label>
                            Texnikin adı
                            <div className="multi-select-container update-user-modal">
                                <button type="button" className="multi-select-button" onClick={handleUserTypeDropdownToggle}>
                                    {selectedUserTypeLabel ? selectedUserTypeLabel : 'Texnik'}
                                    <span>{showUserTypeDropdown ? <FaChevronUp /> : <FaChevronDown />}</span>
                                </button>
                                {showUserTypeDropdown && (
                                    <div className="multi-select-dropdown warehouse-type-dropdown">
                                        <label htmlFor="closeUserTypeDropdown">
                                            Texnik seçin
                                        </label>
                                        {texnikUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleSelectUserType(user.id, `${user.first_name} ${user.last_name}`)}
                                                className={texnikUserId === user.id ? 'selected' : ''}
                                            >
                                                {user.first_name} {user.last_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {texnikUserError && <p className="error-message">{texnikUserError}</p>}
                        </label>
                        <label>
                            Şirkətin adı
                            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
                            {companyError && <p className="error-message">{companyError}</p>}
                        </label>
                        <label>
                            Səlahiyyətli şəxs
                            <input type="text" value={authorizedPerson} onChange={(e) => setAuthorizedPerson(e.target.value)} />
                            {authorizedPersonError && <p className="error-message">{authorizedPersonError}</p>}
                        </label>
                        <label>
                            Sayı
                            <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                            {numberError && <p className="error-message">{numberError}</p>}
                        </label>
                        <label>
                            Tarix
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            {dateError && <p className="error-message">{dateError}</p>}
                        </label>
                    </div>
                    <button type="submit" className="submit-btn">Ixrac et</button>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default DecrementItemForm;
