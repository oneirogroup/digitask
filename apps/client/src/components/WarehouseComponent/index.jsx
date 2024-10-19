import { useState, useEffect, useRef } from "react";
import { BiImport } from "react-icons/bi";
import { IoFilterOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import Import from "../Import";
import Export from "../Export";
import ItemDetail from "../ItemDetail/ItemDetail";
import IncrementImportModal from "../IncrementImportModal";
import AddWarehouseModal from "../AddWarehouseModal";

import "./warehouse.css";

function Warehouse() {
    const [tableData, setTableData] = useState([]);
    const [exportSelected, setExportSelected] = useState(false);
    const [importSelected, setImportSelected] = useState(true);
    const [warehouseSelected, setWarehouseSelected] = useState("");
    const [warehouses, setWarehouses] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showItemDetailModal, setShowItemDetailModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("Hamısı");
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [actionModalPosition, setActionModalPosition] = useState({ index: null });
    const [productData, setProductData] = useState(null);
    const [showIncrementImportModal, setShowIncrementImportModal] = useState(false);
    const [isAddWarehouseModal, setIsAddWarehouseModal] = useState(false);
    const regionModalRef = useRef(null);
    const actionModalRef = useRef(null);

    useEffect(() => {
        fetchWarehouses();
        fetchData();
    }, [searchTerm, warehouseSelected, selectedRegion]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                regionModalRef.current &&
                !regionModalRef.current.contains(event.target)
            ) {
                setIsRegionModalOpen(false);
            }
            if (
                actionModalRef.current &&
                !actionModalRef.current.contains(event.target)
            ) {
                setIsActionModalOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchWarehouses = () => {
        fetch("http://135.181.42.192/services/warehouses/")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setWarehouses(data);
                    const uniqueRegions = Array.from(
                        new Set(data.map((warehouse) => warehouse.region))
                    );
                    setRegions(uniqueRegions);
                } else {
                    console.error("Error: Expected an array but received:", data);
                }
            })
            .catch((error) => console.error("Error fetching warehouses:", error));
    };


    const fetchData = () => {
        let url = "http://135.181.42.192/services/warehouse_item/";
        const params = [];

        if (searchTerm) {
            params.push(`name=${encodeURIComponent(searchTerm)}`);
        }

        fetch(url + (params.length > 0 ? `?${params.join("&")}` : ""))
            .then((response) => response.json())
            .then((data) => {
                let filteredData = data;
                if (warehouseSelected) {
                    filteredData = data.filter(
                        (item) => item.warehouse.name === warehouseSelected
                    );
                }
                if (selectedRegion && selectedRegion !== "Hamısı") {
                    filteredData = filteredData.filter(
                        (item) => item.warehouse.region === selectedRegion
                    );
                }

                const formattedData = filteredData.map((item) => ({
                    id: item.id,
                    name: item.equipment_name || '-',
                    marka: item.brand || '-',
                    model: item.model || '-',
                    sn: item.serial_number || '-',
                    count: item.number || 0,
                    port_number: item.port_number || '-',
                    mac: item.mac || '-',
                    date: item.date || '-',
                    region: item.warehouse.region || '-',
                    warehouse_name: item.warehouse.name || '-',
                    measure: item.size_length || '-',
                }));
                setTableData(formattedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    };

    const handleExportClick = () => {
        setExportSelected(true);
        setImportSelected(false);
        setShowExportModal(true);
        setShowImportModal(false);
    };

    const handleImportClick = () => {
        setImportSelected(true);
        setExportSelected(false);
        setShowImportModal(true);
        setShowExportModal(false);
    };

    const handleWarehouseClick = (name) => {
        if (warehouseSelected === name) {
            setWarehouseSelected("");
        } else {
            setWarehouseSelected(name);
        }
    };

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
        setIsRegionModalOpen(false);
    };

    const handleActionClick = (event, index, itemId) => {
        const cellRect = event.target.getBoundingClientRect();
        setActionModalPosition({
            index: index,
            top: cellRect.bottom + window.scrollY,
            left: cellRect.left + window.scrollX,
        });
        setSelectedItemId(itemId);
        setProductData(tableData[index]);
        setIsActionModalOpen(true);
    };


    const handleExportModalOpen = () => {
        setShowExportModal(true);
        setShowItemDetailModal(false);
        setIsActionModalOpen(false);
    };

    const handleExportSuccess = () => {
        setShowExportModal(false);
        fetchData();
    };

    const handleItemDetailClose = () => {
        setShowItemDetailModal(false);
    };

    const handleItemDetailOpen = (data) => {
        setProductData(data);
        setShowItemDetailModal(true);
    };

    const handleIncrementImportModalOpen = (itemId) => {
        setSelectedItemId(itemId);
        setShowIncrementImportModal(true);
        setIsActionModalOpen(false);
    };

    const handleIncrementImportSuccess = () => {
        setShowIncrementImportModal(false);
        fetchData();
    };

    const openAddWarehouseModal = () => {
        setIsAddWarehouseModal(true);
    };

    const closeAddWarehouseModal = () => {
        setIsAddWarehouseModal(false);
    };

    const initializeWarehouseModals = (warehousesData) => {
        const initialModals = warehousesData.reduce((acc, warehouse) => {
            acc[warehouse.id] = false;
            return acc;
        }, {});
        setWarehouses(initialModals);
    };


    const handleWarehouseAdded = async (newWarehouse) => {
        setWarehouses((prevWarehouses) => [...prevWarehouses, newWarehouse]);
        await fetchWarehouses();
    };

    return (
        <div>
            <section>
                <div className="warehouseTable-title">
                    <p>Anbar</p>
                    <div>
                        <button
                            className={`importButton ${importSelected ? "selectedButton" : ""
                                }`}
                            onClick={handleImportClick}
                        >
                            <BiImport /> İdxal
                        </button>
                        <button
                            onClick={openAddWarehouseModal}
                        >
                            Anbar əlavə et
                        </button>
                    </div>
                </div>
                <div className="warehouseName">
                    {warehouses.map((warehouse, index) => (
                        <button
                            key={index}
                            className={`warehouseButton ${warehouseSelected === warehouse.name ? "selectedButton" : ""
                                }`}
                            onClick={() => handleWarehouseClick(warehouse.name)}
                        >
                            {warehouse.name}
                        </button>
                    ))}
                </div>
                <div className="warehouse-search-filter">
                    <div>
                        <CiSearch />
                        <input
                            type="search"
                            placeholder="Anbarda axtar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IoFilterOutline />
                    </div>
                    <div className="region-filter">
                        <button onClick={() => setIsRegionModalOpen(!isRegionModalOpen)}>
                            <span>Region:</span>
                            <span>{selectedRegion}</span>
                            <FaChevronDown />
                        </button>
                        {isRegionModalOpen && (
                            <div className="region-small-modal" ref={regionModalRef}>
                                <div
                                    className="region-item"
                                    onClick={() => handleRegionClick("Hamısı")}
                                >
                                    Hamısı
                                </div>
                                {regions.map((region, index) => (
                                    <div
                                        key={index}
                                        className="region-item"
                                        onClick={() => handleRegionClick(region)}
                                    >
                                        {region}
                                    </div>
                                ))}

                            </div>
                        )}
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
                                <th>Region</th>
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
                                    <td onClick={() => handleItemDetailOpen(data)}>{data.region}</td>
                                    <td onClick={() => handleItemDetailOpen(data)}>{data.measure}</td>
                                    <td onClick={(event) => handleActionClick(event, index, data.id)}>
                                        <BsThreeDotsVertical
                                        />
                                        {isActionModalOpen && actionModalPosition.index === index && (
                                            <div
                                                className="small-modal-warehouse"
                                            >
                                                <div className="small-modal-warehouse-content" ref={actionModalRef}>
                                                    <button onClick={handleExportModalOpen}>İxrac</button>
                                                    <hr />
                                                    <button onClick={handleIncrementImportModalOpen}>İdxal</button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {showImportModal && <Import showModal={showImportModal} warehouses={warehouses} onClose={() => setShowImportModal(false)} />}
            {showExportModal && <Export showModal={showExportModal} onClose={handleExportSuccess} itemId={selectedItemId || productData.id} productNumber={productData.count} />}
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
                    handleExportModalOpen={() => handleExportModalOpen(selectedItemId)}
                />
            )}
            {isAddWarehouseModal && <AddWarehouseModal isOpen={isAddWarehouseModal} onClose={closeAddWarehouseModal} onWarehouseAdded={handleWarehouseAdded} />}
        </div>
    );
}

export default Warehouse;
