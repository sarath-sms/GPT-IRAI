import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useAuth } from '@/context/AuthContext';

const Wrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(8)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InvoiceCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing(8)};
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(255, 235, 59, 0.15);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(6)};

  h1 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }

  p {
    color: ${({ theme }) => theme.colors.mutedText};
  }
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing(4)};

  th, td {
    padding: ${({ theme }) => theme.spacing(3)};
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Total = styled.div`
  text-align: right;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing(6)};
`;

const PrintButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing(8)};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    transform: scale(1.03);
  }

  @media print {
    display: none;
  }
`;

const TopBar = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  @media print {
    display: none; /* hide in print/PDF */
  }
`;

export default function Invoice() {
  const [order, setOrder] = useState<any>(null);
  const {user, updateUser} = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = {...user};
    if (storedUser) updateUser(storedUser);

    const allOrders = JSON.parse(localStorage.getItem('iraitchi_orders') || '[]');
    const selectedOrder = allOrders.find((o: any) => o.id === id);
    if (selectedOrder) setOrder(selectedOrder);
  }, [id]);

  const getTotal = () => {
    if (!order) return 0;
    const itemTotal = order.items.reduce((acc, i) => acc + i.qty * i.price, 0);
    return itemTotal + order.deliveryFee;
  };
  
  // const goBack = () => navigate(-1);

  if (!user || !order) return <Wrapper>Loading invoice...</Wrapper>;

  return (
    <Wrapper>
      <TopBar>
        <BackButton />
      </TopBar>
      <InvoiceCard>
        <Header>
          <h1>Iraitchi Invoice 🧾</h1>
          <p>Order ID: {order.id}</p>
          <p>Date: {order.date}</p>
        </Header>

        <Section>
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Pincode:</strong> {user.pincode}</p>
        </Section>

        <Section>
          <h3>Order Summary</h3>
          <Table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>₹ {item.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Total>
            Delivery: ₹ {order.deliveryFee} <br />
            Total: ₹ {getTotal()}
          </Total>
        </Section>
      </InvoiceCard>

      <PrintButton onClick={() => window.print()}>🖨 Print / Download</PrintButton>
    </Wrapper>
  );
}
