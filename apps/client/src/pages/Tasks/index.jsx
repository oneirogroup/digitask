import { ConfigProvider, DatePicker, InputNumber, Space, Button, message, Popconfirm } from "antd";
import az from "antd/locale/az_AZ";
import dayjs from "dayjs";
import "dayjs/locale/az";
import React, { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { PiTelevisionSimple } from "react-icons/pi";
import { RiDeleteBin6Line, RiVoiceprintFill } from "react-icons/ri";
import { TfiWorld } from "react-icons/tfi";

import useRefreshToken from "../../common/refreshToken";
import AddSurveyModal from "../../components/AddSurveyModal";
import AddTaskModal from "../../components/AddTaskModal";
import DetailsModal from "../../components/TaskType";
import InternetPacksModal from "./InternetPacksModal";

import "./tasks.css";

dayjs.locale("az");

function Index() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [internetPacksModalOpan, setInternetPacksModalOpan] = useState(false);
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
  const [userPhone, setUserPhone] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const refreshAccessToken = useRefreshToken();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [regions, setRegions] = useState([]);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("Hamısı");
  const [registrationNumberFilter, setRegistrationNumberFilter] = useState("");
  const regionRef = useRef(null);
  const modalRef = useRef(null);
  const position = JSON.parse(localStorage.getItem("position"));
  const popconfirmRef = useRef(null);

  useEffect(() => {
    refreshAccessToken();
    const storedUserType = localStorage.getItem("user_type") || sessionStorage.getItem("user_type");
    const storedUserPhone = localStorage.getItem("phone") || sessionStorage.getItem("phone");
    setUserType(storedUserType);
    setUserPhone(storedUserPhone);

    fetchTasks(selectedMonth, selectedYear, "Hamısı", activeFilter);
  }, [selectedMonth, selectedYear, activeFilter, selectedStatusFilter, selectedRegionFilter, registrationNumberFilter]);

  const statusRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const isInModal = modalRef.current && modalRef.current.contains(event.target);
      const isInPopconfirm = event.target.closest('.custom-popconfirm') !== null;

      if (!isInModal && !isInPopconfirm) {
        closeSmallModal();
      }

      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusModalOpen(false);
      }
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionModalOpen(false);
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

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSmallModalOpen, selectedTaskIndex]);

  const monthsAz = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr"
  ];

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("https://app.digitask.store/accounts/regions/");
        const data = await response.json();
        setRegions(data.map(region => region.name));
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchRegions();
        }
        console.error("Error fetching tasks:", error);
      }
    };

    fetchRegions();
  }, []);

  const fetchTasks = async (taskFilter, selectedMonth, selectedYear, statusFilter, activeFilter) => {
    if (!selectedMonth) return;

    try {
      const token = localStorage.getItem("access_token");
      const month = selectedMonth.getMonth() + 1;
      const year = selectedYear;
      const monthQueryParam = `&month=${month}&year=${year}`;
      const statusMap = {
        "Hamısı": "",
        "Gözləyir": "waiting",
        "Qəbul edilib": "inprogress",
        "Başlanıb": "started",
        "Tamamlanıb": "completed",
        "Tamamlanmadı": "not_completed"
      };

      const regionParam = selectedRegionFilter !== "Hamısı" ? `&group=${selectedRegionFilter}` : "";
      const registrationParam = registrationNumberFilter ? `&registration_number=${registrationNumberFilter}` : "";

      const taskTypeParam = taskFilter !== "all" ? `&task_type=${taskFilter}` : "";
      const statusParam = statusFilter !== "Hamısı" ? `&status=${statusMap[statusFilter]}` : "";

      const url = `https://app.digitask.store/services/status/?${taskTypeParam}${monthQueryParam}${statusParam}${regionParam}${registrationParam}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status == 403) {
          await refreshAccessToken();
          const currentDate = new Date();
          fetchTasks("all", currentDate, currentDate.getFullYear(), "Hamısı");
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setData(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        const currentDate = new Date();
        fetchTasks("all", currentDate, currentDate.getFullYear(), "Hamısı");
      }
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleRegionModal = () => {
    setIsRegionModalOpen(prev => !prev);
  };

  const filterByRegion = region => {
    refreshAccessToken();
    setSelectedRegionFilter(region);
    setIsRegionModalOpen(false);
    fetchTasks(
      // taskFilter,
      selectedMonth,
      selectedYear,
      selectedStatusFilter,
      activeFilter,
      region,
      registrationNumberFilter
    );
  };

  const handleMonthChange = date => {
    if (date) {
      const newDate = new Date(date.year(), date.month(), 1);
      setSelectedMonth(newDate);
      setSelectedYear(newDate.getFullYear());
    }
  };

  useEffect(() => {
    fetchTasks(
      activeFilter,
      selectedMonth,
      selectedYear,
      selectedStatusFilter,
      selectedRegionFilter,
      registrationNumberFilter
    );
  }, [selectedMonth, selectedYear, selectedStatusFilter, selectedRegionFilter, registrationNumberFilter]);

  const applyFilters = (
    taskFilter,
    selectedMonth,
    selectedYear,
    selectedStatusFilter,
    selectedRegionFilter,
    registrationNumberFilter
  ) => {
    setActiveFilter(taskFilter);
    setSelectedMonth(selectedMonth);
    setSelectedYear(selectedYear);
    setSelectedStatusFilter(selectedStatusFilter);
    fetchTasks(taskFilter, selectedMonth, selectedYear, selectedStatusFilter, activeFilter);
  };

  const filterData = filter => {
    refreshAccessToken();
    setActiveFilter(filter);
    applyFilters(
      filter,
      selectedMonth,
      selectedYear,
      selectedStatusFilter,
      activeFilter,
      selectedRegionFilter,
      registrationNumberFilter
    );
  };

  const filterByStatus = statusFilter => {
    refreshAccessToken();
    setIsStatusModalOpen(false);
    setSelectedStatusFilter(selectedStatusFilter);
    applyFilters(
      activeFilter,
      selectedMonth,
      selectedYear,
      statusFilter,
      selectedRegionFilter,
      registrationNumberFilter
    );
  };

  const openAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const openInternetPacksModal = () => {
    setInternetPacksModalOpan(true);
  };

  const closeInternetPacksModal = () => {
    setInternetPacksModalOpan(false);
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const formatTime = time => {
    if (!time) return "-";

    const date = new Date(`1970-01-01T${time}Z`);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const openSmallModal = (event, index) => {
    const buttonRect = event.target.getBoundingClientRect();
    setSelectedTaskIndex(index);
    setIsSmallModalOpen(true);
  };

  const closeSmallModal = () => {
    setIsSmallModalOpen(false);
  };

  const openTaskDetailsModal = taskId => {
    setSelectedTaskId(taskId);
    setIsSmallModalOpen(false);
    setIsTaskDetailsModalOpen(true);
  };

  const closeTaskDetailsModal = () => {
    if (selectedTaskId) {
      fetchTasks(
        activeFilter,
        selectedMonth,
        selectedYear,
        selectedStatusFilter,
        selectedRegionFilter,
        registrationNumberFilter
      );
    }
    setIsTaskDetailsModalOpen(false);
  };

  const [isAddSurveyModalOpen, setIsAddSurveyModalOpen] = useState(false);

  const openAddSurveyModal = () => {
    setIsTaskDetailsModalOpen(false);
    setIsAddSurveyModalOpen(true);
  };

  const closeAddSurveyModal = () => {
    setIsAddSurveyModalOpen(false);
  };

  const handleRefreshButtonClick = async () => {
    setIsRefreshing(true);
    try {
      setActiveFilter("all");
      setSelectedMonth(new Date());
      setSelectedYear(new Date().getFullYear());
      setSelectedStatusFilter("Hamısı");
      setSelectedRegionFilter("Hamısı");
      setRegistrationNumberFilter("")
      await fetchTasks("all", new Date(), new Date().getFullYear(), "Hamısı");
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchTasks();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const deleteTask = async taskId => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`https://app.digitask.store/services/task/${taskId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFilteredData(prevData => prevData.filter(task => task.id !== taskId));
      fetchTasks(
        activeFilter,
        selectedMonth,
        selectedYear,
        selectedStatusFilter,
        selectedRegionFilter,
        registrationNumberFilter
      );
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        deleteTask();
      }
      console.error("Error deleting task:", error);
    }
  };

  const confirm = async (taskId) => {
    try {
      console.log("Deleting task with ID:", taskId);
      await deleteTask(taskId);
      setIsSmallModalOpen(false);
      message.success('Tapşırıq uğurla silindi');
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        deleteTask(taskId);
        setIsSmallModalOpen(false);
      }
    }
  };

  const cancel = () => {
    message.info('Silinmə ləğv edildi');
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`https://app.digitask.store/services/task/${taskId}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.status == 403) {
        await refreshAccessToken();
        handleStatusUpdate(taskId, newStatus);
      }
      setFilteredData(prevData => prevData.map(task => (task.id === taskId ? { ...task, status: newStatus } : task)));

      const updatedTaskResponse = await fetch(`https://app.digitask.store/services/task/${taskId}/`);
      const updatedTaskData = await updatedTaskResponse.json();

      setFilteredData(prevData =>
        prevData.map(task =>
          task.id === taskId
            ? { ...task, first_name: updatedTaskData.first_name, last_name: updatedTaskData.last_name }
            : task
        )
      );
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleStatusUpdate(taskId, newStatus);
      }
      console.error("Error updating task status:", error);
    }
  };

  const handleNewTask = newTask => {
    setData(prevTasks => [newTask, ...prevTasks]);
    setFilteredData(prevTasks => [newTask, ...prevTasks]);
  };

  const handleTaskUpdated = updatedTask => {
    setData(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setFilteredData(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const showUpdateButtons = (userType, status) => {
    if (userType === "Texnik") {
      if (status === "waiting") {
        return "qebul_et";
      } else if (status === "inprogress") {
        return "yolda";
      } else if (status === "started") {
        return "basla";
      } else if (status === "completed") {
        return "tamamlandi";
      }
    }
    return null;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    refreshAccessToken();
    fetchTasks(
      activeFilter,
      selectedMonth,
      selectedYear,
      selectedStatusFilter,
      selectedRegionFilter,
      registrationNumberFilter
    );
  }, [activeFilter, selectedMonth, selectedYear, selectedStatusFilter, selectedRegionFilter, registrationNumberFilter]);

  return (
    <div className="task-page">
      <InternetPacksModal
        internetPacksModalOpan={internetPacksModalOpan}
        closeInternetPacksModal={closeInternetPacksModal}
      />
      <div className="task-page-title">
        <p>Tapşırıqlar</p>
        <div>
          {((position?.tasks_permission && position?.tasks_permission == "read_write") || (position?.tasks_permission && position?.tasks_permission == "is_admin")) && (
            <button onClick={openInternetPacksModal}>İnternet paketləri</button>
          )}

          <button
            onClick={handleRefreshButtonClick}
            className={`refresh-button ${isRefreshing ? "loading" : ""}`}
            disabled={isRefreshing}
          >
            <IoMdRefresh />
            {isRefreshing ? "Yüklənir..." : "Yenilə"}
          </button>

          {((position?.tasks_permission && position?.tasks_permission == "read_write") || (position?.tasks_permission && position?.tasks_permission == "is_admin")) && (
            <button onClick={openAddTaskModal}>
              <IoAdd />
              Əlavə et
            </button>
          )}
        </div>
      </div>

      <div className="taskPage-taskType">
        <button className={activeFilter === "all" ? "activeButton" : ""} onClick={() => filterData("all")}>
          Hamısı
        </button>
        <button
          className={activeFilter === "connection" ? "activeButton" : ""}
          onClick={() => filterData("connection")}
        >
          Qoşulmalar
        </button>
        <button className={activeFilter === "problem" ? "activeButton" : ""} onClick={() => filterData("problem")}>
          Problemlər
        </button>
      </div>
      <div className="task-history-status">
        <Space direction="vertical" size={12} className="task-report-date-filter">
          <ConfigProvider locale={az}>
            <DatePicker
              picker="month"
              value={dayjs(selectedMonth)}
              onChange={handleMonthChange}
              placeholder={capitalizeFirstLetter(dayjs().format('MMMM YYYY'))}
            />
          </ConfigProvider>

        </Space>
        <div className="task-filter-status-region">
          <div className="task-registration-number">
            <InputNumber
              placeholder="Qeydiyyat nömrəsi"
              value={registrationNumberFilter}
              onChange={value => setRegistrationNumberFilter(value)}
            />
          </div>

          <div>
            <button onClick={toggleRegionModal}>
              <span>Region:</span>
              <span>{selectedRegionFilter}</span>
              <FaChevronDown />
            </button>
            {isRegionModalOpen && (
              <div className="task-region-modal" ref={regionRef}>
                <div onClick={() => filterByRegion("Hamısı")}>Hamısı</div>
                {regions.map((region, index) => (
                  <div key={index} onClick={() => filterByRegion(region)}>
                    {region}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <button onClick={() => setIsStatusModalOpen(!isStatusModalOpen)}>
              <span>Status:</span>
              <span>{selectedStatusFilter}</span>
              <FaChevronDown />
            </button>
            {isStatusModalOpen && (
              <div className="status-modal" ref={statusRef}>
                <div onClick={() => filterByStatus("Hamısı")}>Hamısı</div>
                <div onClick={() => filterByStatus("Gözləyir")}>Gözləyir</div>
                <div onClick={() => filterByStatus("Qəbul edilib")}>Qəbul edilib</div>
                <div onClick={() => filterByStatus("Başlanıb")}>Başlanıb</div>
                <div onClick={() => filterByStatus("Tamamlanıb")}>Tamamlanıb</div>
                <div onClick={() => filterByStatus("Tamamlanmadı")}>Tamamlanmadı</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>İcraçı</th>
                <th>Müştəri</th>
                <th>Kateqoriya</th>
                <th>Başlama tarixi</th>
                <th>Bitmə tarixi</th>
                <th>Növ</th>
                <th>Ünvan</th>
                <th>Nömrə</th>
                <th className="task-status-header">Status</th>
                <th className="fixed-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    onClick={() => openTaskDetailsModal(item.id)}
                    className={item.id}
                  >{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                  <td onClick={() => openTaskDetailsModal(item.id)}>
                    {item.first_name && item.last_name ? `${item.first_name} ${item.last_name.charAt(0)}.` : "-"}
                  </td>
                  <td onClick={() => openTaskDetailsModal(item.id)}>{item.full_name}</td>
                  <td
                    onClick={() => openTaskDetailsModal(item.id)}
                    className={item.task_type === "problem" ? "problem" : "connection"}
                  >
                    {item.task_type === "problem" ? "Problem" : "Qoşulma"}
                  </td>
                  <td onClick={() => openTaskDetailsModal(item.id)}>{item.date}</td>
                  <td onClick={() => openTaskDetailsModal(item.id)}>
                    {item.end_date ? item.end_date : "-"}
                  </td>
                  <td onClick={() => openTaskDetailsModal(item.id)} className="type-icon">
                    {item.is_tv && <PiTelevisionSimple />}
                    {item.is_internet && <TfiWorld />}
                    {item.is_voice && <RiVoiceprintFill />}
                    {!item.is_tv && !item.is_internet && !item.is_voice && <span>-</span>}
                  </td>

                  <td onClick={() => openTaskDetailsModal(item.id)}>{item.location}</td>
                  <td onClick={() => openTaskDetailsModal(item.id)}>
                    {item.contact_number ? item.contact_number : "-"}
                  </td>
                  <td className="task-status">
                    {position?.tasks_permission === "technician" || (item.phone === userPhone && !item.phone) ? (
                      <>
                        {item.status === "waiting" && (
                          <button
                            className={`texnikWaiting ${showUpdateButtons(userType, item.status)}`}
                            onClick={() => handleStatusUpdate(item.id, "inprogress")}
                          >
                            Qəbul et
                          </button>
                        )}
                        {item.status === "inprogress" && (
                          <button
                            className={`texnikStatus ${showUpdateButtons(userType, item.status)}`}
                            onClick={() => handleStatusUpdate(item.id, "started")}
                          >
                            Başla
                          </button>
                        )}
                        {item.status === "started" && (
                          <button
                            className={`texnikStatus ${showUpdateButtons(userType, item.status)}`}
                            onClick={() => handleStatusUpdate(item.id, "completed")}
                          >
                            Tamamla
                          </button>
                        )}
                        {item.status === "completed" && (
                          <button className={`texnikCompleted ${showUpdateButtons(userType, item.status)}`}>
                            Tamamlandı
                          </button>
                        )}
                      </>
                    ) : (position?.tasks_permission == "read_write" || position?.tasks_permission == "is_admin") ? (
                      <button
                        onClick={() => openTaskDetailsModal(item.id)}
                        className={`status ${item.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {item.status === "waiting"
                          ? "Gözləyir"
                          : item.status === "inprogress"
                            ? "Qəbul edilib"
                            : item.status === "started"
                              ? "Başlanıb"
                              : item.status === "completed"
                                ? "Tamamlanıb"
                                : item.status}
                      </button>
                    ) : (
                      "?"
                    )}
                  </td>
                  <td className="fixed-right">
                    {position?.tasks_permission == "read_write" || position?.tasks_permission == "is_admin" ? (
                      <>
                        <button data-task-index={index} onClick={e => openSmallModal(e, index)}>
                          <BsThreeDotsVertical />
                        </button>
                        {isSmallModalOpen && selectedTaskIndex === index && (
                          <div ref={modalRef} className={`small-modal ${isSmallModalOpen ? "active" : ""}`}>
                            <div className="small-modal-content">
                              <Popconfirm
                                title="Bu tapşırığı silmək istədiyinizə əminsiniz?"
                                onConfirm={() => confirm(item.id)}
                                onCancel={cancel}
                                okText="Bəli"
                                cancelText="Xeyr"
                                overlayClassName="custom-popconfirm"
                              >
                                <button><RiDeleteBin6Line /></button>
                              </Popconfirm>
                              <button onClick={() => openTaskDetailsModal(item.id)}>
                                <MdOutlineEdit />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isAddTaskModalOpen && <AddTaskModal onClose={closeAddTaskModal} onTaskCreated={handleNewTask} />}
      {isTaskDetailsModalOpen && (
        <DetailsModal
          onClose={closeTaskDetailsModal}
          onAddSurveyClick={openAddSurveyModal}
          onTaskUpdated={handleTaskUpdated}
          taskId={selectedTaskId}
          userType={userType}
        />
      )}
      {isAddSurveyModalOpen && <AddSurveyModal onClose={closeAddSurveyModal} />}
    </div>
  );
}

export default Index;
