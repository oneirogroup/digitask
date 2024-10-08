import React, { useState } from 'react';
import './addgroup.css';
import axios from 'axios';

const AddGroupModal = ({ onClose, onGroupAdded }) => {
    const [group, setGroup] = useState('');
    const [region, setRegion] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('refresh_token');
            const response = await axios.post('http://135.181.42.192/services/create_employee_group', { group, region }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            onGroupAdded(response.data);
            onClose();
        } catch (error) {
            console.error('Error adding group:', error);
        }
    };

    return (
        <div className="group-modal-overlay">
            <div className="add-group-modal-content">
                <div className="add-group-modal-title">
                    <h5>Yeni qrup</h5>
                    <span onClick={onClose}>&times;</span>
                </div>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className='form-group'>
                            <label htmlFor="groupName">Ad</label>
                            <input
                                type="text"
                                id="groupName"
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                                required
                                maxLength={30}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="groupRegion">Region</label>
                            <input
                                type="text"
                                id="groupRegion"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                required
                                maxLength={30}
                            />
                        </div>
                    </div>
                    <button type="submit">Qrup əlavə et</button>
                </form>
            </div>
        </div>
    );
};

export default AddGroupModal;
