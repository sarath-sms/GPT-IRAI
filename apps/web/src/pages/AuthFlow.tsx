import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: ${({ theme }) => theme.spacing(8)};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 235, 59, 0.08) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: blur(60px);
  }
`;

const Title = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 12px rgba(255, 235, 59, 0.4);
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  z-index: 1;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  max-width: 320px;
  z-index: 1;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  text-align: center;

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(255, 235, 59, 0.4);
  }
`;

const Button = styled(motion.button)`
  margin-top: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 4px 10px rgba(255, 235, 59, 0.3);

  &:hover {
    transform: scale(1.05);
    opacity: 0.95;
  }
`;

const Message = styled(motion.div)`
  margin-top: ${({ theme }) => theme.spacing(6)};
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  z-index: 1;
`;

export default function AuthFlow() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [pincode, setPincode] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const availableAreas = ['600125', '600122', '600116'];

  const handleProceed = () => {
    if (!pincode || !name || !mobile) {
      setMessage('⚠️ Please fill all fields.');
      return;
    }

    if (!availableAreas.includes(pincode.trim())) {
      setMessage('🚧 Sorry, we’re expanding soon!');
      return;
    }

    // Mock OTP send
    const mockOtp = '1234';
    localStorage.setItem('mockOtp', mockOtp);
    setMessage('📨 OTP sent successfully!');
    setStep('otp');
  };

  const handleVerify = () => {
    const storedOtp = localStorage.getItem('mockOtp');
    if (otp.trim() === storedOtp) {
      const user = { name, mobile, pincode };
      localStorage.setItem('iraitchi_user', JSON.stringify(user));
      setMessage('✅ Verified! Welcome to Iraitchi 🐟');
      setTimeout(() => {
        window.location.href = '/products';
      }, 1500);
    } else {
      setMessage('❌ Invalid OTP, please try again.');
    }
  };

  return (
    <Wrapper>
      <Title
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Iraitchi 🐟
      </Title>

      {step === 'form' && (
        <InputGroup>
          <Input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="Enter Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProceed}
          >
            Proceed
          </Button>
        </InputGroup>
      )}

      {step === 'otp' && (
        <InputGroup>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerify}
          >
            Verify OTP
          </Button>
        </InputGroup>
      )}

      {message && (
        <Message
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </Message>
      )}
    </Wrapper>
  );
}
