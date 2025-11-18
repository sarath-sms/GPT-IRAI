// apps/web/pages/AuthFlow.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import EmployeeLoginModal from "@/components/EmployeeLoginModal";
import { useNavigate } from "react-router-dom";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "../context/AuthContext";

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: ${({ theme }) => theme.spacing(8)};
  min-height: 100vh;
`;

const Title = styled(motion.h1)`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  max-width: 320px;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  text-align: center;
`;

const Button = styled(motion.button)<{ disabled?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme, disabled }) =>
    disabled ? "rgba(255,255,255,0.12)" : theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const SmallAnchor = styled.p`
  margin-top: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;
`;

export default function AuthFlow() {
  console.log("🔥")
  const [step, setStep] = useState<"form" | "otp">("form");
  const [pincode, setPincode] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const { login, user, ready } = useAuth();

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (ready && user?.role === "customer") {
      navigate("/products", { replace: true });
    }
  }, [ready, user]);

  // -----------------------------------
  // STEP 1 → SEND OTP
  // -----------------------------------
  const handleProceed = async () => {
    if (!pincode || !name || mobile.length !== 10) return;

    try {
      await apiHandler.post("/api/user/entry", { name, mobile, pincode });
      setStep("otp");
      showToast("OTP sent!", "success");
    } catch (err) {
      showToast(err, "error");
    }
  };

  // -----------------------------------
  // STEP 2 → VERIFY OTP
  // -----------------------------------
  const handleVerify = async () => {
    if (otp.length < 4) return;

    try {
      const res = await apiHandler.post("/api/user/verify", {
        mobile,
        otp,
      });

      const profile = res?.profile;
      const token = res?.token;

      // ⭐ GLOBAL AUTH CONTEXT LOGIN
      login(profile, token);

      showToast("Welcome to Iraitchi!", "success");
      navigate("/products", { replace: true });
    } catch (err) {
      showToast(err, "error");
    }
  };

  return (
    <Wrapper>
      <Title
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Iraitchi 🐟
      </Title>

      {/* STEP 1: CUSTOMER ENTRY */}
      {step === "form" && (
        <InputGroup>
          <Input
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <Input
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Enter Mobile"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />

          <Button whileTap={{ scale: 0.98 }} onClick={handleProceed}>
            Proceed
          </Button>
        </InputGroup>
      )}

      {/* STEP 2: OTP SCREEN */}
      {step === "otp" && (
        <InputGroup>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
          <Button whileTap={{ scale: 0.98 }} onClick={handleVerify}>
            Verify OTP
          </Button>
        </InputGroup>
      )}

      <SmallAnchor onClick={() => setShowEmployeeModal(true)}>
        Are you our employee?
      </SmallAnchor>

      <EmployeeLoginModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
      />
    </Wrapper>
  );
}
