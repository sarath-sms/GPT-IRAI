// src/pages/employee/superAdmin/ShopList.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plus, Pencil, Trash2, Search, MapPin } from "lucide-react";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import ShopFormModal from "./components/ShopFormModal";

const Wrapper = styled.div`
  padding: 1.5rem;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const AddBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.65rem 1.3rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background: transparent;
    color: white;
    font-size: 0.9rem;
  }

  svg {
    position: absolute;
    right: 10px;
    top: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.div`
  h4 {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 0.85rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;

  button {
    background: transparent;
    padding: 4px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Toggle = styled.button<{ active: boolean }>`
  padding: 0.45rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  background: ${({ active }) => (active ? "#16a34a" : "#dc2626")};
  color: white;
`;

export default function ShopList() {
  const { showToast } = useToast();

  const [shops, setShops] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // 🔎 Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  // Load shops
  const loadShops = async () => {
    try {
      const data = await apiHandler.get("/api/superadmin/shops", {
        search: debouncedSearch,
      });
      const list = Array.isArray(data) ? data : data?.shops || [];
setShops(list);
    } catch (err: any) {
      showToast(err, "error");
    }
  };

  useEffect(() => {
    loadShops();
  }, [debouncedSearch]);

  // Toggle open/close
  const handleToggle = async (shop: any) => {
    try {
      await apiHandler.patch(`/api/superadmin/shops/${shop._id}/toggle`);
      showToast("Shop updated!", "success");
      loadShops();
    } catch (err: any) {
      showToast(err, "error");
    }
  };

  // Delete shop
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shop?")) return;

    try {
      await apiHandler.del(`/api/superadmin/shops/${id}`);
      showToast("Shop deleted", "success");
      loadShops();
    } catch (err: any) {
      showToast(err, "error");
    }
  };

  // Edit
  const handleEdit = (shop: any) => {
    setEditData(shop);
    setModalOpen(true);
  };

  return (
    <Wrapper>
      <Header>
        <Title>Shops</Title>
        <AddBtn
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Shop
        </AddBtn>
      </Header>

      <SearchBox>
        <input
          placeholder="Search by name / pincode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={18} />
      </SearchBox>

      <Grid>
        {shops.map((shop) => (
          <Card key={shop._id}>
            <Info>
              <h4>{shop.name}</h4>
              <p>
                <MapPin size={14} style={{ marginRight: 4 }} />
                {shop.pincode}
              </p>
              <p>{shop.admins?.length || 0} Admins • {shop.drivers?.length || 0} Drivers</p>
            </Info>

            <Actions>
              <Toggle
                active={shop.isOpen}
                onClick={() => handleToggle(shop)}
              >
                {shop.isOpen ? "Open" : "Closed"}
              </Toggle>

              <button onClick={() => handleEdit(shop)}>
                <Pencil size={18} />
              </button>

              <button onClick={() => handleDelete(shop._id)}>
                <Trash2 size={18} />
              </button>
            </Actions>
          </Card>
        ))}
      </Grid>

      {modalOpen && (
        <ShopFormModal
          isOpen={modalOpen}
          editData={editData}
          onClose={() => setModalOpen(false)}
          onSaved={loadShops}
        />
      )}
    </Wrapper>
  );
}
