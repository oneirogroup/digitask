import axios from "axios";
import az from "date-fns/locale/az";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiMapPinAddFill } from "react-icons/ri";

import useRefreshToken from "../../common/refreshToken";

import "./eventModal.css";

registerLocale("az", az);

const MEETING_TYPES = [
  { value: "Şənlik", label: "Şənlik" },
  { value: "Toplantı", label: "Toplantı" },
  { value: "Konfrans", label: "Konfrans" },
  { value: "Seminar", label: "Seminar" }
];

const AddEventModal = ({ isOpen, onClose, refreshMeetings }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [meetingType, setMeetingType] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [isMeetingTypeModalOpen, setIsMeetingTypeModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  const meetingTypeModalRef = useRef(null);
  const participantsModalRef = useRef(null);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    if (isOpen) {
      const fetchParticipants = async () => {
        try {
          const response = await axios.get("http://135.181.42.192/accounts/users/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
          });
          if (response.data) {
            setParticipants(response.data);
          } else {
            console.error("Unexpected response format:", response);
          }
        } catch (error) {
          if (error.status == 403) {
            await refreshAccessToken();
            fetchParticipants();
          }
          console.error("Error fetching participants:", error);
        }
      };

      fetchParticipants();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isMeetingTypeModalOpen &&
        meetingTypeModalRef.current &&
        !meetingTypeModalRef.current.contains(event.target)
      ) {
        setIsMeetingTypeModalOpen(false);
      }
      if (
        isParticipantsModalOpen &&
        participantsModalRef.current &&
        !participantsModalRef.current.contains(event.target)
      ) {
        setIsParticipantsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMeetingTypeModalOpen, isParticipantsModalOpen]);

  const resetModalState = () => {
    setEventName("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventDescription("");
    setMeetingType(null);
    setSelectedParticipants([]);
    setError({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventName) newErrors.eventName = "Tədbirin adını daxil edin!";
    if (!eventDate) newErrors.eventDate = "Tarixi daxil edin!";
    if (!eventTime) newErrors.eventTime = "Saatı daxil edin!";
    if (!eventLocation) newErrors.eventLocation = "Keçiriləcəyi yeri daxil edin!";
    if (!meetingType) newErrors.meetingType = "Görüş növünü seçin!";
    if (selectedParticipants.length === 0) newErrors.participants = "İştirakçıları seçin!";
    return newErrors;
  };

  const handleAddEvent = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setLoading(true);
    setError({});

    const eventData = {
      title: eventName,
      meeting_type: meetingType,
      participants: selectedParticipants.map(participant => participant.id),
      date: `${eventDate.toISOString().split("T")[0]}T${eventTime}:00`,
      meeting_description: eventDescription
    };

    try {
      const response = await axios.post("http://135.181.42.192/services/create_meeting/", eventData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      if (response.status === 201) {
        refreshMeetings(response.data);
        onClose();
        resetModalState();
      }
      console.log("Event added:", response.data);
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleAddEvent();
      }
      console.error("Error adding event:", error);
      setError({ general: "Tədbir əlavə edilərkən xəta baş verdi." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const textarea = document.querySelector(".textarea");
    if (textarea) {
      adjustHeight(textarea);
    }
  }, [eventDescription]);

  const toggleMeetingTypeModal = () => setIsMeetingTypeModalOpen(!isMeetingTypeModalOpen);
  const toggleParticipantsModal = () => setIsParticipantsModalOpen(!isParticipantsModalOpen);

  const handleMeetingTypeSelect = type => {
    setMeetingType(type);
    toggleMeetingTypeModal();
  };

  const handleParticipantSelect = participant => {
    setSelectedParticipants(prevParticipants => {
      if (prevParticipants.some(p => p.id === participant.id)) {
        return prevParticipants.filter(p => p.id !== participant.id);
      } else {
        return [...prevParticipants, participant];
      }
    });
  };

  const handleTextareaInputChange = e => {
    setEventDescription(e.target.value);
  };

  const adjustHeight = element => {
    element.style.height = "100px";
    element.style.height = `${element.scrollHeight}px`;
  };

  const combinedInputChange = e => {
    setEventDescription(e.target.value);
    handleTextareaInputChange(e);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <h5>Yeni tədbir</h5>
          <button
            onClick={() => {
              onClose();
              resetModalState();
            }}
          >
            <IoMdClose />
          </button>
        </div>
        <hr />
        <div className="modal-body">
          <section className="meeting-label-input">
            <label>Tədbirin adı:</label>
            <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} />
          </section>
          {error.eventName && <p className="error-message">{error.eventName}</p>}
          <div className="date-time-container">
            <section className="meeting-label-input">
              <label>Keçiriləcəyi gün:</label>
              <DatePicker
                selected={eventDate}
                onChange={date => setEventDate(date)}
                locale="az"
                placeholderText="gün/ay/il"
                dateFormat="dd.MM.yyyy"
                minDate={new Date().toISOString().split("T")[0]}
              />
              {error.eventDate && <p className="error-message">{error.eventDate}</p>}
            </section>
            <section className="meeting-label-input">
              <label
                onClick={() => {
                  const timeInput = document.getElementById("eventTimeInput");
                  timeInput.focus();
                  timeInput.click();
                }}
              >
                Saat:
              </label>
              <input id="eventTimeInput" type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} />
              {error.eventTime && <p className="error-message">{error.eventTime}</p>}
            </section>
          </div>
          <div className="meetingType-participants">
            <div>
              <section className="meeting-label-input">
                <label>Görüş növü:</label>
                <div onClick={toggleMeetingTypeModal}>
                  <span>
                    {meetingType ? meetingType : "Seçin"}
                    <span>{isMeetingTypeModalOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
                  </span>
                </div>
              </section>
              {isMeetingTypeModalOpen && (
                <div className="modal-overlay-meetingType" ref={meetingTypeModalRef}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4>Görüş növü seçin</h4>
                      <button onClick={toggleMeetingTypeModal}>
                        <IoMdClose />
                      </button>
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
              {error.meetingType && <p className="error-message">{error.meetingType}</p>}
            </div>
            <div>
              <section className="meeting-label-input">
                <label>İştirakçılar:</label>
                <div onClick={toggleParticipantsModal}>
                  {selectedParticipants.length > 0 ? (
                    selectedParticipants.map(p => `${p.first_name} ${p.last_name}`).join(", ")
                  ) : (
                    <span>
                      Seçin <span>{isParticipantsModalOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
                    </span>
                  )}
                </div>
              </section>
              {isParticipantsModalOpen && (
                <div className="modal-overlay-participants" ref={participantsModalRef}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4>İştirakçıları seçin</h4>
                      <button onClick={toggleParticipantsModal}>
                        <IoMdClose />
                      </button>
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
              {error.participants && <p className="error-message">{error.participants}</p>}
            </div>
          </div>
          <section className="meeting-label-input">
            <label>Keçiriləcəyi yer:</label>
            <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)} />
            <RiMapPinAddFill />
          </section>
          {error.eventLocation && <p className="error-message">{error.eventLocation}</p>}
          <section className="meeting-label-input">
            <label>Tədbir haqqında:</label>
            <textarea className="textarea" rows={1} value={eventDescription} onChange={combinedInputChange} />
          </section>
          {error.general && <p className="error-message">{error.general}</p>}

          <button className="event-submit" onClick={handleAddEvent} disabled={loading}>
            {loading ? "Yüklənir..." : "Tədbir əlavə et"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
