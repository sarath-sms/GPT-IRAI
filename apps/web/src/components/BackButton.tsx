import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(255, 235, 59, 0.4);
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  cursor: pointer;
    margin-bottom: 24px;
  &:hover {
    background: rgba(255, 235, 59, 0.08);
  }

  @media print {
    display: none;
  }
`;

export default function BackButton({ fallback = '/' }: { fallback?: string }) {
  const navigate = useNavigate();
  const onClick = () => (window.history.length > 1 ? navigate(-1) : navigate(fallback));
  return (
    <Btn onClick={onClick} aria-label="Go back">
      <ArrowLeft size={18} />
      Back
    </Btn>
  );
}
