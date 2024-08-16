import "./mapModal.css";

import { FaCirclePlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { CgSortAz } from "react-icons/cg";
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup,useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
function index({ onClose,status }) {
    const [locationList, setLocationList] = useState(null);
    const position = [45.409264, 42.867092]
    const zoomLevel = 13;

    console.log(status,'ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
    
    const customIcon = new L.Icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=CwAOuD64vULU&format=png&color=000000', // Simgenizin yolu
        iconSize: [32, 32], // Simgenizin boyutu
        iconAnchor: [16, 32], // Simgenin yere bağlandığı nokta
        popupAnchor: [0, -32], // Popup'ın simgeye göre yerleşimi
      });

    useEffect(() => {
        if (status.location) {
          const newLocationList = [status.location.latitude, status.location.longitude];
          setLocationList(newLocationList);
         
        }
      }, [status]);
      // Extract values into a list
      
      const MapRecenter= ({ lat, lng, zoomLevel }) => {
        const map = useMap();
      
        useEffect(() => {
         console.log([status.location.latitude, status.location.longitude],zoomLevel,'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
          map.flyTo([lat,lng], zoomLevel );
        }, [status.location.latitude, status.location.longitude]);
        return null;
      
      };

   
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
                <MapContainer center={[status.location.latitude, status.location.longitude]} zoom={zoomLevel} scrollWheelZoom={false}>
                    <MapRecenter lat={status.location.latitude} lng={status.location.longitude} zoomLevel={13} />
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker key={status.user.email} icon={customIcon} position={[status.location.latitude, status.location.longitude]}>
                        <Popup>
                           {status.user.email}
                        </Popup>
                        </Marker>
                   
                </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default index;
