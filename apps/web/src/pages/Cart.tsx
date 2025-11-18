// apps/web/pages/Cart.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BackButton from "@/components/BackButton";
import CartItemCard from "@/components/cart/CartItemCard";
import AddressSection from "@/components/cart/AddressSection";
import LocationSection from "@/components/cart/LocationSection";
import SlotSelector from "@/components/cart/SlotSelector";
import OrderSummary from "@/components/cart/OrderSummary";

import { OrderService } from "../services/orderService";

const Wrapper = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
  position: relative;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const Button = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  border: none;
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;

  .content {
    background: ${({ theme }) => theme.colors.secondary};
    padding: 24px;
    border-radius: 10px;
    width: 95%;
    max-width: 720px;
    color: ${({ theme }) => theme.colors.text};
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
`;

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<any[]>(
    () => JSON.parse(sessionStorage.getItem("iraitchi_cart") || "[]")
  );

  const [user, setUser] = useState<any>(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [geo, setGeo] = useState(user.geo || null);
  const [address, setAddress] = useState(
    user.address || { houseId: "", addr1: "", addr2: "" }
  );

  const [selectedSlot, setSelectedSlot] = useState("");
  const [termsChecked, setTermsChecked] = useState(true);

  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);
  const [jsonConfirmed, setJsonConfirmed] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  const deliveryFee = 38;

  const currentHour = new Date().getHours();
  const hours = Array.from({ length: 24 }, (_, i) => {
    const start = i === 0 ? 12 : i > 12 ? i - 12 : i;
    const ampm = i < 12 ? "AM" : "PM";
    const next = (i + 1) % 24;
    const nextDisplay = next === 0 ? 12 : next > 12 ? next - 12 : next;
    const nextAmpm = next < 12 ? "AM" : "PM";
    return `${start}${ampm} - ${nextDisplay}${nextAmpm}`;
  });

  // Persist helper
  const persistCart = (next: any[]) => {
    sessionStorage.setItem("iraitchi_cart", JSON.stringify(next));
    setCart(next);
  };

  useEffect(() => {
    if (!cart || cart.length === 0) {
      const t = setTimeout(() => navigate("/products"), 150);
      return () => clearTimeout(t);
    }
  }, [cart]);

  // -------------------------
  // Qty Change
  // -------------------------
  const handleQtyChange = (item: any, delta: number) => {
    const newQty = (item.qty || 1) + delta;

    if (newQty <= 0) {
      const updated = cart.filter((x) => x.id !== item.id);
      persistCart(updated);
      return;
    }

    const updated = cart.map((x) =>
      x.id === item.id
        ? {
            ...x,
            qty: newQty,
            total: newQty * (x.unitPrice ?? x.price ?? 0),
          }
        : x
    );

    persistCart(updated);
  };

  // -------------------------
  // Remove Item
  // -------------------------
  const handleRemove = (item: any) => {
    if (!confirm("Remove this item?")) return;
    const updated = cart.filter((x) => x.id !== item.id);
    persistCart(updated);
  };

  // -------------------------
  // Address Change
  // -------------------------
  const handleAddressChange = (key: string, value: string) => {
    const updatedAddress = { ...address, [key]: value };
    setAddress(updatedAddress);

    const updatedUser = { ...user, address: updatedAddress };
    setUser(updatedUser);

    localStorage.setItem("iraitchi_user", JSON.stringify(updatedUser));
  };

  // -------------------------
  // Location handler
  // -------------------------
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newGeo = { lat: pos.coords.latitude, long: pos.coords.longitude };
        setGeo(newGeo);

        const updatedUser = { ...user, geo: newGeo };
        setUser(updatedUser);

        localStorage.setItem("iraitchi_user", JSON.stringify(updatedUser));
      },
      () => alert("Location access denied!")
    );
  };

  // -------------------------
  // Price Calculations
  // -------------------------
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unit = Number(item.unitPrice ?? item.price ?? 0) || 0;
      // const cutFee = Number(item.cutFee ?? 0) || 0;
      const qty = Number(item.qty ?? 1) || 1;
      return sum + (unit * qty);
    }, 0);
  }, [cart]);

  const gst = +(subtotal * 0.05);
  const total = +(subtotal + gst + deliveryFee);

  const canPay =
    cart.length > 0 &&
    selectedSlot &&
    geo?.lat &&
    address.houseId &&
    address.addr1 &&
    address.addr2 &&
    termsChecked;

  // -------------------------
  // Build Order Payload
  // -------------------------
  const buildOrderPayload = () => {
    const userId = user?._id || user.id || "usr-temp";

    const items = cart.map((item) => {
      const unitPrice = Number(item.unitPrice ?? item.price ?? 0) || 0;
      const qty = Number(item.qty ?? 1) || 1;

      return {
        product: item.productId,
        name: item.name,
        category: item.category || "",
        image: item.image,
        size: item.size || "",
        cutType: item.cutType || "",
        netWeight: item.netWeight || "",
        qty,
        unitPrice,
        totalPrice: unitPrice * qty,
      };
    });

    return {
      user: userId,
      pincode: user?.pincode ?? "",
      items,
      subtotal,
      gst,
      deliveryFee,
      total,
      deliverySlot: selectedSlot,
      address: {
        houseId: address.houseId,
        addr1: address.addr1,
        addr2: address.addr2,
        geo,
      },
    };
  };

  // -------------------------
  // JSON Preview flow
  // -------------------------
  const onPayClick = () => {
    const payload = buildOrderPayload();
    setPendingOrder(payload);
    setJsonPreviewOpen(true);
    setJsonConfirmed(false);
  };

  const confirmJson = () => setJsonConfirmed(true);

  const confirmPayment = () => {
    if (!pendingOrder) return;

    OrderService.addOrder({
      ...pendingOrder,
      createdAt: new Date().toISOString(),
      status: "pending",
      orderId: "ORD" + Math.floor(1000 + Math.random() * 9000),
    });

    OrderService.clearCart?.();
    localStorage.removeItem("iraitchi_cart");

    setCart([]);
    setJsonPreviewOpen(false);

    navigate("/order-success");
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <Wrapper>
      <BackButton fallback="/" />
      <Title>🛒 My Cart</Title>

      {/* CART ITEMS */}
      <Section>
        {cart.map((item: any) => (
          <CartItemCard
            key={item.id}
            item={item}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
          />
        ))}
      </Section>

      {/* LOCATION */}
      <Section>
        <Title>📍 Delivery Location</Title>
        <LocationSection geo={geo} onGetLocation={getLocation} />
      </Section>

      {/* ADDRESS */}
      <Section>
        <Title>🏠 Address Details</Title>
        <AddressSection address={address} onChange={handleAddressChange} />
      </Section>

      {/* SLOT SELECTOR */}
      <Section>
        <Title>🕓 Delivery Slot</Title>
        <SlotSelector
          hours={hours}
          currentHour={currentHour}
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
        />
      </Section>

      {/* SUMMARY */}
      <Section>
        <Title>💰 Summary</Title>
        <OrderSummary
          subtotal={subtotal}
          gst={gst}
          deliveryFee={deliveryFee}
          total={total}
        />
      </Section>

      {/* Terms */}
      <Section>
        <label>
          <input
            type="checkbox"
            checked={termsChecked}
            onChange={() => setTermsChecked(!termsChecked)}
          />{" "}
          I accept{" "}
          <span style={{ color: "#FFEB3B", cursor: "pointer" }}>
            Terms & Conditions
          </span>
        </label>
      </Section>

      {/* Pay Button */}
      <Button
        whileTap={{ scale: canPay ? 0.97 : 1 }}
        disabled={!canPay}
        onClick={onPayClick}
      >
        Review Order & Pay ₹{total.toFixed(2)}
      </Button>

      {/* JSON Preview */}
      <AnimatePresence>
        {jsonPreviewOpen && pendingOrder && (
          <Modal as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="content">
              <X className="close" onClick={() => setJsonPreviewOpen(false)} />

              <h3>Order Payload Preview</h3>

              <pre
                style={{
                  background: "#00000066",
                  padding: 12,
                  borderRadius: 10,
                  maxHeight: "50vh",
                  overflow: "auto",
                  fontSize: 13,
                }}
              >
                {JSON.stringify(pendingOrder, null, 2)}
              </pre>

              <div style={{ display: "flex", gap: 12 }}>
                <Button onClick={confirmJson} disabled={jsonConfirmed}>
                  {jsonConfirmed ? "JSON Confirmed" : "Confirm JSON"}
                </Button>

                <Button onClick={confirmPayment} disabled={!jsonConfirmed}>
                  Confirm Payment
                </Button>

                <Button
                  style={{
                    background: "transparent",
                    border: "1px solid #FFEB3B",
                    color: "#FFEB3B",
                  }}
                  onClick={() => setJsonPreviewOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
