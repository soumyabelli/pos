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
    { name: "Products", icon: Box, path: "/admin/products" },
    { name: "Inventory", icon: Box, path: "/admin/inventory" },
    { name: "Orders", icon: ClipboardList, path: "/admin/orders" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <aside className="w-[280px] h-full bg-white/60 backdrop-blur-md border-r border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex flex-col h-full">
        <button
          className="p-6 flex items-center gap-3 text-left group"
          onClick={() => navigate("/admin")}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            UC
          </div>
          <div className="flex flex-col">
            <strong className="text-slate-900 font-black tracking-tight leading-tight group-hover:text-orange-500 transition-colors">Urban Crust</strong>
            <small className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin Panel</small>
          </div>
        </button>

        <ul className="flex flex-col gap-1 px-4 mt-4 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Handle multiple paths matching (e.g. /admin -> /admin/products)
            let isActive = location.pathname === item.path;
            if (item.path === '/admin' && location.pathname.startsWith('/admin') && location.pathname !== '/admin/inventory' && location.pathname !== '/admin/products' && location.pathname !== '/admin/orders' && location.pathname !== '/admin/reports' && location.pathname !== '/admin/users' && location.pathname !== '/admin/settings') {
                isActive = true;
            }

            return (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                      : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-orange-400" : ""} />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={() => navigate("/pos")} 
          className="w-full bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/20 border border-orange-200 hover:border-orange-500 transition-all py-3 rounded-xl font-bold flex items-center justify-center gap-2 group"
        >
          <span className="bg-white/80 text-orange-500 w-5 h-5 rounded flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-white group-hover:text-orange-600">+</span>
          New Sale
        </button>
      </div>
    </aside>
  );
}
