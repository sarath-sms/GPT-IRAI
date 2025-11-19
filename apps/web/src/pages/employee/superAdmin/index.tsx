// src/pages/employee/SuperAdminDashboard.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";

const Wrapper = styled.main`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.06);
  padding: 1rem;
  border-radius: 10px;
  text-align: center;

  h3 {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

export default function SuperAdminDashboard() {
  const { showToast } = useToast();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedShop, setSelectedShop] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await apiHandler.get("/api/superadmin/dashboard");
      setData(res);
    } catch (err: any) {
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Wrapper>Loading dashboard…</Wrapper>;

  return (
    <Wrapper>
      <h2>Super Admin Dashboard</h2>

      {/* Shop Selection */}
      <Select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}>
        <option value="">Select Shop</option>
        {data?.shopList.map((shop: any) => (
          <option key={shop._id} value={shop._id}>
            {shop.name}
          </option>
        ))}
      </Select>

      {/* Stats */}
      <CardGrid>
        <Card onClick={() => navigate("/superadmin/shops")}>
          <h3>{data?.totalShops}</h3>
          <p>Total Shops</p>
        </Card>
        <Card onClick={() => navigate("/superadmin/admins")}>
          <h3>{data?.totalAdmins}</h3>
          <p>Total Admins</p>
        </Card>
        <Card onClick={() => navigate("/superadmin/drivers")}>
          <h3>{data?.totalDrivers}</h3>
          <p>Total Drivers</p>
        </Card>
        <Card onClick={() => navigate("/superadmin/products")}>
          <h3>📦 Products</h3>
          <p>Management</p>
        </Card>
      </CardGrid>
      <LogoutButton />
    </Wrapper>
  );
}
