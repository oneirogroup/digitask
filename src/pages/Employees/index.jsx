import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { IoFilterOutline, IoAdd } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown, FaArrowLeft, FaArrowRight, FaCircle } from "react-icons/fa";
import { PiMapPinAreaFill } from "react-icons/pi";
import "./employees.css";
import { useUser } from '../../contexts/UserContext';
import AddUserModal from '../../components/AddUserModal';
import MapModal from '../../components/MapModal';
import UpdateUserModal from '../../components/UpdateUserModal';

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

const EmployeeList = () => {
  const { isAdmin } = useUser();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [showUserTypeOptions, setShowUserTypeOptions] = useState(false);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [employeeModals, setEmployeeModals] = useState({});
  const [status, setStatus] = useState({});
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const [isMapModal, setIsMapModal] = useState(false);
  const [isUpdateUserModal, setIsUpdateUserModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [mapEmployee, setMapEmployee] = useState(null);


  const userTypeRef = useRef(null);
  const groupRef = useRef(null);
  const modalRef = useRef(null);
  const wsRef = useRef(null);

  const [loggedInUserId, setLoggedInUserId] = useState(null);


  let ws2;
  const connectWebSocket2 = () => {



    ws2 = new WebSocket(`ws://135.181.42.192/userlist/`);

    ws2.onopen = () => {

      console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvv1.');
    };

    ws2.onmessage = (event) => {

      try {
        const data = JSON.parse(event.data);
        console.log('-------------------', data.message);
        if (data.message) {
          setStatus(data.message)
        }


      } catch (e) {
        console.error('vvvvvvvvvvvvvvvvvvvv4:', e);
      }
    };
  }
  useEffect(() => {
    connectWebSocket2();

    // deleted interval 
    return () => {

    };
  }, [loggedInUserId]);

  const fetchEmployees = async () => {
    try {
      await refreshAccessToken();
      const token = localStorage.getItem('access_token');

      const response = await axios.get('http://135.181.42.192/accounts/users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const employeesData = response.data;
      setEmployees(employeesData);

      const statusData = employeesData.reduce((acc, employee) => {
        acc[employee.id] = employee.status;

        return acc;
      }, {});
      console.log(statusData, '+++++++++++++++++++++++++++++++++++++++')
      setStatus(statusData);


      console.log('Status state:', statusData);
      initializeEmployeeModals(employeesData);

      const loggedInUserResponse = await axios.get('http://135.181.42.192/accounts/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLoggedInUserId(loggedInUserResponse.data.id);

    } catch (error) {
      console.error('Error fetching the employees data:', error);
    }
  };

  const handleUserAdded = async (newUser) => {
    setEmployees((prevEmployees) => [...prevEmployees, newUser]);

    initializeEmployeeModals([...employees, newUser]);

    await fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response && error.response.status === 401) {
          try {
            await refreshAccessToken();
            return axios(error.config);
          } catch (refreshError) {
            console.error('Error: Token refresh failed:', refreshError);
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

  const initializeEmployeeModals = (employeesData) => {
    const initialModals = {};
    employeesData.forEach(employee => {
      initialModals[employee.id] = false;
    });
    setEmployeeModals(initialModals);
  };

  const openSmallModal = (employeeId) => {
    setEmployeeModals(prevModals => ({
      ...prevModals,
      [employeeId]: true
    }));
  };

  const closeSmallModal = (employeeId) => {
    setEmployeeModals(prevModals => ({
      ...prevModals,
      [employeeId]: false
    }));
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleUserTypeFilter = (type) => {
    setUserTypeFilter(type);
    setShowUserTypeOptions(false);
    setCurrentPage(1);
  };

  const handleGroupFilter = (group) => {
    setGroupFilter(group);
    setShowGroupOptions(false);
    setCurrentPage(1);
  };

  const getFilteredEmployees = () => {
    let filteredEmployees = employees;

    if (searchTerm) {
      filteredEmployees = filteredEmployees.filter(employee => {
        const firstName = employee.first_name || '';
        const lastName = employee.last_name || '';
        return (
          firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (userTypeFilter) {
      filteredEmployees = filteredEmployees.filter(employee => (
        employee.user_type === userTypeFilter
      ));
    }

    if (groupFilter) {
      filteredEmployees = filteredEmployees.filter(employee => (
        employee.group && employee.group.group === groupFilter
      ));
    }

    if (!Array.isArray(filteredEmployees)) {
      console.error('Expected filteredEmployees to be an array, but got:', filteredEmployees);
      filteredEmployees = [];
    }

    return filteredEmployees;
  };

  const filteredEmployees = getFilteredEmployees();
  const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const paginate = (pageNumber) => {
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

  const openMapModal = (id) => {
    setMapEmployee(id)
    setIsMapModal(true);
  };

  const closeMapModal = () => {
    setIsMapModal(false);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userTypeRef.current && !userTypeRef.current.contains(event.target)) {
        setShowUserTypeOptions(false);
      }
      if (groupRef.current && !groupRef.current.contains(event.target)) {
        setShowGroupOptions(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setEmployeeModals({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUpdateUserClick = (employee) => {
    setSelectedEmployee(employee);
    setIsUpdateUserModal(true);
    closeSmallModal(employee.id);
  };

  const handleUpdateUserModalClose = () => {
    setIsUpdateUserModal(false);
  };

  const handleUpdateEmployee = async (employeeId, updatedData) => {
    try {
      await refreshAccessToken();
      const token = localStorage.getItem('access_token');

      const response = await axios.get(`http://135.181.42.192/accounts/update_user/${employeeId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedEmployee = response.data;

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId ? updatedEmployee : employee
        )
      );
      setStatus((prevStatus) => ({
        ...prevStatus,
        [employeeId]: updatedEmployee.status,
      }));
    } catch (error) {
      console.error('Error fetching updated employee:', error);
    }
  };

  const handleDeleteUser = async (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await refreshAccessToken();
      const token = localStorage.getItem('access_token');

      await axios.delete(`http://135.181.42.192/accounts/delete_user/${employeeId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== employeeId));
    } catch (error) {
      console.error('Error deleting the user:', error);
    }
  };
  console.log(status, '------------------------------------------------')
  return (
    <div className='employee-page'>
      <div className='employee-title'>
        <h1>İşçilər</h1>
        {isAdmin && (
          <button onClick={openAddUserModal}><IoAdd />Istifadəçi əlavə et</button>
        )}
      </div>
      <div className='employee-search-filter'>
        <div>
          <CiSearch />
          <input
            type="search"
            placeholder='İşçiləri axtar'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IoFilterOutline />
        </div>
        <div>
          <div>
            <button onClick={() => setShowUserTypeOptions(!showUserTypeOptions)}>
              <span>Vəzifə:</span>
              <span>{userTypeFilter ? userTypeFilter : 'Hamısı'}</span>
              <FaChevronDown />
            </button>
            {showUserTypeOptions && (
              <div className="group-modal" ref={userTypeRef}>
                <div onClick={() => handleUserTypeFilter(null)}>Hamısı</div>
                <div onClick={() => handleUserTypeFilter('Texnik')}>Texniklər</div>
                <div onClick={() => handleUserTypeFilter('Plumber')}>Plumber</div>
                <div onClick={() => handleUserTypeFilter('Ofis menecer')}>Ofis menecer</div>
                <div onClick={() => handleUserTypeFilter('Texnik menecer')}>Texnik menecer</div>
              </div>
            )}
          </div>
          <div>
            <button onClick={() => setShowGroupOptions(!showGroupOptions)}>
              <span>Qrup:</span>
              <span>{groupFilter ? groupFilter : 'Hamısı'}</span>
              <FaChevronDown />
            </button>
            {showGroupOptions && (
              <div className="group-modal employee-modal-group" ref={groupRef}>
                <div onClick={() => handleGroupFilter(null)}>Hamısı</div>
                {[...new Set(employees.map(employee => employee.group && employee.group.group))]
                  .filter(group => group)
                  .map((group, index) => (
                    <div key={index} onClick={() => handleGroupFilter(group)}>
                      {group}
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
              <th>Məkan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((employee, index) => (
              <tr
                key={employee.id}
                className={employee.id === loggedInUserId ? 'current-user' : ''}
              >
                <td>{`#${(index + 1).toString().padStart(4, '0')}`}</td>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.group ? employee.group.group : '-'}</td>
                <td>{employee.group ? employee.group.region : '-'}</td>
                <td>{employee.phone}  {!employee.phone && <span>-</span>}</td>
                <td>{(employee.user_type)}</td>
                <td className={`status ${status[employee.id]?.status === 'online' ? 'color-green' : 'color-red'}`}>
                  {status[employee.id]?.status !== undefined ? status[employee.id]?.status : "offline"}
                </td>
                <td>
                  <a className='mapIcon' onClick={() => openMapModal(employee.id)}><PiMapPinAreaFill /></a>
                </td>
                <td>
                  <button onClick={() => openSmallModal(employee.id)}><BsThreeDotsVertical /></button>
                  {employeeModals[employee.id] && (
                    <div
                      className={`small-modal-employee ${employeeModals[employee.id] ? 'active' : ''}`} ref={modalRef}
                    >
                      <div
                        className="small-modal-employee-content"
                      >
                        <button onClick={() => handleUpdateUserClick(employee)}>
                          <MdOutlineEdit />
                        </button>
                        <button onClick={() => handleDeleteUser(employee.id)}>
                          <RiDeleteBin6Line />
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
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}>
          <FaArrowRight />
        </button>
      </div>
      {isAddUserModal && <AddUserModal isOpen={isAddUserModal} onClose={closeAddUserModal} onUserAdded={handleUserAdded} />}
      {isMapModal && <MapModal status={status[mapEmployee]} isOpen={isMapModal} onClose={closeMapModal} />}
      {isUpdateUserModal && selectedEmployee && (
        <UpdateUserModal
          isOpen={isUpdateUserModal}
          onClose={handleUpdateUserModalClose}
          employee={selectedEmployee}
          onUpdateUser={(updatedEmployee) => handleUpdateEmployee(updatedEmployee.id, updatedEmployee)}
        />
      )}
    </div>
  );
};

export default EmployeeList;