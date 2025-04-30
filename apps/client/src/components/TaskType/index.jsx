import { useEffect, useRef, useState } from "react";
import { BiComment } from "react-icons/bi";
import { BsTelephone } from "react-icons/bs";
import { FaChevronDown, FaMapPin, FaPassport } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { IoPersonOutline } from "react-icons/io5";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { MdAdd, MdDelete, MdOutlineEdit, MdOutlineEngineering, MdOutlineMiscellaneousServices } from "react-icons/md";
import { PiTelevisionSimple } from "react-icons/pi";
import { RiEdit2Line, RiMapPinLine, RiVoiceprintFill } from "react-icons/ri";
import { SiTyper } from "react-icons/si";
import { TfiWorld } from "react-icons/tfi";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import useRefreshToken from "../../common/refreshToken";
import { useUser } from "../../contexts/UserContext";
import AddItemModal from "../AddItemModal";
import AddSurveyModal from "../AddSurveyModal";
import ImageModal from "../ImageModal";
import UpdateInternetModal from "../UpdateInternetModal";
import UpdateTVModal from "../UpdateTVModal";
import UpdateVoiceModal from "../UpdateVoiceModal";

import upload from "../../assets/images/document-upload.svg";
import "./detailsModal.css";
import "leaflet/dist/leaflet.css";

const TASK_TYPES = [
  { value: "connection", label: "Qoşulma" },
  { value: "problem", label: "Problem" }
];

const STATUS_OPTIONS = [
  { value: "waiting", label: "Gözləyir" },
  { value: "inprogress", label: "Qəbul edilib" },
  { value: "started", label: "Başlanıb" },
  { value: "completed", label: "Tamamlandı" }
];

const SERVICE_OPTIONS = [
  { value: "tv", label: "TV" },
  { value: "internet", label: "İnternet" },
  { value: "voice", label: "Səs" }
];

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: e => {
      onClick(e.latlng);
    }
  });
  return null;
}

function DetailsModal({ onClose, taskId, userType, onTaskUpdated }) {
  const position = JSON.parse(localStorage.getItem("position"));
  const { isAdmin } = useUser();
  const [taskDetails, setTaskDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [groups, setGroups] = useState([]);
  const taskTypeDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const serviceDropdownRef = useRef(null);
  const groupDropdownRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const modalRef = useRef(null);
  const refreshAccessToken = useRefreshToken();

  const handleClickOutside = event => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
    if (taskTypeDropdownRef.current && !taskTypeDropdownRef.current.contains(event.target)) {
      setIsDropdownOpenTaskType(false);
    }
    if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
      setIsDropdownOpenStatus(false);
    }
    if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
      setIsDropdownOpenService(false);
    }
    if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
      setIsDropdownOpenGroup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [formData, setFormData] = useState({
    task_type: "",
    full_name: "",
    date: "",
    end_date: "",
    registration_number: "",
    contact_number: "",
    location: "",
    passport: null,
    services: [],
    status: "",
    group: [],
    note: "",
    latitude: "",
    longitude: "",
    is_tv: "",
    is_internet: "",
    is_voice: ""
  });

  const formatTime = time => {
    if (!time) return "-";

    const date = new Date(`1970-01-01T${time}Z`);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const monthNames = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avqust",
    "sentyabr",
    "oktyabr",
    "noyabr",
    "dekabr"
  ];

  const [taskItemDetails, setTaskItemDetails] = useState([]);
  const [warehouseItems, setWarehouseItems] = useState([]);

  const fetchTaskData = async e => {
    if (taskId) {
      try {
        const response = await fetch(`https://app.desgah.az/services/task/${taskId}/`);
        if (!response.ok) {
          if (response.status === 403) {
            await refreshAccessToken();
            fetchTaskData();
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          task_type: data.task_type,
          full_name: data.full_name,
          date: data.date,
          end_date: data.end_date,
          registration_number: data.registration_number,
          contact_number: data.contact_number,
          location: data.location,
          passport: data.passport ? data.passport : null,
          services: data.services,
          status: data.status,
          group: data.group,
          note: data.note,
          latitude: data.latitude,
          longitude: data.longitude,
          is_tv: data.is_tv,
          is_voice: data.is_voice,
          is_internet: data.is_internet
        });
        setTaskDetails(data);
        setTaskItemDetails(data.task_items);
      } catch (error) {
        if (error.status == 403) {
          await refreshAccessToken();
          fetchTaskData();
        }
        console.error("Error fetching task data:", error);
      }
    }
  };

  const fetchWarehouseItems = async () => {
    try {
      const response = await fetch("https://app.desgah.az/warehouse/warehouse-items/");
      if (!response.ok) {
        if (response.status == 403) {
          await refreshAccessToken();
          fetchWarehouseItems();
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWarehouseItems(data);
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchWarehouseItems();
      }
      console.error("Error fetching warehouse items:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch("https://app.desgah.az/services/groups/");
      if (!response.ok) {
        if (response.status == 403) {
          await refreshAccessToken();
          return fetchGroups();
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        fetchGroups();
      }
      console.error("Error fetching groups:", error);
    }
  };
  useEffect(() => {
    fetchTaskData();
    fetchWarehouseItems();
    fetchGroups();
  }, [taskId, isEditing]);

  const handleItemsAdded = addedItems => {
    setTaskItemDetails(prev => [...prev, ...addedItems]);
  };

  const getEquipmentDetails = taskItem => {
    const equipment = warehouseItems?.find(item => item.id === taskItem.item);
    return equipment ? equipment?.equipment_name : (taskItem?.item?.equipment_name ?? "Məlumat yoxdur");
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (name === "registration_number" || name === "contact_number") {
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const [addedServices, setAddedServices] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const handleInputPhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData(prevState => ({
        ...prevState,
        passport: file
      }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData(prevState => ({
        ...prevState,
        passport: prevState.passport
      }));
    }
  };

  useEffect(() => {
    if (taskDetails && taskDetails.group) {
      setFormData(prevData => ({
        ...prevData,
        group: taskDetails.group.map(g => g.id)
      }));
    }
  }, [taskDetails]);

  const [isDropdownOpenTaskType, setIsDropdownOpenTaskType] = useState(false);
  const [isDropdownOpenStatus, setIsDropdownOpenStatus] = useState(false);
  const [isDropdownOpenGroup, setIsDropdownOpenGroup] = useState(false);
  const [isDropdownOpenService, setIsDropdownOpenService] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdownTaskType = () => {
    setIsDropdownOpenTaskType(!isDropdownOpenTaskType);
  };
  const toggleDropdownService = () => setIsDropdownOpenService(!isDropdownOpenService);

  const toggleDropdownStatus = () => {
    setIsDropdownOpenStatus(!isDropdownOpenStatus);
  };

  const toggleDropdownGroup = () => {
    setIsDropdownOpenGroup(!isDropdownOpenGroup);
  };

  const handleTaskTypeSelect = selectedTaskType => {
    setFormData(prevFormData => ({
      ...prevFormData,
      task_type: selectedTaskType
    }));
    setIsDropdownOpenTaskType(false);
  };

  const handleStatusSelect = status => {
    setFormData({ ...formData, status: status });
    setIsDropdownOpenStatus(false);
  };
  const handleServiceChange = serviceType => {
    setFormData(prevFormData => {
      const newFlags = {
        is_tv: serviceType === "tv" ? !prevFormData.is_tv : prevFormData.is_tv,
        is_internet: serviceType === "internet" ? !prevFormData.is_internet : prevFormData.is_internet,
        is_voice: serviceType === "voice" ? !prevFormData.is_voice : prevFormData.is_voice
      };

      return {
        ...prevFormData,
        ...newFlags
      };
    });
  };

  const renderTaskTypeOptions = () => {
    return TASK_TYPES.map(option => (
      <div
        key={option.value}
        className={`taskType-option ${formData.task_type === option.value ? "selected" : ""}`}
        onClick={() => handleTaskTypeSelect(option.value)}
      >
        {option.label}
      </div>
    ));
  };

  const renderStatusOptions = () => {
    return STATUS_OPTIONS.map(option => (
      <div
        key={option.value}
        className={`taskType-option ${formData.status === option.value ? "selected" : ""}`}
        onClick={() => handleStatusSelect(option.value)}
      >
        {option.label}
      </div>
    ));
  };

  const renderServiceOptions = () => {
    return SERVICE_OPTIONS.map(option => (
      <div
        key={option.value}
        className={`taskType-option ${formData[option.value] ? "selected" : ""}`}
        onClick={() => handleServiceChange(option.value)}
      >
        {option.label}
      </div>
    ));
  };

  const [isAddSurveyModalOpen, setIsAddSurveyModalOpen] = useState(false);

  const openAddSurveyModal = () => {
    setIsAddSurveyModalOpen(true);
  };

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const openAddItemModal = () => {
    setIsAddItemModalOpen(true);
  };

  const getSelectedGroupNames = () => {
    return formData.group
      .map(groupId => groups.find(group => group.id === groupId)?.group)
      .filter(name => name)
      .join(", ");
  };

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
      <label key={group.id} className="dropdown-task-item" htmlFor={`group-${group.id}`}>
        <input
          type="checkbox"
          id={`group-${group.id}`}
          checked={formData.group.includes(group.id)}
          onChange={() => handleGroupSelect(group.id)}
        />
        {group.group}
      </label>
    ));
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append("passport", imageFile);

      fetch(`https://app.desgah.az/services/update_task_image/${taskId}/`, {
        method: "PATCH",
        body: imageFormData
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(`Error: ${response.status} ${response.statusText} - ${JSON.stringify(err)}`);
            });
          }
          return response.json();
        })
        .then(imageData => {
          setFormData(prevFormData => ({
            ...prevFormData,
            passport: imageData.passport
          }));
        })
        .catch(async error => {
          console.error("Error updating image:", error);
          if (error.status == 403) {
            await refreshAccessToken();
            handleFormSubmit(e, true);
          }
        });
    }

    fetch(`https://app.desgah.az/services/update_task/${taskId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(`Error: ${response.status} ${response.statusText} - ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then(data => {
        setTaskDetails(data);
        setAddedServices(data.addedServices || []);
        setFormData({
          task_type: data.task_type,
          full_name: data.full_name,
          date: data.date,
          end_date: data.end_date,
          registration_number: data.registration_number,
          contact_number: data.contact_number,
          location: data.location,
          passport: data.passport || null,
          services: data.services,
          status: data.status,
          group: data.group,
          note: data.note,
          latitude: data.latitude,
          longitude: data.longitude,
          is_tv: data.is_tv,
          is_voice: data.is_voice,
          is_internet: data.is_internet
        });
        setIsEditing(false);
        onClose();
        onTaskUpdated(data);
        taskDetails(data);
      })
      .catch(async error => {
        if (error.status === 403) {
          await refreshAccessToken();
          handleFormSubmit(e, true);
        }
      });
  };

  const shouldShowAddSurveyButton =
    ((taskDetails?.is_tv && !taskDetails?.tv) ||
      (taskDetails?.is_internet && !taskDetails?.internet) ||
      (taskDetails?.is_voice && !taskDetails?.voice)) &&
    taskDetails?.status !== "waiting";

  const handleSurveyAdded = (serviceType, surveyData) => {
    setTaskDetails(prevDetails => ({
      ...prevDetails,
      [serviceType]: surveyData
    }));
  };

  const [isUpdateTVModalOpen, setIsUpdateTVModalOpen] = useState(false);
  const [isUpdateInternetModalOpen, setIsUpdateInternetModalOpen] = useState(false);
  const [isUpdateVoiceModalOpen, setIsUpdateVoiceModalOpen] = useState(false);

  const handleServiceUpdate = (serviceType, updatedData) => {
    setTaskDetails(prevDetails => {
      let updatedInternet = updatedData;

      if (serviceType === "internet" && prevDetails.internetPackages) {
        const foundPackage = prevDetails.internetPackages.find(pack => pack.id === updatedData.internet_packs);

        updatedInternet = {
          ...updatedData,
          internet_packs: foundPackage ? { id: foundPackage.id, name: foundPackage.name } : null
        };
      }

      return {
        ...prevDetails,
        [serviceType]: updatedInternet
      };
    });
  };

  const handleMapClick = latlng => {
    if (isEditing) {
      setFormData(prevState => ({
        ...prevState,
        latitude: latlng.lat,
        longitude: latlng.lng
      }));
    }
  };

  const [mapLink, setMapLink] = useState("");

  function extractCoordinatesFromUrl(url) {
    // Regular expressions for different URL formats
    const regex1 = /@(-?\d+\.\d+),(-?\d+\.\d+),/; // For URLs with '@lat,lng'
    const regex2 = /q=(-?\d+\.\d+),(-?\d+\.\d+)/; // For URLs with 'q=lat,lng'
    const regex3 = /place\/(-?\d+\.\d+),(-?\d+\.\d+)/; // For URLs with 'place/lat,lng'

    // Test the URL with different regex patterns
    let match = url.match(regex1) || url.match(regex2) || url.match(regex3);

    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      };
    }

    return null; // Return null if no coordinates found
  }

  const handleMapLink = url => {
    const location = extractCoordinatesFromUrl(url);
    if (location?.latitude && location.longitude) {
      setFormData(prevState => ({
        ...prevState,
        latitude: location.latitude,
        longitude: location.longitude
      }));
      setMapLink(url); // Store the map link for rendering
    }
  };

  const handleChangeMapLink = event => {
    const { value } = event.target;
    handleMapLink(value);
  };

  const customerIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=CwAOuD64vULU&format=png&color=000000",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const renderMap = () => (
    <div className="form-group mapDiv" id="detailMap">
      <label htmlFor="note">
        <FaMapPin />
        Müştəri ünvanı:
      </label>
      <MapContainer
        center={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : [40.4093, 49.8671]}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {isEditing && <MapClickHandler onClick={handleMapClick} />}
        {formData.latitude && formData.longitude && (
          <Marker icon={customerIcon} position={[formData.latitude, formData.longitude]} />
        )}
      </MapContainer>
    </div>
  );
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (isDropdownOpenGroup && groupDropdownRef.current) {
      const rect = groupDropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left
      });
    }
  }, [isDropdownOpenGroup]);

  const getStatusLabel = status => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = imageSrc => {
    setSelectedImage(imageSrc);
    setIsImageModalOpen(true);
  };

  const handleModalClose = () => {
    setIsImageModalOpen(false);
  };

  const deleteTaskItem = taskItemId => {
    fetch(`https://app.desgah.az/services/warehouse/warehouse_change/${taskItemId}/`, {
      method: "DELETE"
    })
      .then(response => {
        if (response.ok) {
          setTaskItemDetails(prevItems => prevItems.filter(item => item.id !== taskItemId));
        } else {
          console.error("Failed to delete the task item");
        }
      })
      .catch(async error => {
        console.error("Error updating image:", error);
        if (error.status === 403) {
          await refreshAccessToken();
          deleteTaskItem();
        }
      });
  };

  if (!taskDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="taskType-modal">
      <div className="taskType-modal-content">
        <div className="taskType-modal-title">
          {isEditing ? (
            <div className="details-title">
              <h5>Tapşırığı yenilə </h5>
            </div>
          ) : (
            <>
              <h5>
                {taskDetails?.task_type
                  ? (taskDetails.task_type === "connection" ? "Qoşulma" : "Problem") + " məlumatları"
                  : ""}
              </h5>
              {((position && position.tasks_permission == "read_write") || (position && position.tasks_permission == "admin")) && <RiEdit2Line onClick={handleEditClick} />}
            </>
          )}
          <div>
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
        </div>
        <hr />
        {isEditing ? (
          <form onSubmit={handleFormSubmit} className="details-modal-body">
            <div>
              <div className="taskType-info details-info">
                <div>
                  <div className="status-dropdown-div task-type-select">
                    <label>
                      <SiTyper />
                      Tapşırığın növü
                    </label>
                    <div className="dropdown-task" id="details-task">
                      <div className="dropdown-task-toggle" onClick={toggleDropdownTaskType}>
                        {formData.task_type
                          ? formData.task_type === "connection"
                            ? "Qoşulma"
                            : "Problem"
                          : "Tapşırığı Seçin"}
                        <FaChevronDown />
                      </div>
                    </div>
                    {isDropdownOpenTaskType && (
                      <div className="taskType-options" ref={taskTypeDropdownRef}>
                        {renderTaskTypeOptions()}
                      </div>
                    )}
                  </div>
                  <hr />
                </div>
                <div>
                  <div>
                    <label>
                      <IoPersonOutline /> Müştəri
                    </label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                  </div>
                  <hr />
                </div>
                <div>
                  <div>
                    <label>
                      <GoClock /> Başlama tarixi
                    </label>
                    <input type="date" id="" name="date" value={formData.date} onChange={handleInputChange} />
                  </div>
                  <hr />
                </div>
                <div>
                  <div>
                    <label>
                      <GoClock /> Bitmə tarixi
                    </label>
                    <input type="date" id="" name="end_date" value={formData.end_date} onChange={handleInputChange} />
                  </div>
                  <hr />
                </div>
                <div>
                  <div>
                    <label>
                      <BsTelephone /> Qeydiyyat nömrəsi
                    </label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <hr />
                </div>
                <div>
                  <div>
                    <label>
                      <LiaPhoneVolumeSolid /> Əlaqə nömrəsi
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      maxLength={30}
                      value={formData.contact_number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <hr />
                </div>
                <div>
                  <div>
                    <label>
                      <RiMapPinLine /> Ünvan
                    </label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                  </div>
                  <hr />
                </div>
                <div>
                  <div>
                    <label htmlFor="location_link">Ünvan linki</label>
                    <input
                      type="text"
                      id="location_link"
                      name="location_link"
                      onChange={handleChangeMapLink}
                      className="form-control"
                    />
                  </div>
                  <hr />
                </div>

                <div>
                  <div className="status-dropdown-div">
                    <label>
                      <MdOutlineMiscellaneousServices /> Xidmət
                    </label>
                    <div className="status-dropdown" ref={serviceDropdownRef}>
                      <div className="taskType-toggle details-toggle" onClick={toggleDropdownService}>
                        {formData.is_tv || formData.is_internet || formData.is_voice
                          ? SERVICE_OPTIONS.filter(
                            option =>
                              (option.value === "tv" && formData.is_tv) ||
                              (option.value === "internet" && formData.is_internet) ||
                              (option.value === "voice" && formData.is_voice)
                          )
                            .map(service => service.label)
                            .join(", ")
                          : "Xidmət seçin"}
                        <FaChevronDown />
                      </div>

                      {isDropdownOpenService && <div className="taskType-options">{renderServiceOptions()}</div>}
                    </div>
                  </div>
                  <hr />
                </div>
                <div>
                  <div className="status-dropdown-div">
                    <label>
                      <BiComment /> Status
                    </label>
                    <div className="status-dropdown" ref={statusDropdownRef}>
                      <div className="taskType-toggle details-toggle" onClick={toggleDropdownStatus}>
                        {formData.status
                          ? STATUS_OPTIONS.find(option => option.value === formData.status)?.label
                          : "Status Seçin"}
                        <FaChevronDown />
                      </div>
                      {isDropdownOpenStatus && <div className="taskType-options">{renderStatusOptions()}</div>}
                    </div>
                  </div>
                  <hr />
                </div>
                <div>
                  <div className="form-group">
                    <label>
                      <MdOutlineEngineering /> Texniki qrup
                    </label>
                    <div className="dropdown-task" id="details-task" ref={groupDropdownRef}>
                      <div
                        className="dropdown-task-toggle"
                        onClick={() => setIsDropdownOpenGroup(!isDropdownOpenGroup)}
                      >
                        {Array.isArray(formData.group) && formData.group.length > 0
                          ? `${getSelectedGroupNames()}`
                          : "Qrup Seçin"}

                        <FaChevronDown />
                      </div>
                      {isDropdownOpenGroup && (
                        <div
                          className="dropdown-task-menu"
                          style={{
                            position: "absolute",
                            top: dropdownPosition.top,
                            left: dropdownPosition.left
                          }}
                        >
                          {renderGroups()}
                        </div>
                      )}
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
              {renderMap()}
              <div className="taskType-note details-note">
                <div>
                  <label>Qeyd</label>
                  <textarea name="note" value={formData.note} onChange={handleInputChange}></textarea>
                </div>
                <hr />
              </div>
              <div className="form-group passportUpdate">
                <label>Müştərinin şəxsiyyət vəsiqəsi:</label>
                <div className="upload-container">
                  {preview || taskDetails?.passport ? (
                    <>
                      <img
                        src={preview || taskDetails.passport}
                        alt="Passport"
                        className="image-preview"
                        onClick={() => handleImageClick(preview || taskDetails.passport)}
                      />
                      <label htmlFor="passport" className="upload-button upload-passport-button">
                        {preview ? "Dəyişmək üçün klikləyin" : "Dəyişmək üçün klikləyin"}
                      </label>
                    </>
                  ) : (
                    <label htmlFor="passport" className="upload-label">
                      <span>Yükləmək üçün klikləyin</span>
                      <div className="upload-icon">
                        <img src={upload} alt="Upload Icon" />
                      </div>
                    </label>
                  )}

                  <input
                    type="file"
                    id="passport"
                    name="passport"
                    accept="image/*"
                    onChange={handleInputPhotoChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <button className="updateTask-button" type="submit">
                Yenilə
              </button>
            </div>
          </form>
        ) : (
          <div className="taskType-modal-body">
            <div className="taskType-info">
              <div>
                <div>
                  <label>
                    <IoPersonOutline /> Müştəri
                  </label>
                  <span>{taskDetails.full_name}</span>
                </div>
                <hr />
              </div>
              <div>
                <div>
                  <label>
                    <IoPersonOutline /> İcraçı
                  </label>
                  <span>
                    {taskDetails.first_name} {taskDetails.last_name}
                  </span>
                </div>
                <hr />
              </div>
              <div>
                <div>
                  <label>
                    <GoClock /> Zaman
                  </label>
                  {taskDetails.date && (
                    <span>{`${taskDetails.date.split("-")[2]} ${monthNames[parseInt(taskDetails.date.split("-")[1], 10) - 1]
                      }`}</span>
                  )}
                </div>
                <hr />
              </div>
              <div>
                <div className="registrationNumber">
                  <label>
                    <BsTelephone /> Qeydiyyat nömrəsi
                  </label>
                  <span>{taskDetails.registration_number}</span>
                </div>
                <hr />
              </div>
              <div>
                <div className="taskType-phone">
                  <label>
                    <LiaPhoneVolumeSolid /> Əlaqə nömrəsi
                  </label>
                  <span>{taskDetails.contact_number}</span>
                </div>
                <hr />
              </div>
              <div>
                <div>
                  <label>
                    <MdOutlineMiscellaneousServices /> Xidmət
                  </label>
                  <span className="type-icon">
                    {taskDetails.is_tv && <PiTelevisionSimple />}
                    {taskDetails.is_internet && <TfiWorld />}
                    {taskDetails.is_voice && <RiVoiceprintFill />}
                    {!taskDetails.is_tv && !taskDetails.is_internet && !taskDetails.is_voice && <span>-</span>}
                  </span>
                </div>
                <hr />
              </div>
              <div>
                <div className="taskType-status">
                  <label>
                    <BiComment /> Status
                  </label>
                  <span>{getStatusLabel(taskDetails.status)}</span>
                </div>
                <hr />
              </div>
              <div>
                <div>
                  <label>
                    <MdOutlineEngineering /> Texniki qrup
                  </label>
                  <div>
                    {taskDetails.group && taskDetails.group.length > 0 ? (
                      taskDetails.group.map((group, index) => (
                        <div key={index}>
                          <span>{group.group}</span>
                        </div>
                      ))
                    ) : (
                      <span>Texniki qrup seçilməyib.</span>
                    )}
                  </div>
                </div>
                <hr />
              </div>

              <div>
                <div className="taskType-address">
                  <label>
                    <RiMapPinLine /> Ünvan
                  </label>
                  <span>{taskDetails.location}</span>
                </div>
                <hr />
              </div>
              {mapLink ? (
                <div>
                  <div>
                    <label htmlFor="location_link">Ünvan linki</label>

                    <span>
                      Link:
                      <a href={mapLink} target="_blank" rel="noopener noreferrer">
                        {mapLink}
                      </a>
                    </span>
                  </div>
                  <hr />
                </div>
              ) : (
                ""
              )}
              {taskDetails.passport && (
                <div>
                  <div className="taskType-photo">
                    <label>
                      <FaPassport /> Müştərinin şəxsiyyət vəsiqəsi
                    </label>
                    <img onClick={() => handleImageClick(taskDetails.passport)} src={taskDetails.passport} alt="" />
                  </div>
                  <hr />
                </div>
              )}
            </div>
            {formData.latitude != null && formData.longitude != null ? renderMap() : ""}
            <div className="taskType-note">
              <div>
                <label>Qeyd</label>
                <span>{taskDetails.note}</span>
              </div>
              <hr />
            </div>

            <div className="service-details">
              {taskDetails.is_tv && taskDetails.tv && (
                <div className="service-detail">
                  <h5>
                    Tv xidməti
                    <span>
                      <MdOutlineEdit onClick={() => setIsUpdateTVModalOpen(true)} />
                    </span>
                  </h5>
                  <hr />
                  <div>
                    <div>
                      {taskDetails.tv.photo_modem ? (
                        <div className="detail-item">
                          <label>Modemin şəkli:</label>
                          <img src={taskDetails.tv.photo_modem || "-"} alt="" />
                        </div>
                      ) : (
                        <span>Şəkil əlavə olunmayıb</span>
                      )}
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Modem Serial Nömrəsi:</label>
                        <span>{taskDetails.tv.modem_SN || "-"}</span>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              )}
              {taskDetails.is_internet && taskDetails.internet && (
                <div className="service-detail">
                  <h5>
                    İnternet xidməti{" "}
                    <span>
                      {/* {isAdmin && ( */}
                      <MdOutlineEdit onClick={() => setIsUpdateInternetModalOpen(true)} />
                      {/* )} */}
                    </span>
                  </h5>
                  <hr />
                  <div>
                    <div>
                      {taskDetails.internet.photo_modem ? (
                        <div className="detail-item">
                          <label>Modemin şəkli:</label>
                          <img src={taskDetails.internet.photo_modem || "-"} alt="" />
                        </div>
                      ) : (
                        <span>Şəkil əlavə olunmayıb</span>
                      )}
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Modem Serial Nömrəsi:</label>
                        <span>{taskDetails.internet.modem_SN || "-"}</span>
                      </div>
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Splitter port:</label>
                        <span>{taskDetails.internet.splitter_port || "-"}</span>
                      </div>
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Siqnal:</label>
                        <span>{taskDetails.internet.siqnal || "-"}</span>
                      </div>
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>İnternet tarifi:</label>
                        <span>{taskDetails.internet?.internet_packs?.name || "-"}</span>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              )}
              {taskDetails.is_voice && taskDetails.voice && (
                <div className="service-detail">
                  <h5>
                    Səs xidməti{" "}
                    <span>
                      {/* {isAdmin && ( */}
                      <MdOutlineEdit onClick={() => setIsUpdateVoiceModalOpen(true)} />
                      {/* )} */}
                    </span>
                  </h5>
                  <hr />
                  <div>
                    <div>
                      {taskDetails.voice.photo_modem ? (
                        <div className="detail-item">
                          <label>Modemin şəkli:</label>
                          <img src={taskDetails.voice.photo_modem || "-"} alt="" />
                        </div>
                      ) : (
                        <span>Şəkil əlavə olunmayıb</span>
                      )}
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Modem Serial Nömrəsi:</label>
                        <span>{taskDetails.voice.modem_SN || "-"}</span>
                      </div>
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Ev Nömrəsi:</label>
                        <span>{taskDetails.voice.home_number || "-"}</span>
                      </div>
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Şifrə:</label>
                        <span>{taskDetails.voice.password || "-"}</span>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              {taskItemDetails.map((taskItem, index) => (
                <div key={index} className="service-detail service-item-detail">
                  <h5>
                    {getEquipmentDetails(taskItem)}
                    <span>
                      <MdDelete onClick={() => deleteTaskItem(taskItem.id)} />
                    </span>
                  </h5>
                  <hr />
                  <div>
                    <div>
                      <div className="detail-item">
                        <label>Say:</label>
                        <span>{taskItem.count || "-"}</span>
                      </div>
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Çatdırılma Qeydi:</label>
                        <span>{taskItem.delivery_note || "-"}</span>
                      </div>
                      <hr />
                    </div>
                    <div>
                      <div className="detail-item">
                        <label>Servis Növü:</label>
                        <span>
                          {taskItem.is_tv ? "TV" : taskItem.is_voice ? "Səs" : taskItem.is_internet ? "İnternet" : "-"}
                        </span>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {shouldShowAddSurveyButton && (
              <button className="add-survey-button" onClick={openAddSurveyModal}>
                <p>Anket əlavə et</p>
                <MdAdd />
              </button>
            )}
            {shouldShowAddSurveyButton && (
              <button className="add-survey-button" onClick={openAddItemModal}>
                <p>Məhsul əlavə et</p>
                <MdAdd />
              </button>
            )}
          </div>
        )}
      </div>
      {isAddSurveyModalOpen && (
        <AddSurveyModal
          onClose={() => setIsAddSurveyModalOpen(false)}
          selectedServices={{
            tv: taskDetails.is_tv,
            internet: taskDetails.is_internet,
            voice: taskDetails.is_voice
          }}
          taskId={taskId}
          initialAddedServices={addedServices}
          onSurveyAdded={handleSurveyAdded}
        />
      )}
      {isAddItemModalOpen && (
        <AddItemModal
          onClose={() => setIsAddItemModalOpen(false)}
          selectedServices={{
            tv: taskDetails.is_tv,
            internet: taskDetails.is_internet,
            voice: taskDetails.is_voice
          }}
          taskId={taskId}
          onItemsAdded={handleItemsAdded}
        />
      )}
      {isUpdateTVModalOpen && (
        <UpdateTVModal
          onClose={() => setIsUpdateTVModalOpen(false)}
          serviceId={taskDetails.tv.id}
          serviceData={taskDetails.tv}
          onServiceUpdate={handleServiceUpdate}
        />
      )}
      {isUpdateInternetModalOpen && (
        <UpdateInternetModal
          onClose={() => setIsUpdateInternetModalOpen(false)}
          serviceId={taskDetails.internet.id}
          serviceData={taskDetails.internet}
          onServiceUpdate={handleServiceUpdate}
          fetchTaskData={fetchTaskData}
        />
      )}
      {isUpdateVoiceModalOpen && (
        <UpdateVoiceModal
          onClose={() => setIsUpdateVoiceModalOpen(false)}
          serviceId={taskDetails.voice.id}
          serviceData={taskDetails.voice}
          onServiceUpdate={handleServiceUpdate}
        />
      )}
      <ImageModal isOpen={isImageModalOpen} onClose={handleModalClose} image={selectedImage} />
    </div>
  );
}

export default DetailsModal;
