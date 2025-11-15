// src/pages/employee/superAdmin/components/AdminForm.tsx
import styled from "styled-components";
import { useState } from "react";
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
  max-width: 420px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;

  input { flex: 1; }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

const Actions = styled.div`
  display:flex;
  gap:8px;
  margin-top: 12px;
`;

export default function AdminForm({ defaultValues, onClose, onSuccess }: any) {
  const isEdit = !!defaultValues;
  const { showToast } = useToast();

  const [name, setName] = useState(defaultValues?.name || "");
  const [mobile, setMobile] = useState(defaultValues?.mobile || "");
  const [email, setEmail] = useState(defaultValues?.email || "");
  const [aadhaar, setAadhaar] = useState(defaultValues?.aadhaar || "");
  const [pan, setPan] = useState(defaultValues?.pan || "");
  const [drivingLicence, setDrivingLicence] = useState(defaultValues?.drivingLicence || "");
  const [pincodesRaw, setPincodesRaw] = useState((defaultValues?.pincodes || []).join ? (defaultValues?.pincodes || []).join(", ") : (defaultValues?.pincodes || ""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = name.trim() !== "" && /^\d{10}$/.test(mobile) && (isEdit ? true : password.trim().length >= 6);

  const handleSubmit = async () => {
    if (!valid) {
      showToast("Please fill required fields correctly", "error");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        aadhaar: aadhaar.trim() || undefined,
        pan: pan.trim() || undefined,
        drivingLicence: drivingLicence.trim() || undefined,
        pincodes: pincodesRaw ? pincodesRaw.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      };

      if (!isEdit) payload.password = password;

      if (isEdit) {
        await apiHandler.patch(`/api/superadmin/admins/${defaultValues._id}`, payload);
        showToast("Admin updated successfully", "success");
      } else {
        await apiHandler.post("/api/superadmin/admins", payload);
        showToast("Admin created successfully", "success");
      }

      onClose();
      onSuccess();
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

        <div style={{ marginBottom: 8 }}>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <Input placeholder="Mobile (10 digits)" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <Input placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <Row>
          <Input placeholder="Aadhaar (optional)" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
          <Input placeholder="PAN (optional)" value={pan} onChange={(e) => setPan(e.target.value)} />
        </Row>

        <div style={{ marginBottom: 8 }}>
          <Input placeholder="Driving Licence (optional)" value={drivingLicence} onChange={(e) => setDrivingLicence(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <Input placeholder="Pincodes (comma separated)" value={pincodesRaw} onChange={(e) => setPincodesRaw(e.target.value)} />
        </div>

        {!isEdit && (
          <div style={{ marginBottom: 8 }}>
            <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}

        <Actions>
          <button
            onClick={handleSubmit}
            disabled={!valid || loading}
            style={{ flex: 1, background: loading ? "rgba(255,235,59,0.3)" : undefined }}
          >
            {loading ? "Please wait..." : isEdit ? "Update Admin" : "Create Admin"}
          </button>

          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)" }}>
            Cancel
          </button>
        </Actions>
      </Box>
    </Overlay>
  );
}
