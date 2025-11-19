// apps/web/pages/Dashboard.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import SuperAdminDashboard from "./superAdmin";
import AdminDashboard from "./admin/AdminDashboard";
import DriverDashboard from "./driver/DriverDashboard";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  // ⭐ Get global authenticated user
  const { user, token, role, ready } = useAuth();

  // -----------------------------------------
  // ACCESS CONTROL
  // -----------------------------------------
  useEffect(() => {
    if (!ready) return; // wait until hydration complete

    // If not logged in → go to landing
    if (!user || !token) {
      navigate("/", { replace: true });
      return;
    }

    // Customers not allowed here
    if (role === "customer") {
      navigate("/", { replace: true });
      return;
    }
  }, [ready, user, token, role]);

  // -----------------------------------------
  // LOADING STATE
  // -----------------------------------------
  if (!ready || !user) return <p>Loading...</p>;

  // -----------------------------------------
  // RENDER CORRECT DASHBOARD
  // -----------------------------------------
  switch (role) {
    case "superadmin":
      return <SuperAdminDashboard />;

    case "admin":
      return <AdminDashboard />;

    case "driver":
      return <DriverDashboard />;

    default:
      // fallback if something weird happens
      navigate("/", { replace: true });
      return null;
  }
}
