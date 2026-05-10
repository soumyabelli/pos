import { Menu, Search, Bell } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const pageNames = {
  "/manager/dashboard": "Manager Dashboard",
  "/manager/employees": "Employee Management",
  "/manager/inventory": "Branch Inventory",
  "/manager/billing": "Billing & Approvals",
  "/manager/shifts": "Shift Management",
  "/manager/reports": "Operational Reports",
  "/manager/settings": "Branch Settings",
};

export default function ManagerTopNavbar({ onOpenSidebar }) {
  const location = useLocation();
  const activePage = pageNames[location.pathname] || "Manager Portal";
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7d5c3] bg-[#fffaf4]/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7d5c3] bg-white text-[#6F4E37] hover:bg-[#f8eee3] lg:hidden"
          >
            <Menu size={18} />
          </button>

          <label className="relative w-full max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B6F47]" />
            <input
              type="search"
              placeholder="Search staff, bills, or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white pl-11 pr-4 text-[0.95rem] text-[#3E2723] placeholder:text-[#8B6F47] outline-none transition focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15"
            />
          </label>
        </div>

        <div className="hidden min-w-[180px] shrink-0 text-right xl:block">
          <p className="truncate text-sm font-semibold text-[#3E2723]">{activePage}</p>
          <p className="truncate text-xs text-[#8B6F47]">Logged in as Manager</p>
        </div>

        <div className="flex items-center gap-2">
          <button title="Notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7d5c3] bg-white text-[#6F4E37] hover:bg-[#f8eee3] transition">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
