import axios from "axios";
import React, { useEffect, useState } from "react";

import useRefreshToken from "../../common/refreshToken.js";

import "./addItemModal.css";

const AddItemModal = ({ onClose, selectedServices, taskId, onItemsAdded }) => {
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
  const [inputErrors, setInputErrors] = useState({});
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get("https://app.desgah.az/warehouse/warehouses/");
        setWarehouses(warehouseResponse.data);
        const itemResponse = await axios.get("https://app.desgah.az/warehouse/warehouse-items/");
        setItems(itemResponse.data);
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchData();
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDynamicInputChange = (index, field, serviceType, value) => {
    setWarehouseButtons(prevState => {
      const updated = prevState[serviceType].map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [field]: value
          };
        }
        return item;
      });
      return { ...prevState, [serviceType]: updated };
    });
    setInputErrors(prevErrors => ({ ...prevErrors, [`${serviceType}-${index}-${field}`]: "" }));
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
    const newErrors = {};

    const itemsToAdd = Object.keys(warehouseButtons)
      .flatMap(serviceType =>
        warehouseButtons[serviceType]
          .filter(item => item.item && item.count)
          .map(item => {
            const maxCount = items.find(i => i.id === parseInt(item.item, 10))?.count || 0;
            const count = parseInt(item.count, 10);

            if (!item.warehouse) {
              newErrors[`${serviceType}-${warehouseButtons[serviceType].indexOf(item)}-warehouse`] = "Anbar seçin.";
            }
            if (!item.item) {
              newErrors[`${serviceType}-${warehouseButtons[serviceType].indexOf(item)}-item`] = "Məhsul seçin.";
            }
            if (count > maxCount) {
              newErrors[`${serviceType}-${warehouseButtons[serviceType].indexOf(item)}-count`] =
                `Maksimum sayı ${maxCount} olmalıdır.`;
            }

            if (
              newErrors[`${serviceType}-${warehouseButtons[serviceType].indexOf(item)}-warehouse`] ||
              newErrors[`${serviceType}-${warehouseButtons[serviceType].indexOf(item)}-item`] ||
              newErrors[`${serviceType}-${warehouseButtons[serviceType].indexOf(item)}-count`]
            ) {
              return null;
            }

            return {
              task: taskId,
              item: item.item,
              count: count,
              is_tv: serviceType === "tv",
              is_internet: serviceType === "internet",
              is_voice: serviceType === "voice"
            };
          })
      )
      .filter(Boolean);

    if (itemsToAdd.length === 0 && Object.keys(newErrors).length === 0) {
      setInputErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length) {
      setInputErrors(newErrors);
      return;
    }

    console.log("Data to be sent:", itemsToAdd);

    try {
      const response = await axios.post("https://app.desgah.az/services/warehouse_changes/bulk_create/", itemsToAdd, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Items added successfully:", response.data);

      console.log(response.data);

      const addedItems = response.data.filter(
        item =>
          (selectedServices.tv && item.is_tv) ||
          (selectedServices.internet && item.is_internet) ||
          (selectedServices.voice && item.is_voice)
      );

      console.log("Filtered added items:", addedItems);

      onItemsAdded(addedItems);
      onClose();
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleSubmit(e, true);
      }
      console.error("Error adding items:", error);
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
                  {warehouseButtons[serviceType].map((warehouseButton, index) => {
                    const filteredItems = items.filter(
                      item => item.warehouse === parseInt(warehouseButton.warehouse, 10)
                    );
                    const maxCount = items.find(i => i.id === parseInt(warehouseButton.item, 10))?.count || 0;
                    return (
                      <div key={index} className="add-item-modal-dynamic-inputs">
                        <div className="input-container">
                          <div className="select-container">
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
                              disabled={!warehouseButton.warehouse}
                            >
                              <option value="">Məhsul seçin</option>
                              {filteredItems.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.equipment_name} - {item.count}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="input-group">
                            <input
                              type="number"
                              min="1"
                              className="add-item-modal-input-field"
                              value={warehouseButton.count}
                              onChange={e => handleDynamicInputChange(index, "count", serviceType, e.target.value)}
                              placeholder="Məhsul sayı"
                            />
                            <button
                              type="button"
                              className="add-item-modal-delete-button"
                              onClick={() => handleDeleteRow(index, serviceType)}
                            >
                              Sil
                            </button>
                          </div>
                        </div>

                        <div className="error-container">
                          {inputErrors[`${serviceType}-${index}-warehouse`] && (
                            <div className="error-message">{inputErrors[`${serviceType}-${index}-warehouse`]}</div>
                          )}
                          {inputErrors[`${serviceType}-${index}-item`] && (
                            <div className="error-message">{inputErrors[`${serviceType}-${index}-item`]}</div>
                          )}
                          {inputErrors[`${serviceType}-${index}-count`] && (
                            <div className="error-message">{inputErrors[`${serviceType}-${index}-count`]}</div>
                          )}
                        </div>

                        <div className="max-count-notice">Max count: {maxCount}</div>
                      </div>
                    );
                  })}
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
