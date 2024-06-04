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
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("Hamısı");
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    useEffect(() => {
        fetchTasks("all", selectedMonth, "Hamısı");
    }, [selectedMonth]);

    const monthsAz = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
        "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];

    const fetchTasks = (taskFilter, selectedMonth, statusFilter) => {
        const monthYear = `${monthsAz[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;
        const monthQueryParam = `&month=${selectedMonth.getMonth() + 1}&year=${selectedMonth.getFullYear()}`;

        const statusMap = {
            "Hamısı": "",
            "Qəbul edilib": "inprogress",
            "Gözləyir": "waiting",
            "Tamamlanıb": "completed",
            "Tamamlanmadı": "not_completed"
        };

        const taskTypeParam = taskFilter !== "all" ? `&task_type=${taskFilter}` : "";
        const statusParam = statusFilter !== "Hamısı" ? `&status=${statusMap[statusFilter]}` : "";

        const url = `http://135.181.42.192/services/status/?${taskTypeParam}${monthQueryParam}${statusParam}`;

        console.log(`Fetching tasks with URL: ${url}`);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data);
                setData(data);
                setFilteredData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const applyFilters = (taskFilter, selectedMonth, statusFilter) => {
        setActiveFilter(taskFilter);
        setSelectedMonth(selectedMonth);
        setSelectedStatusFilter(statusFilter);
        fetchTasks(taskFilter, selectedMonth, statusFilter);
    };

    const filterData = (filter) => {
        applyFilters(filter, selectedMonth, selectedStatusFilter);
    };

    const filterByDate = (selectedMonth) => {
        setIsDateModalOpen(false);
        applyFilters(activeFilter, selectedMonth, selectedStatusFilter);
    };

    const filterByStatus = (statusFilter) => {
        setIsStatusModalOpen(false);
        applyFilters(activeFilter, selectedMonth, statusFilter);
    };

    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };

    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };

    const resetFilters = () => {
        setActiveFilter("all");
        setSelectedMonth(new Date());
        setSelectedStatusFilter("Hamısı");
        fetchTasks("all", new Date(), "Hamısı");
    };

    return (
        <div className='task-page'>
            <div className='task-page-title'>
                <p>Tapşırıqlar</p>
                <div>
                    <button onClick={resetFilters}>
                        <IoMdRefresh />Yenilə
                    </button>
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
                    <div onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}>
                        <span>&lt;</span>
                    </div>
                    <p>{`${monthsAz[selectedMonth.getMonth()]}, ${selectedMonth.getFullYear()}`}</p>
                    <div onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}>
                        <span>&gt;</span>
                    </div>
                </button>
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
    );
}

export default Index;
