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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081230]/80 px-4 py-3 shadow-[0_10px_25px_rgba(2,8,32,0.35)] backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <label className="relative w-full max-w-2xl">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search here..."
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] pl-9 pr-4 text-[0.95rem] text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-blue-400/70 focus:bg-white/[0.08]"
            />
          </label>
        </div>

        <div className="hidden min-w-[180px] text-right xl:block">
          <p className="text-sm font-semibold text-white">{activePage}</p>
          <p className="text-xs text-slate-300/80">Omnichannel Operations</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200 transition hover:bg-white/10"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <button
            type="button"
            aria-label="Theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200 transition hover:bg-white/10"
          >
            <Moon size={17} />
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-2 py-1.5">
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="Admin profile"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <div className="hidden pr-2 sm:block">
              <p className="text-sm font-semibold text-slate-100">Ariana Wells</p>
              <p className="text-xs text-slate-300/80">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
