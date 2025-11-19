import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {MapPin} from "lucide-react";

const markerIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg width="48" height="48" viewBox="0 0 48 48" 
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="black" flood-opacity="0.4"/>
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path d="M24 4C15.72 4 9 10.72 9 19c0 10.5 13.07 24.09 14.02 25.02a1.4 1.4 0 002 0C25.93 43.09 39 29.5 39 19c0-8.28-6.72-15-15-15zm0 21.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"
                  fill="#FF3B30"/>
          </g>
        </svg>
      `),
    iconSize: [46, 46],
    iconAnchor: [23, 46],
    popupAnchor: [0, -46],
  });

export default function DraggableMarkerMap({ geo, onTempGeoUpdate, editMode }: any) {
  const eventHandlers: any = editMode
    ? {
        dragend(e: any) {
          const pos = e.target.getLatLng();
          const newGeo = { lat: pos.lat, long: pos.lng };
          console.log("🟡 Dragged to:", newGeo);
          onTempGeoUpdate(newGeo);
        },
      }
    : {};

  return (
    <MapContainer
      center={[geo.lat, geo.long]}
      zoom={18}
      style={{
        height: "260px",
        width: "100%",
        borderRadius: "12px",
        marginTop: "12px",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker
        position={[geo.lat, geo.long]}
        draggable={editMode}
        eventHandlers={eventHandlers}
        icon={markerIcon}
      >
        <Popup>{editMode ? "Drag to adjust" : "Your location"}</Popup>
      </Marker>
    </MapContainer>
  );
}
