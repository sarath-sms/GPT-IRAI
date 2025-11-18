import styled from "styled-components";
import { User, ShoppingCart, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: ${({ theme }) => theme.colors.secondary};
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
  backdrop-filter: blur(12px);
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.text};
  font-size: 0.75rem;

  svg {
    margin-bottom: 4px;
  }
`;

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem("iraitchi_cart") || "[]");
    setCartCount(cart.length);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <NavWrapper>
      <NavItem active={isActive("/profile")} onClick={() => navigate("/profile")}>
        <User size={22} />
        Profile
      </NavItem>

      <NavItem active={isActive("/cart")} onClick={() => navigate("/cart")}>
        <div style={{ position: "relative" }}>
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -10,
                background: "#FFEB3B",
                color: "#26355D",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                fontSize: "12px",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        Cart
      </NavItem>

      <NavItem active={isActive("/feedback")} onClick={() => navigate("/feedback")}>
        <MessageCircle size={22} />
        Feedback
      </NavItem>
    </NavWrapper>
  );
}
