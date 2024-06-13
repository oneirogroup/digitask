import React, { useState, useEffect } from 'react';
import { BiImport, BiExport } from "react-icons/bi";
import { IoFilterOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import "./warehouse.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import Import from "../Import";
import Export from "../Export";

function Warehouse() {
    const [tableData, setTableData] = useState([]);
    const [exportSelected, setExportSelected] = useState(false);
    const [importSelected, setImportSelected] = useState(true);
    const [warehouseSelected, setWarehouseSelected] = useState('');
    const [warehouses, setWarehouses] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [searchTerm, warehouseSelected]);

    const fetchData = () => {
        let url = 'http://135.181.42.192/services/warehouse_item/';
        const params = [];
        if (searchTerm) {
            params.push(`name=${encodeURIComponent(searchTerm)}`);
        }
        if (warehouseSelected) {
            params.push(`warehouse=${encodeURIComponent(warehouseSelected)}`);
        }
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(item => ({
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

                const uniqueWarehouses = Array.from(new Set(data.map(item => item.warehouse.name)));
                setWarehouses(uniqueWarehouses);
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

    return (
        <div>
            <section>
                <div className='warehouseTable-title'>
                    <p>Anbar</p>
                    <div>
                        <button
                            className={`exportButton ${exportSelected ? 'selectedButton' : ''}`}
                            onClick={handleExportClick}
                        >
                            <BiExport /> İxrac
                        </button>
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
                    <div>
                        <button>
                            <span>Region:</span>
                            <span>Hamısı</span>
                            <FaChevronDown />
                        </button>
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
                                    <td>{`#${data.id.toString().padStart(4, '0')}`}</td>
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
