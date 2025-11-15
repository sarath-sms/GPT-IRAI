import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthFlow from "./pages/AuthFlow";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";
import Invoice from "./pages/Invoice";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/order-success";
import OrderFailed from "./pages/order-failed";

import EmployeeDashboard from "./pages/employee/Dashboard";
import AdminList from "./pages/employee/superAdmin/AdminList";

import EmployeeProtected from "./routes/EmployeeProtected";
import DriverList from "./pages/employee/superAdmin/DriverList";
import ProductList from "./pages/employee/superAdmin/ProductList";
import ShopList from "./pages/employee/superAdmin/ShopList";

export default function App() {
  const isCustomerLoggedIn = !!localStorage.getItem("iraitchi_user");

  return (
    <Router>
      <Routes>

        {/* -------------------------------------
            EMPLOYEE FLOW (SEPARATE)
        ------------------------------------- */}
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

        {/* Later: */}
        {/* <Route path="/dashboard/drivers" element={<EmployeeProtected><DriverList /></EmployeeProtected>} /> */}
        {/* <Route path="/dashboard/shops" element={<EmployeeProtected><ShopList /></EmployeeProtected>} /> */}


        {/* -------------------------------------
            CUSTOMER FLOW (DEFAULT)
        ------------------------------------- */}
        {!isCustomerLoggedIn ? (
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
