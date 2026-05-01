import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  Utensils,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "POS", icon: ShoppingCart, path: "/pos" },
    { name: "Menu", icon: Utensils, path: "/admin/menu" },
    { name: "Inventory", icon: Box, path: "/admin/inventory" },
    { name: "Orders", icon: ClipboardList, path: "/admin/orders" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
    { name: "Logout", icon: LogOut, action: "logout" },
  ];

  return (
    <aside className="w-[320px] shrink-0 h-full bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col justify-between z-20">
      <div className="flex flex-col h-full">
        <button
          className="p-8 flex items-center gap-4 text-left group"
          onClick={() => navigate("/admin/dashboard")}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
            UC
          </div>
          <div className="flex flex-col">
            <strong className="text-slate-900 text-lg font-black tracking-tight leading-tight group-hover:text-sky-600 transition-colors">Urban Crust</strong>
            <small className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Admin Panel</small>
          </div>
        </button>

        <ul className="flex flex-col gap-2 px-6 mt-4 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let isActive = location.pathname === item.path;
            if (item.path === "/admin/dashboard" && location.pathname === "/admin") {
              isActive = true;
            }

            return (
              <li key={item.name}>
                <button
                  onClick={() => {
                    if (item.action === "logout") {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      navigate("/login");
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-sky-600" : ""} />
                  <span className="text-base">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={() => navigate("/pos")} 
          className="w-full bg-white text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm border border-emerald-200 hover:border-emerald-500 hover:shadow-lg transition-all py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 group"
        >
          <span className="bg-emerald-50 text-emerald-600 w-6 h-6 rounded-md flex items-center justify-center text-sm font-black group-hover:bg-white group-hover:text-emerald-600">+</span>
          New Sale
        </button>
      </div>
    </aside>
  );
}
