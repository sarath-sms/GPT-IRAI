// src/pages/employee/superAdmin/components/AdminForm.tsx
import styled from "styled-components";
import { useState, useEffect } from "react";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 999;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  padding: 1.25rem;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
`;

const Tag = styled.div`
  background: rgba(255,235,59,0.18);
  border: 1px solid #FFEB3B;
  padding: 6px 10px;
  border-radius: 20px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.85rem;
`;

const TagBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

const Actions = styled.div`
  display:flex;
  gap:8px;
  margin-top: 12px;
`;

export default function AdminForm({ defaultValues, onClose, onSuccess }: any) {
  const isEdit = !!defaultValues;
  const { showToast } = useToast();

  // 🔹 Admin Fields
  const [name, setName] = useState(defaultValues?.name || "");
  const [mobile, setMobile] = useState(defaultValues?.mobile || "");
  const [email, setEmail] = useState(defaultValues?.email || "");
  const [aadhaar, setAadhaar] = useState(defaultValues?.aadhaar || "");
  const [pan, setPan] = useState(defaultValues?.pan || "");
  const [password, setPassword] = useState("");

  // 🔹 Shop Linking
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [adminShops, setAdminShops] = useState<any[]>((defaultValues?.adminShops || []).map((s: any) => s._id));

  const [loading, setLoading] = useState(false);

  // 🧲 Load Shops
  useEffect(() => {
    (async () => {
      const data = await apiHandler.get("/api/superadmin/shops");
      setShops(data?.shops || data);
    })();
  }, []);

  const addShop = () => {
    if (!selectedShop || adminShops.includes(selectedShop)) return;
    setAdminShops([...adminShops, selectedShop]);
  };

  const removeShop = (id: string) => {
    setAdminShops(adminShops.filter((s) => s !== id));
  };

  const valid =
    name.trim() !== "" &&
    /^\d{10}$/.test(mobile) &&
    (isEdit || password.length >= 6);

  /** 🚀 SAVE HANDLER */
  const handleSubmit = async () => {
    if (!valid) {
      showToast("Please fill all fields correctly", "error");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name,
        mobile,
        email,
        aadhaar,
        pan,
        adminShops,
      };

      if (!isEdit) payload.password = password;

      if (isEdit) {
        await apiHandler.patch(`/api/superadmin/admins/${defaultValues._id}`, payload);
        showToast("Admin updated", "success");
      } else {
        await apiHandler.post("/api/superadmin/admins", payload);
        showToast("Admin created", "success");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Box>
        <h3 style={{ marginBottom: 8 }}>{isEdit ? "Edit Admin" : "Add Admin"}</h3>

        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Mobile (10 digits)" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <Input placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Aadhaar (optional)" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
        <Input placeholder="PAN (optional)" value={pan} onChange={(e) => setPan(e.target.value)} />

        {/* ⭐ SHOP ASSIGN UI */}
        <small>Assign Shops:</small>
        <Select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}>
          <option value="">-- Select Shop --</option>
          {shops.map((s: any) => (
            <option key={s._id} value={s._id}>{s.name} ({s.pincode})</option>
          ))}
        </Select>
        <button onClick={addShop} style={{ marginBottom: 10 }}>+ Add Shop</button>

        <TagBox>
          {adminShops.map((id) => {
            const shop = shops.find((s) => s._id === id);
            if (!shop) return null;
            return (
              <Tag key={id}>
                {shop.name} ({shop.pincode})
                <span style={{ cursor: "pointer" }} onClick={() => removeShop(id)}>❌</span>
              </Tag>
            );
          })}
        </TagBox>

        {!isEdit && (
          <Input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <Actions>
          <button disabled={!valid || loading} onClick={handleSubmit}>
            {loading ? "Please wait..." : isEdit ? "Update" : "Create"}
          </button>
          <button onClick={onClose} style={{ background: "grey" }}>
            Cancel
          </button>
        </Actions>
      </Box>
    </Overlay>
  );
}
