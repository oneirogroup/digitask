import React, { useState, useEffect } from 'react';

function UpdateVoiceModal({ onClose, serviceId, serviceData, onServiceUpdate }) {
    const [formData, setFormData] = useState(serviceData || {});
    const [preview, setPreview] = useState(serviceData?.photo_modem || '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (serviceData?.photo_modem) {
            setPreview(serviceData.photo_modem);
        }
    }, [serviceData]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            if (file && file.type.startsWith('image/')) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    [name]: file
                }));
                setPreview(URL.createObjectURL(file));
                setError('');
            } else {
                setError('Yalnızca resim dosyaları yüklenebilir.');
            }
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('modem_SN', formData.modem_SN || '');
        data.append('home_number', formData.home_number || '');
        data.append('password', formData.password || '');

        if (formData.photo_modem instanceof File) {
            data.append('photo_modem', formData.photo_modem);
        }

        fetch(`http://135.181.42.192/services/update_voice/${serviceId}/`, {
            method: 'PATCH',
            body: data,
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        setError(JSON.stringify(error));
                        throw new Error(JSON.stringify(error));
                    });
                }
                return response.json();
            })
            .then(data => {
                onServiceUpdate('voice', data);
                onClose();
            })
            .catch(error => console.error('Error updating Voice service:', error.message));
    };

    return (
        <div className="taskType-modal">
            <div className="taskType-modal-content">
                <div className="taskType-modal-title">
                    <h2>Səs məlumatlarının dəyişdirilməsi</h2>
                    <div>
                        <span className="close" onClick={onClose}>&times;</span>
                    </div>
                </div>
                <div className="addSurveyModal-body">
                    <form onSubmit={handleSubmit} className='details-modal-body'>
                        <div className="service-fields service-update">
                            <div className="form-group">
                                <label className="upload-label">
                                    Modemin şəkli:
                                </label>
                                <div className="upload-icon">
                                    <input type="file" name="photo_modem" onChange={handleInputChange} />
                                </div>
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="image-preview"
                                    />
                                )}
                            </div>
                            <div className="update-fields">
                                <div className="form-group">
                                    <label>
                                        Modem Serial Number:
                                    </label>
                                    <input type="text" name="modem_SN" value={formData.modem_SN || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Ev Nömrəsi:
                                    </label>
                                    <input type="text" name="home_number" value={formData.home_number || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Şifrə:
                                    </label>
                                    <input type="text" name="password" value={formData.password || ''} onChange={handleInputChange} />
                                </div>
                            </div>
                            <hr />
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

export default UpdateVoiceModal;
