import axios from "axios";
import { useEffect, useRef, useState } from "react";

import useRefreshToken from "../../common/refreshToken";

import "./MeetingDetailModal.css";

const MeetingDetailModal = ({ isOpen, onClose, meetingId }) => {
  const [meeting, setMeeting] = useState(null);
  const textAreaRef = useRef(null);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    if (isOpen && meetingId) {
      const fetchMeetingDetails = async () => {
        try {
          const response = await axios.get(`https://app.desgah.az/services/meeting/${meetingId}/`);
          setMeeting(response.data);
        } catch (error) {
          if (error.status == 403) {
            await refreshAccessToken();
            fetchMeetingDetails();
          }
          console.error("Error fetching meeting details:", error);
        }
      };

      fetchMeetingDetails();
    }
  }, [isOpen, meetingId]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [meeting ? meeting.meeting_description : ""]);

  if (!isOpen || !meeting) {
    return null;
  }

  return (
    <div className="meeting-detail-modal-overlay">
      <div className="item-detail-modal-content">
        <div className="item-detail-modal-header">
          <h2>Tədbir məlumatları</h2>
          <span className="item-detail-close-button" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="item-detail-modal-body">
          <div className="modal-row">
            <div className="modal-label">Görüşün adı</div>
            <div className="modal-value">{meeting.title || "Qeyd yoxdur"}</div>
          </div>
          <hr />
          <div className="modal-row">
            <div className="modal-label">İştirakçılar</div>
            <div className="modal-value">{meeting.participants.join(", ") || "Qeyd yoxdur"}</div>
          </div>
          <hr />
          <div className="meeting-item-detail-grid">
            <div>
              <div className="modal-row">
                <div className="modal-label">Görüş növü</div>
                <div className="modal-value">{meeting.meeting_type || "Qeyd yoxdur"}</div>
              </div>
              <hr />
            </div>
            <div>
              <div className="modal-row">
                <div className="modal-label">Tarix</div>
                <div className="modal-value">{new Date(meeting.date).toLocaleString()}</div>
              </div>

              <hr />
            </div>
          </div>
          <div>
            <div className="modal-row">
              <div className="modal-label">Tədbir haqqında</div>
              <textarea
                value={meeting.meeting_description || "Qeyd yoxdur"}
                className="event-modal-textarea"
                readOnly
                ref={textAreaRef}
                rows={1}
              />
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailModal;
