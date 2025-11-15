import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboard from "./superAdmin";
import AdminDashboard from "./admin/AdminDashboard";
import DriverDashboard from "./driver/DriverDashboard";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/"); // Customer login page
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      {user.role === "superadmin" && <SuperAdminDashboard />}
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "driver" && <DriverDashboard />}
    </>
  );
}
