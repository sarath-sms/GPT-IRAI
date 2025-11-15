// src/pages/employee/superAdmin/components/DeletePopup.tsx
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  background: #26355d;
  padding: 1.5rem;
  width: 90%;
  max-width: 300px;
  border-radius: 12px;
  text-align: center;
`;

export default function DeletePopup({ message, onCancel, onConfirm }: any) {
  return (
    <Overlay>
      <Box>
        <p>{message}</p>

        <br />

        <button onClick={onConfirm} style={{ background: "#ff4d4d" }}>
          Delete
        </button>

        <br /><br />

        <button onClick={onCancel} style={{ background: "gray" }}>
          Cancel
        </button>
      </Box>
    </Overlay>
  );
}
