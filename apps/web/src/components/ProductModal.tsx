import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled(motion.div)`
  background: ${({ theme }) => theme.colors.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing(8)};
  color: ${({ theme }) => theme.colors.text};
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const RadioGroup = styled.div`
  margin: ${({ theme }) => theme.spacing(6)} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const RadioOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primary : 'rgba(255,255,255,0.2)'};
  background: ${({ selected }) =>
    selected ? 'rgba(255, 235, 59, 0.1)' : 'transparent'};
`;

const AddBtn = styled.button`
  margin-top: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(4)};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export default function ProductModal({ product, onClose }: any) {
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedCut, setSelectedCut] = useState<any>(null);
  const [price, setPrice] = useState(product.price || 0);

  useEffect(() => {
    // auto-select first available price option (Medium preferred)
    if (product.priceOptions && product.priceOptions.length > 0) {
      const medium =
        product.priceOptions.find((opt: any) => opt.type === 'Medium') ||
        product.priceOptions[0];
      setSelectedSize(medium);
      setPrice(medium.price);
    } else {
      setPrice(product.price);
    }
  }, [product]);

  const handleCutChange = (cut: any) => {
    setSelectedCut(cut);
    setPrice(
      (selectedSize?.price || product.price) + (cut?.price || 0)
    );
  };

  const handleSizeChange = (opt: any) => {
    setSelectedSize(opt);
    const cutPrice = selectedCut?.price || 0;
    setPrice(opt.price + cutPrice);
  };

  const handleAddToCart = () => {
    const newItem = {
      id: product.id,
      name: product.name,
      size: selectedSize?.type || 'Default',
      cutType: selectedCut?.type || 'Standard',
      price,
      image: product.image,
    };

    const cart = JSON.parse(localStorage.getItem('iraitchi_cart') || '[]');
    localStorage.setItem('iraitchi_cart', JSON.stringify([...cart, newItem]));
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <Overlay
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalBox
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <CloseBtn onClick={onClose}>
              <X size={20} />
            </CloseBtn>

            <h2 style={{ color: '#FFEB3B', marginBottom: 10 }}>
              {product.name}
            </h2>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                borderRadius: 8,
                marginBottom: 20,
              }}
            />

            {/* Size options */}
            {product.priceOptions && product.priceOptions.length > 0 && (
              <RadioGroup>
                <strong>Choose Size:</strong>
                {product.priceOptions.map((opt: any) => (
                  <RadioOption
                    key={opt.type}
                    selected={selectedSize?.type === opt.type}
                    onClick={() => handleSizeChange(opt)}
                  >
                    <span>{opt.type}</span>
                    <span>₹{opt.price}</span>
                  </RadioOption>
                ))}
              </RadioGroup>
            )}

            {/* Cut types */}
            {product.cutTypes && product.cutTypes.length > 0 && (
              <RadioGroup>
                <strong>Choose Cut Type:</strong>
                {product.cutTypes.map((cut: any) => (
                  <RadioOption
                    key={cut.type}
                    selected={selectedCut?.type === cut.type}
                    onClick={() => handleCutChange(cut)}
                  >
                    <span>{cut.type}</span>
                    <span>+₹{cut.price}</span>
                  </RadioOption>
                ))}
              </RadioGroup>
            )}

            <h3 style={{ marginTop: 20 }}>
              Total Price: <span style={{ color: '#FFEB3B' }}>₹{price}</span>
            </h3>

            <AddBtn onClick={handleAddToCart}>Add to Cart</AddBtn>
          </ModalBox>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
