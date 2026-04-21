import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import POS from "./pages/POS";

import ProductManagement from "./pages/ProductManagement";
import InventoryManagement from "./pages/InventoryManagement";
import OrderManagement from "./pages/OrderManagement";
import ReportsManagement from "./pages/ReportsManagement";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        
        {/* Main Admin Sidebar Routes */}
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/inventory" element={<InventoryManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/reports" element={<ReportsManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/pos" element={<POS />} />
      </Routes>
    </Router>
  );
}

export default App;
