// src/pages/employee/superAdmin/components/ShopFormModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";

// ---------------- UI Components ----------------
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
`;

const ModalBox = styled(motion.div)`
  width: 92%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.secondary};
  padding: 1.3rem;
  border-radius: 12px;
  position: relative;
  color: white;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  color: white;
  padding: 4px;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 4px;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  display: block;
  margin-top: 0.6rem;
`;

const Row = styled.div`
  margin: 0.4rem 0;
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  margin-top: 1rem;
`;

// ----------------------------------------------------

export default function ShopFormModal({ isOpen, onClose, editData, onSaved }: any) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const isEditing = !!editData;

  const [form, setForm] = useState({
    name: "",
    pincode: "",
    description: "",
    openTime: "",
    closeTime: "",
    isOpen: true,

    adminIds: [] as string[],
    driverIds: [] as string[],
  });

  // ---------------- PREFILL FOR EDIT ------------------
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        pincode: editData.pincode || "",
        description: editData.description || "",
        openTime: editData.openTime || "",
        closeTime: editData.closeTime || "",
        isOpen: editData.isOpen ?? true,

        // ⭐ FIX: PRE-SELECT ADMINS & DRIVERS
        adminIds: (editData.admins || []).map((a: any) => a._id || a),
driverIds: (editData.drivers || []).map((d: any) => d._id || d),
      });
    }
  }, [editData]);

  // ---------------- LOAD ADMINS + DRIVERS ----------------
  useEffect(() => {
    (async () => {
      try {
        const adminRes = await apiHandler.get("/api/superadmin/admins");
        const driverRes = await apiHandler.get("/api/superadmin/drivers");

        setAdmins(adminRes?.admins || []);
        setDrivers(driverRes?.drivers || []);
      } catch (err) {
        showToast("Failed to load admins/drivers", "error");
      }
    })();
  }, []);

  const handleForm = (key: string, val: any) => {
    setForm((p) => ({ ...p, [key]: val }));
  };

  // Toggle selection for admin/driver
  const toggleSelect = (listName: "adminIds" | "driverIds", id: string) => {
    setForm((p) => {
      const exists = p[listName].includes(id);
      const updated = exists ? p[listName].filter((x) => x !== id) : [...p[listName], id];
      return { ...p, [listName]: updated };
    });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!form.name || !form.pincode || !form.openTime || !form.closeTime) {
      return showToast("Fill all required fields", "error");
    }

    const payload = {
      name: form.name,
      pincode: form.pincode,
      description: form.description,
      openTime: form.openTime,
      closeTime: form.closeTime,
      isOpen: form.isOpen,

      adminIds: form.adminIds,
      driverIds: form.driverIds,
    };

    try {
      setLoading(true);

      if (isEditing) {
        await apiHandler.patch(`/api/superadmin/shops/${editData._id}`, payload);
        await apiHandler.post("/api/superadmin/shops/link-admins", {
          shopId: editData._id,
          adminIds: form.adminIds,
        });
        await apiHandler.post("/api/superadmin/shops/link-drivers", {
          shopId: editData._id,
          driverIds: form.driverIds,
        });

        showToast("Shop updated!", "success");
      } else {
        await apiHandler.post("/api/superadmin/shops", payload);
        showToast("Shop created!", "success");
      }

      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err?.toString() || "Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ModalBox initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
            <CloseBtn onClick={onClose}>
              <X size={22} />
            </CloseBtn>

            <h2 style={{ marginBottom: "1rem" }}>
              {isEditing ? "Edit Shop" : "Add Shop"}
            </h2>

            {/* BASIC FIELDS */}
            <Label>Shop Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleForm("name", e.target.value)}
            />

            <Label>Pincode *</Label>
            <Input
              value={form.pincode}
              onChange={(e) => handleForm("pincode", e.target.value)}
            />

            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => handleForm("description", e.target.value)}
            />

            <Label>Open Time *</Label>
            <Input
              value={form.openTime}
              onChange={(e) => handleForm("openTime", e.target.value)}
            />

            <Label>Close Time *</Label>
            <Input
              value={form.closeTime}
              onChange={(e) => handleForm("closeTime", e.target.value)}
            />

            <Row>
              <input
                type="checkbox"
                checked={form.isOpen}
                onChange={(e) => handleForm("isOpen", e.target.checked)}
              />
              <span>Shop Open</span>
            </Row>

            {/* ---------------- ADMINS ---------------- */}
            <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Assign Admins</h3>
            {admins.length === 0 && <p>No admins available</p>}

            {admins.map((a) => (
              <Row key={a._id}>
                <input
                  type="checkbox"
                  checked={form.adminIds.includes(a._id)}
                  onChange={() => toggleSelect("adminIds", a._id)}
                />
                <span>{a.name} ({a.mobile})</span>
              </Row>
            ))}

            {/* ---------------- DRIVERS ---------------- */}
            <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Assign Drivers</h3>
            {drivers.length === 0 && <p>No drivers available</p>}

            {drivers.map((d) => (
              <Row key={d._id}>
                <input
                  type="checkbox"
                  checked={form.driverIds.includes(d._id)}
                  onChange={() => toggleSelect("driverIds", d._id)}
                />
                <span>{d.name} ({d.mobile})</span>
              </Row>
            ))}

            <SubmitBtn disabled={loading} onClick={handleSubmit}>
              {loading ? "Saving..." : isEditing ? "Update Shop" : "Add Shop"}
            </SubmitBtn>
          </ModalBox>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
