import React, { useState, useEffect } from 'react';

function UpdateTVModal({ onClose, serviceId, serviceData, onServiceUpdate }) {
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
        data.append('rg6_cable', formData.rg6_cable || '');
        data.append('f_connector', formData.f_connector || '');
        data.append('splitter', formData.splitter || '');

        if (formData.photo_modem instanceof File) {
            data.append('photo_modem', formData.photo_modem);
        }

        fetch(`http://135.181.42.192/services/update_tv/${serviceId}/`, {
            method: 'PUT',
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
                onServiceUpdate('tv', data);
                onClose();
            })
            .catch(error => console.error('Error updating TV service:', error.message));
    };

    return (
        <div className="taskType-modal">
            <div className="taskType-modal-content">
                <div className="taskType-modal-title">
                    <h2>Tv məlumatlarının dəyişdirilməsi</h2>
                    <div>
                        <span className="close" onClick={onClose}>&times;</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        Modem Serial Number:
                        <input type="text" name="modem_SN" value={formData.modem_SN || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        RG6 Cable:
                        <input type="text" name="rg6_cable" value={formData.rg6_cable || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        F Connector:
                        <input type="text" name="f_connector" value={formData.f_connector || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Splitter:
                        <input type="text" name="splitter" value={formData.splitter || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Photo Modem:
                        <input type="file" name="photo_modem" onChange={handleInputChange} />
                    </label>
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="image-preview"
                        />
                    )}
                    <button type="submit">Update</button>
                </form>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

export default UpdateTVModal;
