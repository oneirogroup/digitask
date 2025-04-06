import { Select, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import useRefreshToken from "../../common/refreshToken";

function UpdateInternetModal({ onClose, serviceId, serviceData, onServiceUpdate, fetchTaskData }) {
  const [formData, setFormData] = useState(serviceData || {});
  const [preview, setPreview] = useState(serviceData?.photo_modem || "");
  const [error, setError] = useState("");
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    if (serviceData?.photo_modem) {
      setPreview(serviceData.photo_modem);
    }
  }, [serviceData]);

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: file
        }));
        setPreview(URL.createObjectURL(file));
        setError("");
      } else {
        setError("Yalnız şəkil faylları yüklənə bilər.");
      }
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const [internetPackages, setInternetPackages] = useState([]);

  useEffect(() => {
    axios
      .get("https://app.desgah.az/services/services/internet_packs/")
      .then(response => {
        setInternetPackages(response.data);
      })
      .catch(error => {
        console.error("Error fetching internet packages:", error);
      });
  }, []);

  const handleSelectChange = value => {
    setFormData(prevData => ({
      ...prevData,
      internet_packs: value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const data = new FormData();
    data.append("modem_SN", formData.modem_SN || "");
    data.append("splitter_port", formData.splitter_port || "");
    data.append("siqnal", formData.siqnal || "");
    data.append("internet_packs", formData.internet_packs || "");

    if (formData.photo_modem instanceof File) {
      data.append("photo_modem", formData.photo_modem);
    }

    fetch(`https://app.desgah.az/services/update_internet/${serviceId}/`, {
      method: "PATCH",
      body: data
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            setError(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
          });
        }
        fetchTaskData();
        return response.json();
      })
      .then(updatedData => {
        onServiceUpdate("internet", updatedData);
        setFormData(prevData => ({
          ...prevData,
          ...updatedData
        }));
        onClose();
      })
      .catch(async error => {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchTaskData();

          handleSubmit();
        }
      });
  };

  useEffect(() => {
    if (serviceData?.internet_packs) {
      setFormData(prevData => ({
        ...prevData,
        internet_packs: serviceData.internet_packs
      }));
    }
  }, [serviceData]);

  return (
    <div className="taskType-modal">
      <div className="taskType-modal-content">
        <div className="taskType-modal-title">
          <h2>Internet məlumatlarının dəyişdirilməsi</h2>
          <div>
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
        </div>
        <div className="addSurveyModal-body">
          <form onSubmit={handleSubmit} className="details-modal-body">
            <div className="service-fields service-update">
              <div className="form-group">
                <label className="upload-label">Modemin şəkli:</label>
                <div className="upload-icon">
                  <input type="file" name="photo_modem" onChange={handleInputChange} />
                </div>
                {preview && <img src={preview} alt="Preview" className="image-preview" />}
              </div>
              <div className="update-fields">
                <div className="form-group">
                  <label>Modem Serial Nömrəsi:</label>
                  <input type="text" name="modem_SN" value={formData.modem_SN || ""} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Splitter port:</label>
                  <input
                    type="text"
                    name="splitter_port"
                    value={formData.splitter_port || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Siqnal:</label>
                  <input type="text" name="siqnal" value={formData.siqnal || ""} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>İnternet tarifi:</label>
                  <Space wrap>
                    <Space wrap>
                      <Select
                        name="internet_packs"
                        style={{ width: 120 }}
                        onChange={handleSelectChange}
                        value={formData.internet_packs || undefined}
                        options={internetPackages.map(pack => ({
                          value: pack.id,
                          label: pack.name
                        }))}
                      />
                    </Space>
                  </Space>
                </div>
              </div>
              <hr />
            </div>
            <button type="submit">Yenilə</button>
          </form>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default UpdateInternetModal;
