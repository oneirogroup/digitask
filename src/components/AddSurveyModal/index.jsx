import React, { useState, useEffect } from 'react';
import './addsurveymodal.css';
import axios from 'axios';
import upload from "../../assets/images/document-upload.svg";

const AddSurveyModal = ({ onClose, selectedServices, taskId }) => {
    const [surveyData, setSurveyData] = useState({
        tv: {
            photo_modem: null,
            photo_modem_preview: '',
            modem_SN: '',
            rg6_cable: '',
            f_connector: '',
            splitter: '',
        },
        internet: {
            photo_modem: null,
            photo_modem_preview: '',
            modem_SN: '',
            optical_cable: '',
            fastconnector: '',
            siqnal: '',
        },
        voice: {
            photo_modem: null,
            photo_modem_preview: '',
            modem_SN: '',
            home_number: '',
            password: '',
        },
    });

    const [openServices, setOpenServices] = useState({});
    const [existingSurveys, setExistingSurveys] = useState({});

    useEffect(() => {
        const fetchExistingSurveys = async () => {
            try {
                const response = await axios.get(`http://135.181.42.192/services/task/${taskId}/`);
                const data = response.data;
                setExistingSurveys({
                    tv: data.tv || false,
                    internet: data.internet || false,
                    voice: data.voice || false,
                });
            } catch (error) {
                console.error('Error fetching existing surveys:', error);
            }
        };

        fetchExistingSurveys();
    }, [taskId]);

    const handleInputChange = (e) => {
        const { name, files, value, dataset } = e.target;
        const { service } = dataset;

        if (!surveyData[service]) {
            console.error(`Service data for ${service} is not initialized.`);
            return;
        }

        const file = files ? files[0] : null;
        setSurveyData(prevData => {
            const updatedServiceData = {
                ...prevData[service],
                [name]: file || value,
                ...(file ? { photo_modem_preview: URL.createObjectURL(file) } : {})
            };
            return {
                ...prevData,
                [service]: updatedServiceData
            };
        });
    };

    const handleServiceToggle = (type) => {
        setOpenServices(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const surveyPromises = Object.keys(selectedServices).map(async (serviceType) => {
                if (!selectedServices[serviceType] || existingSurveys[serviceType]) return;

                const serviceData = surveyData[serviceType];
                if (!serviceData || !Object.values(serviceData).some(value => value !== '' && value !== null)) {
                    return;
                }

                const url = `http://135.181.42.192/services/create_${serviceType}/`;

                const formData = new FormData();
                formData.append('task', taskId);

                Object.keys(serviceData).forEach(key => {
                    if (serviceData[key] !== '' && serviceData[key] !== null) {
                        formData.append(key, serviceData[key]);
                    }
                });

                try {
                    const response = await axios.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log(`Survey for ${serviceType} added successfully:`, response.data);
                } catch (error) {
                    console.error(`Error adding survey for ${serviceType}:`, error);
                    alert(`Failed to add survey for ${serviceType}. Please try again.`);
                }
            });

            await Promise.all(surveyPromises);
            onClose();
        } catch (error) {
            console.error('Error adding surveys:', error);
            alert('Failed to add surveys. Please try again.');
        }
    };

    const serviceDisplayNames = {
        tv: 'Tv',
        internet: 'İnternet',
        voice: 'Səs',
    };

    return (
        <div className="add-survey-modal">
            <div className="add-survey-modal-content">
                <div className="addSurveyModal-header">
                    <h5>Anket əlavə et</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <div className="addSurveyModal-body">
                    <form onSubmit={handleFormSubmit}>
                        <div className="service-list">
                            {Object.keys(selectedServices).map(serviceType =>
                                selectedServices[serviceType] && !existingSurveys[serviceType] && (
                                    <div key={serviceType} className="service-section">
                                        <div className="service-header">
                                            <p>Servis məlumatları</p>
                                            <h6 onClick={() => handleServiceToggle(serviceType)}>{serviceDisplayNames[serviceType] || serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} {openServices[serviceType] ? '-' : 'anketi əlavə et'}</h6>
                                        </div>
                                        {openServices[serviceType] && (
                                            <div className="service-fields">
                                                {serviceType === 'tv' && (
                                                    <>
                                                        <div>
                                                            <div className="form-group">
                                                                <label>Modemin arxa şəkli:</label>
                                                                <div className="upload-container">
                                                                    {!surveyData.tv.photo_modem_preview ? (
                                                                        <label htmlFor="photo_modem_tv" className="upload-label">
                                                                            <span>
                                                                                Yükləmək üçün klikləyin
                                                                                <span className="file-size">(Maksimum fayl ölçüsü: 25 MB)</span>
                                                                            </span>
                                                                            <div className="upload-icon">
                                                                                <img src={upload} alt="" />
                                                                            </div>
                                                                        </label>
                                                                    ) : (
                                                                        <img
                                                                            src={surveyData.tv.photo_modem_preview}
                                                                            alt="Preview"
                                                                            className="image-preview"
                                                                        />
                                                                    )}
                                                                    <input
                                                                        type="file"
                                                                        id="photo_modem_tv"
                                                                        accept="image/*"
                                                                        data-service="tv"
                                                                        name="photo_modem"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Modem S/N:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="modem_SN"
                                                                        value={surveyData.tv.modem_SN}
                                                                        data-service="tv"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>RG6 Kabel:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="rg6_cable"
                                                                        value={surveyData.tv.rg6_cable}
                                                                        data-service="tv"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>F-connector:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="f_connector"
                                                                        value={surveyData.tv.f_connector}
                                                                        data-service="tv"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Splitter:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="splitter"
                                                                        value={surveyData.tv.splitter}
                                                                        data-service="tv"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {serviceType === 'internet' && (
                                                    <>
                                                        <div>
                                                            <div className="form-group">
                                                                <label>Modemin arxa şəkli:</label>
                                                                <div className="upload-container">
                                                                    {!surveyData.internet.photo_modem_preview ? (
                                                                        <label htmlFor="photo_modem_internet" className="upload-label">
                                                                            <span>
                                                                                Yükləmək üçün klikləyin
                                                                                <span className="file-size">(Maksimum fayl ölçüsü: 25 MB)</span>
                                                                            </span>
                                                                            <div className="upload-icon">
                                                                                <img src={upload} alt="" />
                                                                            </div>
                                                                        </label>
                                                                    ) : (
                                                                        <img
                                                                            src={surveyData.internet.photo_modem_preview}
                                                                            alt="Preview"
                                                                            className="image-preview"
                                                                        />
                                                                    )}
                                                                    <input
                                                                        type="file"
                                                                        id="photo_modem_internet"
                                                                        accept="image/*"
                                                                        data-service="internet"
                                                                        name="photo_modem"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Modem S/N:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="modem_SN"
                                                                        value={surveyData.internet.modem_SN}
                                                                        data-service="internet"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Optik Kabel:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="optical_cable"
                                                                        value={surveyData.internet.optical_cable}
                                                                        data-service="internet"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Fastconnector:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="fastconnector"
                                                                        value={surveyData.internet.fastconnector}
                                                                        data-service="internet"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Siqnal:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="siqnal"
                                                                        value={surveyData.internet.siqnal}
                                                                        data-service="internet"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {serviceType === 'voice' && (
                                                    <>
                                                        <div>
                                                            <div className="form-group">
                                                                <label>Modemin arxa şəkli:</label>
                                                                <div className="upload-container">
                                                                    {!surveyData.voice.photo_modem_preview ? (
                                                                        <label htmlFor="photo_modem_voice" className="upload-label">
                                                                            <span>
                                                                                Yükləmək üçün klikləyin
                                                                                <span className="file-size">(Maksimum fayl ölçüsü: 25 MB)</span>
                                                                            </span>
                                                                            <div className="upload-icon">
                                                                                <img src={upload} alt="" />
                                                                            </div>
                                                                        </label>
                                                                    ) : (
                                                                        <img
                                                                            src={surveyData.voice.photo_modem_preview}
                                                                            alt="Preview"
                                                                            className="image-preview"
                                                                        />
                                                                    )}
                                                                    <input
                                                                        type="file"
                                                                        id="photo_modem_voice"
                                                                        accept="image/*"
                                                                        data-service="voice"
                                                                        name="photo_modem"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Modem S/N:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="modem_SN"
                                                                        value={surveyData.voice.modem_SN}
                                                                        data-service="voice"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Home Number:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="home_number"
                                                                        value={surveyData.voice.home_number}
                                                                        data-service="voice"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                            <div>
                                                                <div className="form-group">
                                                                    <label>Şifrə:</label>
                                                                    <input
                                                                        type="text"
                                                                        name="password"
                                                                        value={surveyData.voice.password}
                                                                        data-service="voice"
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                        <button type="submit">Əlavə et</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSurveyModal;
