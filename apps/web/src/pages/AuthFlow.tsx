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
  margin-top: ${({ theme }) => theme.spacing(5)};
  background: ${({ theme, disabled }) =>
    disabled ? "rgba(255,255,255,0.15)" : theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const ResendText = styled.p`
  margin-top: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
`;

export default function AuthFlow() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [pincode, setPincode] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [otp, setOtp] = useState("");

  // resend OTP state
  const [showResend, setShowResend] = useState(false);
  const [timer, setTimer] = useState(300); // 5 min = 300 sec

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (ready && user?.role === "customer") {
      navigate("/products", { replace: true });
    }
  }, [ready, user]);

  // -------------------------
  // AUTO TIMER for resend OTP
  // -------------------------
  useEffect(() => {
    if (step !== "otp") return;

    // Resend link appears only after 10 seconds
    const showTimer = setTimeout(() => setShowResend(true), 10000);

    // 5-minute countdown
    const interval = setInterval(() => {
      setTimer((sec) => {
        if (sec <= 1) {
          clearInterval(interval);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, [step]);

  // -------------------------
  // STEP 1: SEND OTP
  // -------------------------
  const handleProceed = async () => {
    if (!pincode || !name || mobile.length !== 10) {
      return showToast("Fill all fields correctly", "error");
    }

    try {
      await apiHandler.post("/api/user/entry", { name, mobile, pincode });
      showToast("OTP sent!", "success");

      setStep("otp");
      setTimer(300);
      setShowResend(false);

      autoReadOtp(); // start OTP auto-read
    } catch (err: any) {
      showToast(err?.message || "Failed", "error");
    }
  };

  // -------------------------
  // STEP 2: VERIFY OTP
  // -------------------------
  const handleVerify = async () => {
    if (otp.length < 4) return;

    try {
      const res = await apiHandler.post("/api/user/verify", {
        mobile,
        otp,
      });

      const profile = res?.profile;
      const token = res?.token;

      login(profile, token);

      showToast("Welcome to Iraitchi!", "success");
      navigate("/products", { replace: true });
    } catch (err: any) {
      showToast(err?.message || "Invalid OTP", "error");
    }
  };

  // -------------------------
  // RESEND OTP
  // -------------------------
  const resendOTP = async () => {
    try {
      await apiHandler.post("/api/user/entry", { name, mobile, pincode });
      showToast("OTP resent!", "success");

      setTimer(300);
      setShowResend(false);

      autoReadOtp();
    } catch (err: any) {
      showToast("Failed to resend", "error");
    }
  };

  // -------------------------
  // AUTO READ OTP (Web OTP API)
  // -------------------------
  const autoReadOtp = async () => {
    try {
      if ("OTPCredential" in window) {
        // @ts-ignore
        const ac = new AbortController();

        setTimeout(() => ac.abort(), 60000); // auto stop after 60 sec

        // @ts-ignore
        const content = await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        });

        // @ts-ignore
        if (content?.code) {
          setOtp(content.code.toString());
          handleVerify();
        }
      }
    } catch {
      // silently ignore (not supported)
    }
  };

  // Format timer as mm:ss
  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");

  return (
    <Wrapper>
      <Title
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Iraitchi 🐟
      </Title>

      {/* FORM STEP */}
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

          <Button whileTap={{ scale: 0.97 }} onClick={handleProceed}>
            Proceed
          </Button>
        </InputGroup>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <InputGroup>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />

          {/* Countdown */}
          <p style={{ color: "#BFC6DC" }}>OTP expires in: {mm}:{ss}</p>

          <Button whileTap={{ scale: 0.97 }} onClick={handleVerify}>
            Verify OTP
          </Button>

          {/* RESEND AFTER 10 SECONDS */}
          {showResend && (
            <ResendText onClick={resendOTP}>Resend OTP</ResendText>
          )}
        </InputGroup>
      )}

      <p
        onClick={() => setShowEmployeeModal(true)}
        style={{
          marginTop: 20,
          color: "#BFC6DC",
          fontSize: "0.95rem",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Are you our employee?
      </p>

      {/* Employee Login */}
      <EmployeeLoginModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
      />
    </Wrapper>
  );
}
