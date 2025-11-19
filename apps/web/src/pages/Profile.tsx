// apps/web/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BackButton from "@/components/BackButton";
import { useNavigate } from "react-router-dom";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

const Wrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
  min-height: 100vh;
`;

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing(6)};
`;

const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 0.85rem;
`;

const Value = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  margin-top: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled.button`
  margin-top: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

export default function Profile() {
  const { showToast } = useToast();
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState({ houseId: "", addr1: "", addr2: "" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // fetch server profile if token available
        const data = await apiHandler.get("/api/user/profile");
        updateUser(data.user || data);
        // hydrate address if present
        setAddress(data.user?.address || data?.address || { houseId: "", addr1: "", addr2: "" });
      } catch (err: any) {
        console.log(err, "getting error on profile");
        // If server fails (e.g. not logged in yet), fallback to localStorage user
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      const payload = { address };
      const res = await apiHandler.patch("/api/user/profile", payload);
      updateUser(res.profile || res);
      showToast("Profile updated", "success");
      setEditing(false);
    } catch (err: any) {
      showToast(err?.message || "Update failed", "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goInvoice = (id: string) => navigate(`/invoice/${id}`);

  if (loading) return <Wrapper>Loading profile...</Wrapper>;
  if (!user) return <Wrapper><BackButton /> <p>No profile found.</p></Wrapper>;

  return (
    <Wrapper>
      <BackButton />
      <h1>👤 {user.name || "Guest"}</h1>
      <p>📱 {user.mobile || "-"}</p>
      <p>📍 {user.pincode || "-"}</p>

      <Section>
        <h2>🏠 Address</h2>

        {editing ? (
          <>
            <Field>
              <Label>House / Flat No</Label>
              <Input value={address.houseId} onChange={(e) => setAddress((p) => ({ ...p, houseId: e.target.value }))} />
            </Field>
            <Field>
              <Label>Address Line 1</Label>
              <Input value={address.addr1} onChange={(e) => setAddress((p) => ({ ...p, addr1: e.target.value }))} />
            </Field>
            <Field>
              <Label>Address Line 2</Label>
              <Input value={address.addr2} onChange={(e) => setAddress((p) => ({ ...p, addr2: e.target.value }))} />
            </Field>

            <Button onClick={handleSave}>Save Address</Button>
            <Button style={{ background: "transparent", color: "#FFEB3B", marginLeft: 12 }} onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Field>
              <Label>House / Flat No</Label>
              <Value>{user.address?.houseId || "-"}</Value>
            </Field>
            <Field>
              <Label>Address Line 1</Label>
              <Value>{user.address?.addr1 || "-"}</Value>
            </Field>
            <Field>
              <Label>Address Line 2</Label>
              <Value>{user.address?.addr2 || "-"}</Value>
            </Field>

            <Button onClick={() => setEditing(true)}>Edit Address</Button>
          </>
        )}
      </Section>

      <Section>
        <h2>🧾 Orders</h2>
        <p style={{ color: "#BFC6DC" }}>
          Your recent orders are fetched from server. If empty, you may not have placed any orders yet.
        </p>
        <Button onClick={() => navigate("/orders")}>View Orders</Button>
      </Section>

      <Section>
        <h2>✉️ Feedback</h2>
        <p style={{ color: "#BFC6DC" }}>Send feedback or view past feedbacks.</p>
        <Button onClick={() => navigate("/feedback")}>Go to Feedback</Button>
      </Section>

      <Section>
        <Button onClick={handleLogout} style={{ background: "transparent", color: "#FFEB3B", border: "1px solid rgba(255,235,59,0.2)" }}>
          Logout
        </Button>
      </Section>
    </Wrapper>
  );
}
