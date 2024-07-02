import React, { useState } from 'react';
import './addsurveymodal.css';
import axios from 'axios';

const AddSurveyModal = ({ onClose, selectedServices, taskId }) => {
    const [surveyData, setSurveyData] = useState({
        tv: {
            photo_modem: null,
            modem_SN: '',
            rg6_cable: '',
            f_connector: '',
            splitter: '',
        },
        internet: {
            photo_modem: null,
            modem_SN: '',
            optical_cable: '',
            fastconnector: '',
            siqnal: '',
        },
        voice: {
            photo_modem: null,
            modem_SN: '',
            home_number: '',
            password: '',
        },
        surveyDetails: ''
    });

    const [openService, setOpenService] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, files, dataset } = e.target;
        const { service } = dataset;

        if (!surveyData[service]) {
            console.error(`Service data for ${service} is not initialized.`);
            return;
        }

        setSurveyData(prevData => ({
            ...prevData,
            [service]: {
                ...prevData[service],
                [name]: files ? files[0] : value
            }
        }));
    };

    const handleServiceToggle = (type) => {
        setOpenService(prev => (prev === type ? null : type));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            for (const serviceType of Object.keys(selectedServices)) {
                if (!selectedServices[serviceType]) continue;

                const serviceData = surveyData[serviceType];
                if (!serviceData || !Object.values(serviceData).some(value => value !== '' && value !== null)) {
                    continue;
                }

                const url = `http://135.181.42.192/services/create_${serviceType}/`;

                const formData = new FormData();
                formData.append('task', taskId);
                formData.append('details', surveyData.surveyDetails);

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
            }
            onClose();
        } catch (error) {
            console.error('Error adding surveys:', error);
            alert('Failed to add surveys. Please try again.');
        }
    };

    return (
        <div className="add-survey-modal">
            <div className="add-survey-modal-content">
                <div className="addSurveyModal-header">
                    <h5>Add Survey</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <div className="addSurveyModal-body">
                    <form onSubmit={handleFormSubmit}>
                        <div className="service-list">
                            {Object.keys(selectedServices).map(serviceType =>
                                selectedServices[serviceType] && (
                                    <div key={serviceType} className="service-section">
                                        <div className="service-header" onClick={() => handleServiceToggle(serviceType)}>
                                            <h6>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} {openService === serviceType ? '-' : '+'}</h6>
                                        </div>
                                        {openService === serviceType && (
                                            <div className="service-fields">
                                                {serviceType === 'tv' && (
                                                    <>
                                                        <div className="form-group">
                                                            <label>Photo Modem:</label>
                                                            <input
                                                                type="file"
                                                                name="photo_modem"
                                                                accept="image/*"
                                                                data-service="tv"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Modem SN:</label>
                                                            <input
                                                                type="text"
                                                                name="modem_SN"
                                                                value={surveyData.tv.modem_SN}
                                                                data-service="tv"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>RG6 Cable:</label>
                                                            <input
                                                                type="text"
                                                                name="rg6_cable"
                                                                value={surveyData.tv.rg6_cable}
                                                                data-service="tv"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>F Connector:</label>
                                                            <input
                                                                type="text"
                                                                name="f_connector"
                                                                value={surveyData.tv.f_connector}
                                                                data-service="tv"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
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
                                                    </>
                                                )}

                                                {serviceType === 'internet' && (
                                                    <>
                                                        <div className="form-group">
                                                            <label>Photo Modem:</label>
                                                            <input
                                                                type="file"
                                                                name="photo_modem"
                                                                accept="image/*"
                                                                data-service="internet"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Modem SN:</label>
                                                            <input
                                                                type="text"
                                                                name="modem_SN"
                                                                value={surveyData.internet.modem_SN}
                                                                data-service="internet"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Optical Cable:</label>
                                                            <input
                                                                type="text"
                                                                name="optical_cable"
                                                                value={surveyData.internet.optical_cable}
                                                                data-service="internet"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
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
                                                        <div className="form-group">
                                                            <label>Signal:</label>
                                                            <input
                                                                type="text"
                                                                name="siqnal"
                                                                value={surveyData.internet.siqnal}
                                                                data-service="internet"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {serviceType === 'voice' && (
                                                    <>
                                                        <div className="form-group">
                                                            <label>Photo Modem:</label>
                                                            <input
                                                                type="file"
                                                                name="photo_modem"
                                                                accept="image/*"
                                                                data-service="voice"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Modem SN:</label>
                                                            <input
                                                                type="text"
                                                                name="modem_SN"
                                                                value={surveyData.voice.modem_SN}
                                                                data-service="voice"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
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
                                                        <div className="form-group">
                                                            <label>Password:</label>
                                                            <input
                                                                type="text"
                                                                name="password"
                                                                value={surveyData.voice.password}
                                                                data-service="voice"
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>

                        <div className="form-group">
                            <label>Survey Details:</label>
                            <textarea
                                name="surveyDetails"
                                value={surveyData.surveyDetails}
                                onChange={(e) => setSurveyData({ ...surveyData, surveyDetails: e.target.value })}
                            />
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSurveyModal;
