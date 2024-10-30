import axios from "axios";
import React, { useEffect, useState } from "react";

import "./addItemModal.css";

const AddItemModal = ({ onClose, selectedServices, taskId }) => {
  const [warehouseButtons, setWarehouseButtons] = useState({
    tv: [{ warehouse: "", item: "", count: "" }],
    internet: [{ warehouse: "", item: "", count: "" }],
    voice: [{ warehouse: "", item: "", count: "" }]
  });

  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);

  const [activeServices, setActiveServices] = useState({
    tv: false,
    internet: false,
    voice: false
  });

  const [isServiceSelected, setIsServiceSelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get("http://135.181.42.192/warehouse/warehouses/");
        setWarehouses(warehouseResponse.data);

        const itemResponse = await axios.get("http://135.181.42.192/warehouse/warehouse-items/");
        setItems(itemResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDynamicInputChange = (index, field, serviceType, value) => {
    setWarehouseButtons(prevState => ({
      ...prevState,
      [serviceType]: prevState[serviceType].map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    }));
  };

  const handleAddRow = serviceType => {
    setWarehouseButtons(prevState => ({
      ...prevState,
      [serviceType]: [...prevState[serviceType], { warehouse: "", item: "", count: "" }]
    }));
  };

  const handleDeleteRow = (index, serviceType) => {
    setWarehouseButtons(prevState => ({
      ...prevState,
      [serviceType]: prevState[serviceType].filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const itemsToAdd = Object.keys(warehouseButtons).flatMap(serviceType =>
      warehouseButtons[serviceType]
        .filter(item => item.item && item.count)
        .map(item => ({
          task: taskId,
          item: item.item,
          count: item.count,
          delivery_note: `Item added for ${serviceType}`,
          is_tv: serviceType === "tv",
          is_internet: serviceType === "internet",
          is_voice: serviceType === "voice"
        }))
    );

    try {
      const response = await axios.post("http://135.181.42.192/services/warehouse_changes/bulk_create/", itemsToAdd, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Items added successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error adding items:", error);
      alert("Failed to add items. Please try again.");
    }
  };

  const toggleService = service => {
    setActiveServices(prev => ({ ...prev, [service]: true }));
    setIsServiceSelected(true);
  };

  return (
    <div className="add-item-modal-overlay">
      <div className="add-item-modal-container">
        <div className="add-item-modal-header">
          <h2 className="add-item-modal-title">Məhsul istifadəsi</h2>
          <button className="add-item-modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        {!isServiceSelected && <p>Hansı anketi doldurursunuz?</p>}
        <div className="add-item-modal-service-selection">
          {!activeServices.tv && selectedServices.tv && (
            <button className="add-item-modal-service-button" onClick={() => toggleService("tv")}>
              Tv
            </button>
          )}
          {!activeServices.internet && selectedServices.internet && (
            <button className="add-item-modal-service-button" onClick={() => toggleService("internet")}>
              İnternet
            </button>
          )}
          {!activeServices.voice && selectedServices.voice && (
            <button className="add-item-modal-service-button" onClick={() => toggleService("voice")}>
              Səs
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          {Object.keys(warehouseButtons).map(
            serviceType =>
              activeServices[serviceType] &&
              selectedServices[serviceType] && (
                <div key={serviceType} className="add-item-modal-service-section">
                  <h3>{serviceType === "tv" ? "Tv" : serviceType === "internet" ? "İnternet" : "Səs"}</h3>
                  {warehouseButtons[serviceType].map((warehouseButton, index) => (
                    <div key={index} className="add-item-modal-dynamic-inputs">
                      <select
                        className="add-item-modal-input-field"
                        value={warehouseButton.warehouse}
                        onChange={e => handleDynamicInputChange(index, "warehouse", serviceType, e.target.value)}
                      >
                        <option value="">Anbar seçin</option>
                        {warehouses.map(warehouse => (
                          <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </option>
                        ))}
                      </select>
                      <select
                        className="add-item-modal-input-field"
                        value={warehouseButton.item}
                        onChange={e => handleDynamicInputChange(index, "item", serviceType, e.target.value)}
                      >
                        <option value="">Məhsul seçin</option>
                        {items.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.equipment_name} - {item.count}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Say"
                        className="add-item-modal-input-field"
                        value={warehouseButton.count}
                        onChange={e => handleDynamicInputChange(index, "count", serviceType, e.target.value)}
                      />
                      <button
                        type="button"
                        className="add-item-modal-delete-button"
                        onClick={() => handleDeleteRow(index, serviceType)}
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-item-modal-add-row-button"
                    onClick={() => handleAddRow(serviceType)}
                  >
                    Məhsul əlavə et
                  </button>
                </div>
              )
          )}
          <button type="submit" className="add-item-modal-submit-button">
            Göndər
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
