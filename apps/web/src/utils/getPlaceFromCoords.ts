// utils/getPlaceFromCoords.ts
export async function getPlaceFromCoords(lat: number, long: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`;
  
      const res = await fetch(url, {
        headers: { "User-Agent": "IraitchiApp/1.0" }
      });
  
      const data = await res.json();
  
      if (!data?.address) return null;
  
      return {
        displayName: data.display_name,
        area:
          data.address.suburb ||
          data.address.village ||
          data.address.town ||
          data.address.city ||
          "",
        street: data.address.road || data.address.neighbourhood || "",
        pincode: data.address.postcode || "",
      };
    } catch (err) {
      console.warn("Reverse geocode failed", err);
      return null;
    }
  }
  