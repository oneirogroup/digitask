import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import axios from "axios";

import "./mapModal.css";
import "leaflet/dist/leaflet.css";

// İki koordinat arasındaki mesafeyi (km cinsinden) hesaplayan fonksiyon
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371; // Dünya'nın yarıçapı (km)

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function index({ onClose, status }) {
  const [locationList, setLocationList] = useState(null);
  const [positions, setPositions] = useState([[status.location.latitude, status.location.longitude]]);
  const [taskLocations, setTaskLocations] = useState([]);

  const zoomLevel = 13;

  const customIcon = email =>
    L.divIcon({
      className: "custom-icon",
      html: `
        <div class="icon-wrapper">
          <img src="https://img.icons8.com/?size=100&id=CwAOuD64vULU&format=png&color=000000" class="icon-image" />
          <div class="icon-text">${email}</div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [16, 32]
    });

  const taskIcon = L.divIcon({
    className: "custom-task-icon",
    html: `<i class="fa-solid fa-house-signal" style="font-size: 24px; color: red;"></i>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  useEffect(() => {
    const fetchTaskLocations = async () => {
      if (!status?.user?.email) return;
      try {
        const response = await axios.get(`http://37.61.77.5/services/map-tasks/?email=${status.user.email}`);
        console.log("Task locations response:", response.data);
        setTaskLocations(response.data);
      } catch (error) {
        console.error("Error fetching task locations:", error);
      }
    };

    fetchTaskLocations();
  }, [status?.user?.email, status]);

  useEffect(() => {
    if (status.location) {
      setLocationList([status.location.latitude, status.location.longitude]);

      if (status.location.latitude !== undefined && status.location.longitude !== undefined) {
        setPositions(prevPositions => [...prevPositions, [status.location.latitude, status.location.longitude]]);
      }
    }
  }, [status]);

  return (
    <div className="map-modal-modal-overlay">
      <div className="map-modal-modal-content">
        <div className="map-modal-modal-header">
          <h2>İstifadəçinin ünvanı</h2>
          <span className="map-modal-close-button" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <div id="myroot" className="map-modal-modal-body">
          <MapContainer
            center={[status.location.latitude, status.location.longitude]}
            zoom={zoomLevel}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {status.location && status?.location?.latitude && status?.location?.longitude && (
              <Marker
                key={status.user.email}
                icon={customIcon(status.user.email)}
                position={[status.location.latitude, status.location.longitude]}
              >
                <Popup>{status.user.email}</Popup>
              </Marker>
            )}

            {taskLocations?.length > 0 &&
              taskLocations.map((task, index) => {
                if (!task.latitude || !task.longitude) return null;

                const distance = haversineDistance(
                  status.location.latitude,
                  status.location.longitude,
                  task.latitude,
                  task.longitude
                );

                return (
                  <Marker key={index} icon={taskIcon} position={[task.latitude, task.longitude]}>
                    <Popup>
                      <b>{task.full_name}</b>
                      <br />
                      Məsafə (hava yolu ilə): {distance.toFixed(2)} km
                    </Popup>
                  </Marker>
                );
              })}

            {positions && <Polyline positions={positions} color="blue" />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default index;
