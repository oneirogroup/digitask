import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./addTask.css";
import { PiTelevisionSimpleLight } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";

/////////////////////////////////////////////////////////////////////////start
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapClickHandler({ onClick }) {
    useMapEvents({
        click: (e) => {
            onClick(e.latlng);
        },
    });
    return null;
}
/////////////////////////////////////////////////////////////////////////end

const CreateTaskModal = ({ onClose, onTaskCreated }) => {
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
        latitude: null,
        longitude: null,
    });
    const [groups, setGroups] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errors, setErrors] = useState({});
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
    
        // Check if the input field is the contact field
        if (name === "contact_number" || name == "registration_number") {
            // Allow only numbers, spaces, and the characters ()+
            const filteredValue = value.replace(/[^0-9()+\s]/g, "");
    
            setFormData((prevState) => ({
                ...prevState,
                [name]: filteredValue,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
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

    const [errorText, setErrorText] = useState('');
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.full_name) newErrors.full_name = 'Müştəri adını daxil edin!';
        if (!formData.date) newErrors.date = 'tarixi';
        if (!formData.start_time) newErrors.start_time = 'başlanğıc saatı';
        if (!formData.end_time) newErrors.end_time = 'bitmə saatı';
        if (!formData.registration_number) newErrors.registration_number = 'Qeydiyyat nömrəsi daxil edin!';
        if (!formData.contact_number) newErrors.contact_number = 'Əlaqə nömrəsini daxil edin!';
        if (!formData.location) newErrors.location = 'Ünvanı daxil edin!';
        if (!formData.is_tv && !formData.is_internet && !formData.is_voice)
            newErrors.service = 'Tv, internet və ya səs xidmətini seçin!';
        if (formData.group.length === 0) newErrors.group = 'Qrup seçin!';

        const errorMessages = [
            newErrors.date,
            newErrors.start_time,
            newErrors.end_time
        ].filter(Boolean);

        let errorText = '';
        if (errorMessages.length > 0) {
            if (errorMessages.length === 1) {
                errorText = errorMessages[0];
            } else if (errorMessages.length === 2) {
                errorText = errorMessages.join(' və ');
            } else {
                const lastMessage = errorMessages.pop();
                errorText = `${errorMessages.join(', ')} və ${lastMessage}`;
            }
        }

        return {
            newErrors,
            errorText
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { newErrors, errorText } = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorText(errorText);
            return;
        }

        try {
            const task_type = activeFilter === "connection" ? "connection" : "problem";

            const response = await axios.post('http://135.181.42.192/services/create_task/', {
                ...formData,
                task_type,
            });

            if (response.status === 201) {
                onTaskCreated(response.data);
                onClose();
                onClose(response.data);
            } else {
                console.error('Failed to create task', response);
            }

        } catch (error) {
            console.error('Error creating task:', error);
        }
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

    const [position, setPosition] = useState({ lat: '', lng: '' });

    const handleMapClick = (latlng) => {
        setFormData((prevState) => ({
            ...prevState,
            latitude: latlng.lat,
            longitude: latlng.lng,
        }));
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
                            <label htmlFor="full_name">Müştərinin ad və soyadı:</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="form-control"
                            />
                            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
                        </div>
                        <div className='form-group'>
                            <div className='task-date-form'>
                                <div className="">
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
                                <div className="">
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
                                <div className="">
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
                            {errorText && <span className='capitalize-first-letter error-message'>{errorText} daxil edin!</span>}

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
                            {errors.registration_number && <span className="error-message">{errors.registration_number}</span>}
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
                            {errors.contact_number && <span className="error-message">{errors.contact_number}</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Ünvan:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.location && <span className="error-message">{errors.location}</span>}
                    </div>
                    <div className='taskService-taskGroup'>
                        <div className="form-group">
                            <div className='tv-voice-internet'>
                                <label htmlFor="tv" className={`form-group ${formData.is_tv ? "activeTask" : ""}`}>
                                    <input
                                        type="checkbox"
                                        id="tv"
                                        name="is_tv"
                                        checked={formData.is_tv}
                                        onChange={handleCheckboxChange}
                                    />
                                    <PiTelevisionSimpleLight /> TV
                                </label>
                                <label htmlFor="internet" className={`form-group ${formData.is_internet ? "activeTask" : ""}`}>
                                    <input
                                        type="checkbox"
                                        id="internet"
                                        name="is_internet"
                                        checked={formData.is_internet}
                                        onChange={handleCheckboxChange}
                                    />
                                    <TfiWorld /> İnternet
                                </label>
                                <label htmlFor="voice" className={`form-group ${formData.is_voice ? "activeTask" : ""}`}>
                                    <input
                                        type="checkbox"
                                        id="voice"
                                        name="is_voice"
                                        checked={formData.is_voice}
                                        onChange={handleCheckboxChange}
                                    />
                                    <RiVoiceprintFill /> Səs
                                </label>
                            </div>
                            {errors.service && <span className="error-message">{errors.service}</span>}
                        </div>
                        <div className="form-group">
                            <label>Texniki qrup:</label>
                            <div className="dropdown-task" ref={dropdownRef}>
                                <div
                                    className="dropdown-task-toggle"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {formData.group.length > 0
                                        ? `Qrup ${formData.group.join(', Qrup ')}`
                                        : 'Qrup seçin'}
                                    <FaChevronDown />
                                </div>
                                {isDropdownOpen && (
                                    <div className="dropdown-task-menu">
                                        {renderGroups()}
                                    </div>
                                )}
                            </div>
                            {errors.group && <span className="error-message">{errors.group}</span>}
                        </div>
                    </div>
                    <div class="form-group mapDiv">
                        <label htmlFor="note">Müştəri ünvanı:</label>
                        <MapContainer center={[40.4093, 49.8671]} zoom={13} style={{ height: '300px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapClickHandler onClick={handleMapClick} />
                            {formData.latitude && formData.longitude && (
                                <Marker position={[formData.latitude, formData.longitude]} />
                            )}
                        </MapContainer>

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
                        {errors.note && <span className="error-message">{errors.note}</span>}
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
