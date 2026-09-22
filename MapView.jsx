import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Default Leaflet marker icon fix (Vite doesn't resolve marker assets automatically)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onSelect }) {
  useMapEvents({ click(e) { onSelect?.(e.latlng); } });
  return null;
}

// Single-marker, editable map used in the citizen report flow (drag or click to adjust GPS)
export default function MapView({ lat, lng, onChange, height = 300, markers }) {
  if (markers) {
    return (
      <MapContainer center={[markers[0]?.lat || 21.15, markers[0]?.lng || 79.09]} zoom={12} style={{ height, width: "100%", borderRadius: 12 }}>
        <TileLayer url={import.meta.env.VITE_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} attribution="&copy; OpenStreetMap contributors" />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }

  return (
    <MapContainer center={[lat || 21.1458, lng || 79.0882]} zoom={15} style={{ height, width: "100%", borderRadius: 12 }}>
      <TileLayer url={import.meta.env.VITE_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} attribution="&copy; OpenStreetMap contributors" />
      {onChange && <ClickHandler onSelect={(latlng) => onChange(latlng.lat, latlng.lng)} />}
      {lat && lng && (
        <Marker
          position={[lat, lng]}
          draggable={!!onChange}
          eventHandlers={onChange ? { dragend: (e) => { const p = e.target.getLatLng(); onChange(p.lat, p.lng); } } : {}}
        />
      )}
    </MapContainer>
  );
}
