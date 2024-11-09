import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

import useRefreshToken from "../../common/refreshToken";

import "./fullMapModal.css";
import "leaflet/dist/leaflet.css";

function FlyToLocation({ coords, zoomLevel }) {
  const map = useMap(); // Get map instance
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoomLevel); // Fly to the coordinates
    }
  }, [coords, map, zoomLevel]);

  return null;
}

function index({ onClose, status }) {
  const [locationList, setLocationList] = useState([]);

  function useMapInstance() {
    return useMap();
  }
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

  //   const startedTasks = status.started_task;

  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    setLocationList(Object.values(status));
  }, [status]);

  const handleButtonClick = useCallback((lat, lng) => {
    setSelectedLocation([lat, lng]); // Set selected location to trigger flyTo
  }, []);


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
          <MapContainer center={[40.409264, 49.867092]} zoom={zoomLevel} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locationList.map((emp, index) => (
              <div key={index}>
                <div>
                  {emp?.user?.email} {emp?.location?.latitude}
                </div>
                {emp.location && emp?.location?.latitude && emp?.location?.longitude && (
                  <Marker
                    key={emp.user.email}
                    icon={customIcon(emp.user.email)}
                    position={[emp?.location?.latitude, emp?.location?.longitude]}
                  >
                    <Popup>{emp.user.email}</Popup>
                  </Marker>
                )}
              </div>
            ))}

            {/* {startedTasks?.map((task, index) => {
                          if (task?.location?.latitude && task?.location?.longitude) {
                            return(
                          <Marker key={task.full_name} icon={customerIcon} position={[task.location.latitude, task.location.longitude]}>
                            <Popup>{task.full_name}</Popup>
                          </Marker>
                            )
                          }
                        })} */}
            {selectedLocation && <FlyToLocation coords={selectedLocation} zoomLevel={zoomLevel} />}
          </MapContainer>
        </div>
        <div>
          {locationList.map((emp, index) => (
            <>
              <button
                onClick={() => {
                  if (emp?.location?.latitude && emp?.location?.longitude) {
                    handleButtonClick(emp.location.latitude, emp.location.longitude);
                  }
                }}
                className={`userButton ${emp?.location?.latitude && emp?.location?.longitude ? "activeFly" : ""}`}
                key={index}
              >
                {emp?.user?.email}
              </button>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default index;
