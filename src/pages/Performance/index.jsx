import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import './performance.css';

function Index() {
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("Hamısı");
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  const modalRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [start_date, end_date]);

  useEffect(() => {
    filterData();
  }, [data, selectedGroupFilter, start_date, end_date, selectedYear, selectedMonth, selectedDay]);

  const fetchData = () => {
    let url = `http://135.181.42.192/services/performance/?`;

    if (start_date) {
      url += `start_date=${encodeURIComponent(start_date)}&`;
    }
    if (end_date) {
      url += `end_date=${encodeURIComponent(end_date)}`;
    }

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
    let filtered = [...data];

    if (start_date) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(start_date));
    }

    if (end_date) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(end_date));
    }

    if (selectedGroupFilter && selectedGroupFilter !== "Hamısı") {
      filtered = filtered.filter(item => item.group.group === selectedGroupFilter);
    }

    if (selectedYear) {
      filtered = filtered.filter(item => new Date(item.date).getFullYear() === parseInt(selectedYear));
    }

    if (selectedMonth) {
      const months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
      ];
      filtered = filtered.filter(item => new Date(item.date).getMonth() === months.indexOf(selectedMonth));
    }

    if (selectedDay) {
      filtered = filtered.filter(item => new Date(item.date).getDate() === parseInt(selectedDay));
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

  const handleStartDateClick = (event) => {
    const inputRect = event.target.getBoundingClientRect();
    setIsSelectingStartDate(true);
    setModalPosition({ top: inputRect.bottom + window.scrollY, left: inputRect.left });
    setIsYearModalOpen(true);
  };

  const handleEndDateClick = (event) => {
    const inputRect = event.target.getBoundingClientRect();
    setIsSelectingStartDate(false);
    setModalPosition({ top: inputRect.bottom + window.scrollY, left: inputRect.left });
    setIsYearModalOpen(true);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearModalOpen(false);
    setIsMonthModalOpen(true);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsMonthModalOpen(false);
    setIsDayModalOpen(true);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setIsDayModalOpen(false);
    const selectedDate = `${selectedYear}-${(months.indexOf(selectedMonth) + 1).toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
    if (isSelectingStartDate) {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div className='performance-page'>
      <div className='performance-page-title'>
        <p>Performans</p>
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
              type="text"
              className="date-picker"
              value={start_date}
              onClick={handleStartDateClick}
              placeholder="YYYY-MM-DD"
              readOnly
            />
            <input
              type="text"
              className="date-picker"
              value={end_date}
              onClick={handleEndDateClick}
              placeholder="YYYY-MM-DD"
              readOnly
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
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id.toString().padStart(2, '0')}</td>
                    <td>{item.first_name && item.last_name ? `${item.first_name} ${item.last_name.charAt(0)}.` : '-'}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="8">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isYearModalOpen && (
        <div className="modal year-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
          {years.map(year => (
            <div key={year} className="modal-item" onClick={() => handleYearSelect(year)}>{year}</div>
          ))}
        </div>
      )}
      {isMonthModalOpen && (
        <div className="modal month-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
          {months.map((month, index) => (
            <div key={index} className="modal-item" onClick={() => handleMonthSelect(month)}>{month}</div>
          ))}
        </div>
      )}
      {isDayModalOpen && (
        <div className="modal day-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
          {days.map((day, index) => (
            <div key={index} className="modal-item" onClick={() => handleDaySelect(day)}>{day}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Index;
