// apps/web/context/AuthContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
  login: (user: UserType, token: string) => void;
  logout: () => void;
  ready: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // on mount, hydrate from localStorage
  useEffect(() => {
    try {
      const rawToken = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");
      if (rawToken) setToken(rawToken);
      if (rawUser) setUser(JSON.parse(rawUser));
    } catch (e) {
      console.error("Auth hydrate error", e);
    } finally {
      setReady(true);
    }
  }, []);

  const login = useCallback((u: UserType, t: string) => {
    setUser(u);
    setToken(t);
    // persist
    try {
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
    } catch (e) {
      console.error("Auth persist error", e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.error("Auth clear error", e);
    }
    // optionally navigate to home - handled externally
  }, []);

  const role = user?.role || null;

  const value = useMemo(
    () => ({ user, token, role, login, logout, ready }),
    [user, token, role, login, logout, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
