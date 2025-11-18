import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import styled from "styled-components";

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  .details {
    flex: 1;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .qty-btn {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function CartItemCard({ item, onQtyChange, onRemove }: any) {
  const unit = Number(item.unitPrice ?? item.price ?? 0) || 0;
  const qty = Number(item.qty ?? 1) || 1;
  const total = unit * qty;

  return (
    <Card initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="details">
        <strong>{item.name}</strong>

        <p style={{ marginTop: 4, color: "#BFC6DC" }}>
          Size: {item.size || "-"} | Cut: {item.cutType || "-"}
        </p>

        <p style={{ marginTop: 6, color: "#FFEB3B" }}>
          ₹{unit} / unit
        </p>

        <p style={{ marginTop: 4, color: "#BFC6DC" }}>
          Total: ₹{total.toFixed(2)}
        </p>
      </div>

      <div className="controls">
        <button className="qty-btn" onClick={() => onQtyChange(item, -1)}>
          -
        </button>

        <motion.span key={qty} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          {qty}
        </motion.span>

        <button className="qty-btn" onClick={() => onQtyChange(item, +1)}>
          +
        </button>

        <button className="remove-btn" onClick={() => onRemove(item)}>
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}
