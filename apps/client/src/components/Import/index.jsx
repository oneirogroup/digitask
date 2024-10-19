import { useState } from 'react';
import PropTypes from 'prop-types';
import "./import.css";

function Import({ onClose, warehouses }) {
    const [activeWarehouse, setActiveWarehouse] = useState(warehouses && warehouses.length > 0 ? warehouses[0].id : null);

    const [formData, setFormData] = useState({
        equipment_name: '',
        brand: '',
        model: '',
        mac: '',
        port_number: '',
        serial_number: '',
        number: '',
        size_length: ''
    });

    const [errors, setErrors] = useState({
        equipment_name: '',
        brand: '',
        model: '',
        mac: '',
        port_number: '',
        serial_number: '',
        number: '',
        size_length: '',
    });

    const validate = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] === '') {
                newErrors[key] = 'Bu sahəni doldurmalısınız';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            console.error('Access token is missing');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
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
                                type="button"
                                className={activeWarehouse === warehouse.id ? "active" : ""}
                                onClick={() => setActiveWarehouse(warehouse.id)}
                            >
                                {warehouse.name}
                            </button>
                        ))}
                    </div>
                    <div className="import-form">
                        <label>
                            Avadanlığın adı
                            <input
                                type="text"
                                name="equipment_name"
                                placeholder='Avadanlığın adı'
                                value={formData.equipment_name}
                                onChange={handleInputChange}
                            />
                            {errors.equipment_name && <span className="error-message">{errors.equipment_name}</span>}
                        </label>
                        <label>
                            Marka
                            <input
                                type="text"
                                name="brand"
                                placeholder='Marka'
                                value={formData.brand}
                                onChange={handleInputChange}
                            />
                            {errors.brand && <span className="error-message">{errors.brand}</span>}
                        </label>
                        <label>
                            Model
                            <input
                                type="text"
                                name="model"
                                placeholder='Model'
                                value={formData.model}
                                onChange={handleInputChange}
                            />
                            {errors.model && <span className="error-message">{errors.model}</span>}
                        </label>
                        <label>
                            Mac
                            <input
                                type="text"
                                name="mac"
                                placeholder='Mac'
                                value={formData.mac}
                                onChange={handleInputChange}
                            />
                            {errors.mac && <span className="error-message">{errors.mac}</span>}
                        </label>
                        <label>
                            Port sayı
                            <input
                                type="number"
                                name="port_number"
                                placeholder='Port sayı'
                                value={formData.port_number}
                                onChange={handleInputChange}
                            />
                            {errors.port_number && <span className="error-message">{errors.port_number}</span>}
                        </label>
                        <label>
                            Seriya nömrəsi
                            <input
                                type="number"
                                name="serial_number"
                                placeholder='Seriya nömrəsi'
                                value={formData.serial_number}
                                onChange={handleInputChange}
                            />
                            {errors.serial_number && <span className="error-message">{errors.serial_number}</span>}
                        </label>
                        <label>
                            Sayı
                            <input
                                type="number"
                                placeholder='Sayı'
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                            />
                            {errors.number && <span className="error-message">{errors.number}</span>}
                        </label>
                        <label>
                            Ölçüsü
                            <input
                                type="number"
                                step="0.01"
                                name="size_length"
                                placeholder='Ölçüsü'
                                value={formData.size_length}
                                onChange={handleInputChange}
                            />
                            {errors.size_length && <span className="error-message">{errors.size_length}</span>}
                        </label>
                    </div>
                    <button type="submit" className="submit-btn">İdxal et</button>
                </form>
            </div>
        </div>
    );
}

Import.propTypes = {
    onClose: PropTypes.func.isRequired,
    warehouses: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        region: PropTypes.string.isRequired
    })).isRequired,
};

export default Import;
