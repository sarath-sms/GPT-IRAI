import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AuthFlow from "./pages/AuthFlow";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Invoice from "./pages/Invoice";
import OrderSuccess from "./pages/order-success";
import OrderFailed from "./pages/order-failed";
import Feedback from "./pages/Feedback";

import EmployeeProtected from "./routes/EmployeeProtected";
import EmployeeDashboard from "./pages/employee/Dashboard";
import AdminList from "./pages/employee/superAdmin/AdminList";
import DriverList from "./pages/employee/superAdmin/DriverList";
import ProductList from "./pages/employee/superAdmin/ProductList";
import ShopList from "./pages/employee/superAdmin/ShopList";

export default function App() {
  const { user, role, ready } = useAuth();
console.log("✅✅✅")
console.log(user, role)
  if (!ready) return null; // Prevent flicker

  const isCustomer = role === "customer";

  return (
    <Router>
      <Routes>
        {/* EMPLOYEE ROUTES */}
        <Route
          path="/dashboard"
          element={
            <EmployeeProtected>
              <EmployeeDashboard />
            </EmployeeProtected>
          }
        />

        <Route
          path="/superadmin/admins"
          element={
            <EmployeeProtected>
              <AdminList />
            </EmployeeProtected>
          }
        />

        <Route
          path="/superadmin/drivers"
          element={
            <EmployeeProtected>
              <DriverList />
            </EmployeeProtected>
          }
        />

        <Route
          path="/superadmin/products"
          element={
            <EmployeeProtected>
              <ProductList />
            </EmployeeProtected>
          }
        />

        <Route
          path="/superadmin/shops"
          element={
            <EmployeeProtected>
              <ShopList />
            </EmployeeProtected>
          }
        />

        {/* CUSTOMER FLOW */}
        {!isCustomer ? (
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
