import { useState, useEffect, useRef } from 'react';
import "./history.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatDate } from './utils';
import { FaChevronDown } from "react-icons/fa6";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WarehouseItemModal from "../WarehouseItemModal";
import HistoryModal from "../HistoryModal";

const Anbar = () => {
  const [historyData, setHistoryData] = useState([]);
  const [warehouseItemData, setWarehouseItemData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [region, setRegion] = useState('Hamısı');
  const [importSelected, setImportSelected] = useState(false);
  const [exportSelected, setExportSelected] = useState(true);
  const [regions, setRegions] = useState([]);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const regionModalRef = useRef(null);

  const [selectedItemData, setSelectedItemData] = useState(null);
  const [showWarehouseItemModal, setShowWarehouseItemModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyUrl = new URL(`http://135.181.42.192/services/history/`);
        const warehouseItemUrl = new URL(`http://135.181.42.192/services/increment_history/`);

        if (startDate) {
          historyUrl.searchParams.append('start_date', startDate);
          warehouseItemUrl.searchParams.append('start_date', startDate);
        }
        if (endDate) {
          historyUrl.searchParams.append('end_date', endDate);
          warehouseItemUrl.searchParams.append('end_date', endDate);
        }
        if (region !== 'Hamısı') {
          historyUrl.searchParams.append('region', region);
          warehouseItemUrl.searchParams.append('region', region);
        }

        const historyResponse = await fetch(historyUrl.toString());
        const historyData = await historyResponse.json();
        setHistoryData(historyData);

        const warehouseItemResponse = await fetch(warehouseItemUrl.toString());
        const warehouseItemData = await warehouseItemResponse.json();
        setWarehouseItemData(warehouseItemData);

        const regionsResponse = await fetch(`http://135.181.42.192/services/warehouses/`);
        const regionsData = await regionsResponse.json();
        const uniqueRegions = Array.from(new Set(regionsData.map(item => item.region)));
        setRegions(uniqueRegions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [startDate, endDate, region]);

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
    const formattedDate = date ? date.toLocaleDateString('az-AZ') : null;
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (date) => {
    const formattedDate = date ? date.toLocaleDateString('az-AZ') : null;
    setEndDate(formattedDate);
  };


  const handleRegionChange = (region) => {
    setRegion(region);
    setIsRegionModalOpen(false);
  };

  const handleExportClick = () => {
    setExportSelected(true);
    setImportSelected(false);
  };

  const handleImportClick = () => {
    setExportSelected(false);
    setImportSelected(true);
  };

  const handleActionClick = (itemData, type) => {
    setSelectedItemData(itemData);
    if (type === 'history') {
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

      {exportSelected && (
        <div className='historyTable'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>İxrac edən şəxs</th>
                <th>İxrac edilən qurum <br /> və ya şəxs</th>
                <th>Tarix</th>
                <th>Məhsulun adı</th>
                <th>Marka</th>
                <th>Model</th>
                <th>Seriya nömrəsi</th>
                {/* <th>Mac</th>
                <th>Region</th> */}
                <th>Port sayı</th>
                <th>Sayı</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((data, index) => (
                <tr key={index}>
                  <td onClick={() => handleActionClick(data, 'history')} >{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.item_created_by.first_name} {data.item_created_by.last_name}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.company || data.authorized_person || (data.texnik_user ? `${data.texnik_user.first_name} ${data.texnik_user.last_name}` : '')}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.date ? formatDate(data.date) : 'N/A'}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.item_equipment_name}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.item_brand}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.item_model}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.item_serial_number}</td>
                  {/* <td>{data.item_mac}</td> */}
                  {/* <td>{(data.item_warehouse && data.item_warehouse.region) || 'N/A'}</td> */}
                  <td onClick={() => handleActionClick(data, 'history')} >{data.item_port_number}</td>
                  <td onClick={() => handleActionClick(data, 'history')} >{data.number}</td>
                  <td>
                    <BsThreeDotsVertical />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {importSelected && (
        <div className='warehouseTable historyTable'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Məhsul təminatçısı</th>
                <th>Tarix</th>
                <th>Məhsulun adı</th>
                <th>Marka</th>
                <th>Model</th>
                <th>Seriya nömrəsi</th>
                <th>Mac</th>
                <th>Region</th>
                <th>Port sayı</th>
                <th>Sayı</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {warehouseItemData.map((data, index) => (
                <tr key={index}>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.product_provider}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.date ? formatDate(data.date) : 'N/A'}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.item_equipment_name}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.item_brand}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.item_model}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.item_serial_number}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.item_mac}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{(data.item_warehouse && data.item_warehouse.region) || 'N/A'}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.item_port_number}</td>
                  <td onClick={() => handleActionClick(data, 'warehouse')} >{data.number}</td>

                  <td>
                    <BsThreeDotsVertical />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showWarehouseItemModal && <WarehouseItemModal itemData={selectedItemData} onClose={handleWarehouseItemModalClose} />}
      {showHistoryModal && <HistoryModal itemData={selectedItemData} onClose={handleHistoryModalClose} />}
    </div>
  );
};

export default Anbar;
