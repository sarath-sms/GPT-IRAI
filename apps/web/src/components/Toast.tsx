// apps/web/src/components/Toast.tsx
import styled, { keyframes } from "styled-components";

export type ToastItemType = {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
};

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 92%;
  max-width: 400px;
`;

const ToastBox = styled.div<{ t?: string }>`
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 0.95rem;
  animation: ${slideUp} 0.3s ease forwards;

  background: ${({ t }) =>
    t === "success"
      ? "rgba(76, 175, 80, 0.95)"
      : t === "error"
      ? "rgba(244, 67, 54, 0.95)"
      : "rgba(33, 150, 243, 0.95)"};

  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
`;

export default function Toast({
  toasts,
  removeToast,
}: {
  toasts: ToastItemType[];
  removeToast: (id: string) => void;
}) {
  return (
    <ToastWrapper>
      {toasts.map((toast) => (
        <ToastBox
          key={toast.id}
          t={toast.type || "info"}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </ToastBox>
      ))}
    </ToastWrapper>
  );
}
