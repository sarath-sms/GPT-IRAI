// src/pages/employee/superAdmin/components/AdminCard.tsx
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
  gap: 12px;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }

  .info {
    flex: 1;
    line-height: 1.3;
  }

  .meta {
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 0.85rem;
    margin-top: 6px;
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  button {
    padding: 6px 10px;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }
`;

export default function AdminCard({ data, onEdit, onDelete }: any) {
  return (
    <Card>
      <div className="info">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ fontSize: 16 }}>{data.name}</strong>
            <div style={{ color: "#BFC6DC", marginTop: 4 }}>{data.mobile}</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#FFEB3B" }}>{data.role?.toUpperCase() || "ADMIN"}</div>
            <div style={{ color: "#BFC6DC", fontSize: 12 }}>{data._id?.slice?.(0,8)}</div>
          </div>
        </div>

        <div className="meta">
          <div><strong>Pincodes:</strong> {Array.isArray(data.pincodes) ? data.pincodes.join(", ") : (data.pincodes || "-")}</div>
          <div><strong>Aadhaar:</strong> {data.aadhaar || "-"}</div>
          <div><strong>PAN:</strong> {data.pan || "-"}</div>
          <div><strong>Driving Licence:</strong> {data.drivingLicence || "-"}</div>
        </div>
      </div>

      <div className="actions" style={{ alignSelf: "flex-end" }}>
        <button onClick={onEdit} style={{ background: "rgba(255,235,59,0.12)" }}>Edit</button>
        <button onClick={onDelete} style={{ background: "#ff4d4d", color: "#fff" }}>Delete</button>
      </div>
    </Card>
  );
}
