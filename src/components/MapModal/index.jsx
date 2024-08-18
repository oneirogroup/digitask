import "./mapModal.css";

import { FaCirclePlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { CgSortAz } from "react-icons/cg";
import { createRoot } from 'react-dom/client';
import { MapContainer,Polyline, TileLayer, Marker, Popup,useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
function index({ onClose,status }) {
    const [locationList, setLocationList] = useState(null);
    const [positions, setPositions] = useState([[status.location.latitude, status.location.longitude]]);
 
    const position = [45.409264, 42.867092]
    const zoomLevel = 13;
    
    if (status.shared_tasl)
    console.log(status,'ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
    
    const customIcon = (email) => L.divIcon({
      className: 'custom-icon',
      html: `
        <div class="icon-wrapper">
          <img src="https://img.icons8.com/?size=100&id=CwAOuD64vULU&format=png&color=000000" class="icon-image" />
          <div class="icon-text">${email}</div>
        </div>
      `,
      iconSize: [16, 16], // İkonun boyutunu ayarla
      iconAnchor: [16, 32], // İkonun merkeze oturmasını sağla
    });
  

      const customerIcon = new L.Icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=u4VHO3ZaZQa9&format=png&color=000000', 
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32], 
      });

      const startedTask = status.started_task;
      const startedTaskLocation = startedTask && startedTask.location 
      ? [startedTask.location.latitude,  startedTask.location.longitude ] 
      : null;

    useEffect(() => {
        if (status.location) {
          const newLocationList = [status.location.latitude, status.location.longitude];
          setLocationList(newLocationList);
          setPositions((prevPositions) => [...prevPositions, [status.location.latitude, status.location.longitude]]);
        }
      }, [status]);
      // Extract values into a list
  

    console.log(locationList,'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
      
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
                <MapContainer center={[status.location.latitude, status.location.longitude]} zoom={zoomLevel} scrollWheelZoom={true}>
                 
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker key={status.user.email} icon={customIcon(status.user.email)} position={[status.location.latitude, status.location.longitude]}>
                        <Popup>
                           {status.user.email}
                        </Popup>
                        </Marker>
                        {startedTaskLocation && 
                          <Marker key={status.user.email} icon={customerIcon} position={startedTaskLocation}>
                        <Popup>
                           {status.user.email}
                        </Popup>
                        </Marker>
                        }
                        <Polyline positions={positions} color="blue" />
                </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default index;
