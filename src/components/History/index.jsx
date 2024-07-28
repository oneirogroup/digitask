import React, { useState, useEffect, useRef } from 'react';
import "./history.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatDate } from './utils';
import { FaChevronDown } from "react-icons/fa6";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Anbar = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [region, setRegion] = useState('Hamısı');
  const [importSelected, setImportSelected] = useState(false);
  const [exportSelected, setExportSelected] = useState(true);
  const [importData, setImportData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const regionModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyUrl = new URL(`http://135.181.42.192/services/history/`);
        const warehouseItemUrl = new URL(`http://135.181.42.192/services/warehouse_item/`);

        if (startDate) {
          historyUrl.searchParams.append('start_date', startDate.toISOString().split('T')[0]);
          warehouseItemUrl.searchParams.append('start_date', startDate.toISOString().split('T')[0]);
        }
        if (endDate) {
          historyUrl.searchParams.append('end_date', endDate.toISOString().split('T')[0]);
          warehouseItemUrl.searchParams.append('end_date', endDate.toISOString().split('T')[0]);
        }
        if (region !== 'Hamısı') {
          historyUrl.searchParams.append('region', region);
          warehouseItemUrl.searchParams.append('region', region);
        }

        const historyResponse = await fetch(historyUrl.toString());
        const historyData = await historyResponse.json();
        setData(historyData);

        if (importSelected) {
          const warehouseItemResponse = await fetch(warehouseItemUrl.toString());
          const warehouseItemData = await warehouseItemResponse.json();
          setImportData(warehouseItemData);
        }

        const regionsResponse = await fetch(`http://135.181.42.192/services/warehouses/`);
        const regionsData = await regionsResponse.json();
        const uniqueRegions = Array.from(new Set(regionsData.map(item => item.region)));
        setRegions(uniqueRegions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [startDate, endDate, region, importSelected]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (regionModalRef.current && !regionModalRef.current.contains(event.target)) {
        setIsRegionModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleRegionChange = (region) => {
    setRegion(region);
    setIsRegionModalOpen(false);
  };

  const handleExportClick = () => {
    setExportSelected(true);
    setImportSelected(false);
    setImportData([]);
  };

  const handleImportClick = async () => {
    setExportSelected(false);
    setImportSelected(true);
    try {
      const warehouseItemUrl = new URL(`http://135.181.42.192/services/warehouse_item/`);

      if (startDate) {
        warehouseItemUrl.searchParams.append('start_date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        warehouseItemUrl.searchParams.append('end_date', endDate.toISOString().split('T')[0]);
      }

      const response = await fetch(warehouseItemUrl.toString());
      const jsonData = await response.json();
      setImportData(jsonData);
    } catch (error) {
      console.error('Error fetching import data:', error);
    }
  };

  const displayData = importSelected ? importData : data;

  return (
    <div className="history-page">
      <section>
        <div className="button-container">
          <div>
            <button
              className={`exportButton ${exportSelected ? 'selectedButton' : ''}`}
              onClick={handleExportClick}
            >
              İxrac
            </button>
            <button
              className={`importButton ${importSelected ? 'selectedButton' : ''}`}
              onClick={handleImportClick}
            >
              İdxal
            </button>
          </div>
        </div>
        <div className="filter-container">
          <div className="filter-item">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              id="startDate"
              className="custom-datepicker"
            />
          </div>
          <div className="filter-item">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              id="endDate"
              className="custom-datepicker"
            />
          </div>
          <div className="filter-item-modal history-region-modal">
            <button onClick={() => setIsRegionModalOpen(!isRegionModalOpen)}>
              <span>Region:</span>
              <span>{region}</span>
              <FaChevronDown />
            </button>
            {isRegionModalOpen && (
              <div className="region-small-modal" ref={regionModalRef}>
                <div
                  className="region-item"
                  onClick={() => handleRegionChange("Hamısı")}
                >
                  Hamısı
                </div>
                {regions.map((region, index) => (
                  <div
                    key={index}
                    className="region-item"
                    onClick={() => handleRegionChange(region)}
                  >
                    {region}
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      </section>

      <div className='warehouseTable'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Marka</th>
              <th>Model</th>
              <th>S/N</th>
              <th>Mac</th>
              <th>Region</th>
              <th>Port sayı</th>
              <th>Sayı</th>
              <th>Tarix</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((data, index) => (
              <tr key={index}>
                <td>{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                <td>{data.item_equipment_name || data.equipment_name}</td>
                <td>{data.item_brand || data.brand}</td>
                <td>{data.item_model || data.model}</td>
                <td>{data.item_serial_number || data.serial_number}</td>
                <td>{data.item_mac || data.mac}</td>
                <td>{(data.item_warehouse && data.item_warehouse.region) || (data.warehouse && data.warehouse.region) || 'N/A'}</td>
                <td>{data.item_port_number || data.port_number}</td>
                <td>{data.number}</td>
                <td>{data.date ? formatDate(data.date) : 'N/A'}</td>
                <td><BsThreeDotsVertical /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Anbar;
