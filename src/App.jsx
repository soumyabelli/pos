import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Pos from "./pages/POS";

// Legacy standalone page (kept for compatibility)
import ProductManagement from "./pages/ProductManagement";

// Manager Routes
import ManagerLayout from "./manager/components/ManagerLayout";
import ManagerDashboardPage from "./manager/pages/ManagerDashboardPage";
import ManagerEmployeesPage from "./manager/pages/ManagerEmployeesPage";
import ManagerInventoryPage from "./manager/pages/ManagerInventoryPage";
import ManagerBillingPage from "./manager/pages/ManagerBillingPage";
import ManagerReportsPage from "./manager/pages/ManagerReportsPage";
import ManagerShiftsPage from "./manager/pages/ManagerShiftsPage";
import ManagerSettingsPage from "./manager/pages/ManagerSettingsPage";

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
          <Route path="employees" element={<ManagerEmployeesPage />} />
          <Route path="inventory" element={<ManagerInventoryPage />} />
          <Route path="billing" element={<ManagerBillingPage />} />
          <Route path="shifts" element={<ManagerShiftsPage />} />
          <Route path="reports" element={<ManagerReportsPage />} />
          <Route path="settings" element={<ManagerSettingsPage />} />
        </Route>
        
        <Route
          path="/pos"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager", "user", "worker"]}>
              <Pos />
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
