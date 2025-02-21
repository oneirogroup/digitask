import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

import "./mapModal.css";
import "leaflet/dist/leaflet.css";

function index({ onClose, status }) {
  const [locationList, setLocationList] = useState(null);
  const [positions, setPositions] = useState([[status.location.latitude, status.location.longitude]]);

  const position = [45.409264, 42.867092];
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
      iconSize: [16, 16], // İkonun boyutunu ayarla
      iconAnchor: [16, 32] // İkonun merkeze oturmasını sağla
    });

  const customerIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=u4VHO3ZaZQa9&format=png&color=000000",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const startedTasks = status.started_task;

  useEffect(() => {
    if (status.location) {
      setLocationList([status.location.latitude, status.location.longitude]);

      if (status.location && status.location.latitude !== undefined && status.location.longitude !== undefined) {
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
            {startedTasks?.map((task, index) => {
              if (task?.location?.latitude && task?.location?.longitude) {
                return (
                  <Marker
                    key={task.full_name}
                    icon={customerIcon}
                    position={[task.location.latitude, task.location.longitude]}
                  >
                    <Popup>{task.full_name}</Popup>
                  </Marker>
                );
              }
            })}
            {positions && <Polyline positions={positions} color="blue" />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default index;
