import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map({ places, searchCenter }) {
  const center = searchCenter || (places.length > 0 
    ? [
        places.reduce((sum, p) => sum + (p.point?.lat || p.lat), 0) / places.length,
        places.reduce((sum, p) => sum + (p.point?.lon || p.lon), 0) / places.length
      ]
    : [40.7128, -74.0060]);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border">
      <MapContainer key={`${center[0]}-${center[1]}`} center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {places.map((place, index) => (
          <Marker key={index} position={[place.point?.lat || place.lat, place.point?.lon || place.lon]}>
            <Popup>
              <div>
                <h3 className="font-semibold">{place.title || place.name}</h3>
                <p className="text-sm">{place.extract || place.address || 'No description available'}</p>
                {place.distance && (
                  <p className="text-xs text-gray-500">{(place.distance / 1000).toFixed(2)} km away</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}