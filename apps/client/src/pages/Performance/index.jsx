import axios from "axios";
import az from "date-fns/locale/az";
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { FaChevronDown } from "react-icons/fa";

import useRefreshToken from "../../common/refreshToken";

import "./performance.css";

registerLocale("az", az);

function Index() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("Hamısı");
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const modalRef = useRef(null);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    fetchData();
  }, [start_date, end_date]);

  useEffect(() => {
    filterData();
  }, [data, selectedGroupFilter, start_date, end_date]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const loggedInUserResponse = await axios.get("https://app.desgah.az/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoggedInUserId(loggedInUserResponse.data.id);

      const url = new URL("https://app.desgah.az/services/performance/");
      if (start_date) {
        url.searchParams.append("start_date", start_date.toISOString().split("T")[0]);
      }
      if (end_date) {
        url.searchParams.append("end_date", end_date.toISOString().split("T")[0]);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setData(data);
        const uniqueGroups = Array.from(new Set(data.map(item => item.group.group).filter(Boolean)));
        setGroups(uniqueGroups);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchData();
      }
      console.error("Error fetching data:", error);
    }
  };

  const filterData = () => {
    let filtered = [...data];

    filtered = filtered.filter(item => selectedGroupFilter === "Hamısı" || item.group.group === selectedGroupFilter);

    setFilteredData(filtered);
  };

  const filterByGroup = group => {
    setSelectedGroupFilter(group);
    setIsGroupModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (!event.target.closest(".group-modal") && isGroupModalOpen) {
        setIsGroupModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGroupModalOpen]);

  return (
    <div className="performance-page">
      <div className="performance-page-title">
        <p>Performans</p>
      </div>
      <div>
        <div className="performance-filter">
          <div>
            <button onClick={() => setIsGroupModalOpen(!isGroupModalOpen)}>
              <span>Qrup:</span>
              <span>{selectedGroupFilter}</span>
              <FaChevronDown />
            </button>
            {isGroupModalOpen && (
              <div className="group-modal">
                <div onClick={() => filterByGroup("Hamısı")}>Hamısı</div>
                {groups.map((group, index) => (
                  <div key={index} onClick={() => filterByGroup(group)}>
                    {group}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="date-picker-container performance-date">
            <div className="date-picker-wrapper">
              <DatePicker
                selected={start_date}
                onChange={date => setStartDate(date)}
                locale="az"
                placeholderText="gün/ay/il"
                dateFormat="dd.MM.yyyy"
                className="date-picker"
              />
            </div>
            <div className="date-picker-wrapper">
              <DatePicker
                selected={end_date}
                onChange={date => setEndDate(date)}
                locale="az"
                placeholderText="gün/ay/il"
                dateFormat="dd.MM.yyyy"
                className="date-picker"
              />
            </div>
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
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className={item.id === loggedInUserId ? "current-user" : ""}>
                    <td>{`${(index + 1).toString().padStart(2, "0")}`}</td>
                    <td>
                      {item.first_name && item.last_name ? `${item.first_name} ${item.last_name.charAt(0)}.` : "-"}
                    </td>
                    <td>{item.group.group ? item.group.group : "-"}</td>
                    <td>{item?.position_name?.name ? item?.position_name?.name : "Vəzifə qeyd olunmayıb"}</td>
                    <td>{item.task_count.total !== undefined ? item.task_count.total : 0}</td>
                    <td>{item.task_count.connection !== undefined ? item.task_count.connection : 0}</td>
                    <td>{item.task_count.problem !== undefined ? item.task_count.problem : 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Məlumat mövcud deyil</td>
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
