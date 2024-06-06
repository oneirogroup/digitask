import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./import.css";

function Index({ onClose, warehouses }) {
    const [activeWarehouse, setActiveWarehouse] = useState(warehouses && warehouses.length > 0 ? warehouses[0] : null);

    const [formData, setFormData] = useState({
        equipment_name: '',
        brand: '',
        model: '',
        serial_number: '',
        number: '',
        size_length: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                warehouse: activeWarehouse
            })
        };
        fetch('http://135.181.42.192/services/import/', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('Item imported successfully:', data);
                onClose();
            })
            .catch(error => console.error('Error importing item:', error));
    };

    return (
        <div className="import-modal">
            <div className="import-modal-content">
                <div className='import-modal-title'>
                    <h5>İdxal</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="importModal-warehouseName">
                        {warehouses && warehouses.length > 0 && warehouses.map((warehouse, index) => (
                            <button
                                key={index}
                                className={activeWarehouse === warehouse.name ? "active" : ""}
                                onClick={() => setActiveWarehouse(warehouse.name)}
                            >
                                {warehouse.name}
                            </button>
                        ))}
                    </div>
                    <div className="import-form">
                        {["equipment_name", "brand", "model", "serial_number", "number", "size_length"].map((label, index) => (
                            <div key={index}>
                                <label htmlFor={label}>{label}</label>
                                <input type="text" id={label} name={label} value={formData[label]} onChange={handleInputChange} />
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="submit-btn">İdxal et</button>
                </form>
            </div>
        </div>
    );
}

Index.propTypes = {
    onClose: PropTypes.func.isRequired,
    warehouses: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        region: PropTypes.string.isRequired,
    })).isRequired,
};

export default Index;
