// components/LocationSection.tsx
import styled from "styled-components";
import { motion } from "framer-motion";
import DraggableMarkerMap from "@/components/DraggableMarkerMap";
import { getPlaceFromCoords } from "@/utils/getPlaceFromCoords";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Button = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
`;

const ConfirmBox = styled.div`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 12px;
  border-radius: 10px;
  margin-top: 16px;
`;

export default function LocationSection() {
  const [editMode, setEditMode] = useState(false);
  const [tempGeo, setTempGeo] = useState<any>(null);
 
    const { user, updateUser } = useAuth();
  const geo = user.geo;

  const onGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;

        const newGeo = { lat, long };
        const info = await getPlaceFromCoords(lat, long);

        updateUser({
          geo: newGeo,
          // pincode: info?.pincode || "",
          // address: {
          //   ...user.address,
          //   addr1: info?.street || "",
          //   addr2: info?.area || "",
          // },
        });
      },
      () => alert("Location access denied!")
    );
  };

  const confirmLocation = () => {
    if (!tempGeo) return;

    getPlaceFromCoords(tempGeo.lat, tempGeo.long).then((info) => {
      const updatedUser = {
        ...user,
        geo: tempGeo,
        pincode: user.pincode || info?.pincode,
        // address: {
        //   addr1: info?.street || "",
        //   addr2: info?.area || "",
        //   ...user.address,
        // },
      };

      updateUser(updatedUser);
    });

    setTempGeo(null);
    setEditMode(false);
  };

  const cancelLocation = () => {
    setTempGeo(null);
    setEditMode(false);
  };

  /** UI STATES **/
  if (!user?.geo) {
    return (
      <Button whileTap={{ scale: 0.98 }} onClick={onGetLocation}>
        Detect My Location
      </Button>
    );
  }

  return (
    <>
      {/* SHOW MAP */}
      <DraggableMarkerMap
        geo={tempGeo || geo}
        onTempGeoUpdate={(g: any) => setTempGeo(g)}
        editMode={editMode}
      />

      {/* INFO */}
      <p style={{ marginTop: 10 }}>
        {editMode && "📍 Move the pin & confirm your location"}
      </p>

      {/* EDIT BUTTON */}
      {!editMode && (
        <Button whileTap={{ scale: 0.98 }} onClick={() => setEditMode(true)}>
          Edit Location
        </Button>
      )}

      {/* CONFIRMATION BOX */}
      {editMode && tempGeo && (
        <ConfirmBox>
          <p>Confirm this location?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={confirmLocation}>✔ Confirm</Button>
            <Button
              onClick={cancelLocation}
              style={{ background: "transparent", border: "1px solid #FFEB3B", color: "#FFEB3B" }}
            >
              ✖ Cancel
            </Button>
          </div>
        </ConfirmBox>
      )}

      {/* RE-DETECT */}
      <Button onClick={onGetLocation}>Re-Detect Location</Button>
    </>
  );
}
