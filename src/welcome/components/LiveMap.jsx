import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FaBus,
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';

// Fix for default marker icons in Leaflet
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map view updates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

function LiveMap({ bus, onBack, onContinue }) {
  // Default to Kigali coordinates if no bus location is provided
  const [position, setPosition] = useState([-1.9441, 30.0619]);
  const [zoom] = useState(13);

  // Update position if bus location changes
  useEffect(() => {
    if (bus?.location?.lat && bus?.location?.lng) {
      setPosition([bus.location.lat, bus.location.lng]);
    }
  }, [bus]);

  // Get bus status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'on-time':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>Live Bus Location</h2>
        <div className="bus-info">
          <div className="bus-name">
            <FaBus className="mr-2" />
            {bus?.name || 'Bus'} {bus?.number || ''}
          </div>
          <div className={`status-badge ${getStatusColor(bus?.status)}`}>
            {bus?.status || 'In Transit'}
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={position}
          zoom={zoom}
          className="live-map"
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
          zoomControl={false}
        >
          <ChangeView center={position} zoom={zoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={defaultIcon}>
            <Popup>
              <div className="popup-content">
                <h4>{bus?.name || 'Bus'}</h4>
                <p>
                  Status: <strong>{bus?.status || 'In Transit'}</strong>
                </p>
                <p>
                  Speed: <strong>{bus?.speed || 'N/A'} km/h</strong>
                </p>
                <p>
                  Last Updated:{' '}
                  <strong>{new Date().toLocaleTimeString()}</strong>
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="map-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          <FaArrowLeft className="mr-2" /> Back to Details
        </button>
        <button className="btn btn-primary" onClick={onContinue}>
          Continue to Seat Selection <FaArrowRight className="ml-2" />
        </button>
      </div>

      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <FaMapMarkerAlt className="legend-icon" style={{ color: 'red' }} />
          <span>Bus Location</span>
        </div>
      </div>
    </div>
  );
}

export default LiveMap;
