import { useEffect, useRef, useState } from "react";
import { BiImport } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";

import useRefreshToken from "../../common/refreshToken";
import AddWarehouseModal from "../AddWarehouseModal";
import Export from "../Export";
import Import from "../Import";
import IncrementImportModal from "../IncrementImportModal";
import ItemDetail from "../ItemDetail/ItemDetail";

import "./warehouse.css";

function Warehouse() {
  const [tableData, setTableData] = useState([]);
  const [importSelected, setImportSelected] = useState(true);
  const [warehouseSelected, setWarehouseSelected] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [updateAction, setUpdateAction] = useState({ action: "", actionName: "", count: null });
  const [showItemDetailModal, setShowItemDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("Hamısı");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [actionModalPosition, setActionModalPosition] = useState({ index: null });
  const [productData, setProductData] = useState(null);
  const [showIncrementImportModal, setShowIncrementImportModal] = useState(false);

  const actionModalRef = useRef(null);
  const position = JSON.parse(localStorage.getItem("position"));
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    fetchWarehouses();
    fetchData();
  }, [searchTerm, warehouseSelected, selectedRegion]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (actionModalRef.current && !actionModalRef.current.contains(event.target)) {
        setIsActionModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchWarehouses = async (isRetry = false) => {
    try {
      const response = await fetch("https://app.desgah.az/warehouse/warehouses/");
      if (!response.ok) {
        if (response.status === 403 && !isRetry) {
          await refreshAccessToken();
          fetchWarehouses(true);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        if (Array.isArray(data)) {
          setWarehouses(data);
          const uniqueRegions = Array.from(new Set(data.map(warehouse => warehouse.region)));
          setRegions(uniqueRegions);
        } else {
          console.error("Error: Expected an array but received:", data);
        }
      }
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchWarehouses(true);
      }
    }
  };

  const fetchData = () => {
    let url = "https://app.desgah.az/warehouse/warehouse-items/";
    const params = [];

    if (searchTerm) {
      params.push(`name=${encodeURIComponent(searchTerm)}`);
    }
    if (selectedRegion && selectedRegion != "Hamısı") {
      params.push(`region=${encodeURIComponent(selectedRegion)}`);
    }

    fetch(url + (params.length > 0 ? `?${params.join("&")}` : ""))
      .then(response => response.json())
      .then(data => {
        let filteredData = data;
        if (warehouseSelected) {
          filteredData = data.filter(item => item.warehouse == warehouseSelected);
        }

        const formattedData = filteredData.map(item => ({
          id: item.id,
          name: item.equipment_name || "-",
          marka: item.brand || "-",
          model: item.model || "-",
          sn: item.serial_number || "-",
          count: item.count || 0,
          port_number: item.port_number || "-",
          mac: item.mac || "-",
          date: item.date || "-",
          warehouse: item.warehouse,
          measure: item.size_length || "-"
        }));
        setTableData(formattedData);
      })
      .catch(async error => {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchData();
        }
      });
  };

  const handleWarehouseClick = id => {
    if (warehouseSelected === id) {
      setWarehouseSelected("");
    } else {
      setWarehouseSelected(id);
    }
  };

  const handleRegionClick = region => {
    setSelectedRegion(region);
  };

  const handleActionClick = (event, index, itemId) => {
    const cellRect = event.target.getBoundingClientRect();
    setActionModalPosition({
      index: index,
      top: cellRect.bottom + window.scrollY,
      left: cellRect.left + window.scrollX
    });
    setSelectedItemId(itemId);
    setProductData(tableData[index]);
    setIsActionModalOpen(true);
  };

  const handleUpdateModalOpen = action => {
    setShowUpdateModal(true);
    setUpdateAction(action);
    setShowItemDetailModal(false);
    setIsActionModalOpen(false);
  };

  const handleExportSuccess = () => {
    setShowUpdateModal(false);
    setUpdateAction({});
    fetchData();
  };

  const handleItemDetailClose = () => {
    setShowItemDetailModal(false);
  };

  const handleItemDetailOpen = data => {
    const updatedData = {
      ...data,
      warehouseName: warehouses.find(warehouse => warehouse.id === data.warehouse)?.name || "Depo Bulunamadı"
    };

    setProductData(updatedData);
    setShowItemDetailModal(true);
  };

  const handleIncrementImportModalOpen = itemId => {
    setSelectedItemId(itemId);
    setShowIncrementImportModal(true);
    setIsActionModalOpen(false);
  };

  const handleIncrementImportSuccess = () => {
    setShowIncrementImportModal(false);
    fetchData();
  };

  const initializeWarehouseModals = warehousesData => {
    const initialModals = warehousesData.reduce((acc, warehouse) => {
      acc[warehouse.id] = false;
      return acc;
    }, {});
    setWarehouses(initialModals);
  };

  const handleOpenNewItemModal = () => {
    setShowNewItemModal(true);
  };

  const handleCloseNewItemModal = () => {
    setShowNewItemModal(false);
  };

  return (
    <div>
      <section>
        <div className="warehouseTable-title">
          <p>Anbar</p>
          {position && position.warehouse_permission == "read_write" && (
            <div>
              <button
                className={`importButton ${importSelected ? "selectedButton" : ""}`}
                onClick={() => handleOpenNewItemModal()}
              >
                <BiImport /> Yeni məhsul əlavə et
              </button>
            </div>
          )}
        </div>

        <div className="warehouse-search-filter">
          <div>
            <CiSearch />
            <input
              type="search"
              placeholder="Anbarda axtar"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <IoFilterOutline />
          </div>

          <div className="region-filter">
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

            <select className="warehouse-small-modal" onChange={e => handleRegionClick(e.target.value)}>
              <option value="">Region seç</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="warehouseTable">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Avadanlığın adı</th>
                <th>Marka</th>
                <th>Model</th>
                <th>Seriya nömrəsi</th>
                <th>Sayı</th>
                <th>Anbar</th>
                <th>Ölçüsü</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr key={index} className="tableRow">
                  <td onClick={() => handleItemDetailOpen(data)}>{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                  <td onClick={() => handleItemDetailOpen(data)}>{data.name}</td>
                  <td onClick={() => handleItemDetailOpen(data)}>{data.marka}</td>
                  <td onClick={() => handleItemDetailOpen(data)}>{data.model}</td>
                  <td onClick={() => handleItemDetailOpen(data)}>{data.sn}</td>
                  <td onClick={() => handleItemDetailOpen(data)}>{data.count}</td>
                  <td onClick={() => handleItemDetailOpen(data)}>
                    {warehouses.find(warehouse => warehouse.id === data.warehouse)?.name}
                  </td>

                  <td onClick={() => handleItemDetailOpen(data)}>{data.measure}</td>
                  {position && position.warehouse_permission == "read_write" && (
                    <td style={{ position: "relative" }} onClick={event => handleActionClick(event, index, data.id)}>
                      <BsThreeDotsVertical />
                      {isActionModalOpen && actionModalPosition.index === index && (
                        <div className="small-modal-warehouse small-css">
                          <div className="small-modal-warehouse-content" ref={actionModalRef}>
                            <button
                              onClick={() =>
                                handleUpdateModalOpen({ action: "increment", actionName: "Idxal", count: data.count })
                              }
                            >
                              İdxal
                            </button>
                            <hr />
                            <button
                              onClick={() =>
                                handleUpdateModalOpen({ action: "decrement", actionName: "Ixrac", count: data.count })
                              }
                            >
                              {" "}
                              İxrac
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showUpdateModal && (
        <Export
          fetchData={fetchData}
          action={updateAction}
          showModal={showUpdateModal}
          onClose={handleExportSuccess}
          itemId={selectedItemId || productData.id}
          productNumber={productData.count}
        />
      )}

      {showIncrementImportModal && (
        <IncrementImportModal
          showModal={showIncrementImportModal}
          itemId={selectedItemId || productData.id}
          onClose={handleIncrementImportSuccess}
        />
      )}

      {showItemDetailModal && (
        <ItemDetail
          showModal={showItemDetailModal}
          onClose={handleItemDetailClose}
          productData={productData}
          itemId={selectedItemId}
          count={productData.count}
          handleUpdateModalOpen={handleUpdateModalOpen}
        />
      )}
      {showNewItemModal && <Import onClose={handleCloseNewItemModal} fetchData={fetchData} warehouses={warehouses} />}
    </div>
  );
}

export default Warehouse;
