import styled from "styled-components";
import { motion } from "framer-motion";

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
`;

export default function OrderSummary({ subtotal, gst, deliveryFee, total }: any) {
  return (
    <Card>
      <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
      <p>GST (5%): ₹{gst.toFixed(2)}</p>
      <p>Delivery Fee: ₹{deliveryFee}</p>
      <h3>Total: ₹{total.toFixed(2)}</h3>
    </Card>
  );
}
