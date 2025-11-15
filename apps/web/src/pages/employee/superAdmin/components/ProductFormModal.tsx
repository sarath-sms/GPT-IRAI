// src/pages/employee/superAdmin/ProductFormModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
`;

const ModalBox = styled(motion.div)`
  width: 92%;
  max-width: 450px;
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
  padding: 0.65rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  display: block;
  margin-top: 0.6rem;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 0.7rem;

  & > input {
    flex: 1;
  }
`;

const AddBtn = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #1e293b;
  margin-bottom: 1rem;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  margin-top: 1rem;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;

  input {
    width: 18px;
    height: 18px;
  }
`;

export default function ProductFormModal({ isOpen, onClose, editData, refreshList }: any) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const isEditing = !!editData;

  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "",
    subCategory: "",
    available: true,
    price: "",
    netWeight: "",
    priceOptions: [{ type: "", price: "" }],
    cutTypes: [{ type: "", price: "" }],
  });

  // Prefill form
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        image: editData.image,
        category: editData.category,
        subCategory: editData.subCategory,
        available: editData.available,
        price: editData.price || "",
        netWeight: editData.netWeight || "",
        priceOptions: editData.priceOptions?.length
          ? editData.priceOptions
          : [{ type: "", price: "" }],
        cutTypes: editData.cutTypes?.length
          ? editData.cutTypes
          : [{ type: "", price: "" }],
      });
    }
  }, [editData]);

  const handleForm = (key: string, val: any) =>
    setForm((p) => ({ ...p, [key]: val }));

  const updateArray = (list: string, i: number, key: string, val: string) => {
    setForm((p) => {
      const arr = [...(p as any)[list]];
      arr[i][key] = val;
      return { ...p, [list]: arr };
    });
  };

  const addArray = (list: string) => {
    setForm((p) => ({
      ...p,
      [list]: [...(p as any)[list], { type: "", price: "" }],
    }));
  };

  const removeArray = (list: string, i: number) => {
    setForm((p) => {
      const arr = [...(p as any)[list]];
      if (arr.length === 1) return p;
      arr.splice(i, 1);
      return { ...p, [list]: arr };
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.image || !form.category) {
      return showToast("Fill all required fields", "error");
    }

    const payload: any = {
      name: form.name,
      image: form.image,
      category: form.category,
      subCategory: form.subCategory,
      available: form.available,
    };

    if (form.category === "Fish") {
      payload.priceOptions = form.priceOptions;
      payload.cutTypes = form.cutTypes;
    } else {
      payload.price = form.price;
      payload.netWeight = form.netWeight;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await apiHandler.put(`/api/superadmin/products/${editData._id}`, payload);
        showToast("Product updated", "success");
      } else {
        await apiHandler.post(`/api/superadmin/products`, payload);
        showToast("Product added", "success");
      }

      refreshList();
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
          <ModalBox initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}>
            <CloseBtn onClick={onClose}>
              <X size={22} />
            </CloseBtn>

            <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>

            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleForm("name", e.target.value)}
            />

            <Label>Image URL</Label>
            <Input
              value={form.image}
              onChange={(e) => handleForm("image", e.target.value)}
            />

            <Label>Category</Label>
            <select
              style={{ width: "100%", padding: 12, marginBottom: 12 }}
              value={form.category}
              onChange={(e) => handleForm("category", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Fish">Fish</option>
              <option value="Meat">Meat</option>
              <option value="Poultry">Poultry</option>
            </select>

            <Label>Sub Category</Label>
            <Input
              value={form.subCategory}
              onChange={(e) => handleForm("subCategory", e.target.value)}
            />

            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => handleForm("available", e.target.checked)}
              />
              <span>Available</span>
            </CheckboxRow>

            {/* FISH */}
            {form.category === "Fish" && (
              <>
                <h4>Price Options</h4>
                {form.priceOptions.map((opt, i) => (
                  <Row key={i}>
                    <input
                      placeholder="Type"
                      value={opt.type}
                      onChange={(e) => updateArray("priceOptions", i, "type", e.target.value)}
                    />
                    <input
                      placeholder="Price"
                      value={opt.price}
                      onChange={(e) => updateArray("priceOptions", i, "price", e.target.value)}
                    />
                    <button onClick={() => removeArray("priceOptions", i)}>❌</button>
                  </Row>
                ))}
                <AddBtn onClick={() => addArray("priceOptions")}>+ Add Size</AddBtn>

                <h4>Cut Types</h4>
                {form.cutTypes.map((opt, i) => (
                  <Row key={i}>
                    <input
                      placeholder="Cut Type"
                      value={opt.type}
                      onChange={(e) => updateArray("cutTypes", i, "type", e.target.value)}
                    />
                    <input
                      placeholder="Price"
                      value={opt.price}
                      onChange={(e) => updateArray("cutTypes", i, "price", e.target.value)}
                    />
                    <button onClick={() => removeArray("cutTypes", i)}>❌</button>
                  </Row>
                ))}
                <AddBtn onClick={() => addArray("cutTypes")}>+ Add Cut Type</AddBtn>
              </>
            )}

            {/* MEAT / POULTRY */}
            {(form.category === "Meat" || form.category === "Poultry") && (
              <>
                <Label>Net Weight (g / kg)</Label>
                <Input
                  value={form.netWeight}
                  onChange={(e) => handleForm("netWeight", e.target.value)}
                />

                <Label>Price</Label>
                <Input
                  value={form.price}
                  type="number"
                  onChange={(e) => handleForm("price", e.target.value)}
                />
              </>
            )}

            <SubmitBtn disabled={loading} onClick={handleSubmit}>
              {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
            </SubmitBtn>
          </ModalBox>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
