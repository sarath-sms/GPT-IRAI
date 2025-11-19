import { LogOut } from "lucide-react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const Btn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;

  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 0.95rem;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Btn
      whileTap={{ scale: 0.9 }}
      onClick={() => logout()}
    >
      <LogOut size={18} />
      Logout
    </Btn>
  );
}
