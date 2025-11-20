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
import CustomerProtected from "./routes/CustomerProtected";
import AvailableShops from "./pages/AvailableShops";

export default function App() {
  const { user, role, ready } = useAuth();
console.log("✅✅✅")
console.log(user, role)
  if (!ready) return null; // Prevent flicker

  const isCustomer = user;

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
        <Route
      path="/commingsoon"
      element={<AvailableShops />}
    />

        {/* CUSTOMER FLOW */}
        {!isCustomer ? (
  <Route path="*" element={<AuthFlow />} />
) : (
  <>
    <Route
      path="/"
      element={
        <CustomerProtected>
          <Products />
        </CustomerProtected>
      }
    />

    <Route
      path="/products"
      element={
        <CustomerProtected>
          <Products />
        </CustomerProtected>
      }
    />

    <Route
      path="/cart"
      element={
        <CustomerProtected>
          <Cart />
        </CustomerProtected>
      }
    />

    <Route
      path="/order-success"
      element={
        <CustomerProtected>
          <OrderSuccess />
        </CustomerProtected>
      }
    />

    <Route
      path="/order-failed"
      element={
        <CustomerProtected>
          <OrderFailed />
        </CustomerProtected>
      }
    />

    <Route
      path="/profile"
      element={
        <CustomerProtected>
          <Profile />
        </CustomerProtected>
      }
    />

    <Route
      path="/invoice"
      element={
        <CustomerProtected>
          <Invoice />
        </CustomerProtected>
      }
    />

    <Route
      path="/invoice/:id"
      element={
        <CustomerProtected>
          <Invoice />
        </CustomerProtected>
      }
    />

    <Route
      path="/feedback"
      element={
        <CustomerProtected>
          <Feedback />
        </CustomerProtected>
      }
    />
  </>
)}

      </Routes>
    </Router>
  );
}
