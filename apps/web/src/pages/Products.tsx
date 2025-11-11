import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProductModal from '@/components/ProductModal';
import { category1, category2 } from '@/data/products';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
  position: relative;
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
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? theme.colors.secondary : theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
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

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(255, 235, 59, 0.4);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing(8)};
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing(6)};
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    transform: scale(1.03);
    background: rgba(255, 255, 255, 0.1);
  }

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }

  h3 {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.mutedText};
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedText};
  margin-top: ${({ theme }) => theme.spacing(8)};
`;

export default function Products() {
  const [category, setCategory] = useState<string>('fish');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const navigate = useNavigate();

  const products = [...category1, ...category2];

  // 🕒 Debounce search (0.8 s)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 800);
    return () => clearTimeout(handler);
  }, [search]);

  // 🧠 Smart reactive filter
  const visibleProducts = products.filter((p) => {
    if (debouncedSearch.trim() !== '') {
      return p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    }
    const currentCategory = category || 'fish';
    return p.category === currentCategory;
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('iraitchi_cart') || '[]');
    setCartCount(cart.length);
  }, [selectedProduct]);

  return (
    <Wrapper>
      <Header>
        <h1>Iraitchi</h1>
        <div className="cart-icon" onClick={() => navigate('/cart')}>
          <ShoppingCart size={26} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </Header>

      {/* 🔹 Category buttons */}
      <CategoryBar>
        {['fish', 'meat'].map((cat) => (
          <CategoryButton
            key={cat}
            active={category === cat}
            onClick={() => {
              setCategory(cat);
              setSearch('');
            }}
            whileHover={{ scale: 1.05 }}
          >
            {cat.toUpperCase()}
          </CategoryButton>
        ))}
      </CategoryBar>

      {/* 🔹 Search input */}
      <SearchBox
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          if (value.trim() !== '') setCategory('');
          else setCategory('fish'); // default fallback
        }}
      />

      {/* 🔹 Product grid with transitions */}
      <Grid>
        <AnimatePresence mode="wait">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Card onClick={() => setSelectedProduct(item)}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>

                  {item.category === 'fish' ? (
                    <>
                      <p>Base: ₹ {item.priceOptions?.[0]?.price || 0}</p>
                      <small>Cut Types:</small>
                      <ul style={{ listStyle: 'none', padding: 0, marginTop: 4 }}>
                        {item.cutTypes.map((cut: any) => (
                          <li key={cut.type}>
                            {cut.type}: +₹{cut.price}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>
                      {item.netWeight} — ₹ {item.price}
                    </p>
                  )}

                  <p style={{ color: '#BFC6DC', marginTop: 8 }}>
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState>No products found</EmptyState>
            </motion.div>
          )}
        </AnimatePresence>
      </Grid>

      {/* 🔹 Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
