// src/pages/employee/superAdmin/AdminList.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiHandler } from "@/utils/apiHandler";
import AdminCard from "./components/AdminCard";
import AdminForm from "./components/AdminForm";
import DeletePopup from "./components/DeletePopup";
import { useToast } from "@/context/ToastContext";

const Wrapper = styled.main`
  padding: 1rem;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  button {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

export default function AdminList() {
  const { showToast } = useToast();

  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch admin list
  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await apiHandler.get("/api/superadmin/admins");
      setAdmins(data?.admins || []);
    } catch (err: any) {
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <Wrapper>
      <Header>
        <h2>Admins</h2>
        <button onClick={() => { setEditData(null); setShowForm(true); }}>
          + Add Admin
        </button>
      </Header>

      {loading && <p>Loading...</p>}

      {!loading && admins.length === 0 && (
        <p>No admins found.</p>
      )}

      {!loading &&
        admins.map((admin) => (
          <AdminCard
            key={admin._id}
            data={admin}
            onEdit={() => { setEditData(admin); setShowForm(true); }}
            onDelete={() => setDeleteId(admin._id)}
          />
        ))}

      {/* Add/Edit Form */}
      {showForm && (
        <AdminForm
          defaultValues={editData}
          onClose={() => { setShowForm(false); setEditData(null); }}
          onSuccess={() => loadAdmins()}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <DeletePopup
          message="Delete this admin?"
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            try {
              await apiHandler.del(`/api/superadmin/admins/${deleteId}`);
              showToast("Admin deleted", "success");
              setDeleteId(null);
              loadAdmins();
            } catch (err: any) {
              showToast(err, "error");
            }
          }}
        />
      )}
    </Wrapper>
  );
}
