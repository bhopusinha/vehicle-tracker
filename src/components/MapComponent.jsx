import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const containerStyle = {
  width: '70%',
  height: '80vh',
  margin: 'auto',
};

const MapComponent = ({ vehiclePath, vehiclePosition, center, onMapClick, locationList, selectedMarkers }) => {
  useEffect(() => {
    const map = L.map('map').setView([center.lat, center.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      onMapClick({ latLng: { lat, lng } });
    });

    locationList.forEach((location) => {
      const marker = L.marker([location.lat, location.lng]).addTo(map);
      marker.on('click', () => onMapClick({ latLng: { lat: location.lat, lng: location.lng } }));
    });

    selectedMarkers.forEach((marker) => {
      L.marker([marker.lat, marker.lng], {
        icon: L.icon({
          iconUrl: 'http://maps.google.com/mapfiles/kml/shapes/cabs.png',
          iconSize: [50, 50],
        }),
      }).addTo(map);
    });

    if (vehiclePosition) {
      L.marker([vehiclePosition.lat, vehiclePosition.lng], {
        icon: L.icon({
          iconUrl: 'http://maps.google.com/mapfiles/kml/shapes/cabs.png',
          iconSize: [50, 50],
        }),
      }).addTo(map);
    }

    if (vehiclePath.length > 0) {
      L.polyline(vehiclePath, { color: 'red' }).addTo(map);
    }

    return () => {
      map.remove();
    };
  }, [vehiclePath, vehiclePosition, center, locationList, selectedMarkers]);

  return <div id="map" style={containerStyle}></div>;
};

export default MapComponent;
