import { GoClock } from "react-icons/go";
import photo1 from "../../assets/images/photo.svg";
import photo2 from "../../assets/images/calendar-1-11.svg";
import { IoIosAddCircleOutline } from "react-icons/io";
import ApexChart from '../../components/Chart';
import CircleChart from '../../components/CircleChart';


import "./home.css"

const Home = () => {

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
                    <button>
                        <IoIosAddCircleOutline />
                        <p>Tədbir əlavə et</p>
                    </button>
                </div>
            </section>
            <div className="home-charts">
                <ApexChart />
                <CircleChart />
            </div>
            <div className="">
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
                <div>
                    
                </div>
            </div>
        </div>
    );
};

export default Home;
