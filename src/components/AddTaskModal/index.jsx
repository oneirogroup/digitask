import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./addTask.css";
import { PiTelevisionSimpleLight } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";

const CreateTaskModal = ({ onClose }) => {
    const [activeFilter, setActiveFilter] = useState("connection");
    const [formData, setFormData] = useState({
        full_name: '',
        registration_number: '',
        contact_number: '',
        location: '',
        date: '',
        start_time: '',
        end_time: '',
        note: '',
        is_voice: false,
        is_internet: false,
        is_tv: false,
        task_type: '',
        group: [],
    });
    const [groups, setGroups] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://135.181.42.192/services/groups/');
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const task_type = activeFilter === "connection" ? "connection" : "problem";
            const time = `${formData.start_time}-${formData.end_time}`;

            const response = await axios.post('http://135.181.42.192/services/create_task/', {
                ...formData,
                task_type,
                time,
            });

            if (response.status === 201) {
                onClose(response.data);
            } else {
                console.error('Failed to create task', response);
            }

            window.location.reload();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleTaskTypeChange = (type) => {
        setActiveFilter(type);
        setFormData((prevState) => ({
            ...prevState,
            task_type: type,
        }));
    };

    const handleGroupSelect = (groupId) => {
        setFormData((prevState) => {
            const updatedGroups = prevState.group.includes(groupId)
                ? prevState.group.filter((id) => id !== groupId)
                : [...prevState.group, groupId];
            return { ...prevState, group: updatedGroups };
        });
    };

    const renderGroups = () => {
        return groups.map((group) => (
            <div key={group.id} className="dropdown-task-item" onClick={() => handleGroupSelect(group.id)}>
                <input
                    type="checkbox"
                    checked={formData.group.includes(group.id)}
                    onChange={() => handleGroupSelect(group.id)}
                />
                {group.group}
            </div>
        ));
    };

    return (
        <div className="task-modal" onClick={onClose}>
            <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className='task-modal-title'>
                    <h5>Yeni tapşırıq</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <hr />
                <div className='taskModal-taskType'>
                    <button
                        type="button"
                        className={activeFilter === "connection" ? "activeButton" : ""}
                        onClick={() => handleTaskTypeChange("connection")}
                    >
                        Qoşulma
                    </button>
                    <button
                        type="button"
                        className={activeFilter === "problem" ? "activeButton" : ""}
                        onClick={() => handleTaskTypeChange("problem")}
                    >
                        Problem
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='task-name-date'>
                        <div className="form-group">
                            <label htmlFor="full_name">Ad Soyad:</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
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
                                <label htmlFor="start_time">Başlayır:</label>
                                <input
                                    type="time"
                                    id="start_time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="end_time">Bitir:</label>
                                <input
                                    type="time"
                                    id="end_time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='registerNumber-contactNumber'>
                        <div className="form-group">
                            <label htmlFor="registration_number">Qeydiyyat nömrəsi:</label>
                            <input
                                type="text"
                                id="registration_number"
                                name="registration_number"
                                value={formData.registration_number}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact_number">Əlaqə nömrəsi:</label>
                            <input
                                type="text"
                                id="contact_number"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Adress:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className='taskService-taskGroup'>
                        <div className='tv-voice-internet'>
                            <label htmlFor="tv" className={`form-group ${formData.is_tv ? "activeTask" : ""}`}>
                                <input
                                    type="checkbox"
                                    id="tv"
                                    name="is_tv"
                                    checked={formData.is_tv}
                                    onChange={handleCheckboxChange}
                                />
                                <PiTelevisionSimpleLight /> TV</label>
                            <label htmlFor="internet" className={`form-group ${formData.is_internet ? "activeTask" : ""}`}>
                                <input
                                    type="checkbox"
                                    id="internet"
                                    name="is_internet"
                                    checked={formData.is_internet}
                                    onChange={handleCheckboxChange}
                                />
                                <TfiWorld /> Internet</label>
                            <label htmlFor="voice" className={`form-group ${formData.is_voice ? "activeTask" : ""}`}>
                                <input
                                    type="checkbox"
                                    id="voice"
                                    name="is_voice"
                                    checked={formData.is_voice}
                                    onChange={handleCheckboxChange}
                                />
                                <RiVoiceprintFill /> Voice</label>
                        </div>
                        <div className="form-group">
                            <label>Texniki Qrup:</label>
                            <div className="dropdown-task" ref={dropdownRef}>
                                <div
                                    className="dropdown-task-toggle"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {formData.group.length > 0
                                        ? `Qrup ${formData.group.join(', Qrup ')}`
                                        : 'Qrup Seçin'}
                                    <FaChevronDown />
                                </div>
                                {isDropdownOpen && (
                                    <div className="dropdown-task-menu">
                                        {renderGroups()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Qeydlər:</label>
                        <textarea
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Əlavə et
                    </button>
                </form>
            </div >
        </div >
    );
};

export default CreateTaskModal;
