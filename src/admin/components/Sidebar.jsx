import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Tags,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Categories", icon: Tags, path: "/admin/categories" },
  { label: "Inventory", icon: Boxes, path: "/admin/inventory" },
  { label: "Orders", icon: ClipboardList, path: "/admin/orders" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Reports", icon: ChartNoAxesCombined, path: "/admin/reports" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
  { label: "Logout", icon: LogOut, path: "/admin/logout", critical: true },
];

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Desktop sidebar: in normal flex flow, no overlap */}
      <aside className="relative z-20 hidden h-full w-64 shrink-0 border-r border-white/10 bg-gradient-to-b from-[#09153a] via-[#081436] to-[#061230] p-3 shadow-[0_30px_80px_rgba(2,8,32,0.45)] lg:flex">
        <div className="flex h-full w-full flex-col">
          <div className="mb-4 flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-[1.2rem] leading-5 font-semibold tracking-tight text-white">NovaRetail OS</p>
                <p className="mt-0.5 text-xs text-blue-100/80">Admin Command Center</p>
              </div>
            </div>
          </div>

          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100/50">Navigation</p>

          <nav className="flex-1 overflow-y-auto pr-1">
            <ul className="m-0 list-none space-y-1.5 p-0">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.label} className="list-none">
                  <NavLink
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `group flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-blue-900/40"
                          : item.critical
                            ? "text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                            : "text-blue-100/80 hover:bg-white/[0.06] hover:text-white"
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="ml-3 tracking-[0.01em]">{item.label}</span>
                    {!item.critical && <ChevronRight size={14} className="ml-auto opacity-40 transition group-hover:opacity-100" />}
                  </NavLink>
                </li>
              );
            })}
            </ul>
          </nav>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">System Health</p>
              <div className="grid h-8 w-8 place-content-center rounded-lg bg-white/10 text-slate-200">
                <BarChart3 size={14} />
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300/80">
              All channels synced. Inventory updates are live.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Operational
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-gradient-to-b from-[#09153a] via-[#081436] to-[#061230] p-3 shadow-[0_30px_80px_rgba(2,8,32,0.7)] transition-transform duration-300 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full w-full flex-col">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-[1.2rem] leading-5 font-semibold tracking-tight text-white">NovaRetail OS</p>
                <p className="mt-0.5 text-xs text-blue-100/80">Admin Command Center</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100/50">Navigation</p>

          <nav className="flex-1 overflow-y-auto">
            <ul className="m-0 list-none space-y-1.5 p-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={`mobile-${item.label}`} className="list-none">
                    <NavLink
                      to={item.path}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-blue-900/40"
                            : item.critical
                              ? "text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                              : "text-blue-100/80 hover:bg-white/[0.06] hover:text-white"
                        }`
                      }
                    >
                      <Icon size={17} className="shrink-0" />
                      <span className="ml-3 tracking-[0.01em]">{item.label}</span>
                      {!item.critical && <ChevronRight size={14} className="ml-auto opacity-40 transition group-hover:opacity-100" />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
