import { GoClock } from "react-icons/go";
import photo1 from "../../assets/images/photo.svg";
import photo2 from "../../assets/images/calendar-1-11.svg";
import { IoIosAddCircleOutline } from "react-icons/io";
import ApexChart from '../../components/Chart';
import CircleChart from '../../components/CircleChart';
import { PiTelevisionSimpleLight } from "react-icons/pi";
import AddEventModal from '../../components/AddEventModal/index';

import "./home.css"
import { Link } from "react-router-dom";
import { useState } from "react";

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


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
                        <ul>
                            <li>
                                Faiq Ə.
                            </li>
                            <li>
                                Yasamal
                            </li>
                            <li>
                                36
                            </li>
                        </ul>
                        <ul>
                            <li>
                                Faiq Ə.
                            </li>
                            <li>
                                Yasamal
                            </li>
                            <li>
                                36
                            </li>
                        </ul>
                        <ul>
                            <li>
                                Faiq Ə.
                            </li>
                            <li>
                                Yasamal
                            </li>
                            <li>
                                36
                            </li>
                        </ul>
                        <ul>
                            <li>
                                Faiq Ə.
                            </li>
                            <li>
                                Yasamal
                            </li>
                            <li>
                                36
                            </li>
                        </ul>
                        <ul>
                            <li>
                                Faiq Ə.
                            </li>
                            <li>
                                Yasamal
                            </li>
                            <li>
                                36
                            </li>
                        </ul>
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
                        <ul>
                            <li>
                                Nicat Hasanov
                            </li>
                            <li>
                                16:00 - 18:00
                            </li>
                            <li>
                                <PiTelevisionSimpleLight />

                            </li>
                            <li>
                                Yasamal, Mirzə Ş..
                            </li>
                            <li>
                                (051) 555 5555
                            </li>
                            <li>
                                Qəbul edilib
                            </li>

                        </ul>
                        <ul>
                            <li>
                                Nicat Hasanov
                            </li>
                            <li>
                                16:00 - 18:00
                            </li>
                            <li>
                                <PiTelevisionSimpleLight />

                            </li>
                            <li>
                                Yasamal, Mirzə Ş..
                            </li>
                            <li>
                                (051) 555 5555
                            </li>
                            <li>
                                Qəbul edilib
                            </li>

                        </ul><ul>
                            <li>
                                Nicat Hasanov
                            </li>
                            <li>
                                16:00 - 18:00
                            </li>
                            <li>
                                <PiTelevisionSimpleLight />

                            </li>
                            <li>
                                Yasamal, Mirzə Ş..
                            </li>
                            <li>
                                (051) 555 5555
                            </li>
                            <li>
                                Qəbul edilib
                            </li>

                        </ul><ul>
                            <li>
                                Nicat Hasanov
                            </li>
                            <li>
                                16:00 - 18:00
                            </li>
                            <li>
                                <PiTelevisionSimpleLight />

                            </li>
                            <li>
                                Yasamal, Mirzə Ş..
                            </li>
                            <li>
                                (051) 555 5555
                            </li>
                            <li>
                                Qəbul edilib
                            </li>

                        </ul><ul>
                            <li>
                                Nicat Hasanov
                            </li>
                            <li>
                                16:00 - 18:00
                            </li>
                            <li>
                                <PiTelevisionSimpleLight />

                            </li>
                            <li>
                                Yasamal, Mirzə Ş..
                            </li>
                            <li>
                                (051) 555 5555
                            </li>
                            <li>
                                Qəbul edilib
                            </li>

                        </ul>
                    </div>
                </div>
            </section>
            <AddEventModal isOpen={isModalOpen} onClose={closeModal} />

        </div>
    );
};

export default Home;
