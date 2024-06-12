import { GoClock } from "react-icons/go";
import photo1 from "../../assets/images/photo.svg";
import photo2 from "../../assets/images/calendar-1-11.svg";
import { IoIosAddCircleOutline } from "react-icons/io";
import ApexChart from '../../components/Chart';
import CircleChart from '../../components/CircleChart';
import AddEventModal from '../../components/AddEventModal';
import { PiTelevisionSimple } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";

import "./home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');

                const responseTasks = await axios.get('http://135.181.42.192/services/tasks/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(responseTasks.data);

                const responsePerformance = await axios.get('http://135.181.42.192/services/performance/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPerformanceData(responsePerformance.data);

                const responseMainPage = await axios.get('http://135.181.42.192/services/mainpage/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMeetings(responseMainPage.data.meetings || []);

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        const refresh_token = localStorage.getItem('refresh_token');
                        const refreshResponse = await axios.post('http://135.181.42.192/accounts/token/refresh/', {
                            refresh_token
                        });
                        const { access_token } = refreshResponse.data;
                        localStorage.setItem('access_token', access_token);
                        await fetchData();
                    } catch (refreshError) {
                        console.error('Hata: Token yenileme başarısız:', refreshError);
                    }
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="home-page">
            <section className="home-meet-section">
                {meetings.slice(0, 2).map((meeting, index) => (
                    <div key={meeting.id} className="meet-time-date-img">
                        <div className="meet-time-date">
                            <p><GoClock /> {new Date(meeting.date).toLocaleString()}</p>
                            <div>
                                <h5>{meeting.title}</h5>
                                <p>{meeting.meeting_description}</p>
                            </div>
                        </div>
                        <div className="meet-img">
                            <img src={index === 0 ? photo1 : photo2} alt="Meeting" />
                        </div>
                    </div>
                ))}
                <div className="meet-add">
                    <button onClick={openModal}>
                        <IoIosAddCircleOutline />
                        <p>Tədbir əlavə et</p>
                    </button>
                </div>
            </section>
            <div className="home-charts">
                <ApexChart />
                <CircleChart />
            </div>
            <section className="home-tasks-sec">
                <div className="home-employee-task">
                    <div>
                        <p>İşçilərin performansı</p>
                    </div>
                    <ul>
                        <li>Ad</li>
                        <li>Qrup</li>
                        <li>Tasklar</li>
                    </ul>
                    <div>
                        {performanceData.length > 0 ? (
                            performanceData.map((item, index) => (
                                <ul key={index}>
                                    <li>{`${item.first_name} ${item.last_name.charAt(0)}.`}</li>
                                    <li>{item.group.region}</li>
                                    <li>{item.task_count.total}</li>
                                </ul>
                            ))
                        ) : (
                            <div>No performance data available.</div>
                        )}

                    </div>
                </div>
                <div className="home-tasks">
                    <div>
                        <p>Tapşırıqlar</p>
                        <Link to="/tasks/">Hamısına bax</Link>
                    </div>
                    <ul>
                        <li>Ad</li>
                        <li>Saat</li>
                        <li>Növ</li>
                        <li>Adres</li>
                        <li>Nömrə</li>
                        <li>Status</li>
                    </ul>
                    <div>
                        {data.length > 0 ? (
                            data.slice(0, 5).map((item, index) => (
                                <ul key={index}>
                                    <li>
                                        {item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : 'User yoxdur'}
                                    </li>
                                    <li>{item.time}</li>
                                    <li>
                                        {item.tv && <PiTelevisionSimple />}
                                        {item.internet && <TfiWorld />}
                                        {item.voice && <RiVoiceprintFill />}
                                        {!item.tv && !item.internet && !item.voice && <span>Servis Yoxdur</span>}
                                    </li>
                                    <li>{item.location}</li>
                                    <li>{item.phone ? item.phone : 'No Number'}</li>
                                    <li className="task-status">
                                        <button className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status === "waiting" ? "Gözləyir" :
                                                item.status === "inprogress" ? "Qəbul edilib" :
                                                    item.status === "started" ? "Başlanıb" :
                                                        item.status === "completed" ? "Tamamlanıb" : item.status}
                                        </button>
                                    </li>
                                </ul>
                            ))
                        ) : (
                            <div>No data available.</div>
                        )}
                    </div>
                </div>
            </section>
            <AddEventModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default Home;
