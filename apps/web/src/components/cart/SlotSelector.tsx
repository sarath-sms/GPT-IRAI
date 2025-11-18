import styled from "styled-components";
import { motion } from "framer-motion";

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
`;

const SlotButton = styled(motion.button)<{ active?: boolean; disabled?: boolean }>`
  background: ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};
  color: ${({ active, theme }) => (active ? theme.colors.secondary : theme.colors.text)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

export default function SlotSelector({ hours, currentHour, selectedSlot, onSelect }: any) {
  return (
    <SlotGrid>
      {hours.map((slot: string, i: number) => {
        const disabled = i === currentHour || i === currentHour + 1;
        return (
          <SlotButton
            key={slot}
            disabled={disabled}
            active={selectedSlot === slot}
            onClick={() => !disabled && onSelect(slot)}
          >
            {slot}
          </SlotButton>
        );
      })}
    </SlotGrid>
  );
}
