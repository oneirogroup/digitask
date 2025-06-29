import axios from "axios";
import az from "date-fns/locale/az";
import { useCallback, useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { FaChevronDown } from "react-icons/fa";
import { PiTelevisionSimpleLight } from "react-icons/pi";
import { RiVoiceprintFill } from "react-icons/ri";
import { TfiWorld } from "react-icons/tfi";
/////////////////////////////////////////////////////////////////////////start
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import MapFlyTo from "../MapFlyTo";
import { debounce } from 'lodash';

import useRefreshToken from "../../common/refreshToken";

import upload from "../../assets/images/document-upload.svg";
import "./addTask.css";
import "leaflet/dist/leaflet.css";

registerLocale("az", az);

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: e => {
      onClick(e.latlng);
    }
  });
  return null;
}
/////////////////////////////////////////////////////////////////////////end

const CreateTaskModal = ({ onClose, onTaskCreated }) => {
  const [activeFilter, setActiveFilter] = useState("connection");
  const [formData, setFormData] = useState({
    full_name: "",
    registration_number: "",
    contact_number: "",
    location: "",
    date: "",
    end_date: "",
    note: "",
    is_voice: false,
    is_internet: false,
    is_tv: false,
    task_type: "",
    group: [],
    latitude: null,
    longitude: null,
    passport: ""
  });
  const [groups, setGroups] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchGroups = async (isRetry = false) => {
    try {
      const response = await axios.get("https://app.digitask.store/services/user_groups/");
      setGroups(response.data);
    } catch (error) {
      if (error.status === 403 && !isRetry) {
        await refreshAccessToken();
        fetchGroups(true);
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "contact_number" || name == "registration_number") {
      const filteredValue = value.replace(/[^0-9()+\s]/g, "");

      setFormData(prevState => ({
        ...prevState,
        [name]: filteredValue
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = e => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleTaskTypeChange = type => {
    setActiveFilter(type);
    setFormData(prevState => ({
      ...prevState,
      task_type: type
    }));
  };

  const handleSelectDate = date => {
    if (date && date instanceof Date && !isNaN(date.getTime())) {
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      setFormData(prevState => ({
        ...prevState,
        date: formattedDate
      }));
    } else {
      console.error("Invalid date selected:", date);
    }
  };

  const handleSelectEndDate = end_date => {
    if (end_date && end_date instanceof Date && !isNaN(end_date.getTime())) {
      const formattedEndDate = `${end_date.getFullYear()}-${String(end_date.getMonth() + 1).padStart(2, "0")}-${String(end_date.getDate()).padStart(2, "0")}`;
      setFormData(prevState => ({
        ...prevState,
        end_date: formattedEndDate
      }));
    } else {
      console.error("Invalid date selected:", end_date);
    }
  };

  const [errorText, setErrorText] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Müştəri adını daxil edin!";
    if (!formData.date) newErrors.date = "tarixi";
    if (!formData.end_date) newErrors.end_date = "tarixi";
    if (!formData.registration_number) newErrors.registration_number = "Qeydiyyat nömrəsi daxil edin!";
    if (!formData.location) newErrors.location = "Ünvanı daxil edin!";
    if (!formData.is_tv && !formData.is_internet && !formData.is_voice)
      newErrors.service = "Tv, internet və ya səs xidmətini seçin!";
    if (formData.group.length === 0) newErrors.group = "Qrup seçin!";

    const errorMessages = [newErrors.date, newErrors.end_date].filter(Boolean);

    let errorText = "";
    if (errorMessages.length > 0) {
      if (errorMessages.length === 1) {
        errorText = errorMessages[0];
      } else if (errorMessages.length === 2) {
        errorText = errorMessages.join(" və ");
      } else {
        const lastMessage = errorMessages.pop();
        errorText = `${errorMessages.join(", ")} və ${lastMessage}`;
      }
    }

    return {
      newErrors,
      errorText
    };
  };

  const [backendErrors, setBackendErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGroupSelect = groupId => {
    setFormData(prevState => {
      const updatedGroups = prevState.group.includes(groupId)
        ? prevState.group.filter(id => id !== groupId)
        : [...prevState.group, groupId];
      return { ...prevState, group: updatedGroups.map(Number) };
    });
  };

  const renderGroups = () => {
    return groups.map(group => (
      <div key={group.id} className="dropdown-task-item" onClick={() => handleGroupSelect(group.id)}>
        <input
          type="checkbox"
          id={`group-${group.id}`}
          checked={formData.group.map(Number).includes(group.id)}
          onChange={() => handleGroupSelect(group.id)}
        />
        {group.group}
      </div>
    ));
  };

  const handleSubmit = async (e, retry = false) => {
    e.preventDefault();
    console.log("Form Data: ", formData.group);

    if (isSubmitting) return;
    setIsSubmitting(true);

    const { newErrors, errorText } = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorText(errorText);
      setIsSubmitting(false);
      return;
    }

    try {
      const task_type = activeFilter === "connection" ? "connection" : "problem";

      const payload = {
        full_name: formData.full_name,
        registration_number: formData.registration_number,
        contact_number: formData.contact_number,
        location: formData.location,
        date: formData.date,
        end_date: formData.end_date,
        note: formData.note,
        is_voice: formData.is_voice,
        is_internet: formData.is_internet,
        is_tv: formData.is_tv,
        task_type: task_type,
        group: formData.group,
        latitude: formData.latitude,
        longitude: formData.longitude,
        passport: imageFile ? imageFile : ""
      };

      const response = await axios.post("https://app.digitask.store/services/create_task/", payload, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 201) {
        onTaskCreated(response.data);
        onClose();
      } else {
        const backendErrors = response.data.errors;

        if (backendErrors && typeof backendErrors === "object") {
          const errorMessages = Object.entries(backendErrors).map(([field, messages]) => {
            return `${field}: ${messages.join(", ")}`;
          });
          setBackendErrors(errorMessages);
        }
      }
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleSubmit(e, true);
        if (isSubmitting) return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [position, setPosition] = useState({ lat: "", lng: "" });
  // Customer marker icon definition
  const customerIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=CwAOuD64vULU&format=png&color=000000",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const [marker, setMarker] = useState(null);
  const [isValidLink, setIsValidLink] = useState(null);
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const [mapLinkError, setMapLinkError] = useState("");

  const handleMapClick = latlng => {
    setFormData(prevState => ({
      ...prevState,
      latitude: latlng.lat,
      longitude: latlng.lng
    }));

    updateMapMarker(latlng.lat, latlng.lng);
  };

  function extractCoordinatesFromUrl(url) {
    if (!url) return null;

    try {
      url = url.trim();

      const patterns = [
        /@(-?\d+\.\d+),(-?\d+\.\d+)/,
        /q=(-?\d+\.\d+),(-?\d+\.\d+)/,
        /place\/(-?\d+\.\d+),(-?\d+\.\d+)/,
        /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
        /center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/
      ];

      for (const regex of patterns) {
        const match = url.match(regex);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);

          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return {
              latitude: lat,
              longitude: lng
            };
          }
        }
      }

      if (url.includes("maps.app.goo.gl") ||
        url.includes("goo.gl/maps") ||
        url.includes("maps.google.com/") ||
        url.includes("maps.google.") ||
        url.includes("google.com/maps")) {
        return { isShortened: true, url };
      }

      return null;
    } catch (error) {
      console.error("Error parsing URL:", error);
      return null;
    }
  }

  const updateMapMarker = (lat, lng) => {
    const mapInstance = mapRef.current;

    if (marker) {
      mapInstance.removeLayer(marker);
      setMarker(null); // marker'ı da sıfırla
    }

    if (mapInstance && lat && lng) {
      const newMarker = L.marker([lat, lng], { icon: customerIcon }).addTo(mapInstance);
      setMarker(newMarker);
      mapInstance.setView([lat, lng], 15);
      setIsValidLink(true);
      setMapLinkError("");
    }
  };

  const handleMapLink = async (url) => {
    setIsValidLink(null);
    setMapLinkError("");

    if (!url || url.trim() === "") {
      setIsValidLink(null);
      return;
    }

    setIsProcessingLink(true);

    try {
      const directCoords = extractCoordinatesFromUrl(url);

      if (directCoords && !directCoords.isShortened) {
        setFormData(prevState => ({
          ...prevState,
          latitude: directCoords.latitude,
          longitude: directCoords.longitude
        }));
        updateMapMarker(directCoords.latitude, directCoords.longitude);
        setIsValidLink(true);
        setMapLinkError("");
        setIsProcessingLink(false);
        return;
      }
      const response = await fetch(`https://app.digitask.store/services/resolve-map-url/?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.latitude && data.longitude) {
        console.log("Coordinates received:", data.latitude, data.longitude);
        setFormData(prevState => ({
          ...prevState,
          latitude: data.latitude,
          longitude: data.longitude
        }));
        updateMapMarker(data.latitude, data.longitude);
        setIsValidLink(true);
        setMapLinkError("");
      } else if (data.error) {
        console.error("Coordinates not found in response:", data);
        setIsValidLink(false);
        setMapLinkError(data.error || "Geçersiz harita bağlantısı");
      } else {
        setIsValidLink(false);
        setMapLinkError("Harita koordinatları alınamadı");
      }

    } catch (error) {
      console.error("General error in handleMapLink:", error);
      setIsValidLink(false);
      setMapLinkError("Harita bağlantısı işlenirken bir hata oluştu");
    } finally {
      setIsProcessingLink(false);
    }
  };

  const debouncedHandleMapLink = useCallback(
    debounce((url) => {
      if (url) handleMapLink(url);
    }, 500),
    []
  );

  const handleChangeMapLink = (event) => {
    const { value } = event.target;

    setFormData(prevState => ({
      ...prevState,
      location_link: value
    }));


    setFormData(prevState => ({
      ...prevState,
      location_link: value,
      latitude: null,
      longitude: null
    }));

    if (value.trim() === "") {
      setIsValidLink(null);
      setMapLinkError("");
      return;
    }

    setIsProcessingLink(true);
    debouncedHandleMapLink(value);
  };

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleInputChange = event => {
    const file = event.target.files[0];

    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="task-modal">
      <div className="task-modal-content">
        <div className="task-modal-title">
          <h5>Yeni tapşırıq</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <div className="taskModal-taskType">
          <button
            type="button"
            className={activeFilter === "connection" ? "activeButton" : ""}
            onClick={() => handleTaskTypeChange("connection")}
          >
            Qoşulma
          </button>
          <button
            type="button"
            className={activeFilter === "problem" ? "activeButton" : ""}
            onClick={() => handleTaskTypeChange("problem")}
          >
            Problem
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="task-name-date">
            <div className="form-group">
              <label htmlFor="full_name">Müştərinin ad və soyadı:</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="form-control"
              />
              {errors.full_name && <span className="error-message">{errors.full_name}</span>}
            </div>
            <div className="form-group">
              <div className="task-date-form">
                <div className="">
                  <label htmlFor="date">Başlama tarixi:</label>
                  <DatePicker
                    selected={formData.date}
                    id="date"
                    name="date"
                    onChange={handleSelectDate}
                    locale="az"
                    placeholderText="gün/ay/il"
                    dateFormat="dd.MM.yyyy"
                    minDate={new Date()}
                  />
                </div>
                <div className="">
                  <label htmlFor="end_date">Bitmə tarixi:</label>
                  <DatePicker
                    selected={formData.end_date}
                    id="end_date"
                    name="end_date"
                    onChange={handleSelectEndDate}
                    locale="az"
                    placeholderText="gün/ay/il"
                    dateFormat="dd.MM.yyyy"
                    minDate={new Date()}
                  />
                </div>
              </div>
              {errorText && <span className="capitalize-first-letter error-message">{errorText} daxil edin!</span>}
            </div>
          </div>
          <div className="registerNumber-contactNumber">
            <div className="form-group">
              <label htmlFor="registration_number">Qeydiyyat nömrəsi:</label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                className="form-control"
              />
              {errors.registration_number && <span className="error-message">{errors.registration_number}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="contact_number">Əlaqə nömrəsi:</label>
              <input
                type="text"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="form-control"
                maxLength={15}
              />
              {errors.contact_number && <span className="error-message">{errors.contact_number}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="location">Ünvan:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
          <div className="taskService-taskGroup">
            <div className="form-group">
              <div className="tv-voice-internet">
                <label htmlFor="tv" className={`form-group ${formData.is_tv ? "activeTask" : ""}`}>
                  <input
                    type="checkbox"
                    id="tv"
                    name="is_tv"
                    checked={formData.is_tv}
                    onChange={handleCheckboxChange}
                  />
                  <PiTelevisionSimpleLight /> TV
                </label>
                <label htmlFor="internet" className={`form-group ${formData.is_internet ? "activeTask" : ""}`}>
                  <input
                    type="checkbox"
                    id="internet"
                    name="is_internet"
                    checked={formData.is_internet}
                    onChange={handleCheckboxChange}
                  />
                  <TfiWorld /> İnternet
                </label>
                <label htmlFor="voice" className={`form-group ${formData.is_voice ? "activeTask" : ""}`}>
                  <input
                    type="checkbox"
                    id="voice"
                    name="is_voice"
                    checked={formData.is_voice}
                    onChange={handleCheckboxChange}
                  />
                  <RiVoiceprintFill /> Səs
                </label>
              </div>
              {errors.service && <span className="error-message">{errors.service}</span>}
            </div>
            <div className="form-group add-task-group-dropdown">
              <label>Texniki qrup:</label>
              <div className="dropdown-task" ref={dropdownRef}>
                <div className="dropdown-task-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {formData.group.length > 0
                    ? ` ${groups
                      .filter(group => formData.group.includes(group.id))
                      .map(group => group.group)
                      .join(",  ")}`
                    : "Qrup seçin"}
                  <FaChevronDown />
                </div>
                {isDropdownOpen && <div className="dropdown-task-menu">{renderGroups()}</div>}
              </div>
              {errors.group && <span className="error-message">{errors.group}</span>}
            </div>
          </div>
          <div className="form-group mapDiv">
            <label htmlFor="note">Müştəri ünvanı:</label>
            <MapContainer
              center={[formData.latitude || 40.4093, formData.longitude || 49.8671]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler onClick={handleMapClick} />

              {formData?.latitude && formData?.longitude && (
                <>
                  <Marker
                    icon={customerIcon}
                    position={[formData.latitude, formData.longitude]}
                  />
                  <MapFlyTo lat={formData.latitude} lng={formData.longitude} />
                </>
              )}
            </MapContainer>
          </div>
          <div className="form-group">
            <label htmlFor="location_link">Ünvan linki</label>
            <input
              type="text"
              id="location_link"
              name="location_link"
              value={formData.location_link}
              onChange={handleChangeMapLink}
              className={`form-control ${isValidLink === true ? 'is-valid' :
                isValidLink === false ? 'is-invalid' : ''
                }`}
              placeholder="Google Maps linkini buraya yapışdırın"
            />
            {((!isProcessingLink && isValidLink === false && mapLinkError) && (!formData.latitude || !formData.longitude)) && (
              <div style={{ color: "red", marginTop: "8px" }}>
                {mapLinkError}
              </div>
            )}

            {formData.latitude && formData.longitude && (
              <div style={{ color: "green", marginTop: "8px" }}>
                Konum başarıyla alındı
              </div>
            )}
          </div>
          {/* <div className="form-group passportImage">
                        <label htmlFor="note">Müştərinin şəxsiyyət vəsiqəsi:</label>
                        <div className="upload-icon-password">
                            <label htmlFor=""></label>
                            <input type="file" name="passport" onChange={handleInputChange} />
                        </div>
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="image-preview"
                            />
                        )}
                    </div> */}

          <div className="form-group passportImage">
            <label>Müştərinin şəxsiyyət vəsiqəsi:</label>
            <div className="upload-container">
              {!preview ? (
                <label htmlFor="passport" className="upload-label">
                  <span>
                    Yükləmək üçün klikləyin
                    {/* <span className="file-size">(Maksimum fayl ölçüsü: 25 MB)</span> */}
                  </span>
                  <div className="upload-icon">
                    <img src={upload} alt="" />
                  </div>
                </label>
              ) : (
                <img src={preview} alt="Preview" className="image-preview" />
              )}
              <input type="file" id="passport" name="passport" onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">Qeydlər:</label>
            <textarea id="note" name="note" value={formData.note} onChange={handleChange} className="form-control" />
            {errors.note && <span className="error-message">{errors.note}</span>}
          </div>
          {backendErrors.length > 0 && <div className="error-message">{backendErrors.join(", ")}</div>}
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Əlavə edilir..." : "Əlavə et"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
