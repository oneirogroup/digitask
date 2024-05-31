import { IoMdRefresh } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import "./tasks.css";
import { useEffect, useState } from "react";
import { RiArrowUpWideFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa6";


function Index() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    useEffect(() => {
        fetch('http://135.181.42.192/services/tasks/')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFilteredData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const filterData = (filter) => {
        setActiveFilter(filter);
        if (filter === "all") {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item => item.task_type === filter);
            setFilteredData(filtered);
        }
    };

    return (
        <div className='task-page'>
            <div className='task-page-title'>
                <p>Tapşırıqlar</p>
                <div>
                    <button><IoMdRefresh />
                        Yenilə</button>
                    <button><IoAdd />
                        Əlavə et</button>
                </div>
            </div>
            <div className="taskPage-taskType">
                <button className={activeFilter === "all" ? "activeButton" : ""} onClick={() => filterData("all")}>Hamısı</button>
                <button className={activeFilter === "connection" ? "activeButton" : ""} onClick={() => filterData("connection")}>Qoşulmalar</button>
                <button className={activeFilter === "problem" ? "activeButton" : ""} onClick={() => filterData("problem")}>Problemlər</button>
            </div>
            <div className="task-history-status">
                <button>
                    <span>Tarix:</span>
                    <span>Bugün</span>
                    <FaChevronDown />

                </button>
                <button>
                    <span>Status:</span>
                    <span>Hamısı</span>
                    <FaChevronDown />

                </button>
            </div>
            <div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ad</th>
                                <th>Kategoriya</th>
                                <th>Saat</th>
                                <th>Növ</th>
                                <th>Adres</th>
                                <th>Nömrə</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.user}</td>
                                    <td className={item.task_type === 'problem' ? 'problem' : 'connection'}>
                                        {item.task_type === 'problem' ? 'Problem' : 'Qoşulma'}
                                    </td>
                                    <td>{item.time}</td>
                                    <td className="type-icon">
                                        {item.type === 'Television' ? '📺' : '🌐'}
                                    </td>
                                    <td>{item.location}</td>
                                    <td>{item.user_phone ? item.user_phone : 'No Number'}</td>
                                    <td className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                                        {item.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Index;
