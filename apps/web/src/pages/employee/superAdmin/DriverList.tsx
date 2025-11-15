// src/pages/employee/superAdmin/DriverList.tsx

import { useState, useEffect } from "react";
import styled from "styled-components";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import DriverCard from "./components/DriverCard";
import DriverForm from "./components/DriverForm";

const Wrapper = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export default function DriverList() {
  const { showToast } = useToast();

  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const res = await apiHandler.get("/api/superadmin/drivers");
      setDrivers(res?.drivers || []);
    } catch (err: any) {
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (driver: any) => {
    if (!confirm("Delete this driver?")) return;

    try {
      await apiHandler.del(`/api/superadmin/drivers/${driver._id}`);
      showToast("Driver removed", "success");
      loadDrivers();
    } catch (err: any) {
      showToast(err, "error");
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  return (
    <Wrapper>
      <Header>
        <h2>Drivers</h2>
        <button onClick={() => { setEditing(null); setOpenForm(true); }}>+ Add Driver</button>
      </Header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        drivers.map((d) => (
          <DriverCard
            key={d._id}
            data={d}
            onEdit={() => { setEditing(d); setOpenForm(true); }}
            onDelete={() => deleteDriver(d)}
          />
        ))
      )}

      {openForm && (
        <DriverForm
          defaultValues={editing}
          onClose={() => setOpenForm(false)}
          onSuccess={loadDrivers}
        />
      )}
    </Wrapper>
  );
}
