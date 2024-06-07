import { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import './performance.css';

function Index() {
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("Hamısı");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const modalRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, selectedGroupFilter, startDate, endDate]);

  const fetchData = () => {
    let url = 'http://135.181.42.192/services/performance/';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          setData(data);
          const uniqueGroups = Array.from(new Set(data.map(item => item.group.group)));
          setGroups(uniqueGroups);
        } else {
          console.error('Data is not an array:', data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const filterData = () => {
    let filtered = data;

    if (startDate) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(endDate));
    }
    if (selectedGroupFilter && selectedGroupFilter !== "Hamısı") {
      filtered = filtered.filter(item => item.group.group === selectedGroupFilter);
    }

    setFilteredData(filtered);
  };

  const openSmallModal = (event) => {
    const buttonRect = event.target.getBoundingClientRect();
    setModalPosition({ top: buttonRect.top + window.scrollY, left: buttonRect.left + buttonRect.width });
    setIsSmallModalOpen(true);
  };

  const closeSmallModal = () => {
    setIsSmallModalOpen(false);
  };

  const filterByGroup = (group) => {
    setSelectedGroupFilter(group);
    setIsGroupModalOpen(false);
  };

  return (
    <div className='performance-page'>
      <div className='performance-page-title'>
        <p>Tapşırıqlar</p>
      </div>
      <div>
        <div className='performance-filter'>
          <div>
            <button onClick={() => setIsGroupModalOpen(!isGroupModalOpen)}>
              <span>Group:</span>
              <span>{selectedGroupFilter}</span>
              <FaChevronDown />
            </button>
            {isGroupModalOpen && (
              <div className="group-modal">
                <div onClick={() => filterByGroup("Hamısı")}>Hamısı</div>
                {groups.map((group, index) => (
                  <div key={index} onClick={() => filterByGroup(group)}>{group}</div>
                ))}
              </div>
            )}
          </div>
          <div className="date-picker-container">
            <input
              type="date"
              className="date-picker"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="date-picker"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="performance-table-container">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Ad</th>
                <th>Qrup</th>
                <th>Vəzifə</th>
                <th>Tapşırıqlar</th>
                <th>Qoşulma</th>
                <th>Problem</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.id.toString().padStart(2, '0')}</td>
                  <td>{item.first_name && item.last_name ? `${item.first_name} ${item.last_name.charAt(0)}.` : 'User yoxdur'}</td>
                  <td>{item.group.group}</td>
                  <td>{item.user_type}</td>
                  <td>{item.task_count.total}</td>
                  <td>{item.task_count.connection}</td>
                  <td>{item.task_count.problem}</td>
                  <td>
                    <button onClick={(e) => openSmallModal(e)}><BsThreeDotsVertical /></button>
                    {isSmallModalOpen && (
                      <div
                        ref={modalRef}
                        className={`small-modal ${isSmallModalOpen ? 'active' : ''}`}
                        style={{ top: modalPosition.top, left: modalPosition.left }}
                      >
                        <div className="small-modal-content">
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
              {!Array.isArray(filteredData) && (
                <tr>
                  <td colSpan="8">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Index;
