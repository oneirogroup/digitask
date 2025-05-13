import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapFlyTo = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 16);
    }
  }, [lat, lng, map]);

  return null;
};

export default MapFlyTo;
