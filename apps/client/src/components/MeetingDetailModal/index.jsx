import { useState, useEffect } from 'react';
import axios from 'axios';

import './MeetingDetailModal.css';

const MeetingDetailModal = ({ isOpen, onClose, meetingId }) => {
    const [meeting, setMeeting] = useState(null);

    useEffect(() => {
        if (isOpen && meetingId) {
            const fetchMeetingDetails = async () => {
                try {
                    const response = await axios.get(`http://135.181.42.192/services/meeting/${meetingId}/`);
                    setMeeting(response.data);
                } catch (error) {
                    console.error('Error fetching meeting details:', error);
                }
            };

            fetchMeetingDetails();
        }
    }, [isOpen, meetingId]);

    if (!isOpen || !meeting) {
        return null;
    }

    return (
        <div className="meeting-detail-modal-overlay">
            <div className="item-detail-modal-content">
                <div className="item-detail-modal-header">
                    <h2>Tədbir məlumatları</h2>
                    <span className="item-detail-close-button" onClick={onClose}>&times;</span>
                </div >
                <div className="item-detail-modal-body">
                    <div className="modal-row">
                        <div className="modal-label">Görüşün adı</div>
                        <div className="modal-value">{meeting.title || 'Qeyd yoxdur'}</div>
                    </div>
                    <hr />
                    <div className="modal-row">
                        <div className="modal-label">İştirakçılar</div>
                        <div className="modal-value">{meeting.participants.join(', ') || 'Qeyd yoxdur'}</div>
                    </div>
                    <hr />
                    <div className='meeting-item-detail-grid'>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Görüş növü</div>
                                <div className="modal-value">{meeting.meeting_type || 'Qeyd yoxdur'}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Tarix</div>
                                <div className="modal-value">
                                    {new Date(meeting.date).toLocaleString()}
                                </div>
                            </div>

                            <hr />
                        </div>

                    </div>
                    <div>
                        <div className="modal-row">
                            <div className="modal-label">Tədbir haqqında</div>
                            <div className="modal-value">{meeting.meeting_description || 'Qeyd yoxdur'}</div>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        </div >
    );
};

export default MeetingDetailModal;
