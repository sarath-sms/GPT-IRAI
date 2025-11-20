// apps/web/pages/AvailableShops.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Store, MapPin, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { apiHandler } from "@/utils/apiHandler";
import BackButton from "@/components/BackButton";

const Wrapper = styled.main`
  min-height: 100vh;
  padding: 24px 16px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 0.95rem;
  opacity: 0.8;
  margin-bottom: 20px;
`;

const ShopCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 18px 14px;
  border-radius: 12px;
  margin-bottom: 14px;

  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
`;

const IconBox = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 10px;
  border-radius: 10px;
`;

const ShopName = styled.h3`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2px;
`;

const Pincode = styled.span`
  font-size: 0.85rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FooterNote = styled.div`
  text-align: center;
  margin-top: 28px;
  padding: 18px;
  font-size: 0.9rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.3);
  opacity: 0.9;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const Contact = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
`;

const WAButton = styled(motion.a)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  margin-top: 22px;
  background: #25D366;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
`;

export default function AvailableShops() {
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiHandler.get("/api/user/shops", false);
        setShops(res?.shops || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Wrapper>
      <BackButton fallback="/" />

      <Title>📍 Available Delivery Zones</Title>
      <Subtitle>We’re expanding faster than ever. Stay tuned! 😄🔥</Subtitle>

      {shops.map((shop, idx) => (
        <ShopCard
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <IconBox>
            <Store size={22} />
          </IconBox>

          <div>
            <ShopName>{shop.name}</ShopName>
            <Pincode>
              <MapPin size={14} /> {shop.pincode}
            </Pincode>
          </div>
        </ShopCard>
      ))}

      <FooterNote>
        💡 <Highlight>Feel free to contact us</Highlight> for **pre-orders for 
        weddings, functions & parties!** 🎉🎊  
        <br />
        <Contact href="tel:+919444626409">
          <PhoneCall size={17} /> +91 94446-26409
        </Contact>
      </FooterNote>
      <WAButton
        whileTap={{ scale: 0.95 }}
        href={`https://wa.me/919444626409?text=${encodeURI(
          "Hello Iraitchi Team! 👋🏼 \nI would like to enquire about a pre-order for an event/function."
        )}`}
        target="_blank"
      >
        <PhoneCall size={18} /> WhatsApp Pre-Order
      </WAButton>
    </Wrapper>
  );
}
