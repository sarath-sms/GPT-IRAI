import styled from 'styled-components';
import { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
`;

const OrdersSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing(8)};
`;

const OrderCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('iraitchi_user');
    if (storedUser) setUser(JSON.parse(storedUser));

     // 🧾 TODO: Mock order data if not available
     let existingOrders = JSON.parse(localStorage.getItem('iraitchi_orders') || '[]');
     if (existingOrders.length === 0) {
       existingOrders = [
         {
           id: 'ORD001',
           date: '2025-11-08',
           total: 820,
           items: [
             { name: 'Prawns', qty: 1, price: 450 },
             { name: 'Chicken Breast', qty: 2, price: 280 },
           ],
           deliveryFee: 40,
         },
         {
           id: 'ORD002',
           date: '2025-11-07',
           total: 550,
           items: [
             { name: 'Mutton Curry Cut', qty: 1, price: 500 },
           ],
           deliveryFee: 50,
         },
       ];
       localStorage.setItem('iraitchi_orders', JSON.stringify(existingOrders));
     }
 
     setOrders(existingOrders);
  }, []);

  const handleViewInvoice = (id: string) => {
    navigate(`/invoice/${id}`);
  };

  if (!user) return <Wrapper>Loading profile...</Wrapper>;

  return (
    <Wrapper>
      <BackButton />
      <h1>👤 {user.name}</h1>
      <p>📱 {user.mobile}</p>
      <p>📍 {user.pincode}</p>

      <hr style={{ margin: '2rem 0', opacity: 0.2 }} />

      <h2>🧾 Order History</h2>
      <p>
  <a
    href="/invoice"
    style={{
      color: '#FFEB3B',
      textDecoration: 'none',
      fontWeight: '600',
    }}
  >
    View Sample Order Invoice →
  </a>
</p>
<OrdersSection>
        <h2>🧾 Order History</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} onClick={() => handleViewInvoice(order.id)}>
              <div>
                <strong>{order.id}</strong>
                <p style={{ color: '#BFC6DC', fontSize: '0.9rem' }}>{order.date}</p>
              </div>
              <span style={{ color: '#FFEB3B' }}>₹ {order.total}</span>
            </OrderCard>
          ))
        )}
      </OrdersSection>
    </Wrapper>
  );
}
