import styled from 'styled-components';
import { motion } from 'framer-motion';

// 🔹 Styled container for layout
const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing(8)};
  position: relative;
overflow: hidden;
z-index: 1;
  &::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 235, 59, 0.08) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(40px);
  z-index: 0;
}
`;

// 🔹 Animated heading with glow effect
const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 15px rgba(255, 235, 59, 0.4);
`;

// 🔹 Subtext
const Tagline = styled(motion.p)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.mutedText};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

// 🔹 Button with slight motion
const ActionButton = styled(motion.button)`
  margin-top: ${({ theme }) => theme.spacing(8)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(8)};
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 235, 59, 0.3);
  transition: 0.3s ease;

  &:hover {
    opacity: 0.95;
    transform: scale(1.05);
  }
`;

export default function App() {
  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Welcome to Iraitchi
      </Title>

      <Tagline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Easy Booking, Fast Cooking! 🐟
      </Tagline>

      <ActionButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Explore Menu
      </ActionButton>
    </Container>
  );
}
