import React, { useState, useEffect } from 'react';
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

function DetailsModal({ onClose, taskId }) {
    const [taskDetails, setTaskDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        task_type: '',
        first_name: '',
        last_name: '',
        time: '',
        date: '',
        registration_number: '',
        contact_number: '',
        region: '',
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
                        full_name: `${data.first_name} ${data.last_name}`,
                        time: data.time,
                        registration_number: data.registration_number,
                        contact_number: data.contact_number,
                        region: data.region,
                        location: data.location,
                        services: data.services,
                        status: data.status,
                        group: data.group,
                        note: data.note,
                        date: data.date
                    });
                })
                .catch(error => console.error('Error fetching task details:', error));
        }
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
        fetch(`http://135.181.42.192/services/update_task/${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                setTaskDetails(data);
                setIsEditing(false);
            })
            .catch(error => console.error('Error updating task:', error));
    };

    const handleGroupChange = (e, index) => {
        const newGroups = [...formData.group];
        newGroups[index] = { ...newGroups[index], group: e.target.value };
        setFormData({ ...formData, group: newGroups });
    };

    if (!taskDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="taskType-modal">
            <div className="taskType-modal-content">
                <div className="taskType-modal-title">
                    {isEditing ? (
                        <div>
                            <label><span>Task Type</span></label>
                            <input type="text" name="task_type" value={formData.task_type} onChange={handleInputChange} />
                        </div>
                    ) : (
                        <h5>{taskDetails?.task_type?.charAt(0).toUpperCase() + taskDetails?.task_type?.slice(1)} məlumatları</h5>
                    )}
                    <div>
                        <RiEdit2Line onClick={handleEditClick} />
                        <span className="close" onClick={onClose}>&times;</span>
                    </div>
                </div>
                <hr />
                {isEditing ? (
                    <form onSubmit={handleFormSubmit} className="taskType-modal-body">
                        <div className="taskType-info">
                            <div>
                                <label><IoPersonOutline /> Ad və soyad</label>
                                <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                                <hr />
                            </div>
                            <div>
                                <label><GoClock /> Zaman</label>
                                <input type="text" name="time" value={formData.time} onChange={handleInputChange} />
                                <hr />
                            </div>
                            <div>
                                <label><BsTelephone /> Qeydiyyat nömrəsi</label>
                                <input type="text" name="registration_number" value={formData.registration_number} onChange={handleInputChange} />
                                <hr />
                            </div>
                            <div>
                                <label><LiaPhoneVolumeSolid /> Əlaqə nömrəsi</label>
                                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} />
                                <hr />
                            </div>
                            <div>
                                <label><RiMapPinLine /> Adres</label>
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                                <hr />
                            </div>
                            <div>
                                <label><MdOutlineMiscellaneousServices /> Servis</label>
                                <input type="text" name="services" value={formData.services} onChange={handleInputChange} />
                                <hr />
                            </div>
                            <div>
                                <label><BiComment /> Status</label>
                                <input type="text" name="status" value={formData.status} onChange={handleInputChange} />
                                <hr />
                            </div>
                        </div>
                        <div className="taskType-note">
                            <div>
                                <label><MdOutlineEngineering /> Texniki qrup</label>
                                {formData.group.map((group, index) => (
                                    <input key={index} type="text" name="group" value={group.group} onChange={(e) => handleGroupChange(e, index)} />
                                ))}
                                <hr />
                            </div>
                            <div>
                                <label>Qeyd</label>
                                <textarea name="note" value={formData.note} onChange={handleInputChange}></textarea>
                                <hr />
                            </div>
                        </div>
                        <button type="submit">Yenilə</button>
                    </form>
                ) : (
                    <div className="taskType-modal-body">
                        <div className="taskType-info">
                            <div>
                                <div>
                                    <label><IoPersonOutline /> Ad və soyad</label>
                                    <span>{taskDetails.first_name} {taskDetails.last_name}</span>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div>
                                    <label><GoClock /> Zaman</label>
                                    <span>{`${taskDetails.date.split('-')[2]} ${monthNames[parseInt(taskDetails.date.split('-')[1], 10) - 1]}, ${taskDetails.time}`}</span>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div>
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
                                    {taskDetails.group && taskDetails.group.map((group, index) => (
                                        <div key={index}>
                                            <span>{group.group}</span>
                                        </div>
                                    ))}
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div className="taskType-note">
                            <div>
                                <div className='taskType-adress'>
                                    <label><RiMapPinLine /> Adres</label>
                                    <span>{taskDetails.location}</span>
                                </div>
                            </div>
                            <hr />

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
