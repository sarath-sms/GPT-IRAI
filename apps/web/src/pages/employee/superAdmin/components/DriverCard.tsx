// src/pages/employee/superAdmin/components/DriverCard.tsx
import styled from "styled-components";

const Card = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }

  .details {
    flex: 1;
    line-height: 1.3;
  }

  .meta span {
    display: block;
    color: #BFC6DC;
    margin-top: 4px;
    font-size: 0.85rem;
  }

  .actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
  }
`;

export default function DriverCard({ data, onEdit, onDelete }: any) {
  return (
    <Card>
      <div className="details">
        <strong style={{ fontSize: 16 }}>{data.name}</strong>
        <div className="meta">
          <span>📱 {data.mobile}</span>
          <span>🆔 Aadhaar: {data.aadhaar || "-"}</span>
          <span>🪪 PAN: {data.pan || "-"}</span>
          <span>🚘 DL: {data.drivingLicence || "-"}</span>
        </div>
      </div>

      <div className="actions">
        <button onClick={onEdit} style={{ background: "rgba(255,235,59,0.12)" }}>Edit</button>
        <button onClick={onDelete} style={{ background: "#ff4d4d", color: "white" }}>Delete</button>
      </div>
    </Card>
  );
}
