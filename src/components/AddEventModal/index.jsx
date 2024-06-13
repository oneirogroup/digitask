import React, { useState } from 'react';
import axios from 'axios';
import "./eventModal.css";
import { IoMdClose } from "react-icons/io";
import { RiMapPinAddFill } from "react-icons/ri";

const AddEventModal = ({ isOpen, onClose }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddEvent = async () => {
    setLoading(true);
    setError(null);

    const eventData = {
      title: eventName,
      meeting_type: 'default', // or some appropriate value
      date: `${eventDate}T${eventTime}:00`, // combining date and time
      meeting_description: eventDescription
    };

    try {
      const response = await axios.post('http://135.181.42.192/services/create_meeting/', eventData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Event added:', response.data);
      onClose();
    } catch (error) {
      console.error('Error adding event:', error);
      setError('An error occurred while adding the event.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <h5>Yeni tədbir</h5>
          <button onClick={onClose}><IoMdClose /></button>
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