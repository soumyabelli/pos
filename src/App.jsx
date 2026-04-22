import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import POS from "./pages/POS";

import AdminLayout from "./admin/components/AdminLayout";
import DashboardPage from "./admin/pages/DashboardPage";
import ProductsPage from "./admin/pages/ProductsPage";
import CategoriesPage from "./admin/pages/CategoriesPage";
import InventoryPage from "./admin/pages/InventoryPage";
import OrdersPage from "./admin/pages/OrdersPage";
import UsersPage from "./admin/pages/UsersPage";
import ReportsPage from "./admin/pages/ReportsPage";
import SettingsPage from "./admin/pages/SettingsPage";
import LogoutPage from "./admin/pages/LogoutPage";
import { AdminDataProvider } from "./admin/context/AdminDataProvider";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/pos" element={<POS />} />

        <Route
          path="/admin"
          element={
            <AdminDataProvider>
              <AdminLayout />
            </AdminDataProvider>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="logout" element={<LogoutPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
