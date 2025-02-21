import { az } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

import useRefreshToken from "../../common/refreshToken";
import HistoryModal from "../HistoryModal";
import WarehouseItemModal from "../WarehouseItemModal";
import { formatDate } from "./utils";

import "./history.css";
import "react-datepicker/dist/react-datepicker.css";

const Anbar = () => {
  const [historyData, setHistoryData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [action, setAction] = useState("1");
  const [warehouseSelected, setWarehouseSelected] = useState("");
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [showWarehouseItemModal, setShowWarehouseItemModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const refreshAccessToken = useRefreshToken();

  const fetchData = async () => {
    try {
      const historyUrl = new URL(`http://37.61.77.5/warehouse/warehouse-history`);
      const params = new URLSearchParams();
      const actions = action == 1 ? ["add", "increment"] : ["remove", "decrement"];
      params.append("timestamp__date__gte", startDate);
      params.append("timestamp__date__lte", endDate);
      params.append("item__warehouse", warehouseSelected);
      actions.forEach(actionItem => {
        params.append("action", actionItem);
      });
      historyUrl.search = params.toString();
      const historyResponse = await fetch(historyUrl.toString());
      const historyData = await historyResponse.json();
      const sortedHistory = historyData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setHistoryData(sortedHistory);
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchData();
      }
      console.error("Error fetching data:", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await fetch("http://37.61.77.5/warehouse/warehouses/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setWarehouses(data);
      } else {
        console.error("Error: Expected an array but received:", data);
      }
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchWarehouses();
      }
      console.error("Error fetching warehouses:", error);
    }
  };

  const getWarehouseName = warehouseId => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : "N/A";
  };

  const handleWarehouseClick = id => {
    if (warehouseSelected === id) {
      setWarehouseSelected("");
    } else {
      setWarehouseSelected(id);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, action, warehouseSelected]);

  const handleStartDateChange = date => {
    const formattedDate = date ? date.toLocaleDateString("az-AZ") : null;
    setStartDate(formattedDate);
  };

  const handleEndDateChange = date => {
    const formattedDate = date ? date.toLocaleDateString("az-AZ") : null;
    setEndDate(formattedDate);
  };

  const handleActionClick = (itemData, type) => {
    setSelectedItemData(itemData);
    if (type === "history") {
      setShowHistoryModal(true);
    } else {
      setShowWarehouseItemModal(true);
    }
  };

  const handleWarehouseItemModalClose = () => {
    setShowWarehouseItemModal(false);
  };

  const handleHistoryModalClose = () => {
    setShowHistoryModal(false);
  };

  const handleActionSelect = action => {
    setAction(action);
  };

  return (
    <div className="history-page">
      <section>
        <div className="region-filter">
          <div className="button-container">
            <div>
              <button
                className={`exportButton ${action == "1" ? "selectedButton" : ""}`}
                onClick={() => {
                  handleActionSelect("1");
                }}
              >
                İdxal
              </button>
              <button
                className={`importButton ${action == "2" ? "selectedButton" : ""}`}
                onClick={() => {
                  handleActionSelect("2");
                }}
              >
                İxrac
              </button>
            </div>
          </div>
          <select
            className="warehouse-small-modal"
            value={warehouseSelected}
            onChange={e => handleWarehouseClick(e.target.value)}
          >
            <option value="">Anbar seç</option>
            {warehouses.map((warehouse, index) => (
              <option
                key={index}
                value={warehouse.id}
                className={`warehouseOption ${warehouseSelected === warehouse.id ? "selectedOption" : ""}`}
              >
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-container">
          <div className="filter-item">
            <DatePicker
              locale={az}
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="gün/ay/il"
              id="startDate"
              className="custom-datepicker"
            />
          </div>
          <div className="filter-item">
            <DatePicker
              locale={az}
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="gün/ay/il"
              id="endDate"
              className="custom-datepicker"
            />
          </div>
        </div>
      </section>

      <div className="warehouseTable historyTable">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Qeyd</th>
              <th>Tarix</th>
              <th>Məhsulun adı</th>
              <th>Marka</th>
              <th>Model</th>
              <th>Seriya nömrəsi</th>
              <th>Mac</th>
              <th>Anbar</th>
              <th>Port sayı</th>
              <th>Əvvəlki say</th>
              <th>Sonrakı Say</th>
              <th>Aktual say</th>
              <th>Əməliyyat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((data, index) => (
              <tr key={index}>
                <td
                  onClick={() => handleActionClick(data, "history")}
                >{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                <td onClick={() => handleActionClick(data, "history")}>
                  {data.delivery_note.length > 15 ? `${data.delivery_note.slice(0, 15)}...` : data.delivery_note}
                </td>

                <td onClick={() => handleActionClick(data, "history")}>
                  {data.timestamp ? formatDate(data.timestamp) : "N/A"}
                </td>
                <td onClick={() => handleActionClick(data, "history")}>{data.item.equipment_name}</td>
                <td onClick={() => handleActionClick(data, "history")}>{data.item.brand}</td>
                <td onClick={() => handleActionClick(data, "history")}>{data.item.model}</td>
                <td onClick={() => handleActionClick(data, "history")}>{data.item.serial_number}</td>
                <td onClick={() => handleActionClick(data, "history")}>{data.item.mac}</td>
                <td onClick={() => handleActionClick(data, "history")}>
                  {getWarehouseName(data.item.warehouse) || "N/A"}
                </td>
                <td onClick={() => handleActionClick(data, "history")}>{data.item.port_number}</td>
                <td onClick={() => handleActionClick(data, "history")}>{data.old_count}</td>
                <td onClick={() => handleActionClick(data, "history")}>{data.new_count}</td>
                <td onClick={() => handleActionClick(data, "history")}>{data.item.count}</td>
                <td className="hasProblem" onClick={() => handleActionClick(data, "history")}>
                  {data.has_problem ? (
                    <span className="checkFalse">
                      <FaExclamationTriangle />
                    </span>
                  ) : (
                    <span className="checkTrue">
                      <FaCheckCircle />
                    </span>
                  )}
                </td>
                <td>
                  <BsThreeDotsVertical />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showWarehouseItemModal && (
        <WarehouseItemModal itemData={selectedItemData} onClose={handleWarehouseItemModalClose} />
      )}
      {showHistoryModal && (
        <HistoryModal warehouses={warehouses} itemData={selectedItemData} onClose={handleHistoryModalClose} />
      )}
    </div>
  );
};

export default Anbar;
