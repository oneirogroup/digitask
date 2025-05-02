import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight, FaChevronDown } from "react-icons/fa";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";

import useRefreshToken from "../../../common/refreshToken";
import AddUserModal from "../../../components/AddUserModal";
import FullMapModal from "../../../components/FullMapModal";
import MapModal from "../../../components/MapModal";
import UpdateUserModal from "../../../components/UpdateUserModal";
import { useUser } from "../../../contexts/UserContext";
import { message, Popconfirm } from "antd";

import "../employees.css";

const EmployeeList = () => {
  const { isAdmin } = useUser();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [showUserTypeOptions, setShowUserTypeOptions] = useState(false);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [employeeModals, setEmployeeModals] = useState({});
  const [status, setStatus] = useState({});
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const [isMapModal, setIsMapModal] = useState(false);
  const [isFullMapModal, setIsFullMapModal] = useState(false);
  const [isUpdateUserModal, setIsUpdateUserModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [mapEmployee, setMapEmployee] = useState(null);
  const [allGroups, setAllGroups] = useState([]);

  const userTypeRef = useRef(null);
  const groupRef = useRef(null);
  const modalRef = useRef(null);
  const wsRef = useRef(null);
  const refreshAccessToken = useRefreshToken();

  const [loggedInUserId, setLoggedInUserId] = useState(null);

  let ws2;
  const connectWebSocket2 = () => {
    ws2 = new WebSocket(`wss://app.desgah.az/userlist/`);

    ws2.onopen = () => { };

    ws2.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        console.log("vvvvvvvvvvvvvvvvvvvv2:", data);
        if (data.message) {
          setStatus(data.message);
        }
      } catch (e) {
        console.error("vvvvvvvvvvvvvvvvvvvv4:", e);
      }
    };
    ws2.onclose = event => {
      if (event.wasClean) {
        console.log(`WebSocket1 connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        setTimeout(connectWebSocket2, 5000);
      } else {
        console.error("WebSocket1 connection died unexpectedly");
        setTimeout(connectWebSocket2, 5000);
      }
    };
  };
  useEffect(() => {
    connectWebSocket2();

    // deleted interval
    return () => { };
  }, [loggedInUserId]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get("https://app.desgah.az/accounts/users/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const employeesData = response.data;
      setEmployees(employeesData);

      const statusData = employeesData.reduce((acc, employee) => {
        acc[employee.id] = employee.status;

        return acc;
      }, {});
      setStatus(statusData);

      initializeEmployeeModals(employeesData);

      const loggedInUserResponse = await axios.get("https://app.desgah.az/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoggedInUserId(loggedInUserResponse.data.id);
    } catch (error) {
      if (response.status == 403) {
        await refreshAccessToken();
        fetchData();
      }
      console.error("Error fetching the employees data:", error);
    }
  };

  const handleUserAdded = async newUser => {
    setEmployees(prevEmployees => [...prevEmployees, newUser]);

    initializeEmployeeModals([...employees, newUser]);

    await fetchEmployees();
  };

  const handleGroupAdded = async newGroup => {
    setEmployees(prevEmployees => [...prevEmployees, newGroup]);

    setAllGroups(prevGroups => [...prevGroups, newGroup]);

    initializeEmployeeModals([...employees, newGroup]);

    await fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async config => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        if (error.response && error.response.status === 401) {
          try {
            return axios(error.config);
          } catch (refreshError) {
            console.error("Error: Token refresh failed:", refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const groupsResponse = await axios.get("https://app.desgah.az/services/groups/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const groupsData = groupsResponse.data;
      console.log("Fetched groups:", groupsData);
      setAllGroups(groupsData);
    } catch (error) {
      if (response.status == 403) {
        await refreshAccessToken();
        fetchData();
      }
      console.error("Error fetching groups:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const initializeEmployeeModals = employeesData => {
    const initialModals = {};
    employeesData.forEach(employee => {
      initialModals[employee.id] = false;
    });
    setEmployeeModals(initialModals);
  };

  const openSmallModal = employeeId => {
    setEmployeeModals(prevModals => ({
      ...prevModals,
      [employeeId]: true
    }));
  };

  const closeSmallModal = employeeId => {
    setEmployeeModals(prevModals => ({
      ...prevModals,
      [employeeId]: false
    }));
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleUserTypeFilter = type => {
    setUserTypeFilter(type);
    setShowUserTypeOptions(false);
    setCurrentPage(1);
  };

  const handleGroupFilter = group => {
    setGroupFilter(group);
    setShowGroupOptions(false);
    setCurrentPage(1);
  };

  const getFilteredEmployees = () => {
    let filteredEmployees = employees;

    if (searchTerm) {
      filteredEmployees = filteredEmployees.filter(employee => {
        const firstName = employee.first_name || "";
        const lastName = employee.last_name || "";
        return (
          firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (userTypeFilter) {
      filteredEmployees = filteredEmployees.filter(employee => employee.user_type === userTypeFilter);
    }

    if (groupFilter) {
      filteredEmployees = filteredEmployees.filter(employee => employee.group && employee.group.group === groupFilter);
    }

    filteredEmployees = filteredEmployees.sort((a, b) => {
      const statusA = status[a.id]?.status === "online" ? 1 : 0;
      const statusB = status[b.id]?.status === "online" ? 1 : 0;
      return statusB - statusA;
    });

    if (!Array.isArray(filteredEmployees)) {
      console.error("Expected filteredEmployees to be an array, but got:", filteredEmployees);
      filteredEmployees = [];
    }

    return filteredEmployees;
  };

  const filteredEmployees = getFilteredEmployees();
  const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const paginate = pageNumber => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredEmployees.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const openAddUserModal = () => {
    setIsAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModal(false);
  };

  const openMapModal = id => {
    setMapEmployee(id);
    setIsMapModal(true);
  };

  const closeMapModal = () => {
    setIsMapModal(false);
  };

  const openFullMapModal = () => {
    setIsFullMapModal(true);
  };

  const closeFullMapModal = () => {
    setIsFullMapModal(false);
  };

  const handleButtonClick = event => {
    event.stopPropagation();
    event.preventDefault();
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (userTypeRef.current && !userTypeRef.current.contains(event.target)) {
        setShowUserTypeOptions(false);
      }
      if (groupRef.current && !groupRef.current.contains(event.target)) {
        setShowGroupOptions(false);
      }
      const isInModal = modalRef.current && modalRef.current.contains(event.target);
      const isInPopconfirm = event.target.closest('.custom-popconfirm') !== null;

      if (!isInModal && !isInPopconfirm) {
        setEmployeeModals({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdateUserClick = employee => {
    setSelectedEmployee(employee);
    setIsUpdateUserModal(true);
    closeSmallModal(employee.id);
  };

  const handleUpdateUserModalClose = () => {
    setIsUpdateUserModal(false);
  };

  const handleUpdateEmployee = async (employeeId, updatedData) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`https://app.desgah.az/accounts/update_user/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedEmployee = response.data;

      setEmployees(prevEmployees =>
        prevEmployees.map(employee => (employee.id === employeeId ? updatedEmployee : employee))
      );
      setStatus(prevStatus => ({
        ...prevStatus,
        [employeeId]: updatedEmployee.status
      }));
    } catch (error) {
      if (response.status == 403) {
        await refreshAccessToken();
        handleUpdateEmployee();
      }
      console.error("Error fetching updated employee:", error);
    }
  };

  const handleDeleteUser = async employeeId => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(`https://app.desgah.az/accounts/delete_user/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== employeeId));
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleDeleteUser();
      }
      console.error("Error deleting the user:", error);
    }
  };

  const confirm = async (userId) => {
    try {
      await handleDeleteUser(userId);
      setEmployeeModals({});
      message.success('Tapşırıq uğurla silindi');
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleDeleteUser(userId);
        setEmployeeModals({});
      }
    }
  };

  const cancel = () => {
    message.info('Silinmə ləğv edildi');
  };


  const position = JSON.parse(localStorage.getItem("position"));

  return (
    <div className="employee-page">
      <div className="employee-title">
        <h1></h1>
        {position && position.users_permission !== "read_only" && (
          <div className="employee-add-buttons">
            <button onClick={openFullMapModal}>Xəritə</button>
            <button onClick={openAddUserModal}>
              <IoAdd />
              Istifadəçi əlavə et
            </button>
          </div>
        )}
      </div>
      <div className="employee-search-filter">
        <div>
          <CiSearch />
          <input type="search" placeholder="İşçiləri axtar" value={searchTerm} onChange={handleSearchChange} />
          <IoFilterOutline />
        </div>
        <div>
          <div>
            <button onClick={() => setShowUserTypeOptions(!showUserTypeOptions)}>
              <span>Vəzifə:</span>
              <span>{userTypeFilter ? userTypeFilter : "Hamısı"}</span>
              <FaChevronDown />
            </button>
            {showUserTypeOptions && (
              <div className="group-modal" ref={userTypeRef}>
                <div onClick={() => handleUserTypeFilter(null)}>Hamısı</div>
                <div onClick={() => handleUserTypeFilter("Texnik")}>Texniklər</div>
                <div onClick={() => handleUserTypeFilter("Plumber")}>Plumber</div>
                <div onClick={() => handleUserTypeFilter("Ofis menecer")}>Ofis menecer</div>
                <div onClick={() => handleUserTypeFilter("Texnik menecer")}>Texnik menecer</div>
              </div>
            )}
          </div>
          <div>
            <button onClick={() => setShowGroupOptions(!showGroupOptions)}>
              <span>Qrup:</span>
              <span>{groupFilter ? groupFilter : "Hamısı"}</span>
              <FaChevronDown />
            </button>
            {showGroupOptions && (
              <div className="group-modal employee-modal-group" ref={groupRef}>
                <div onClick={() => handleGroupFilter(null)}>Hamısı</div>
                {allGroups
                  .filter(group => group)
                  .map((group, index) => (
                    <div key={index} onClick={() => handleGroupFilter(group.group)}>
                      {group.group}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="employee-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Qrup</th>
              <th>Ünvan</th>
              <th>Nōmrǝ</th>
              <th>Vəzifə</th>
              <th>Status</th>
              {/* {position && position.users_permission !== "read_only" && ( */}
              <>
                <th>Məkan</th>
                <th></th>
              </>
              {/* )} */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((employee, index) => (
              <tr key={employee.id} className={employee.id === loggedInUserId ? "current-user" : ""}>
                <td>{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                <td>
                  {employee.first_name} {employee.last_name}
                </td>
                <td>{employee.group ? employee.group.group : "-"}</td>
                <td>{employee.group ? employee.group.region : "-"}</td>
                <td>
                  {employee.phone} {!employee.phone && <span>-</span>}
                </td>
                <td>{employee.position?.name}</td>
                <td className={`status ${status[employee.id]?.status === "online" ? "color-green" : "color-red"}`}>
                  {status[employee.id]?.status !== undefined ? status[employee.id]?.status : "offline"}
                </td>
                {/* {position && position.users_permission !== "read_only" &&
                  ( */}
                <>
                  <td>
                    <a
                      className={`mapIcon ${status[employee.id]?.status !== "online" ? "deactive" : ""}`}
                      onClick={employee.id ? () => openMapModal(employee.id) : null}
                    >
                      <PiMapPinAreaFill />
                    </a>
                  </td>
                  <td>
                    <button onClick={() => openSmallModal(employee.id)}>
                      <BsThreeDotsVertical />
                    </button>
                    {employeeModals[employee.id] && (
                      <div
                        className={`small-modal-employee ${employeeModals[employee.id] ? "active" : ""}`}
                        ref={modalRef}
                      >
                        <div className="small-modal-employee-content">
                          <button onClick={() => handleUpdateUserClick(employee)}>
                            <MdOutlineEdit />
                          </button>
                          <Popconfirm
                            title="Bu tapşırığı silmək istədiyinizə əminsiniz?"
                            onConfirm={() => confirm(employee.id)}
                            onCancel={cancel}
                            okText="Bəli"
                            cancelText="Xeyr"
                            overlayClassName="custom-popconfirm"
                          >
                            <button><RiDeleteBin6Line /></button>
                          </Popconfirm>
                        </div>
                      </div>
                    )}
                  </td>
                </>
                {/* )} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          <FaArrowLeft />
        </button>
        {Array(Math.ceil(getFilteredEmployees().length / itemsPerPage))
          .fill(0)
          .map((_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} disabled={i + 1 === currentPage}>
              {i + 1}
            </button>
          ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}
        >
          <FaArrowRight />
        </button>
      </div>
      {isAddUserModal && (
        <AddUserModal isOpen={isAddUserModal} onClose={closeAddUserModal} onUserAdded={handleUserAdded} />
      )}
      {isMapModal && <MapModal status={status[mapEmployee]} isOpen={isMapModal} onClose={closeMapModal} />}
      {isFullMapModal && <FullMapModal status={status} isOpen={isFullMapModal} onClose={closeFullMapModal} />}
      {isUpdateUserModal && selectedEmployee && (
        <UpdateUserModal
          isOpen={isUpdateUserModal}
          onClose={handleUpdateUserModalClose}
          employee={selectedEmployee}
          fetchEmployees={fetchEmployees}
          onUpdateUser={updatedEmployee => handleUpdateEmployee(updatedEmployee.id, updatedEmployee)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
