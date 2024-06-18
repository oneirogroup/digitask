import React, { useState, useEffect, useRef } from 'react';
import { IoMdRefresh } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";
import { PiTelevisionSimple } from "react-icons/pi";
import { TfiWorld } from "react-icons/tfi";
import { RiVoiceprintFill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddTaskModal from '../../components/AddTaskModal';
import { RiDeleteBin6Line } from "react-icons/ri";
import DetailsModal from '../../components/TaskType';
import { MdOutlineEdit } from "react-icons/md";
import './tasks.css';

function Index() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("Hamısı");
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
    const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [userType, setUserType] = useState(null);

    const modalRef = useRef(null);

    useEffect(() => {
        fetchUserType();
        fetchTasks("all", selectedMonth, "Hamısı");
    }, [selectedMonth]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeSmallModal();
            }
        }

        function handleScroll() {
            if (isSmallModalOpen && selectedTaskIndex !== null) {
                const button = document.querySelector(`[data-task-index="${selectedTaskIndex}"]`);
                if (button) {
                    const buttonRect = button.getBoundingClientRect();
                    setModalPosition({
                        top: buttonRect.top + window.scrollY,
                        left: buttonRect.left + buttonRect.width
                    });
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isSmallModalOpen, selectedTaskIndex]);

    const monthsAz = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
        "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];

    const fetchUserType = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserType(decodedToken.user_type);
        } else {
            setUserType(null);
        }
    };

    const fetchTasks = (taskFilter, selectedMonth, statusFilter) => {
        const monthYear = `${monthsAz[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;
        const monthQueryParam = `&month=${selectedMonth.getMonth() + 1}&year=${selectedMonth.getFullYear()}`;

        const statusMap = {
            "Hamısı": "",
            "Gözləyir": "waiting",
            "Qəbul edilib": "inprogress",
            "Başlanıb": "started",
            "Tamamlanıb": "completed",
            "Tamamlanmadı": "not_completed"
        };

        const taskTypeParam = taskFilter !== "all" ? `&task_type=${taskFilter}` : "";
        const statusParam = statusFilter !== "Hamısı" ? `&status=${statusMap[statusFilter]}` : "";

        const url = `http://135.181.42.192/services/status/?${taskTypeParam}${monthQueryParam}${statusParam}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setData(sortedData);
                setFilteredData(sortedData);

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

    const openSmallModal = (event, index) => {
        const buttonRect = event.target.getBoundingClientRect();
        setModalPosition({ top: buttonRect.top + window.scrollY, left: buttonRect.left + buttonRect.width });
        setSelectedTaskIndex(index);
        setIsSmallModalOpen(true);
    };

    const closeSmallModal = () => {
        setIsSmallModalOpen(false);
    };

    const openTaskDetailsModal = (taskId) => {
        setSelectedTaskId(taskId);
        setIsSmallModalOpen(false);
        setIsTaskDetailsModalOpen(true);
    };

    const closeTaskDetailsModal = () => {
        setIsTaskDetailsModalOpen(false);
    };

    const resetFilters = () => {
        setActiveFilter("all");
        setSelectedMonth(new Date());
        setSelectedStatusFilter("Hamısı");
        fetchTasks("all", new Date(), "Hamısı");
    };

    const deleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('access_token');
            await fetch(`http://135.181.42.192/services/task/${taskId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setFilteredData(prevData => prevData.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className='task-page'>
            <div className='task-page-title'>
                <p>Tapşırıqlar</p>
                <div>
                    <button onClick={resetFilters}>
                        <IoMdRefresh />Yenilə
                    </button>
                    {userType !== 'technician' && (
                        <button onClick={openAddTaskModal}><IoAdd />Əlavə et</button>
                    )}
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
                        <div onClick={() => filterByStatus("Gözləyir")}>Gözləyir</div>
                        <div onClick={() => filterByStatus("Qəbul edilib")}>Qəbul edilib</div>
                        <div onClick={() => filterByStatus("Başlanıb")}>Başlanıb</div>
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{`#${(index + 1).toString().padStart(4, '0')}`}</td>                                    <td>{item.first_name && item.last_name ? `${item.first_name} ${item.last_name.charAt(0)}.` : '-'}</td>
                                    <td className={item.task_type === 'problem' ? 'problem' : 'connection'}>
                                        {item.task_type === 'problem' ? 'Problem' : 'Qoşulma'}
                                    </td>
                                    <td>{item.time}</td>
                                    <td className="type-icon">
                                        {item.is_tv && <PiTelevisionSimple />}
                                        {item.is_internet && <TfiWorld />}
                                        {item.is_voice && <RiVoiceprintFill />}
                                        {!item.is_tv && !item.is_internet && !item.is_voice && <span>Servis Yoxdur</span>}
                                    </td>

                                    <td>{item.location}</td>
                                    <td>{item.contact_number ? item.contact_number : 'No Number'}</td>
                                    <td className="task-status">
                                        <button className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status === "waiting" ? "Gözləyir" :
                                                item.status === "inprogress" ? "Qəbul edilib" :
                                                    item.status === "started" ? "Başlanıb" :
                                                        item.status === "completed" ? "Tamamlanıb" : item.status}
                                        </button>
                                    </td>
                                    <td>
                                        <button data-task-index={index} onClick={(e) => openSmallModal(e, index)}><BsThreeDotsVertical /></button>
                                        {isSmallModalOpen && selectedTaskIndex === index && (
                                            <div
                                                ref={modalRef}
                                                className={`small-modal ${isSmallModalOpen ? 'active' : ''}`}
                                                style={{ top: modalPosition.top, left: modalPosition.left }}
                                            >
                                                <div className="small-modal-content">
                                                    <button onClick={() => deleteTask(item.id)}>
                                                        <RiDeleteBin6Line />
                                                    </button>
                                                    <button onClick={() => openTaskDetailsModal(item.id)}>
                                                        <MdOutlineEdit />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isAddTaskModalOpen && <AddTaskModal onClose={closeAddTaskModal} />}
            {isTaskDetailsModalOpen && <DetailsModal onClose={closeTaskDetailsModal} taskId={selectedTaskId} />}
        </div>
    );
}

export default Index;
