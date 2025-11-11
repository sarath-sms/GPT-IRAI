import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthFlow from './pages/AuthFlow';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Invoice from './pages/Invoice';
import Cart from './pages/Cart';
import OrderSuccess from './pages/order-success';
import OrderFailed from './pages/order-failed';

export default function App() {
  const isLoggedIn = !!localStorage.getItem('iraitchi_user');

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<AuthFlow />} />
        ) : (
          <>
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-success" element={<OrderSuccess />} />
<Route path="/order-failed" element={<OrderFailed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/feedback" element={<Feedback />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
