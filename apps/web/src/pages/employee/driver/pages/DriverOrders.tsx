import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

const Wrapper = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const Card = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: .25s;
  &:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
`;

const ActionBtns = styled.div`
  display: flex; gap: 10px; margin-top: 10px;
`;

const Btn = styled.button`
  flex: 1; padding: 8px; border-radius: 8px; cursor: pointer; font-weight: 600;
`;

const DeliverBtn = styled(Btn)`
  background: #29cc57; border: none; color: #000;
`;
const CancelBtn = styled(Btn)`
  background: transparent; border: 1px solid #ff5454; color: #ff5454;
`;

export default function DriverOrders() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const data = await apiHandler.get("/api/driver/orders");
      setOrders(data.orders);
    } catch (err) { showToast(err, "error"); }
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await apiHandler.patch("/api/driver/order-status", { orderId, status });
      showToast(`Order ${status}!`, "success");
      loadOrders();
    } catch (err) { showToast(err, "error"); }
  };

  return (
    <Wrapper>
      <h2>🚚 Driver Orders</h2>
      {orders.length === 0 ? <p>No active orders</p> : orders.map((o: any) => (
        <Card key={o._id}>
          <strong>🧾 {o.orderId}</strong>
          <div>👤 {o.user?.name} ({o.user?.mobile})</div>
          <div>📍 {o.address?.houseId}, {o.address?.addr1}</div>
          <div>⏱ {o.deliverySlot}</div>

          <ActionBtns>
            <DeliverBtn onClick={() => updateStatus(o._id, "delivered")}>Delivered</DeliverBtn>
            <CancelBtn onClick={() => updateStatus(o._id, "cancelled")}>Cancel</CancelBtn>
          </ActionBtns>
        </Card>
      ))}
    </Wrapper>
  );
}
