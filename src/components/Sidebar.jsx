import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "POS", icon: ShoppingCart, path: "/pos" },
    { name: "Products", icon: Box, path: null },
    { name: "Inventory", icon: Box, path: null },
    { name: "Orders", icon: ClipboardList, path: null },
    { name: "Reports", icon: BarChart3, path: null },
    { name: "Users", icon: Users, path: null },
    { name: "Settings", icon: Settings, path: null },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-main">
        <button
          className="sidebar-brand"
          onClick={() => navigate("/admin")}
          aria-label="Go to dashboard"
        >
          <span className="brand-mark">CA</span>
          <span className="brand-copy">
            <strong>Curator Admin</strong>
            <small>Flagship Store</small>
          </span>
        </button>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && location.pathname === item.path;

            return (
              <li key={item.name}>
                <button
                  onClick={() => item.path && navigate(item.path)}
                  className={`menu-item ${isActive ? "active" : ""} ${item.path ? "" : "disabled"}`}
                >
                  <Icon size={17} />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button onClick={() => navigate("/pos")} className="new-sale-btn">
          <span className="plus-chip">+</span>
          New Sale
        </button>
      </div>
    </aside>
  );
}
