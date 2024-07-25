import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import { GoClock } from 'react-icons/go';
import { IoIosAddCircleOutline } from 'react-icons/io';
import ApexChart from '../../components/Chart';
import CircleChart from '../../components/CircleChart';
import AddEventModal from '../../components/AddEventModal';
import { PiTelevisionSimple } from 'react-icons/pi';
import { TfiWorld } from 'react-icons/tfi';
import { RiVoiceprintFill } from 'react-icons/ri';
import photo1 from '../../assets/images/photo.svg';
import photo2 from '../../assets/images/calendar-1-11.svg';

const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('http://135.181.42.192/accounts/token/refresh/', { refresh: refresh_token });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
};

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    const fetchData = async (isRetry = false) => {
        try {
            const token = localStorage.getItem('access_token');

            const responseMainPage = await axios.get('http://135.181.42.192/services/mainpage/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMeetings(responseMainPage.data.meetings || []);
            setUserType(responseMainPage.data.user_type);

            const ongoingTasks = responseMainPage.data.ongoing_tasks || [];
            const mappedTasks = ongoingTasks.map(task => ({
                id: task.id,
                first_name: task.first_name,
                last_name: task.last_name,
                time: task.time,
                tv: task.is_tv,
                internet: task.is_internet,
                voice: task.is_voice,
                location: task.location,
                phone: task.contact_number,
                status: task.status
            }));
            setTasks(mappedTasks);

            const responsePerformance = await axios.get('http://135.181.42.192/services/performance/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPerformanceData(responsePerformance.data);

        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403) && !isRetry) {
                try {
                    await refreshAccessToken();
                    await fetchData(true);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    navigate('/login');
                }
            } else {
                console.error('Error fetching data:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEventAdded = (newEvent) => {
        setMeetings(prevMeetings => [newEvent, ...prevMeetings]);
    };

    return (
        <div className="home-page">
            <section className="home-meet-section">
                {meetings.map((meeting, index) => (
                    <div key={meeting.id} className="meet-time-date-img">
                        <div className="meet-time-date">
                            <p><GoClock /> {new Date(meeting.date).toLocaleString()}</p>
                            <div>
                                <h5>{meeting.title}</h5>
                                <p>{meeting.meeting_description.length > 15 ? `${meeting.meeting_description.slice(0, 15)}...` : meeting.meeting_description}</p>
                            </div>
                        </div>
                        <div className="meet-img">
                            <img src={photo1} alt="Meeting" />
                        </div>
                    </div>
                ))}
                {userType !== 'Texnik' && (
                    <div className="meet-add">
                        <button onClick={openModal}>
                            <IoIosAddCircleOutline />
                            <p>Tədbir əlavə et</p>
                        </button>
                    </div>
                )}
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
                            performanceData.slice(0, 5).map((item, index) => (
                                <ul key={index}>
                                    <li>{`${item.first_name} ${item.last_name.charAt(0)}.`}</li>
                                    <li>{item.group.group}</li>
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
                        {tasks.length > 0 ? (
                            tasks.slice(0, 5).map((item, index) => (
                                <ul key={index}>
                                    <li>{item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : '-'}</li>
                                    <li>{item.time} {!item.item && <span>-</span>}</li>

                                    <li>
                                        {item.tv && <PiTelevisionSimple />}
                                        {item.internet && <TfiWorld />}
                                        {item.voice && <RiVoiceprintFill />}
                                        {!item.tv && !item.internet && !item.voice && <span>Xidmət daxil edilməyib</span>}
                                    </li>
                                    <li>{item.location}</li>
                                    <li>{item.phone ? item.phone : 'No Number'}</li>
                                    <li className="task-status">
                                        <button className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status === 'waiting' ? 'Gözləyir' :
                                                item.status === 'inprogress' ? 'Qəbul edilib' :
                                                    item.status === 'started' ? 'Başlanıb' :
                                                        item.status === 'completed' ? 'Tamamlanıb' : item.status}
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
            <AddEventModal isOpen={isModalOpen} onClose={closeModal} refreshMeetings={handleEventAdded} />
        </div>
    );
};

export default Home;
