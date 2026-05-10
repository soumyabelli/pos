import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import POS from "./pages/POS";

// Legacy standalone page (kept for compatibility)
import ProductManagement from "./pages/ProductManagement";

// Manager Routes
import ManagerLayout from "./manager/components/ManagerLayout";
import ManagerDashboardPage from "./manager/pages/ManagerDashboardPage";

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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Our Custom Light Theme Pages */}
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="employees" element={<div className="p-8">Employee Management Module (Building...)</div>} />
          <Route path="inventory" element={<div className="p-8">Inventory Module (Building...)</div>} />
          <Route path="billing" element={<div className="p-8">Billing & Approvals Module (Building...)</div>} />
          <Route path="shifts" element={<div className="p-8">Shift Tracking Module (Building...)</div>} />
          <Route path="reports" element={<div className="p-8">Reports Module (Building...)</div>} />
          <Route path="settings" element={<div className="p-8">Settings Module (Building...)</div>} />
        </Route>
        
        <Route
          path="/pos"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager", "user", "worker"]}>
              <POS />
            </ProtectedRoute>
          }
        />

        {/* Remote Origin Main Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDataProvider>
                <AdminLayout />
              </AdminDataProvider>
            </ProtectedRoute>
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
