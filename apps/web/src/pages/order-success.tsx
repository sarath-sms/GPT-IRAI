import React, { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const Button = styled(motion.button)`
  margin-top: 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
`;

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("iraitchi_cart", "[]");
    console.log("✅ Order placed successfully!");
  }, []);

  return (
    <Wrapper>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <CheckCircle size={100} color="#FFEB3B" />
      </motion.div>
      <h2 style={{ color: "#FFEB3B", marginTop: "20px" }}>Order Confirmed!</h2>
      <p style={{ color: "#BFC6DC" }}>
        Thank you for choosing Iraitchi. Your order has been successfully placed.
        We’ll notify you once it’s out for delivery.
      </p>
      <Button whileTap={{ scale: 0.95 }} onClick={() => navigate("/profile")}>
        View My Orders
      </Button>
      <Button
        whileTap={{ scale: 0.95 }}
        style={{ marginTop: "1rem", backgroundColor: "#BFC6DC", color: "#26355D" }}
        onClick={() => navigate("/products")}
      >
        Continue Shopping
      </Button>
    </Wrapper>
  );
}
