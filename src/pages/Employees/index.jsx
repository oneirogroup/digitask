import React, { useState, useEffect, useRef, useContext } from 'react';
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
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [showUserTypeOptions, setShowUserTypeOptions] = useState(false);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [employeeModals, setEmployeeModals] = useState({});
  const [status, setStatus] = useState({});
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const userTypeRef = useRef(null);
  const groupRef = useRef(null);
  const modalRef = useRef(null);
  const wsRef = useRef(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        await refreshAccessToken();
        const token = localStorage.getItem('access_token');

        const response = await axios.get('http://135.181.42.192/accounts/users/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEmployees(response.data);
        initializeEmployeeModals(response.data);

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

  useEffect(() => {
    const ws = new WebSocket('ws://135.181.42.192/ws/');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);

        if (data.userId && data.status) {
          setStatus((prevStatus) => ({
            ...prevStatus,
            [data.userId]: data.status,
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error('WebSocket connection died unexpectedly');
      }
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [loggedInUserId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userTypeRef.current && !userTypeRef.current.contains(event.target)) {
        setShowUserTypeOptions(false);
      }
      if (groupRef.current && !groupRef.current.contains(event.target)) {
        setShowGroupOptions(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAllModals();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const closeAllModals = () => {
    setEmployeeModals(prevModals => {
      const newModals = {};
      Object.keys(prevModals).forEach(key => {
        newModals[key] = false;
      });
      return newModals;
    });
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
      filteredEmployees = filteredEmployees.filter(employee => (
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }

    if (userTypeFilter) {
      filteredEmployees = filteredEmployees.filter(employee => (
        employee.user_type === userTypeFilter
      ));
    }

    if (groupFilter) {
      filteredEmployees = filteredEmployees.filter(employee => (
        employee.group === groupFilter
      ));
    }

    return filteredEmployees;
  };

  const currentItems = getFilteredEmployees().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openAddUserModal = () => {
    setIsAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModal(false);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(getFilteredEmployees().length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

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
                <div onClick={() => handleUserTypeFilter('Ofis menecer')}>Ofis meneceri</div>
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
              <th>Adres</th>
              <th>Nōmrǝ</th>
              <th>Vəzifə</th>
              <th>Status</th>
              <th>Məkan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((employee, index) => (
              <tr key={employee.id}>
                <td>{`#${(index + 1).toString().padStart(4, '0')}`}</td>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.group ? employee.group.group : '-'}</td>
                <td>{employee.group ? employee.group.region : '-'}</td>
                <td>{employee.phone}  {!employee.phone && <span>-</span>}</td>
                <td>{(employee.user_type)}</td>
                <td className='status'>
                  <p color={status[employee.id] === 'online' ? 'green' : 'red'}>
                    <FaCircle color={status[employee.id] === 'online' ? 'green' : 'red'} />
                    {status[employee.id] === 'online' ? 'Aktiv' : 'Offline'}
                  </p>
                </td>
                <td><a href=""><PiMapPinAreaFill /></a></td>
                <td>
                  <button onClick={() => openSmallModal(employee.id)}><BsThreeDotsVertical /></button>
                  {employeeModals[employee.id] && (
                    <div
                      ref={modalRef}
                      className={`small-modal-employee active`}
                    >
                      <div className="small-modal-employee-content">
                        <button>
                          <RiDeleteBin6Line />
                        </button>
                        <button>
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
      {isAddUserModal && <AddUserModal onClose={closeAddUserModal} />}
    </div>
  );
};

export default EmployeeList;
