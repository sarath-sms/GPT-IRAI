import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
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

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;

  .details {
    flex: 1;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .qty-btn {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary};
  }
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

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SlotButton = styled(motion.button)<{ active?: boolean; disabled?: boolean }>`
  background: ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};
  color: ${({ active, theme }) => (active ? theme.colors.secondary : theme.colors.text)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(3)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;

  .content {
    background: ${({ theme }) => theme.colors.secondary};
    padding: ${({ theme }) => theme.spacing(6)};
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    color: ${({ theme }) => theme.colors.text};
    max-height: 70vh;
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
  const [cart, setCart] = useState<any[]>(() => JSON.parse(localStorage.getItem("iraitchi_cart") || "[]"));
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem("iraitchi_user") || "{}"));
  const [geo, setGeo] = useState(user.geo || null);
  const [address, setAddress] = useState(user.address || { houseId: "", addr1: "", addr2: "" });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [termsChecked, setTermsChecked] = useState(true);
  const [termsOpen, setTermsOpen] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
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

  useEffect(() => {
    if (!cart || cart.length === 0) navigate("/products");
  }, [cart, navigate]);

  const handleQtyChange = useCallback((id: string, change: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + change) } : item
      );
      localStorage.setItem("iraitchi_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    if (!confirm("Remove this item from cart?")) return;
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("iraitchi_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleAddressChange = useCallback(
    (key: string, value: string) => {
      setAddress((prev) => {
        const updatedAddress = { ...prev, [key]: value };
        const updatedUser = { ...user, address: updatedAddress };
        setUser(updatedUser);
        localStorage.setItem("iraitchi_user", JSON.stringify(updatedUser));
        return updatedAddress;
      });
    },
    [user]
  );

  const getLocation = useCallback(() => {
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
  }, [user]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price + (item.cutFee || 0)) * (item.qty || 1), 0);
  }, [cart]);

  const gst = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = useMemo(() => subtotal + gst + deliveryFee, [subtotal, gst]);

  const canPay =
    cart.length > 0 &&
    selectedSlot.trim() !== "" &&
    geo?.lat &&
    geo?.long &&
    address.houseId.trim() !== "" &&
    address.addr1.trim() !== "" &&
    address.addr2.trim() !== "" &&
    termsChecked;

    const handlePay = () => {
        // 1️⃣ create order payload
        const orderId = "ORD" + Math.floor(1000 + Math.random() * 9000);
        const date = new Date().toISOString();
        const subtotalVal = subtotal;
        const gstVal = gst;
        const totalVal = subtotal + gst + deliveryFee;
      
        const newOrder = {
          orderId,
          userId: user._id || "usr-temp",
          date,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            qty: item.qty || 1,
            size: item.size,
            cutType: item.cutType,
            price: item.price
          })),
          subtotal: subtotalVal,
          gst: gstVal,
          deliveryFee,
          total: totalVal,
          deliverySlot: selectedSlot,
          status: "Placed",
          captions: "Awaiting admin confirmation",
          userAddress: address,
          geo
        };
        setPendingOrder(newOrder);
        setShowPaymentPopup(true);
      };

      const handlePaymentResult = (result: "success" | "failure") => {
        setShowPaymentPopup(false);
      
        if (result === "success" && pendingOrder) {
            OrderService.addOrder(pendingOrder);
            OrderService.clearCart();
          // clear cart in success page
          navigate("/order-success");
        //   setCart([]);
        } else {
          navigate("/order-failed");
        }
      };

  return (
    <Wrapper>
      <BackButton fallback="/" />
      <Title>🛒 My Cart</Title>

      {/* Cart Items */}
      <Section>
        <AnimatePresence>
          {cart.map((item) => (
            <Card key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="details">
                <strong>{item.name}</strong>
                <p>Size: {item.size || "-"} | Cut: {item.cutType || "-"}</p>
                <p>Unit: ₹{item.price}</p>
                <p>Total: ₹{((item.qty || 1) * item.price).toFixed(2)}</p>
              </div>
              <div className="controls">
                <button className="qty-btn" onClick={() => handleQtyChange(item.id, -1)}>-</button>
                <motion.span key={item.qty} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  {item.qty || 1}
                </motion.span>
                <button className="qty-btn" onClick={() => handleQtyChange(item.id, 1)}>+</button>
                <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          ))}
        </AnimatePresence>
      </Section>

      {/* Location */}
      <Section>
        <Title>📍 Delivery Location</Title>
        {!geo ? (
          <Button whileTap={{ scale: 0.98 }} onClick={getLocation}>
            Get Current Location
          </Button>
        ) : (
          <p>✅ Location: {geo.lat.toFixed(3)}, {geo.long.toFixed(3)}</p>
        )}
      </Section>

      {/* Address */}
      <Section>
        <Title>🏠 Address Details</Title>
        <Input placeholder="House / Flat No" value={address.houseId} onChange={(e) => handleAddressChange("houseId", e.target.value)} />
        <Input placeholder="Address Line 1" value={address.addr1} onChange={(e) => handleAddressChange("addr1", e.target.value)} />
        <Input placeholder="Address Line 2" value={address.addr2} onChange={(e) => handleAddressChange("addr2", e.target.value)} />
      </Section>

      {/* Slot */}
      <Section>
        <Title>🕓 Delivery Slot</Title>
        <SlotGrid>
          {hours.map((slot, i) => {
            const disabled = i === currentHour || i === currentHour + 1;
            return (
              <SlotButton key={slot} disabled={disabled} active={selectedSlot === slot} onClick={() => !disabled && setSelectedSlot(slot)}>
                {slot}
              </SlotButton>
            );
          })}
        </SlotGrid>
      </Section>

      {/* Summary */}
      <Section>
        <Title>💰 Summary</Title>
        <Card>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST (5%): ₹{gst.toFixed(2)}</p>
          <p>Delivery Fee: ₹{deliveryFee}</p>
          <h3>Total: ₹{total.toFixed(2)}</h3>
        </Card>
      </Section>

      {/* Terms */}
      <Section>
        <label>
          <input type="checkbox" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} /> I accept{" "}
          <span style={{ color: "#FFEB3B", cursor: "pointer" }} onClick={() => setTermsOpen(true)}>Terms & Conditions</span>
        </label>
      </Section>

      {/* Pay Button */}
      <Button whileTap={{ scale: canPay ? 0.97 : 1 }} disabled={!canPay} onClick={handlePay}>
        Pay ₹{total.toFixed(2)}
      </Button>

      {/* Terms Modal */}
      <AnimatePresence>
        {termsOpen && (
          <Modal as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="content">
              <X className="close" onClick={() => setTermsOpen(false)} />
              <h3>Terms & Conditions</h3>
              <p>
                By placing your order, you agree that Iraitchi ensures the freshest seafood, meat, and poultry sourced directly from trusted markets.
                Delivery times may vary based on local availability and conditions.
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
  {showPaymentPopup && (
    <Modal
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content">
        <X className="close" onClick={() => setShowPaymentPopup(false)} />
        <h3>Simulate Payment Result</h3>
        <p>Select a payment outcome to continue:</p>
        <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
          <Button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePaymentResult("success")}
          >
            ✅ Success
          </Button>
          <Button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePaymentResult("failure")}
          >
            ❌ Failure
          </Button>
        </div>
      </div>
    </Modal>
  )}
</AnimatePresence>
    </Wrapper>
  );
}
