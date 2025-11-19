// apps/web/components/cart/AddressSection.tsx
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

export default function AddressSection() {
  const { user, updateUser } = useAuth();

  // local controlled inputs for smooth typing
  const [houseId, setHouseId] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");

  // hydrate local state when user loads
  useEffect(() => {
    if (!user) return;
    setHouseId(user.address?.houseId || "");
    setAddr1(user.address?.addr1 || "");
    setAddr2(user.address?.addr2 || "");
  }, [user]);

  const commit = (key: string, value: string) => {
    if (!user) return;
    updateUser({
      ...user,
      address: {
        ...user.address,
        [key]: value,
      },
    });
  };

  return (
    <>
      <Input
        placeholder="House / Flat No"
        value={houseId}
        onChange={(e) => {
          setHouseId(e.target.value);
          commit("houseId", e.target.value);
        }}
      />

      <Input
        placeholder="Address Line 1"
        value={addr1}
        onChange={(e) => {
          setAddr1(e.target.value);
          commit("addr1", e.target.value);
        }}
      />

      <Input
        placeholder="Address Line 2"
        value={addr2}
        onChange={(e) => {
          setAddr2(e.target.value);
          commit("addr2", e.target.value);
        }}
      />
    </>
  );
}
