import React, { useState, useEffect } from 'react';
import { BiImport, BiExport } from "react-icons/bi";
import { IoFilterOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import Import from "../Import";
import Export from "../Export";
import "./warehouse.css";

function Warehouse() {
    const [tableData, setTableData] = useState([]);
    const [exportSelected, setExportSelected] = useState(false);
    const [importSelected, setImportSelected] = useState(true);
    const [warehouseSelected, setWarehouseSelected] = useState('');
    const [warehouses, setWarehouses] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('Hamısı');
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

    useEffect(() => {
        fetchWarehouses();
        fetchData();
    }, [searchTerm, warehouseSelected, selectedRegion]);

    const fetchWarehouses = () => {
        fetch('http://135.181.42.192/services/warehouses/')
            .then(response => response.json())
            .then(data => {
                const warehouseNames = data.map(warehouse => warehouse.name);
                setWarehouses(warehouseNames);
                const uniqueRegions = Array.from(new Set(data.map(warehouse => warehouse.region)));
                setRegions(uniqueRegions);
            })
            .catch(error => console.error('Error fetching warehouses:', error));
    };

    const fetchData = () => {
        let url = 'http://135.181.42.192/services/warehouse_item/';
        const params = [];

        if (searchTerm) {
            params.push(`name=${encodeURIComponent(searchTerm)}`);
        }

        fetch(url + (params.length > 0 ? `?${params.join('&')}` : ''))
            .then(response => response.json())
            .then(data => {
                let filteredData = data;
                if (warehouseSelected) {
                    filteredData = data.filter(item => item.warehouse.name === warehouseSelected);
                }
                if (selectedRegion && selectedRegion !== 'Hamısı') {
                    filteredData = filteredData.filter(item => item.warehouse.region === selectedRegion);
                }

                const formattedData = filteredData.map(item => ({
                    id: item.id,
                    name: item.equipment_name,
                    marka: item.brand,
                    model: item.model,
                    sn: item.serial_number,
                    count: item.number,
                    region: item.warehouse.region,
                    measure: item.size_length
                }));
                setTableData(formattedData);
            })
            .catch(error => console.error('Error fetching data:', error));
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
            setWarehouseSelected('');
        } else {
            setWarehouseSelected(name);
        }
    };

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
        setIsRegionModalOpen(false);
    };

    return (
        <div>
            <section>
                <div className='warehouseTable-title'>
                    <p>Anbar</p>
                    <div>

                        <button
                            className={`importButton ${importSelected ? 'selectedButton' : ''}`}
                            onClick={handleImportClick}
                        >
                            <BiImport /> İdxal
                        </button>
                    </div>
                </div>
                <div className='warehouseName'>
                    {warehouses.map((name, index) => (
                        <button
                            key={index}
                            className={`warehouseButton ${warehouseSelected === name ? 'selectedButton' : ''}`}
                            onClick={() => handleWarehouseClick(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>
                <div className='warehouse-search-filter'>
                    <div>
                        <CiSearch />
                        <input
                            type="search"
                            placeholder='Anbarda axtar'
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
                            <div className="region-small-modal">
                                {regions.map((region, index) => (
                                    <div
                                        key={index}
                                        className="region-item"
                                        onClick={() => handleRegionClick(region)}
                                    >
                                        {region}
                                    </div>
                                ))}
                                <div className="region-item" onClick={() => handleRegionClick('Hamısı')}>
                                    Hamısı
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='warehouseTable'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Avadanlığın adı</th>
                                <th>Marka</th>
                                <th>Model</th>
                                <th>S/N</th>
                                <th>Sayı</th>
                                <th>Region</th>
                                <th>Ölçüsü</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((data, index) => (
                                <tr key={index}>
                                    <td>{`#${(index + 1).toString().padStart(4, '0')}`}</td>
                                    <td>{data.name}</td>
                                    <td>{data.marka}</td>
                                    <td>{data.model}</td>
                                    <td>{data.sn}</td>
                                    <td>{data.count}</td>
                                    <td>{data.region}</td>
                                    <td>{data.measure} m</td>
                                    <td><BsThreeDotsVertical /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {showImportModal && <Import onClose={() => setShowImportModal(false)} />}
            {showExportModal && <Export onClose={() => setShowExportModal(false)} />}
        </div>
    );
}

export default Warehouse;
