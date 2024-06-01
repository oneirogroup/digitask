import { GoClock } from "react-icons/go";
import photo1 from "../../assets/images/photo.svg";
import photo2 from "../../assets/images/calendar-1-11.svg";
import { IoIosAddCircleOutline } from "react-icons/io";
import ApexChart from '../../components/Chart';
import CircleChart from '../../components/CircleChart';
import AddEventModal from '../../components/AddEventModal/index';
import { PiTelevisionSimple } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";

import "./home.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('http://135.181.42.192/services/tasks/')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const [performanceData, setPerformanceData] = useState([]);

    useEffect(() => {
        fetch('http://135.181.42.192/services/performance/')
            .then(response => response.json())
            .then(data => setPerformanceData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    return (
        <div className="home-page">
            <section className="home-meet-section">
                <div className="meet-time-date-img">
                    <div className="meet-time-date">
                        <p><GoClock /> Günü və saatı</p>
                        <div>
                            <h5>Tədbirin adı</h5>
                            <p>Keçirələcəyi yer</p>
                        </div>
                    </div>
                    <div className="meet-img">
                        <img src={photo1} alt="" />
                    </div>
                </div>
                <div className="meet-time-date-img">
                    <div className="meet-time-date">
                        <p><GoClock /> Günü və saatı</p>
                        <div>
                            <h5>Tədbirin adı</h5>
                            <p>Keçirələcəyi yer</p>
                        </div>
                    </div>
                    <div className="meet-img">
                        <img src={photo2} alt="" />
                    </div>
                </div>
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
                        <li>
                            Ad
                        </li>
                        <li>
                            Qrup
                        </li>
                        <li>
                            Tasklar
                        </li>
                    </ul>
                    <div>
                        {performanceData.map((item, index) => (
                            <ul key={index}>
                                <li>{`${item.first_name} ${item.last_name.charAt(0)}.`}</li>
                                <li>{item.group.region}</li>
                                <li>{item.task_count.total}</li>
                            </ul>
                        ))}
                    </div>
                </div>
                <div className="home-tasks">
                    <div>
                        <p>Tapşırıqlar</p>
                        <Link>Hamısına bax</Link>
                    </div>
                    <ul>
                        <li>
                            Ad
                        </li>
                        <li>
                            Saat
                        </li>
                        <li>
                            Növ
                        </li>
                        <li>
                            Adres
                        </li>
                        <li>
                            Nömrə
                        </li>
                        <li>
                            Status
                        </li>
                    </ul>
                    <div>
                        {data.map((item, index) => (
                            <ul key={index}>
                                <li>
                                    {item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : 'User yoxdur'}
                                </li>
                                <li>
                                    {item.time}
                                </li>
                                <li>
                                    {item.tv && <PiTelevisionSimple />}
                                    {item.internet && <TfiWorld />}
                                    {item.voice && <RiVoiceprintFill />}
                                    {!item.tv && !item.internet && !item.voice && <span>Servis Yoxdur</span>}
                                </li>
                                <li>
                                    {item.location}
                                </li>
                                <li>
                                    {item.phone ? item.phone : 'No Number'}
                                </li>
                                <li className="task-status">
                                    <button className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                                        {item.status === "waiting" ? "Gözləyir" :
                                            item.status === "inprogress" ? "Qəbul edilib" :
                                                item.status === "started" ? "Başlanıb" :
                                                    item.status === "completed" ? "Tamamlanıb" : item.status}
                                    </button>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            </section>
            <AddEventModal isOpen={isModalOpen} onClose={closeModal} />

        </div>
    );
};

export default Home;
