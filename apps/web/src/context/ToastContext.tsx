// apps/web/src/context/ToastContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
  } from "react";
  import Toast from "@/components/Toast";
  import type { ToastItemType } from "@/components/Toast"; // <- IMPORTANT: type-only import
  
  type ToastContextType = {
    showToast: (message: string, type?: "success" | "error" | "info") => void;
  };
  
  const ToastContext = createContext<ToastContextType | undefined>(undefined);
  
  export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [toasts, setToasts] = useState<ToastItemType[]>([]);
  
    const removeToast = useCallback((id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
  
    const showToast = useCallback(
      (message: string, type: "success" | "error" | "info" = "info") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 2500);
      },
      [removeToast]
    );
  
    return (
      <ToastContext.Provider value={{ showToast }}>
        {children}
        <Toast toasts={toasts} removeToast={removeToast} />
      </ToastContext.Provider>
    );
  };
  
  export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside a ToastProvider");
    return context;
  };
  