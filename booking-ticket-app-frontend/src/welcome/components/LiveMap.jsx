import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LiveMap({ bus, seats }) {
  return (
    <div className="live-map-container">
      <MapContainer
        center={[-1.944, 30.089]}
        zoom={13}
        className="live-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[-1.944, 30.089]}>
          <Popup>
            {bus?.name || "Bus"} — Seats: {seats?.length || 0}
          </Popup>
        </Marker>
      </MapContainer>

      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <img
            src="https://cdn-icons-png.flaticon.com/512/61/61231.png"
            width="20"
            alt="bus"
          />{" "}
          Bus
        </div>
      </div>
    </div>
  );
}

export default LiveMap;
