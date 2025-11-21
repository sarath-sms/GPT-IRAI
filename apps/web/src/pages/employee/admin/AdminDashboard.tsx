import LogoutButton from "@/components/LogoutButton";
import AdminOrders from "./pages/AdminOrders";

export default function AdminDashboard() {
    return (
      <div style={{ padding: "2rem", color: "white" }}>
        <AdminOrders />
        <LogoutButton />
      </div>
    );
  }
  