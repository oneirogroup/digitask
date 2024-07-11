import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./eventModal.css";
import { IoMdClose } from "react-icons/io";
import { RiMapPinAddFill } from "react-icons/ri";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


const MEETING_TYPES = [
  { value: 'Şənlik', label: 'Şənlik' },
  { value: 'Toplantı', label: 'Toplantı' },
  { value: 'Konfrans', label: 'Konfrans' },
  { value: 'Seminar', label: 'Seminar' }
];

const AddEventModal = ({ isOpen, onClose }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [meetingType, setMeetingType] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMeetingTypeModalOpen, setIsMeetingTypeModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get('http://135.181.42.192/accounts/users/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setParticipants(response.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, []);

  // Modal kapatıldığında veya etkinlik eklendikten sonra durumu sıfırla
  const resetModalState = () => {
    setEventName('');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setEventDescription('');
    setMeetingType(null);
    setSelectedParticipants([]);
  };

  const handleAddEvent = async () => {
    setLoading(true);
    setError(null);

    const eventData = {
      title: eventName,
      meeting_type: meetingType,
      participants: selectedParticipants.map(participant => participant.id),
      date: `${eventDate}T${eventTime}:00`,
      meeting_description: eventDescription
    };

    try {
      const response = await axios.post('http://135.181.42.192/services/create_meeting/', eventData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Event added:', response.data);
      onClose(); // Modalı kapat
      resetModalState(); // Durumu sıfırla
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Tədbir əlavə edilərkən xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const toggleMeetingTypeModal = () => setIsMeetingTypeModalOpen(!isMeetingTypeModalOpen);
  const toggleParticipantsModal = () => setIsParticipantsModalOpen(!isParticipantsModalOpen);

  const handleMeetingTypeSelect = (type) => {
    setMeetingType(type);
    toggleMeetingTypeModal();
  };

  const handleParticipantSelect = (participant) => {
    setSelectedParticipants(prevParticipants => {
      if (prevParticipants.some(p => p.id === participant.id)) {
        return prevParticipants.filter(p => p.id !== participant.id);
      } else {
        return [...prevParticipants, participant];
      }
    });
  };

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <h5>Yeni tədbir</h5>
          <button onClick={() => { onClose(); resetModalState(); }}><IoMdClose /></button>
        </div>
        <hr />
        <div className="modal-body">
          <label>
            Tədbirin adı:
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </label>
          <div className="date-time-container">
            <label>
              Keçiriləcəyi gün:
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </label>
            <label>
              Saat:
              <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
            </label>
          </div>
          <div className='meetingType-participants'>
            <label onClick={toggleMeetingTypeModal}>
              Görüş növü:  <div>
                {meetingType ? meetingType : 'Seçin'}
                <span>{isMeetingTypeModalOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>
            </label>
            {isMeetingTypeModalOpen && (
              <div className="modal-overlay-meetingType">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4>Görüş növü seçin</h4>
                    <button onClick={toggleMeetingTypeModal}><IoMdClose /></button>
                  </div>
                  <div className="modal-body">
                    {MEETING_TYPES.map(type => (
                      <div key={type.value} onClick={() => handleMeetingTypeSelect(type.value)}>
                        {type.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <label onClick={toggleParticipantsModal}>
              İştirakçılar: <div>
                {selectedParticipants.length > 0
                  ? selectedParticipants.map(p => `${p.first_name} ${p.last_name}`).join(', ')
                  : <span>Seçin <span>{isParticipantsModalOpen ? <FaChevronUp /> : <FaChevronDown />}</span></span>}
              </div>
            </label>
            {isParticipantsModalOpen && (
              <div className="modal-overlay-participants">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4>İştirakçıları seçin</h4>
                    <button onClick={toggleParticipantsModal}><IoMdClose /></button>
                  </div>
                  <div className="modal-body">
                    {participants.map(participant => (
                      <div key={participant.id} onClick={() => handleParticipantSelect(participant)}>
                        {participant.first_name} {participant.last_name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <label>
            Keçiriləcəyi yer:
            <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
            <RiMapPinAddFill />
          </label>
          <label>
            Qeyd:
            <textarea value={eventDescription} placeholder='Qeydlər' onChange={(e) => setEventDescription(e.target.value)} />
          </label>
          {error && <p className="error">{error}</p>}
          <button onClick={handleAddEvent} disabled={loading}>
            {loading ? 'Əlavə edilir...' : 'Əlavə Et'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
