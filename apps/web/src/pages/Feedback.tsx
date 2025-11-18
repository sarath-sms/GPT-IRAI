// apps/web/pages/Feedback.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BackButton from "@/components/BackButton";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import StarRating from "@/components/StarRating";

const Wrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
  min-height: 100vh;
`;

const Input = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 12px;
`;

const Button = styled.button`
  margin-top: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

export default function Feedback() {
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("product");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiHandler.get("/api/feedback/my");
      setList(res.feedbacks || res || []);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!rating) return showToast("Please rate your experience", "error");
    if (!text.trim()) return showToast("Write feedback message", "error");

    try {
      await apiHandler.post("/api/feedback", {
        message: text,
        rating,
        category,
      });

      showToast("Thanks! Feedback submitted.", "success");
      setText("");
      setRating(0);
      setCategory("product");
      load();
    } catch (err: any) {
      showToast(err?.message || "Submit failed", "error");
    }
  };

  return (
    <Wrapper>
      <BackButton />
      <h1>📝 Feedback</h1>

      <p style={{ color: "#BFC6DC" }}>
        Share your experience — we listen, and admins respond.
      </p>

      <h3 style={{ marginTop: 20 }}>Your Rating</h3>
      <StarRating value={rating} onChange={setRating} />

      <h3 style={{ marginTop: 20 }}>Category</h3>
      <Select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="product">Product</option>
        <option value="delivery">Delivery</option>
        <option value="app">App UX / UI</option>
      </Select>

      <h3 style={{ marginTop: 20 }}>Message</h3>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell us what's good / bad / suggestions..."
      />

      <Button onClick={submit}>Submit Feedback</Button>

      <hr style={{ margin: "20px 0", opacity: 0.12 }} />

      <h3>Your Feedback History</h3>

      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <div>
          {list.map((f: any) => (
            <div key={f._id} style={{
              marginBottom: 12,
              border: "1px solid rgba(255,255,255,0.04)",
              padding: 12,
              borderRadius: 8
            }}>
              <div style={{ fontSize: 13, color: "#BFC6DC" }}>
                {new Date(f.createdAt).toLocaleString()}
              </div>

              <div style={{ marginTop: 6 }}>
                ⭐ {f.rating} — {f.category.toUpperCase()}
              </div>

              <div style={{ marginTop: 6 }}>{f.message}</div>

              {f.reply && (
                <div style={{ marginTop: 10, color: "#FFEB3B" }}>
                  Admin Reply: {f.reply.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
