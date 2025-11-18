// apps/web/pages/Products.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import ProductModal from "@/components/ProductModal";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import BottomNav from "../components/BottomNav";

const Wrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(8)};

  h1 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.8rem;
    font-weight: 600;
  }
  .cart-icon {
    position: relative;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary};
  }
  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CategoryBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

const CategoryButton = styled(motion.button)<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "transparent"};
  color: ${({ active, theme }) =>
    active ? theme.colors.secondary : theme.colors.text};
  font-weight: 600;
  cursor: pointer;
`;

const SearchBox = styled.input`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto ${({ theme }) => theme.spacing(8)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing(8)};
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  cursor: pointer;
  transition: 0.28s;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);

  &:hover {
    transform: translateY(-4px) scale(1.02);
    background: rgba(255, 255, 255, 0.15);
  }

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: ${({ theme }) => theme.spacing(3)};
  }

  .name {
    font-size: 1.05rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 4px;
  }

  .price {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.85;
    margin-bottom: 2px;
  }

  .desc {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.mutedText};
    margin-top: 4px;
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedText};
  margin-top: ${({ theme }) => theme.spacing(8)};
`;

export default function Products() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [category, setCategory] = useState("fish");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  // DEBOUNCE search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(t);
  }, [search]);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      let query = "";

      if (debouncedSearch) query = `?search=${debouncedSearch}`;
      else if (category) query = `?category=${category}`;

      try {
        const data = await apiHandler.get(`/api/products${query}`);
        setProducts(data.products || []);
      } catch (err) {
        showToast("Failed to load products", "error");
      }
    };

    fetchProducts();
  }, [category, debouncedSearch]);

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem("iraitchi_cart") || "[]");
    setCartCount(cart.length);
  }, [selectedProduct]);

  return (
    <Wrapper>
      {/* HEADER */}
      <Header>
        <h1>Iraitchi</h1>
        {/* <div className="cart-icon" onClick={() => navigate("/cart")}>
          <ShoppingCart size={26} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div> */}
      </Header>

      {/* CATEGORY */}
      <CategoryBar>
        {["fish", "meat", "poultry"].map((cat) => (
          <CategoryButton
            key={cat}
            active={category === cat}
            onClick={() => {
              setCategory(cat);
              setSearch("");
            }}
          >
            {cat.toUpperCase()}
          </CategoryButton>
        ))}
      </CategoryBar>

      {/* SEARCH */}
      <SearchBox
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          const v = e.target.value;
          setSearch(v);
          if (v.trim() !== "") setCategory(""); // reset category
          else setCategory("fish");
        }}
      />

      {/* LIST */}
      <Grid>
        <AnimatePresence mode="wait">
          {products.length > 0 ? (
            products.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card onClick={() => setSelectedProduct(item)}>
                  <img src={item.image} alt={item.name} />

                  <div className="name">{item.name}</div>

                  <div className="price">
                    {item.category === "fish" ? (
                      <>₹ {item.priceOptions?.[0]?.price || 0} / kg</>
                    ) : (
                      <>
                        ₹ {item.price} / {item.netWeight}
                      </>
                    )}
                  </div>

                  <div className="desc">{item.description}</div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <EmptyState>No products found</EmptyState>
            </motion.div>
          )}
        </AnimatePresence>
      </Grid>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
      <BottomNav />
    </Wrapper>
  );
}
