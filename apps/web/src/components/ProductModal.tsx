// apps/web/components/ProductModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CutTypes from "./productModal/CutTypes";
import { useNavigate } from "react-router-dom";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled(motion.div)`
  background: ${({ theme }) => theme.colors.secondary};
  padding: 18px;
  border-radius: 16px;
  width: 92%;
  max-width: 520px;
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

const Top = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;

  img {
    width: 96px;
    height: 72px;
    object-fit: cover;
    border-radius: 8px;
  }

  h2 {
    margin: 0;
    color: #FFEB3B;
  }
`;

const Section = styled.div`
  margin-top: 12px;
`;

const SizeCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  margin-bottom: 8px;
`;

const Left = styled.div``;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    color: ${({ theme }) => theme.colors.secondary};
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  span {
    min-width: 28px;
    display: inline-block;
    text-align: center;
  }
`;

const AddBtn = styled.button`
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

const ActionsRow = styled.div`
  margin-top: 12px;
  display:flex;
  gap:12px;
  align-items:center;
`;

/**
 * ProductModal
 * Props:
 * - product: product object (expects _id, name, image, priceOptions[], price, cutTypes[])
 * - onClose: () => void
 */
export default function ProductModal({ product, onClose }: any) {
  const navigate = useNavigate();
  const [cutType, setCutType] = useState<any>(null);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem("iraitchi_cart") || "[]");
    } catch {
      return [];
    }
  };

  // When modal opens: hydrate qtyMap + default cut
  useEffect(() => {
    if (!product) return;
    const cart = readCart();
    const map: Record<string, number> = {};
    let preferredCut: any = null;

    for (const c of cart) {
      if (c.productId === product._id) {
        map[c.size] = (map[c.size] || 0) + (c.qty || 0);
        if (!preferredCut && c.cutType) {
          preferredCut = { type: c.cutType, price: c.cutFee || 0 };
        }
      }
    }

    if (!preferredCut) {
      // pick first cut type, prefer one with 0 price if exists
      if (product.cutTypes?.length) {
        preferredCut = product.cutTypes.find((ct: any) => ct.price === 0) || product.cutTypes[0];
      } else {
        preferredCut = { type: "Standard", price: 0 };
      }
    }

    setQtyMap(map);
    setCutType(preferredCut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  // utility: compute unit price for a size option (handles priceOptions or fixed price)
  const unitPriceFor = (sizeOpt: any) => {
    const base = sizeOpt?.price ?? product?.price ?? 0;
    const cut = (cutType?.price ?? 0);
    // ensure numeric
    const b = Number(base) || 0;
    const c = Number(cut) || 0;
    return b + c;
  };

  // update qty in UI only
  const updateQty = (size: string, delta: number) => {
    setQtyMap((prev) => {
      const cur = prev[size] || 0;
      const next = cur + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[size];
        return copy;
      }
      return { ...prev, [size]: next };
    });
  };

  // Build canonical item id
  const makeId = (productId: string, size: string, cutName: string) => {
    return `${productId}-${size}-${cutName}`.replace(/\s+/g, "-").toLowerCase();
  };

  // Persist qtyMap into cart atomically (merge entries)
  const sizeOptions = product.priceOptions?.length
? product.priceOptions
: [{ type: product.netWeight || "Default", price: product.price }];
  const saveQtyMapToCart = () => {
    const cart: any[] = readCart();
    const nextCart = [...cart];


    for (const opt of sizeOptions) {
      const size = opt.type;
      const q = qtyMap[size] || 0;
      const cutName = (cutType?.type || "Standard");
      const cutFee = Number(cutType?.price || 0) || 0;
      const unitPrice = unitPriceFor(opt);
      const total = unitPrice * q;
      const id = makeId(product._id, size, cutName);

      const idx = nextCart.findIndex((c) => c.id === id);

      if (q > 0) {
        const entry = {
          id,
          productId: product._id,
          name: product.name,
          size,
          qty: q,
          cutType: cutName,
          cutFee,
          unitPrice,
          total,
          image: product.image,
        };
        if (idx >= 0) {
          // update existing
          nextCart[idx] = { ...nextCart[idx], ...entry };
        } else {
          nextCart.push(entry);
        }
      } else {
        // q === 0 => remove if exists
        if (idx >= 0) nextCart.splice(idx, 1);
      }
    }

    try {
      localStorage.setItem("iraitchi_cart", JSON.stringify(nextCart));
    } catch (e) {
      console.warn("Failed to write cart", e);
    }
  };

  // when qtyMap or cutType changes, sync to storage live — this avoids doubling when modal closes
  useEffect(() => {
    if (!product) return;
    saveQtyMapToCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qtyMap, cutType]);

  // Primary add action (keeps current qtyMap as is, storage already synced)
  const handleAddToCart = () => {
    // storage already synced via effect; provide slight UI feedback by closing
    onClose();
  };

  // Buy now: ensure saved + navigate to cart
  const handleBuyNow = () => {
    saveQtyMapToCart(); // make sure persisted
    onClose();
    navigate("/cart");
  };

  // computed totals for display
  const itemsCount = Object.values(qtyMap).reduce((s, v) => s + (v || 0), 0);
  const subtotal = (product.priceOptions ?? [{ price: product.price ?? 0 }])
    .reduce((sum: number, opt: any) => {
      const q = qtyMap[opt.type] || 0;
      return sum + (unitPriceFor(opt) * q);
    }, 0);

  if (!product) return null;

  return (
    <AnimatePresence>
      <Overlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalBox
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
        >
          <CloseBtn onClick={onClose}><X size={18} /></CloseBtn>

          <Top>
            <img src={product.image} alt={product.name} />
            <div>
              <h2>{product.name}</h2>
              <div style={{ color: "#BFC6DC", marginTop: 6 }}>{product.subCategory || ""}</div>
            </div>
          </Top>

          {/* CUT TYPES */}
          {product.cutTypes?.length > 0 && (
            <CutTypes product={product} cutType={cutType} setCutType={setCutType} />
          )}

          {/* SIZES */}
          <Section>
            <strong>Select sizes / quantities</strong>
            <div style={{ marginTop: 10 }}>
              {sizeOptions.map((opt: any) => {
                const q = qtyMap[opt.type] || 0;
                const unitPrice = unitPriceFor(opt);
                const total = unitPrice * q;
                return (
                  <SizeCard key={opt.type}>
                    <Left>
                      <div style={{ fontWeight: 700 }}>{opt.type}</div>
                      <div style={{ color: "#FFEB3B", marginTop: 6 }}>₹{unitPrice} / unit</div>
                      {q > 0 && <div style={{ color: "#BFC6DC", marginTop: 6 }}>Total: ₹{total}</div>}
                    </Left>

                    <Right>
                      {q > 0 ? (
                        <QtyControls>
                          <button onClick={() => updateQty(opt.type, -0.5)} aria-label="decrease">-</button>
                          <span>{q}</span>
                          <button onClick={() => updateQty(opt.type, +0.5)} aria-label="increase">+</button>
                        </QtyControls>
                      ) : (
                        <AddBtn onClick={() => updateQty(opt.type, +1)}>ADD</AddBtn>
                      )}
                    </Right>
                  </SizeCard>
                );
              })}
            </div>
          </Section>

          {/* Summary + Actions */}
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ color: "#BFC6DC", fontSize: 14 }}>Items</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>{itemsCount}</div>
              <div style={{ color: "#BFC6DC", fontSize: 12 }}>Subtotal: ₹{subtotal.toFixed(2)}</div>
            </div>
            <div style={{ flex: 1 }} />
            <ActionsRow>
              <AddBtn onClick={handleAddToCart}>Save</AddBtn>
              <AddBtn onClick={handleBuyNow}>Buy Now</AddBtn>
            </ActionsRow>
          </div>
        </ModalBox>
      </Overlay>
    </AnimatePresence>
  );
}
