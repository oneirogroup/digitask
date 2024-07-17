import React, { useState, useEffect } from 'react';

function UpdateInternetModal({ onClose, serviceId, serviceData, onServiceUpdate }) {
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
        data.append('optical_cable', formData.optical_cable || '');
        data.append('fastconnector', formData.fastconnector || '');
        data.append('siqnal', formData.siqnal || '');

        if (formData.photo_modem instanceof File) {
            data.append('photo_modem', formData.photo_modem);
        }

        fetch(`http://135.181.42.192/services/update_internet/${serviceId}/`, {
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
                onServiceUpdate('internet', data);
                onClose();
            })
            .catch(error => console.error('Error updating Internet service:', error.message));
    };

    return (
        <div className="taskType-modal">
            <div className="taskType-modal-content">
                <h2>Internet məlumatlarının dəyişdirilməsi</h2>
                <div>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Modem Serial Number:
                        <input type="text" name="modem_SN" value={formData.modem_SN || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Optik Kabel:
                        <input type="text" name="optical_cable" value={formData.optical_cable || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Fastconnector:
                        <input type="text" name="fastconnector" value={formData.fastconnector || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Siqnal:
                        <input type="text" name="siqnal" value={formData.siqnal || ''} onChange={handleInputChange} />
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

export default UpdateInternetModal;
