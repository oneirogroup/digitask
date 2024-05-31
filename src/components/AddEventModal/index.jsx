import React, { useState } from 'react';
import "./eventModal.css"
import { IoMdClose } from "react-icons/io";
import { RiMapPinAddFill } from "react-icons/ri";

const AddEventModal = ({ isOpen, onClose }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventNote, setEventNote] = useState('');

  const handleAddEvent = () => {
    console.log('Tədbir əlavə edildi:', {
      eventName,
      eventDate,
      eventTime,
      eventLocation,
      eventNote
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        <div>
          <h5>Yeni tədbir</h5>
          <button onClick={onClose}><IoMdClose /></button>
        </div>
        <hr />
        <div>
          <label>
            Tədbirin adı:
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </label>
          <div>
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
            <textarea value={eventNote} placeholder='Qeydlər' onChange={(e) => setEventNote(e.target.value)} />
          </label>
          <button onClick={handleAddEvent}>Əlavə Et</button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
