import React from "react";
import styled, { keyframes, css } from "styled-components";
import { Star } from "lucide-react";

const pop = keyframes`
  0% { transform: scale(0.6); opacity: 0.5; }
  60% { transform: scale(1.4); opacity: 1; }
  100% { transform: scale(1); }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  margin: 14px 0;
  justify-content: center;
`;

// Prevent "active" from passing to DOM
const StarButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;

  svg {
    color: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.mutedText};
    transition: 0.2s ease;

    ${({ active }) =>
      active &&
      css`
        animation: ${pop} 0.3s ease;
      `}
  }

  &:hover svg {
    transform: scale(1.2);
  }
`;

export default function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <Row>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarButton
          key={n}
          active={n <= value}
          onClick={() => onChange(n)}
        >
          <Star size={34} fill={n <= value ? "#FFEB3B" : "transparent"} />
        </StarButton>
      ))}
    </Row>
  );
}
