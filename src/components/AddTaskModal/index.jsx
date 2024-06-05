import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./addTask.css";
import { PiTelevisionSimpleLight } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";


const CreateTaskModal = ({ onClose }) => {
    const [activeFilter, setActiveFilter] = useState("connection");
    const [activeTaskFilter, setActiveTaskFilter] = useState();

    const [formData, setFormData] = useState({
        name: '',
        registration_number: '',
        contact_number: '',
        location: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        time: '',
        note: '',
        is_voice: false,
        is_internet: false,
        is_tv: false,
        task_type: '',
        group: [],
    });

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://135.181.42.192/services/create_task/');
            setGroups(response.data.group);
            console.log(response)
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'group') {
            const selectedGroups = Array.from(e.target.selectedOptions, option => option.value);
            setFormData((prevState) => ({
                ...prevState,
                [name]: selectedGroups,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const task_type = activeFilter === "connection" ? "connection" : "problem";
            const time = `${formData.startTime}-${formData.endTime}`;
            const response = await axios.post('http://135.181.42.192/services/create_task/', { ...formData, task_type, time });
            if (response.status === 201) {
                onClose(response.data);
            } else {
                console.error('Failed to create task', response);
            }
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

    const handleActiveTaskFilter = (filter) => {
        setActiveTaskFilter(filter);
        let is_voice = filter === "voice";
        let is_internet = filter === "internet";
        let is_tv = filter === "tv";
        setFormData((prevState) => ({
            ...prevState,
            is_voice: is_voice,
            is_internet: is_internet,
            is_tv: is_tv,
        }));
    };


    return (
        <div className="task-modal">
            <div className="task-modal-content">
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
                        <label htmlFor="adress">Adress:</label>
                        <input
                            type="text"
                            id="adress"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className='taskService-taskGroup'>
                        <div className='tv-voice-internet'>
                            <div onClick={() => handleActiveTaskFilter("tv")} className={`form-group ${activeTaskFilter === "tv" ? "activeTask" : ""}`}>
                                <PiTelevisionSimpleLight />
                                <button type="button">Tv</button>
                            </div>
                            <div onClick={() => handleActiveTaskFilter("internet")} className={`form-group ${activeTaskFilter === "internet" ? "activeTask" : ""}`}>
                                <TfiWorld />
                                <button type="button">Internet</button>
                            </div>
                            <div onClick={() => handleActiveTaskFilter("voice")} className={`form-group ${activeTaskFilter === "voice" ? "activeTask" : ""}`}>
                                <RiVoiceprintFill />
                                <button type="button">Voice</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="group">Texniki Qrup:</label>
                            <select
                                id="group"
                                name="group"
                                value={formData.group}
                                onChange={handleChange}
                                className="form-control"
                                multiple
                            >
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>{group.id}</option>
                                ))}
                            </select>
                        </div>
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
