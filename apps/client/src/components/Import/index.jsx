import PropTypes from "prop-types";
import { useState } from "react";

import useRefreshToken from "../../common/refreshToken";

import "./import.css";

function Import({ onClose, warehouses, fetchData }) {
  const [activeWarehouse, setActiveWarehouse] = useState(warehouses && warehouses.length > 0 ? warehouses[0].id : null);

  const [formData, setFormData] = useState({
    equipment_name: "",
    brand: "",
    model: "",
    mac: "",
    port_number: "",
    serial_number: "",
    count: "",
    size_length: ""
  });

  const [errors, setErrors] = useState({
    equipment_name: "",
    count: "",
  });

  const refreshAccessToken = useRefreshToken();

  const validate = () => {
    const requiredFields = Object.keys(errors);
    const newErrors = {};

    requiredFields.forEach(key => {
      if (formData[key] === "") {
        newErrors[key] = "Bu sahəni doldurmalısınız";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    let accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        ...formData,
        port_number: formData.port_number === "" ? 0 : Number(formData.port_number),
        warehouse: activeWarehouse
      })
    };

    try {
      const response = await fetch("https://app.desgah.az/warehouse/warehouse-items/", requestOptions);

      if (!response.ok) {
        if (response.status === 403) {
          await refreshAccessToken();
          accessToken = localStorage.getItem("access_token");
          requestOptions.headers["Authorization"] = `Bearer ${accessToken}`;
          const retryResponse = await fetch("https://app.desgah.az/warehouse/warehouse-items/", requestOptions);
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! Status: ${retryResponse.status}`);
          }

          const retryData = await retryResponse.json();
          fetchData();
          onClose();
          return;
        }

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      fetchData();
      onClose();
    } catch (error) {
      console.error("Error importing item:", error);
      console.alert("An error occurred while importing the item. Please try again later.");
    }
  };

  const hasWarehouses = warehouses && warehouses.length > 0;


  return (
    <div className="import-modal">
      <div className="import-modal-content">
        <div className="import-modal-title">
          <h5>İdxal</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="importModal-warehouseName">
            {warehouses && warehouses.length > 0 ? (
              warehouses.map((warehouse, index) => (
                <button
                  key={index}
                  type="button"
                  className={activeWarehouse === warehouse.id ? "active" : ""}
                  onClick={() => setActiveWarehouse(warehouse.id)}
                >
                  {warehouse.name}
                </button>
              ))
            ) : (
              <p className="no-warehouse-message">Anbar yoxdur</p>
            )}
          </div>

          <div className="import-form">
            <label>
              Avadanlığın adı
              <input
                type="text"
                name="equipment_name"
                placeholder="Avadanlığın adı"
                value={formData.equipment_name}
                onChange={handleInputChange}
              />
              {errors.equipment_name && <span className="error-message">{errors.equipment_name}</span>}
            </label>
            <label>
              Marka
              <input type="text" name="brand" placeholder="Marka" value={formData.brand} onChange={handleInputChange} />
              {errors.brand && <span className="error-message">{errors.brand}</span>}
            </label>
            <label>
              Model
              <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} />
              {errors.model && <span className="error-message">{errors.model}</span>}
            </label>
            <label>
              Mac
              <input type="text" name="mac" placeholder="Mac" value={formData.mac} onChange={handleInputChange} />
            </label>
            <label>
              Port sayı
              <input
                type="number"
                name="port_number"
                placeholder="Port sayı"
                value={formData.port_number}
                onChange={handleInputChange}
                onKeyDown={evt => (evt.key === "e" || evt.key === "-") && evt.preventDefault()}
              />
            </label>
            <label>
              Seriya nömrəsi
              <input
                type="number"
                name="serial_number"
                placeholder="Seriya nömrəsi"
                value={formData.serial_number}
                onChange={handleInputChange}
                onKeyDown={evt => (evt.key === "e" || evt.key === "-") && evt.preventDefault()}
              />
            </label>
            <label>
              Sayı
              <input
                type="number"
                placeholder="Sayı"
                name="count"
                value={formData.count}
                onChange={handleInputChange}
                onKeyDown={evt => (evt.key === "e" || evt.key === "-") && evt.preventDefault()}
              />
              {errors.count && <span className="error-message">{errors.count}</span>}
            </label>
            <label>
              Ölçüsü
              <input
                type="number"
                step="0.01"
                name="size_length"
                placeholder="Ölçüsü"
                value={formData.size_length}
                onChange={handleInputChange}
                onKeyDown={evt => (evt.key === "e" || evt.key === "-") && evt.preventDefault()}
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">
            İdxal et
          </button>
          {!hasWarehouses && (
            <div className="error-message" style={{ marginTop: "10px", textAlign: "center", fontSize: '18px' }}>
              Zəhmət olmazsa anbar seçin!
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

Import.propTypes = {
  onClose: PropTypes.func.isRequired,
  warehouses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      region: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Import;
