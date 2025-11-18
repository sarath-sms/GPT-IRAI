import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

export default function AddressSection({ address, onChange }: any) {
  return (
    <>
      <Input
        placeholder="House / Flat No"
        value={address.houseId}
        onChange={(e) => onChange("houseId", e.target.value)}
      />
      <Input
        placeholder="Address Line 1"
        value={address.addr1}
        onChange={(e) => onChange("addr1", e.target.value)}
      />
      <Input
        placeholder="Address Line 2"
        value={address.addr2}
        onChange={(e) => onChange("addr2", e.target.value)}
      />
    </>
  );
}
