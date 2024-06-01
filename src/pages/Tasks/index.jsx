import { IoMdRefresh } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import "./tasks.css";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { PiTelevisionSimple } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";
import AddTaskModal from '../../components/AddTaskModal/index';


function Index() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState("Bugün");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("Hamısı");
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    useEffect(() => {
        fetch('http://135.181.42.192/services/tasks/')
            .then(response => response.json())
            .then(data => {
                setData(data);
                applyFilters("all", "Bugün", "Hamısı", data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const applyFilters = (taskFilter, dateFilter, statusFilter, tasks = data) => {
        let filtered = tasks;

        if (taskFilter !== "all") {
            filtered = filtered.filter(item => item.task_type === taskFilter);
        }

        const now = new Date();
        switch (dateFilter) {
            case "Bugün":
                filtered = filtered.filter(item => new Date(item.date).toDateString() === now.toDateString());
                break;
            case "Dünən":
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                filtered = filtered.filter(item => new Date(item.date).toDateString() === yesterday.toDateString());
                break;
            case "Son 1 ay":
                const oneMonthAgo = new Date(now);
                oneMonthAgo.setMonth(now.getMonth() - 1);
                filtered = filtered.filter(item => new Date(item.date) > oneMonthAgo);
                break;
            default:
                break;
        }

        if (statusFilter !== "Hamısı") {
            filtered = filtered.filter(item => {
                switch (statusFilter) {
                    case "Qəbul edilib":
                        return item.status === "inprogress";
                    case "Gözləyir":
                        return item.status === "waiting";
                    case "Tamamlanıb":
                        return item.status === "completed";
                    case "Tamamlanmadı":
                        return item.status === "not_completed";
                    default:
                        return true;
                }
            });
        }

        setFilteredData(filtered);
    };

    const filterData = (filter) => {
        setActiveFilter(filter);
        applyFilters(filter, selectedDateFilter, selectedStatusFilter);
    };

    const filterByDate = (dateFilter) => {
        setSelectedDateFilter(dateFilter);
        setIsDateModalOpen(false);
        applyFilters(activeFilter, dateFilter, selectedStatusFilter);
    };

    const filterByStatus = (statusFilter) => {
        setSelectedStatusFilter(statusFilter);
        setIsStatusModalOpen(false);
        applyFilters(activeFilter, selectedDateFilter, statusFilter);
    };

    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };

    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };

    return (
        <div className='task-page'>
            <div className='task-page-title'>
                <p>Tapşırıqlar</p>
                <div>
                    <button><IoMdRefresh />Yenilə</button>
                    <button onClick={openAddTaskModal}><IoAdd />Əlavə et</button>
                </div>
            </div>
            <div className="taskPage-taskType">
                <button className={activeFilter === "all" ? "activeButton" : ""} onClick={() => filterData("all")}>Hamısı</button>
                <button className={activeFilter === "connection" ? "activeButton" : ""} onClick={() => filterData("connection")}>Qoşulmalar</button>
                <button className={activeFilter === "problem" ? "activeButton" : ""} onClick={() => filterData("problem")}>Problemlər</button>
            </div>
            <div className="task-history-status">
                <button onClick={() => setIsDateModalOpen(!isDateModalOpen)}>
                    <span>Tarix:</span>
                    <span>{selectedDateFilter}</span>
                    <FaChevronDown />
                </button>
                {isDateModalOpen && (
                    <div className="date-modal">
                        <div onClick={() => filterByDate("Bugün")}>Bugün</div>
                        <div onClick={() => filterByDate("Dünən")}>Dünən</div>
                        <div onClick={() => filterByDate("Son 1 ay")}>Son 1 ay</div>
                    </div>
                )}
                <button onClick={() => setIsStatusModalOpen(!isStatusModalOpen)}>
                    <span>Status:</span>
                    <span>{selectedStatusFilter}</span>
                    <FaChevronDown />
                </button>
                {isStatusModalOpen && (
                    <div className="status-modal">
                        <div onClick={() => filterByStatus("Hamısı")}>Hamısı</div>
                        <div onClick={() => filterByStatus("Qəbul edilib")}>Qəbul edilib</div>
                        <div onClick={() => filterByStatus("Gözləyir")}>Gözləyir</div>
                        <div onClick={() => filterByStatus("Tamamlanıb")}>Tamamlanıb</div>
                        <div onClick={() => filterByStatus("Tamamlanmadı")}>Tamamlanmadı</div>
                    </div>
                )}
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
                                    <td>{`#${item.id.toString().padStart(4, '0')}`}</td>
                                    <td>{item.first_name && item.last_name ? `${item.first_name} ${item.last_name.charAt(0)}.` : 'User yoxdur'}</td>
                                    <td className={item.task_type === 'problem' ? 'problem' : 'connection'}>
                                        {item.task_type === 'problem' ? 'Problem' : 'Qoşulma'}
                                    </td>
                                    <td>{item.time}</td>
                                    <td className="type-icon">
                                        {item.tv && <PiTelevisionSimple />}
                                        {item.internet && <TfiWorld />}
                                        {item.voice && <RiVoiceprintFill />}
                                        {!item.tv && !item.internet && !item.voice && <span>Servis Yoxdur</span>}
                                    </td>
                                    <td>{item.location}</td>
                                    <td>{item.phone ? item.phone : 'No Number'}</td>
                                    <td className="task-status">
                                        <button className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status === "waiting" ? "Gözləyir" :
                                                item.status === "inprogress" ? "Qəbul edilib" :
                                                    item.status === "started" ? "Başlanıb" :
                                                        item.status === "completed" ? "Tamamlanıb" : item.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isAddTaskModalOpen && <AddTaskModal onClose={closeAddTaskModal} />}
        </div>
    )
}

export default Index;