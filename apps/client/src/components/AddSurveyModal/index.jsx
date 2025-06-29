import { Select, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import useRefreshToken from "../../common/refreshToken";

import upload from "../../assets/images/document-upload.svg";
import "./addsurveymodal.css";

const AddSurveyModal = ({ onClose, selectedServices, taskId, onSurveyAdded }) => {
  const [surveyData, setSurveyData] = useState({
    tv: {
      photo_modem: null,
      photo_modem_preview: "",
      modem_SN: ""
    },
    internet: {
      photo_modem: null,
      photo_modem_preview: "",
      modem_SN: "",
      siqnal: "",
      internet_packs: ""
    },
    voice: {
      photo_modem: null,
      photo_modem_preview: "",
      modem_SN: "",
      home_number: "",
      password: ""
    }
  });

  const [internetPackages, setInternetPackages] = useState([]);

  useEffect(() => {
    axios
      .get("https://app.digitask.store/services/services/internet_packs/")
      .then(response => {
        setInternetPackages(response.data);
      })
      .catch(error => {
        console.error("Error fetching internet packages:", error);
      });
  }, []);

  const [openServices, setOpenServices] = useState({});

  const [existingSurveys, setExistingSurveys] = useState({});
  const [submittedServices, setSubmittedServices] = useState({});
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    const fetchExistingSurveys = async () => {
      try {
        const response = await axios.get(`https://app.digitask.store/services/task/${taskId}/`);
        const data = response.data;
        setExistingSurveys({
          tv: data.tv || false,
          internet: data.internet || false,
          voice: data.voice || false
        });
        fetchExistingSurveys();
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchExistingSurveys();
        }
      }
    };
  }, [taskId, refreshAccessToken()]);

  useEffect(() => {
    const hasActiveStatus = Object.keys(openServices).some(serviceType => openServices[serviceType]);
    const serviceList = document.querySelector(".service-list");
    if (serviceList) {
      serviceList.classList.toggle("column-layout", hasActiveStatus);
    }
  }, [openServices]);

  const handleInputChange = e => {
    const { name, files, value, dataset } = e.target;
    const { service } = dataset;

    if (!surveyData[service]) {
      console.error(`Service data for ${service} is not initialized.`);
      return;
    }

    const file = files ? files[0] : null;
    setSurveyData(prevData => {
      const updatedServiceData = {
        ...prevData[service],
        [name]: file || value,
        ...(file ? { photo_modem_preview: URL.createObjectURL(file) } : {})
      };
      return {
        ...prevData,
        [service]: updatedServiceData
      };
    });
  };

  const handleServiceToggle = type => {
    setOpenServices(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSelectChange = value => {
    setSurveyData(prevData => ({
      ...prevData,
      internet: {
        ...prevData.internet,
        internet_packs: value
      }
    }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    try {
      const surveyPromises = Object.keys(selectedServices).map(async serviceType => {
        if (!selectedServices[serviceType] || existingSurveys[serviceType] || submittedServices[serviceType]) return;

        const serviceData = surveyData[serviceType];
        if (!serviceData || !Object.values(serviceData).some(value => value !== "" && value !== null)) {
          return;
        }

        const url = `https://app.digitask.store/services/create_${serviceType}/`;

        const formData = new FormData();
        formData.append("task", taskId);

        Object.keys(serviceData).forEach(key => {
          if (serviceData[key] !== "" && serviceData[key] !== null) {
            formData.append(key, serviceData[key]);
          }
        });

        try {
          const response = await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          onSurveyAdded(serviceType, response.data);

          setSubmittedServices(prev => ({
            ...prev,
            [serviceType]: true
          }));
        } catch (error) {
          if (error.status == 403) {
            await refreshAccessToken();
            handleFormSubmit();
          }
          console.error(`Error adding survey forrr ${serviceType}:`, error);
        }
      });

      await Promise.all(surveyPromises);
      onClose();
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleFormSubmit();
      }
      console.error("Error adding surveys:", error);
    }
  };

  const serviceDisplayNames = {
    tv: "Tv",
    internet: "İnternet",
    voice: "Səs"
  };

  return (
    <div className="add-survey-modal">
      <div className="add-survey-modal-content">
        <div className="addSurveyModal-header">
          <h5>Xidmət növü</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <p className="service-text">Hansı anketi doldurursunuz?</p>

        <div className="addSurveyModal-body">
          <form onSubmit={handleFormSubmit}>
            <div className="service-list">
              {Object.keys(selectedServices).map(
                serviceType =>
                  selectedServices[serviceType] &&
                  !existingSurveys[serviceType] && (
                    <div
                      key={serviceType}
                      className={`service-section ${openServices[serviceType] ? "active-status" : ""}`}
                    >
                      {!openServices[serviceType] && !submittedServices[serviceType] && (
                        <div onClick={() => handleServiceToggle(serviceType)} className="service-header">
                          <h6>
                            {serviceDisplayNames[serviceType] ||
                              serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
                          </h6>
                        </div>
                      )}
                      {openServices[serviceType] && (
                        <div className="service-fields">
                          {serviceType === "tv" && (
                            <>
                              <h2>Tv servisi</h2>
                              <br />
                              <div>
                                <div className="form-group">
                                  <label>Modemin arxa şəkli:</label>
                                  <div className="upload-container">
                                    {!surveyData.tv.photo_modem_preview ? (
                                      <label htmlFor="photo_modem_tv" className="upload-label-service">
                                        <span>
                                          Yükləmək üçün klikləyin
                                          <span className="file-size">(Maksimum fayl ölçüsü: 25 MB)</span>
                                        </span>
                                        <div className="upload-icon">
                                          <img src={upload} alt="" />
                                        </div>
                                      </label>
                                    ) : (
                                      <img
                                        src={surveyData.tv.photo_modem_preview}
                                        alt="Preview"
                                        className="image-preview"
                                      />
                                    )}
                                    <input
                                      type="file"
                                      id="photo_modem_tv"
                                      accept="image/*"
                                      data-service="tv"
                                      name="photo_modem"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                                <hr />
                              </div>
                              <div>
                                <div>
                                  <div className="form-group">
                                    <label>Modem S/N:</label>
                                    <input
                                      type="text"
                                      name="modem_SN"
                                      value={surveyData.tv.modem_SN}
                                      data-service="tv"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  <hr />
                                </div>
                              </div>
                            </>
                          )}

                          {serviceType === "internet" && (
                            <>
                              <h2>İnternet servisi</h2>
                              <br />
                              <div>
                                <div className="form-group">
                                  <label>Modemin arxa şəkli:</label>
                                  <div className="upload-container">
                                    {!surveyData.internet.photo_modem_preview ? (
                                      <label htmlFor="photo_modem_internet" className="upload-label">
                                        <span>
                                          Yükləmək üçün klikləyin
                                          <span className="file-size">(Maksimum fayl ölçüsü: 25 MB)</span>
                                        </span>
                                        <div className="upload-icon">
                                          <img src={upload} alt="" />
                                        </div>
                                      </label>
                                    ) : (
                                      <img
                                        src={surveyData.internet.photo_modem_preview}
                                        alt="Preview"
                                        className="image-preview"
                                      />
                                    )}
                                    <input
                                      type="file"
                                      id="photo_modem_internet"
                                      accept="image/*"
                                      data-service="internet"
                                      name="photo_modem"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                                <hr />
                              </div>
                              <div>
                                <div>
                                  <div className="form-group">
                                    <label>Modem seriya nömrəsi:</label>
                                    <input
                                      type="text"
                                      name="modem_SN"
                                      value={surveyData.internet.modem_SN}
                                      data-service="internet"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  <hr />
                                </div>
                                <div>
                                  <div className="form-group">
                                    <label>Splitter portu:</label>
                                    <input
                                      type="text"
                                      name="splitter_port"
                                      value={surveyData.internet.splitter_port}
                                      data-service="internet"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  <hr />
                                </div>
                                <div>
                                  <div className="form-group">
                                    <label>Siqnal:</label>
                                    <input
                                      type="text"
                                      name="siqnal"
                                      value={surveyData.internet.siqnal}
                                      data-service="internet"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  <hr />
                                </div>
                                <div>
                                  <div className="form-group">
                                    <label>İnternet tarifi:</label>
                                    <Space wrap>
                                      <Select
                                        name="internet_packs"
                                        style={{ width: 120 }}
                                        onChange={handleSelectChange}
                                        options={internetPackages.map(pack => ({
                                          value: pack.id,
                                          label: pack.name
                                        }))}
                                      />
                                    </Space>
                                  </div>
                                  <hr />
                                </div>
                              </div>
                            </>
                          )}

                          {serviceType === "voice" && (
                            <>
                              <h2>Səs servisi</h2>
                              <br />
                              <div>
                                <div className="form-group">
                                  <label>Modemin arxa şəkli:</label>
                                  <div className="upload-container">
                                    {!surveyData.voice.photo_modem_preview ? (
                                      <label htmlFor="photo_modem_voice" className="upload-label">
                                        <span>
                                          Yükləmək üçün klikləyin
                                          <span className="file-size">(Maksimum fayl ölçüsü: 25 MB)</span>
                                        </span>
                                        <div className="upload-icon">
                                          <img src={upload} alt="" />
                                        </div>
                                      </label>
                                    ) : (
                                      <img
                                        src={surveyData.voice.photo_modem_preview}
                                        alt="Preview"
                                        className="image-preview"
                                      />
                                    )}
                                    <input
                                      type="file"
                                      id="photo_modem_voice"
                                      accept="image/*"
                                      data-service="voice"
                                      name="photo_modem"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                                <hr />
                              </div>
                              <div>
                                <div>
                                  <div className="form-group">
                                    <label>Modem seriya nömrəsi:</label>
                                    <input
                                      type="text"
                                      name="modem_SN"
                                      value={surveyData.voice.modem_SN}
                                      data-service="voice"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  <hr />
                                </div>
                                <div>
                                  <div className="form-group">
                                    <label>Ev nömrəsi:</label>
                                    <input
                                      type="text"
                                      name="home_number"
                                      value={surveyData.voice.home_number}
                                      data-service="voice"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  <hr />
                                </div>
                                <div>
                                  <div className="form-group">
                                    <label>Şifrə:</label>
                                    <input
                                      type="text"
                                      name="password"
                                      value={surveyData.voice.password}
                                      data-service="voice"
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                  <hr />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>

            <div className="modal-footer">
              <button type="submit">Əlavə et</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSurveyModal;
