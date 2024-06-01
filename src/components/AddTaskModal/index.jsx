import React, { useState } from 'react';
import axios from 'axios';
import "./addTask.css"

const CreateTaskModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        registrationNumber: '',
        contactNumber: '',
        location: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        isVoice: false,
        isInternet: false,
        isTv: false,
        technicalGroup: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://135.181.42.192/services/create_task/', formData);
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="task-modal">
            <div className="task-modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <div className='task-name-date'>
                        <div className="form-group">
                            <label htmlFor="name">Ad Soyad:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className='task-date-form'>
                            <div className="form-group">
                                <label htmlFor="date">Tarix:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="startTime">Başlayır:</label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="endTime">Bitir:</label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='registerNumber-contactNumber'>
                        <div className="form-group">
                            <label htmlFor="registrationNumber">Qeydiyyat nömrəsi:</label>
                            <input
                                type="text"
                                id="registrationNumber"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactNumber">Əlaqə nömrəsi:</label>
                            <input
                                type="text"
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Region:</label>
                        <select
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="Suraxanı">Suraxanı</option>
                            <option value="Sabunçu">Sabunçu</option>
                            {/* Add more regions as needed */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="adress">Adress:</label>
                        <select
                            id="adress"
                            name="adress"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="Suraxanı">Suraxanı</option>
                            <option value="Sabunçu">Sabunçu</option>
                            {/* Add more regions as needed */}
                        </select>
                    </div>
                    <div className='tv-voice-internet'>
                        <div className="form-group">
                            <label htmlFor="isVoice">Voice:</label>
                            <input
                                type="checkbox"
                                id="isVoice"
                                name="isVoice"
                                checked={formData.isVoice}
                                onChange={handleCheckboxChange}
                                className="form-check-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="isInternet">Internet:</label>
                            <input
                                type="checkbox"
                                id="isInternet"
                                name="isInternet"
                                checked={formData.isInternet}
                                onChange={handleCheckboxChange}
                                className="form-check-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="isTv">Tv:</label>
                            <input
                                type="checkbox"
                                id="isTv"
                                name="isTv"
                                checked={formData.isTv}
                                onChange={handleCheckboxChange}
                                className="form-check-input"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="technicalGroup">Texniki Qrup:</label>
                        <select
                            id="technicalGroup"
                            name="technicalGroup"
                            value={formData.technicalGroup}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="Qrup 1">Qrup 1</option>
                            <option value="Qrup 2">Qrup 2</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Qeydlər:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Əlavə et
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;