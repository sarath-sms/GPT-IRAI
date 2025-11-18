// components/MapPreview.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";

// Fix marker icons (Leaflet issue)
import "leaflet/dist/leaflet.css";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapBox = styled.div`
  width: 100%;
  height: 220px;
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255,255,255,0.15);
`;

export default function MapPreview({ geo }: any) {
  if (!geo) return null;

  return (
    <MapBox>
      <MapContainer
        center={[geo.lat, geo.long]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[geo.lat, geo.long]}>
          <Popup>You are here 🐟</Popup>
        </Marker>
      </MapContainer>
    </MapBox>
  );
}
