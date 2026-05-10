import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Boxes,
  ReceiptText,
  ChartNoAxesCombined,
  Clock,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/manager/dashboard" },
  { label: "Employees", icon: Users, path: "/manager/employees" },
  { label: "Inventory", icon: Boxes, path: "/manager/inventory" },
  { label: "Billing / Approvals", icon: ReceiptText, path: "/manager/billing" },
  { label: "Shifts", icon: Clock, path: "/manager/shifts" },
  { label: "Reports", icon: ChartNoAxesCombined, path: "/manager/reports" },
  { label: "Settings", icon: Settings, path: "/manager/settings" },
  { label: "Logout", icon: LogOut, path: "/login", critical: true },
];

export default function ManagerSidebar({ isMobileOpen, onCloseMobile }) {
  const sidebarBg = "bg-[#fffaf4]";
  const borderColor = "border-[#e7d5c3]";
  const hoverBg = "hover:bg-[#f8eee3]";
  const textMuted = "text-[#8B6F47]";
  const textBase = "text-[#5E4634]";
  const textStrong = "text-[#3E2723]";

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside className={`relative z-20 hidden h-full w-72 shrink-0 border-r p-4 shadow-[8px_0_30px_rgba(92,61,34,0.08)] lg:flex flex-col ${borderColor} ${sidebarBg}`}>
        <div className={`mb-4 flex items-center rounded-2xl border bg-white px-3 py-3 shadow-sm ${borderColor}`}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid shrink-0 h-10 w-10 place-content-center rounded-xl bg-gradient-to-br from-[#D4853D] to-[#6F4E37] text-white">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[1.1rem] leading-5 font-bold tracking-tight ${textStrong}`}>Manager Portal</p>
              <p className={`mt-0.5 truncate text-[11px] font-medium ${textMuted}`}>Branch Operations</p>
            </div>
          </div>
        </div>

        <p className={`mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.2em] ${textMuted}`}>Modules</p>

        <nav className="flex-1 overflow-y-auto pr-1">
          <ul className="m-0 list-none space-y-1.5 p-0">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `group flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition ${
                        isActive
                          ? "bg-[#d4853d] text-white shadow-lg shadow-[#d4853d]/30"
                          : item.critical
                            ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            : `${textBase} ${hoverBg} hover:text-[#3E2723]`
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="ml-3 truncate tracking-[0.01em]">{item.label}</span>
                    {!item.critical && <ChevronRight size={14} className="ml-auto shrink-0 opacity-40 transition group-hover:opacity-100" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
