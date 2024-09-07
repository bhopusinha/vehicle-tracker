import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import './VehicleTracker.css';
import axios from 'axios';

const VehicleTracker = () => {
  const [vehiclePath, setVehiclePath] = useState([]);
  const [vehiclePosition, setVehiclePosition] = useState(null);
  const [center, setCenter] = useState({ lat: 41.8781, lng: -87.6298 });
  const [locationList, setLocationList] = useState([]);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  useEffect(() => {
    if (selectedMarkers.length === 2) {
      const [start, end] = selectedMarkers;
      const path = [start, end];
      setVehiclePath(path);
      setVehiclePosition(start);
      moveVehicle(path);
    }
  }, [selectedMarkers]);

  const moveVehicle = (path) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < path.length) {
        setVehiclePosition(path[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2000); 
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const address = e.target.elements.address.value;
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
    const location = response.data[0];
    const { lat, lon } = location;
    setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
  };

  const handleDeleteSelectedLocation = (index) => {
    const newList = locationList.filter((_, i) => i !== index);
    setLocationList(newList);
  };

  const handleDeleteAllLocations = () => {
    setLocationList([]);
    setSelectedMarkers([]);
    setVehiclePath([]);
    setVehiclePosition(null);
  };

  const handleMapClick = (e) => {
    const { latLng } = e;
    if (selectedMarkers.length < 2) {
      const newMarker = { lat: latLng.lat, lng: latLng.lng };
      setSelectedMarkers([...selectedMarkers, newMarker]);
      setLocationList([...locationList, newMarker]);
    }
  };

  return (
    <div className="tracker-container">
      <div className="settings-form">
        <form onSubmit={handleSearch}>
          <input type="text" name="address" placeholder="Input an address to center the map" />
          <button type="submit">Search</button>
        </form>
        <div className="location-list">
          <h4>Locations list</h4>
          <ul>
            {locationList.map((loc, index) => (
              <li key={index}>
                {loc.lat}, {loc.lng}
                <button onClick={() => handleDeleteSelectedLocation(index)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={handleDeleteAllLocations}>Delete All Locations</button>
        </div>
      </div>
      <MapComponent
        vehiclePath={vehiclePath}
        vehiclePosition={vehiclePosition}
        center={center}
        onMapClick={handleMapClick}
        locationList={locationList}
        selectedMarkers={selectedMarkers}
      />
    </div>
  );
};

export default VehicleTracker;
