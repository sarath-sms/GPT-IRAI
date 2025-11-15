// apps/web/components/EmployeeLoginModal.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Popup from "@/components/Popup";
import { useToast } from "@/context/ToastContext";
import { apiHandler } from "@/utils/apiHandler";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin: 0;
  text-align: left;
`;

const Submit = styled.button<{ disabled?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  background: ${({ disabled, theme }) => (disabled ? "rgba(255,255,255,0.15)" : theme.colors.primary)};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeLoginModal({ isOpen, onClose }: Props) {
  const [role, setRole] = useState<string>("customer");
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const { showToast } = useToast();
  const auth = useAuth();
  const navigate = useNavigate();

  const isFormValid = role.trim() !== "" && /^\d{10}$/.test(mobile) && password.trim().length >= 4;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setInlineError(null);
    if (!isFormValid) {
      setInlineError("Please fill all fields correctly");
      return;
    }
    setIsSubmitting(true);
    try {
      // POST /api/{role}/login
      const url = `/api/${role}/login`;
      const payload = { mobile, password, role };
      const res = await apiHandler.post(url, payload);
      // expect: { token, user }
      const { token, user } = res;
      if (!token || !user) throw new Error("Invalid response from server");

      // store and update context
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.warn("Storage write failed", err);
      }
      auth.login(user, token);

      showToast(`Welcome ${user.name || "Captain"}!`, "success");
      onClose();

      // navigate to common dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 400);
    } catch (err: any) {
      // show inline error inside modal so user can retry
      const msg = typeof err === "string" ? err : err?.message || "Login failed";
      setInlineError(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Employee Login ⚓">
      <Form onSubmit={handleSubmit}>
        <Select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Select role">
          <option value="">Select Role</option>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="driver">Driver</option>
        </Select>

        <Input
          type="tel"
          placeholder="Mobile (10 digits)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {inlineError && <ErrorText>{inlineError}</ErrorText>}

        <Submit type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? "Please wait..." : "Login"}
        </Submit>
      </Form>
    </Popup>
  );
}
