import React, { useState, useEffect, useRef } from 'react';
import { RiEdit2Line } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { GoClock } from "react-icons/go";
import { CiMapPin } from "react-icons/ci";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { RiMapPinLine } from "react-icons/ri";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { BiComment } from "react-icons/bi";
import { MdOutlineEngineering } from "react-icons/md";
import './detailsModal.css';
import { FaChevronDown } from "react-icons/fa";


const TASK_TYPES = [
    { value: 'connection', label: 'Qoşulma' },
    { value: 'problem', label: 'Problem' }
];

const STATUS_OPTIONS = [
    { value: 'waiting', label: 'Gözləyir' },
    { value: 'inprogress', label: 'Qəbul edilib' },
    { value: 'started', label: 'Başlanıb' },
    { value: 'completed', label: 'Tamamlandı' }
];


function DetailsModal({ onClose, taskId, userType }) {
    const [taskDetails, setTaskDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({
        task_type: '',
        full_name: '',
        time: '',
        registration_number: '',
        contact_number: '',
        location: '',
        services: '',
        status: '',
        group: [],
        note: ''
    });

    const monthNames = [
        "yanvar",
        "fevral",
        "mart",
        "aprel",
        "may",
        "iyun",
        "iyul",
        "avqust",
        "sentyabr",
        "oktyabr",
        "noyabr",
        "dekabr"
    ];

    useEffect(() => {
        if (taskId) {
            fetch(`http://135.181.42.192/services/task/${taskId}/`)
                .then(response => response.json())
                .then(data => {
                    setTaskDetails(data);
                    setFormData({
                        task_type: data.task_type,
                        full_name: data.full_name,
                        time: data.time,
                        registration_number: data.registration_number,
                        contact_number: data.contact_number,
                        location: data.location,
                        services: data.services,
                        status: data.status,
                        group: data.group.map(g => g.id),
                        note: data.note,
                    });
                })
                .catch(error => console.error('Error fetching task details:', error));
        }

        fetch('http://135.181.42.192/services/groups/')
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error('Error fetching groups:', error));
    }, [taskId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("formData:", formData);

        const updatedData = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] !== taskDetails[key]) {
                updatedData[key] = formData[key];
            }
        });
        window.location.reload();


        if (updatedData.id) {
            updatedData.id = formData.id;
        }

        fetch(`http://135.181.42.192/services/update_task/${taskId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)

        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(`Error: ${response.status} ${response.statusText} - ${JSON.stringify(err)}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                setTaskDetails(data);
                setIsEditing(false);
                onClose();
            })
            .catch(error => console.error('Error updating task:', error));
    };

    const handleGroupSelect = (groupId) => {
        setFormData((prevFormData) => {
            const newGroup = prevFormData.group.includes(groupId)
                ? prevFormData.group.filter(id => id !== groupId)
                : [...prevFormData.group, groupId];
            return { ...prevFormData, group: newGroup };
        });
    };
    const [isDropdownOpenTaskType, setIsDropdownOpenTaskType] = useState(false);
    const [isDropdownOpenStatus, setIsDropdownOpenStatus] = useState(false);
    const [isDropdownOpenGroup, setIsDropdownOpenGroup] = useState(false);


    const dropdownRef = useRef(null);

    const toggleDropdownTaskType = () => {
        setIsDropdownOpenTaskType(!isDropdownOpenTaskType);
    };

    const toggleDropdownStatus = () => {
        setIsDropdownOpenStatus(!isDropdownOpenStatus);
    };

    const toggleDropdownGroup = () => {
        setIsDropdownOpenGroup(!isDropdownOpenGroup);
    };

    const handleTaskTypeSelect = (type) => {
        setFormData({ ...formData, task_type: type });
        setIsDropdownOpenTaskType(false);
    };

    const handleStatusSelect = (status) => {
        setFormData({ ...formData, status: status });
        setIsDropdownOpenStatus(false);
    };

    const renderTaskTypeOptions = () => {
        return TASK_TYPES.map(option => (
            <div
                key={option.value}
                className={`taskType-option ${formData.task_type === option.value ? 'selected' : ''}`}
                onClick={() => handleTaskTypeSelect(option.value)}
            >
                {option.label}
            </div>
        ));
    };

    const renderStatusOptions = () => {
        return STATUS_OPTIONS.map(option => (
            <div
                key={option.value}
                className={`taskType-option ${formData.status === option.value ? 'selected' : ''}`}
                onClick={() => handleStatusSelect(option.value)}
            >
                {option.label}
            </div>
        ));
    };

    const renderGroups = () => {
        return groups.map((group) => (
            <label key={group.id} className="dropdown-task-item">
                <input
                    type="checkbox"
                    checked={formData.group.includes(group.id)}
                    onChange={() => handleGroupSelect(group.id)}
                />
                {group.group}
            </label>
        ));
    };

    if (!taskDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="taskType-modal">
            <div className="taskType-modal-content">
                <div className="taskType-modal-title">
                    {isEditing ? (
                        <div className='details-title'>
                            <label><span>Tapşırığın Növü </span></label>
                            <div className="taskType-dropdown ">
                                <div className="taskType-toggle details-toggle" onClick={toggleDropdownTaskType}>
                                    {formData.task_type ? formData.task_type === 'connection' ? 'Qoşulma' : 'Problem' : 'Tapşırığı Seçin'}
                                    <FaChevronDown />

                                </div>
                                {isDropdownOpenTaskType && (
                                    <div className="taskType-options">
                                        {renderTaskTypeOptions()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <h5>{taskDetails?.task_type ? (taskDetails.task_type === "connection" ? "Qoşulma" : "Problem") + " məlumatları" : ""}</h5>
                    )}
                    <div>
                        {userType !== 'technician' && (
                            <RiEdit2Line onClick={handleEditClick} />

                        )}
                        <span className="close" onClick={onClose}>&times;</span>
                    </div>
                </div>
                <hr />
                {isEditing ? (
                    <form onSubmit={handleFormSubmit} className="details-modal-body">
                        <div>
                            <div className="taskType-info details-info">
                                <div>
                                    <div>
                                        <label><IoPersonOutline /> Ad və soyad</label>
                                        <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                                    </div>
                                    <hr />
                                </div>
                                <div>
                                    <div>
                                        <label><GoClock /> Zaman</label>
                                        <input type="text" name="time" value={formData.time} onChange={handleInputChange} />
                                    </div>
                                    <hr />
                                </div>
                                <div>
                                    <div>
                                        <label><BsTelephone /> Qeydiyyat nömrəsi</label>
                                        <input type="text" name="registration_number" value={formData.registration_number} onChange={handleInputChange} />
                                    </div>
                                    <hr />
                                </div>
                                <div>
                                    <div>
                                        <label><LiaPhoneVolumeSolid /> Əlaqə nömrəsi</label>
                                        <input type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} />
                                    </div>
                                    <hr />
                                </div>
                                <div>
                                    <div>
                                        <label><RiMapPinLine /> Adres</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                                    </div>
                                    <hr />
                                </div>
                                <div>
                                    <div>
                                        <label><MdOutlineMiscellaneousServices /> Servis</label>
                                        <input type="text" name="services" value={formData.services} onChange={handleInputChange} />
                                    </div>
                                    <hr />
                                </div>
                                <div>
                                    <div className='status-dropdown-div'>
                                        <label><BiComment /> Status</label>
                                        <div className="status-dropdown">
                                            <div className="taskType-toggle details-toggle" onClick={toggleDropdownStatus}>
                                                {formData.status ? STATUS_OPTIONS.find(option => option.value === formData.status)?.label : 'Status Seçin'}
                                                <FaChevronDown />

                                            </div>
                                            {isDropdownOpenStatus && (
                                                <div className="taskType-options">
                                                    {renderStatusOptions()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                                <div>
                                    <div className="form-group">
                                        <label><MdOutlineEngineering /> Texniki qrup</label>
                                        <div className="dropdown-task" id='details-task' ref={dropdownRef}>
                                            <div
                                                className="dropdown-task-toggle"
                                                onClick={() => setIsDropdownOpenGroup(!isDropdownOpenGroup)}
                                            >
                                                {formData.group.length > 0
                                                    ? `Qrup ${formData.group.join(', Qrup ')}`
                                                    : 'Qrup Seçin'}
                                                <FaChevronDown />
                                            </div>
                                            {isDropdownOpenGroup && (
                                                <div className="dropdown-task-menu">
                                                    {renderGroups()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <hr />

                                </div>

                            </div>
                            <div className="taskType-note details-note">
                                <div>
                                    <label>Qeyd</label>
                                    <textarea name="note" value={formData.note} onChange={handleInputChange}></textarea>
                                </div>
                                <hr />
                            </div>
                            <button className='updateTask-button' type="submit">Yenilə</button>
                        </div>
                    </form>
                ) : (
                    <div className="taskType-modal-body">
                        <div className="taskType-info">
                            <div>
                                <div>
                                    <label><IoPersonOutline /> Ad və soyad</label>
                                    <span>{taskDetails.full_name}</span>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div>
                                    <label><GoClock /> Zaman</label>
                                    {taskDetails.date && (
                                        <span>{`${taskDetails.date.split('-')[2]} ${monthNames[parseInt(taskDetails.date.split('-')[1], 10) - 1]}, ${taskDetails.time}`}</span>
                                    )}
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div className='registrationNumber'>
                                    <label><BsTelephone /> Qeydiyyat nömrəsi</label>
                                    <span>{taskDetails.registration_number}</span>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div className='taskType-phone'>
                                    <label><LiaPhoneVolumeSolid /> Əlaqə nömrəsi</label>
                                    <span>{taskDetails.contact_number}</span>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div>
                                    <label><MdOutlineMiscellaneousServices /> Servis</label>
                                    <span>{taskDetails.services}</span>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div className='taskType-status'>
                                    <label><BiComment /> Status</label>
                                    <span>{taskDetails.status}</span>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div>
                                    <label><MdOutlineEngineering /> Texniki qrup</label>
                                    {taskDetails.group && taskDetails.group.length > 0 ? (
                                        taskDetails.group.map((group, index) => (
                                            <div key={index}>
                                                <span>{group.group}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span>Texniki qrup seçilməyib.</span>
                                    )}
                                </div>
                                <hr />
                            </div>

                            <div>
                                <div className='taskType-address'>
                                    <label><RiMapPinLine /> Adres</label>
                                    <span>{taskDetails.location}</span>
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div className="taskType-note">
                            <div>
                                <label>Qeyd</label>
                                <span>{taskDetails.note}</span>
                            </div>
                            <hr />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailsModal;
