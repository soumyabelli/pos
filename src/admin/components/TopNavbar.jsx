import { Bell, Menu, Moon, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageNames = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/inventory": "Inventory",
  "/admin/orders": "Orders",
  "/admin/users": "Users",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
  "/admin/logout": "Logout",
};

export default function TopNavbar({ onOpenSidebar }) {
  const location = useLocation();
  const activePage = pageNames[location.pathname] || "Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7d5c3] bg-[#fffaf4]/95 px-4 py-3 shadow-[0_8px_24px_rgba(76,54,36,0.08)] backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7d5c3] bg-white text-[#6F4E37] transition hover:bg-[#f8eee3] lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <label className="relative w-full max-w-2xl">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6F47]"
            />
            <input
              type="search"
              placeholder="Search products, orders, users..."
              className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white pl-9 pr-4 text-[0.95rem] text-[#3E2723] outline-none transition placeholder:text-[#8B6F47] focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15"
            />
          </label>
        </div>

        <div className="hidden min-w-[180px] text-right xl:block">
          <p className="text-sm font-semibold text-[#3E2723]">{activePage}</p>
          <p className="text-xs text-[#8B6F47]">Omnichannel Operations</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7d5c3] bg-white text-[#6F4E37] transition hover:bg-[#f8eee3]"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <button
            type="button"
            aria-label="Theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7d5c3] bg-white text-[#6F4E37] transition hover:bg-[#f8eee3]"
          >
            <Moon size={17} />
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-[#e7d5c3] bg-white px-2 py-1.5 shadow-sm">
            <img
              src="https://i.pravatar.cc/80?img=1"
              alt="Admin profile"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <div className="hidden pr-2 sm:block">
              <p className="text-sm font-semibold text-[#3E2723]">Admin</p>
              <p className="text-xs text-[#8B6F47]">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
