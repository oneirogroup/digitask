import axios from "axios";
import { useEffect, useState } from "react";
import { GoClock } from "react-icons/go";
import { IoIosAddCircleOutline } from "react-icons/io";
import { PiTelevisionSimple } from "react-icons/pi";
import { RiVoiceprintFill } from "react-icons/ri";
import { TfiWorld } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";

import useRefreshToken from "../../common/refreshToken";
import AddEventModal from "../../components/AddEventModal";
import ApexChart from "../../components/Chart";
import CircleChart from "../../components/CircleChart";
import MeetingDetailModal from "../../components/MeetingDetailModal";

import photo1 from "../../assets/images/photo.svg";
import "./home.css";
import PerformanceTable from "./performance_table";
import TasksTable from "./tasks_table";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [userType, setUserType] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const navigate = useNavigate();
  const refreshAccessToken = useRefreshToken();
  const position = JSON.parse(localStorage.getItem("position"));

  const fetchData = async (isRetry = false) => {
    try {
      const token = localStorage.getItem("access_token");

      const responseMainPage = await axios.get("https://app.desgah.az/services/mainpage/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(responseMainPage.data.meetings || []);
      setUserType(responseMainPage.data.user_type);

      const waitingTasks = responseMainPage.data.waiting_tasks || [];
      const mappedTasks = waitingTasks.map(task => ({
        id: task.id,
        first_name: task.first_name,
        last_name: task.last_name,
        start_time: task.start_time,
        end_time: task.end_time,
        tv: task.is_tv,
        internet: task.is_internet,
        voice: task.is_voice,
        location: task.location,
        phone: task.contact_number,
        status: task.status
      }));
      setTasks(mappedTasks);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403) && !isRetry) {
        try {
          await fetchData(true);
        } catch (refreshError) {
          if (error.response.status == 403) {
            await refreshAccessToken();
            fetchData();
          }
          console.error("Token refresh failed:", refreshError);
          navigate("/login");
        }
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = time => {
    if (!time) return "-";

    const date = new Date(`1970-01-01T${time}Z`);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEventAdded = newEvent => {
    setMeetings(prevMeetings => [newEvent, ...prevMeetings]);
  };

  const openMeetingDetailModal = meetingId => {
    setSelectedMeeting(meetingId);
    setIsMeetingModalOpen(true);
  };

  const closeMeetingDetailModal = () => {
    setIsMeetingModalOpen(false);
    setSelectedMeeting(null);
  };

  return (
    <div className="home-page">
      <section className="home-meet-section">
        {meetings.map(meeting => (
          <div key={meeting.id} className="meet-time-date-img" onClick={() => openMeetingDetailModal(meeting.id)}>
            <div className="meet-time-date">
              <p>
                <GoClock /> {new Date(meeting.date).toLocaleString("en-US", { hour12: false })}
              </p>
              <div>
                <h5>{meeting.title.length > 15 ? `${meeting.title.slice(0, 15)}...` : meeting.title}</h5>
                <p>
                  {meeting.meeting_description.length > 15
                    ? `${meeting.meeting_description.slice(0, 15)}...`
                    : meeting.meeting_description}
                </p>
              </div>
            </div>
            <div className="meet-img">
              <img src={photo1} alt="Meeting" />
            </div>
          </div>
        ))}
        {position && position.tasks_permission != "Texnik" &&
          <div className="meet-add" onClick={openModal}>
            <button>
              <IoIosAddCircleOutline />
              <p>Tədbir əlavə et</p>
            </button>
          </div>}
      </section>
      <div>
        <div className="home-charts">
          <ApexChart />
          <CircleChart />
        </div>
        <section className="home-tasks-sec">
          <div className="home-employee-task">
            <div>
              <p>İşçilərin performansı</p>
            </div>
            <PerformanceTable scroll={{ y: 400 }} />
          </div>
          <div className="home-tasks">
            <div>
              <p>Tapşırıqlar</p>
              <Link to="/tasks/">Hamısına bax</Link>
            </div>
            <TasksTable tasks={tasks} />
          </div>
        </section>
      </div>
      <AddEventModal isOpen={isModalOpen} onClose={closeModal} refreshMeetings={handleEventAdded} />
      <MeetingDetailModal isOpen={isMeetingModalOpen} onClose={closeMeetingDetailModal} meetingId={selectedMeeting} />
    </div>
  );
};

export default Home;
