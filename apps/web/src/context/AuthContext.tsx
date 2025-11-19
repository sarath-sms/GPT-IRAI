// apps/web/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

type UserType = {
  id?: string;
  name?: string;
  role?: string;
  mobile?: string;
  [k: string]: any;
};

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  role: string | null;
  ready: boolean;
  login: (user: UserType, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      const rawToken = localStorage.getItem("token");
      if (rawToken) setToken(rawToken);
      if (rawUser) setUser(JSON.parse(rawUser));
    } catch (e) {
      console.error("Auth hydrate error:", e);
    } finally {
      setReady(true);
    }
  }, []);

  const login = useCallback((u: UserType, t: string) => {
    setUser(u);
    setToken(t);

    try {
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("token", t);
    } catch (e) {
      console.error("Persist error:", e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (e) {
      console.error("Logout error:", e);
    }
  }, []);

  const role = user?.role || "customer";

  const updateUser = useCallback((changes: Partial<UserType>) => {
    setUser((prev) => {
      const updated = { ...prev, ...changes };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ user, token, role, ready, login, logout, updateUser }),
    [user, token, role, ready, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
