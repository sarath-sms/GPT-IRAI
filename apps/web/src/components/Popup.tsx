// apps/web/components/Popup.tsx
import React, { useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(6px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing(6)};
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.35);
  position: relative;
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(3)} 0;
  color: ${({ theme }) => theme.colors.primary};
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

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(5)};
`;

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
  actions,
  closeOnOverlayClick = true,
}: PopupProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          onClick={() => closeOnOverlayClick && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CloseBtn onClick={onClose}>
              <X size={18} />
            </CloseBtn>
            {title && <Title>{title}</Title>}
            {children}
            {actions && <Actions>{actions}</Actions>}
          </Card>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
