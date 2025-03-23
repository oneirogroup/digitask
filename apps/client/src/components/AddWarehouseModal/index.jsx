import axios from "axios";
import { useState } from "react";

import useRefreshToken from "../../common/refreshToken";

import "./AddWarehouseModal.css";

const AddWarehouseModal = ({ onClose, onWarehouseAdded }) => {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [nameError, setNameError] = useState("");
  const [regionError, setRegionError] = useState("");
  const refreshAccessToken = useRefreshToken();

  const handleSubmit = async e => {
    e.preventDefault();

    setNameError("");
    setRegionError("");

    if (!name) {
      setNameError("Ad boş olmamalıdır.");
    }
    if (!region) {
      setRegionError("Region boş olmamalıdır.");
    }

    if (!name || !region) {
      return;
    }

    try {
      const response = await axios.post("https://app.desgah.az/warehouse/warehouses/", { name, region });

      onWarehouseAdded(response.data);
      onClose();
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleSubmit(e, true);
      }
      console.error("Error adding group:", error);
    }
  };

  return (
    <div className="group-modal-overlay">
      <div className="add-group-modal-content">
        <div className="add-group-modal-title">
          <h5>Yeni anbar</h5>
          <span onClick={onClose}>&times;</span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <div className="form-group">
              <label htmlFor="groupName">Ad</label>
              <input type="text" id="groupName" value={name} onChange={e => setName(e.target.value)} maxLength={30} />
              {nameError && <span className="error-message">{nameError}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="groupRegion">Region</label>
              <input type="text" id="groupRegion" value={region} onChange={e => setRegion(e.target.value)} />
              {regionError && <span className="error-message">{regionError}</span>}
            </div>
          </div>
          <button type="submit">Anbar əlavə et</button>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouseModal;
