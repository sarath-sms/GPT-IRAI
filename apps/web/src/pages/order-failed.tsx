import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
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

export default function OrderFailed() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <XCircle size={100} color="#FF4D4D" />
      </motion.div>
      <h2 style={{ color: "#FF4D4D", marginTop: "20px" }}>Payment Failed</h2>
      <p style={{ color: "#BFC6DC" }}>
        Your payment could not be processed. Please try again.
      </p>
      <Button whileTap={{ scale: 0.95 }} onClick={() => navigate("/cart")}>
        Retry Payment
      </Button>
      <Button
        whileTap={{ scale: 0.95 }}
        style={{ marginTop: "1rem", backgroundColor: "#BFC6DC", color: "#26355D" }}
        onClick={() => navigate("/products")}
      >
        Back to Products
      </Button>
    </Wrapper>
  );
}
