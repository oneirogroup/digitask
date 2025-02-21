import axios from "axios";
import React, { useState } from "react";

import useRefreshToken from "../../common/refreshToken";

import "./addgroup.css";

const AddGroupModal = ({ onClose, onGroupAdded }) => {
  const [group, setGroup] = useState("");
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState({});
  const refreshAccessToken = useRefreshToken();

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = {};
    if (!group.trim()) newErrors.group = "Qrup adı boş ola bilməz.";
    if (!region.trim()) newErrors.region = "Region boş ola bilməz.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://37.61.77.5/services/create_employee_group", { group, region });

      onGroupAdded(response.data);
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
          <h5>Yeni qrup</h5>
          <span onClick={onClose}>&times;</span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <div className="form-group">
              <label htmlFor="groupName">Ad</label>
              <input
                type="text"
                id="groupName"
                value={group}
                onChange={e => {
                  setGroup(e.target.value);
                  if (errors.group) setErrors(prev => ({ ...prev, group: "" }));
                }}
                maxLength={30}
              />
              {errors.group && <p className="error-message">{errors.group}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="groupRegion">Region</label>
              <input
                type="text"
                id="groupRegion"
                value={region}
                onChange={e => {
                  setRegion(e.target.value);
                  if (errors.region) setErrors(prev => ({ ...prev, region: "" }));
                }}
                maxLength={30}
              />
              {errors.region && <p className="error-message">{errors.region}</p>}
            </div>
          </div>
          <button type="submit">Qrup əlavə et</button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;
