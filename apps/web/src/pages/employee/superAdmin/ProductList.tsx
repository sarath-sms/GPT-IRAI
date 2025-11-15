// src/pages/employee/superAdmin/ProductList.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import ProductFormModal from "./components/ProductFormModal";

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
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    object-fit: cover;
  }

  .info {
    flex: 1;

    h4 {
      color: ${({ theme }) => theme.colors.primary};
      font-size: 1rem;
    }

    p {
      font-size: 0.85rem;
      color: ${({ theme }) => theme.colors.mutedText};
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;

    button {
      background: transparent;
      color: ${({ theme }) => theme.colors.primary};
      padding: 4px;
    }
  }
`;

export default function ProductList() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Debounce Search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(t);
  }, [search]);

  // Load Products
  const loadProducts = async () => {
    try {
      const res = await apiHandler.get("/api/superadmin/products", {
        search: debouncedSearch,
      });

      setProducts(res?.products || []);
    } catch (err: any) {
      showToast(err?.toString() || "Failed loading products", "error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [debouncedSearch]);

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await apiHandler.del(`/api/superadmin/products/${id}`);
      showToast("Product deleted", "success");
      loadProducts();
    } catch (err: any) {
      showToast(err?.toString() || "Delete failed", "error");
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>Products</Title>

        <AddBtn
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Product
        </AddBtn>
      </Header>

      <SearchBox>
        <input
          placeholder="Search product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={18} />
      </SearchBox>

      <Grid>
        {products.map((p) => (
          <Card key={p._id}>
            <img src={p.image || "https://via.placeholder.com/80"} />

            <div className="info">
              <h4>{p.name}</h4>
              <p>
                {p.category} • {p.subCategory}
              </p>
              <p>
                Base: ₹
                {p.category === "Fish"
                  ? (p.priceOptions?.[0]?.price || 0)
                  : p.price}
              </p>
            </div>

            <div className="actions">
              <button
                onClick={() => {
                  setEditingProduct(p);
                  setModalOpen(true);
                }}
              >
                <Pencil size={18} />
              </button>

              <button onClick={() => handleDelete(p._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </Card>
        ))}
      </Grid>

      {/* MODAL */}
      {modalOpen && (
        <ProductFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editData={editingProduct}     // ✅ CORRECT PROP NAME
          refreshList={loadProducts}    // ✅ CORRECT CALLBACK NAME
        />
      )}
    </Wrapper>
  );
}
