// apps/web/components/ProductModal.tsx
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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

/**
 * ProductModal
 *
 * Props:
 * - product: product object (expects _id, name, image, priceOptions[], cutTypes[], price, category)
 * - onClose: () => void
 */
export default function ProductModal({ product, onClose }: any) {
  const navigate = useNavigate();

  // chosen cutType (single global for this product modal)
  const [cutType, setCutType] = useState<any>(null);

  // qtyMap: { [sizeType]: number }
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  // helper: read cart and write cart
  const readCart = () => {
    try {
      return JSON.parse(sessionStorage.getItem("iraitchi_cart") || "[]");
    } catch {
      return [];
    }
  };
  const writeCart = (c: any[]) => {
    try {
      sessionStorage.setItem("iraitchi_cart", JSON.stringify(c));
    } catch (e) {
      console.warn("Failed to write cart", e);
    }
  };

  // stable id generator for cart entries (productId|size|cut)
  const keyFor = (productId: string, size: string, cutName: string) =>
    `${productId}||${size}||${cutName}`;

  // On open: hydrate qtyMap and cutType from existing cart entries for this product
  useEffect(() => {
    if (!product) return;

    const cart = readCart();
    const map: Record<string, number> = {};
    // Prefer first entry's cutType if exists
    let preferredCut: any = null;

    for (const c of cart) {
      if (c.productId === product._id) {
        map[c.size] = (map[c.size] || 0) + (c.qty || 0);
        if (!preferredCut && c.cutType) preferredCut = { type: c.cutType, price: c.cutFee || 0 };
      }
    }

    // fallback: pick first cut type or default null
    if (!preferredCut && product.cutTypes?.length) {
      preferredCut = product.cutTypes[0];
    }

    // If product has no priceOptions (meat/poultry), ensure we show a default size option "Standard"
    if ((!product.priceOptions || product.priceOptions.length === 0) && !map["Standard"]) {
      // if there's already a cart entry for Standard, keep it; else set 0
      map["Standard"] = map["Standard"] || 0;
    }

    setQtyMap(map);
    setCutType(preferredCut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // compute derived unit price for a given size option
  const unitPriceFor = (sizeOpt: any) => {
    // If product has priceOptions, use sizeOpt.price. Otherwise use product.price
    const base = sizeOpt?.price ?? product.price ?? 0;
    const cut = cutType?.price ?? 0;
    // ensure numbers
    const b = typeof base === "number" ? base : Number(base || 0);
    const c = typeof cut === "number" ? cut : Number(cut || 0);
    return b + c;
  };

  // handle increment/decrement in UI (does NOT persist fully to cart until we sync)
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

  // merge this product entries into cart (replace any entries with same productId)
  const syncProductToCart = () => {
    const cart = readCart();
    // remove existing entries for this product (we'll re-add from qtyMap)
    const other = cart.filter((c: any) => c.productId !== product._id);

    // for each qtyMap entry create/recreate stable entry
    const newEntries: any[] = [];
    for (const size of Object.keys(qtyMap)) {
      const q = qtyMap[size] || 0;
      if (q <= 0) continue;
      // find corresponding price option if exists
      const sizeOpt = (product.priceOptions ?? []).find((p: any) => p.type === size);
      const unitPrice = unitPriceFor(sizeOpt);
      const cutName = cutType?.type || "Standard";
      const cutFee = cutType?.price || 0;
      const id = keyFor(product._id, size, cutName);

      newEntries.push({
        id,
        productId: product._id,
        name: product.name,
        category: product.category || "",
        size,
        qty: q,
        cutType: cutName,
        cutFee,
        unitPrice,
        price: unitPrice, // legacy field used across app
        total: unitPrice * q,
        image: product.image,
      });
    }

    const merged = [...other, ...newEntries];
    writeCart(merged);
    return merged;
  };

  // Whenever qtyMap or cutType changes we persist the product entries live,
  // but we avoid doubling by replacing product-specific entries.
  useEffect(() => {
    // avoid running when product missing
    if (!product) return;
    // perform lighter sync only if qtyMap reflects change (this keeps UI persistent)
    syncProductToCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qtyMap, cutType]);

  // handle Add to Cart (explicit): keep cart already in sync; just close modal
  const handleAddToCart = () => {
    syncProductToCart();
    onClose();
  };

  // Buy Now: ensure add then go to cart
  const handleBuyNow = () => {
    syncProductToCart();
    onClose();
    navigate("/cart");
  };

  // convenience: total count for this product
  const productTotalCount = useMemo(
    () => Object.values(qtyMap).reduce((s, v) => s + (v || 0), 0),
    [qtyMap]
  );

  if (!product) return null;

  // prepare sizes list (if none, provide a "Standard" pseudo-size)
  const sizes = (product.priceOptions && product.priceOptions.length > 0)
    ? product.priceOptions
    : [{ type: "Standard", price: product.price ?? 0 }];

  return (
    <AnimatePresence>
      <Overlay
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
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
              {sizes.map((opt: any) => {
                const sKey = opt.type;
                const q = qtyMap[sKey] || 0;
                const unitPrice = unitPriceFor(opt);
                const total = unitPrice * q;
                return (
                  <SizeCard key={sKey}>
                    <Left>
                      <div style={{ fontWeight: 700 }}>{sKey}</div>
                      <div style={{ color: "#FFEB3B", marginTop: 6 }}>₹{unitPrice} / unit</div>
                      {q > 0 && <div style={{ color: "#BFC6DC", marginTop: 6 }}>Total: ₹{total}</div>}
                    </Left>

                    <Right>
                      {q > 0 ? (
                        <QtyControls>
                          <button onClick={() => updateQty(sKey, -1)} aria-label="decrease">
                            -
                          </button>
                          <span>{q}</span>
                          <button onClick={() => updateQty(sKey, +1)} aria-label="increase">
                            +
                          </button>
                        </QtyControls>
                      ) : (
                        <AddBtn onClick={() => updateQty(sKey, +1)}>ADD</AddBtn>
                      )}
                    </Right>
                  </SizeCard>
                );
              })}
            </div>
          </Section>

          {/* Summary + Save */}
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ color: "#BFC6DC", fontSize: 14 }}>Items</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>{productTotalCount}</div>
            </div>
            <div style={{ flex: 1 }} />
            <AddBtn onClick={handleAddToCart}>
              Add to cart
            </AddBtn>
          </div>

          <div style={{ marginTop: 10 }}>
            <button style={{ width: "100%", padding: 10, marginTop: 8 }} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </ModalBox>
      </Overlay>
    </AnimatePresence>
  );
}
