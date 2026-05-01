import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

const initialNotifications = [
  { id: 1, title: "Low stock alert", detail: "2 products are below threshold.", read: false },
  { id: 2, title: "Order spike", detail: "Lunch orders are 18% above normal.", read: false },
  { id: 3, title: "Daily sync complete", detail: "POS and admin data are in sync.", read: true },
];

export default function TopNavbar({ onOpenSidebar, isCoolTheme = false, toggleTheme }) {
  const location = useLocation();
  const activePage = pageNames[location.pathname] || "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const notificationRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0),
    [notifications],
  );

  useEffect(() => {
    const onDocClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <header className={`sticky top-0 z-30 border-b px-4 py-3 shadow-[0_8px_24px_rgba(76,54,36,0.08)] backdrop-blur-md sm:px-6 lg:px-8 ${isCoolTheme ? "border-[#cfe2ff] bg-[#f4f8ff]/95" : "border-[#e7d5c3] bg-[#fffaf4]/95"}`}>
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white transition lg:hidden ${isCoolTheme ? "border-[#cfe2ff] text-[#35557d] hover:bg-[#e8f1ff]" : "border-[#e7d5c3] text-[#6F4E37] hover:bg-[#f8eee3]"}`}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <label className="relative w-full max-w-2xl">
            <Search
              size={16}
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isCoolTheme ? "text-[#5e7fa6]" : "text-[#8B6F47]"}`}
            />
            <input
              type="search"
              placeholder="Search products, orders, users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={`h-11 w-full rounded-xl border bg-white pl-9 pr-4 text-[0.95rem] outline-none transition focus:ring-4 ${isCoolTheme ? "border-[#cfe2ff] text-[#1f3652] placeholder:text-[#5e7fa6] focus:border-[#5b9dff] focus:ring-[#5b9dff]/15" : "border-[#e7d5c3] text-[#3E2723] placeholder:text-[#8B6F47] focus:border-[#D4853D] focus:ring-[#D4853D]/15"}`}
            />
          </label>
        </div>

        <div className="hidden min-w-[180px] text-right xl:block">
          <p className={`text-sm font-semibold ${isCoolTheme ? "text-[#1f3652]" : "text-[#3E2723]"}`}>{activePage}</p>
          <p className={`text-xs ${isCoolTheme ? "text-[#5e7fa6]" : "text-[#8B6F47]"}`}>Omnichannel Operations</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white transition ${isCoolTheme ? "border-[#cfe2ff] text-[#35557d] hover:bg-[#e8f1ff]" : "border-[#e7d5c3] text-[#6F4E37] hover:bg-[#f8eee3]"}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
            </button>

            {isNotificationOpen && (
              <div className={`absolute right-0 mt-2 w-[300px] rounded-2xl border bg-white p-3 shadow-xl ${isCoolTheme ? "border-[#cfe2ff]" : "border-[#e7d5c3]"}`}>
                <div className="mb-2 flex items-center justify-between">
                  <p className={`text-sm font-semibold ${isCoolTheme ? "text-[#1f3652]" : "text-[#3E2723]"}`}>Notifications</p>
                  <p className={`text-xs ${isCoolTheme ? "text-[#5e7fa6]" : "text-[#8B6F47]"}`}>{unreadCount} unread</p>
                </div>
                <div className="max-h-56 space-y-2 overflow-auto">
                  {notifications.length === 0 && (
                    <p className={`rounded-xl px-2 py-4 text-center text-xs ${isCoolTheme ? "bg-[#f2f7ff] text-[#5e7fa6]" : "bg-[#f8eee3]/50 text-[#8B6F47]"}`}>
                      No new notifications
                    </p>
                  )}
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border px-2.5 py-2 ${item.read ? (isCoolTheme ? "border-[#d8e8ff] bg-[#f8fbff]" : "border-[#f0dfd0] bg-[#fffcf9]") : (isCoolTheme ? "border-[#b7d6ff] bg-[#edf5ff]" : "border-[#ecd6bf] bg-[#fff5ea]")}`}
                    >
                      <p className={`text-xs font-semibold ${isCoolTheme ? "text-[#1f3652]" : "text-[#3E2723]"}`}>{item.title}</p>
                      <p className={`mt-0.5 text-[11px] ${isCoolTheme ? "text-[#5e7fa6]" : "text-[#8B6F47]"}`}>{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={markAllRead}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold ${isCoolTheme ? "border-[#b7d6ff] text-[#35557d] hover:bg-[#edf5ff]" : "border-[#e7d5c3] text-[#6F4E37] hover:bg-[#f8eee3]"}`}
                  >
                    Mark all read
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifications([])}
                    className="flex-1 rounded-lg border border-rose-200 px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Theme toggle"
            onClick={toggleTheme}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white transition ${isCoolTheme ? "border-[#cfe2ff] text-[#35557d] hover:bg-[#e8f1ff]" : "border-[#e7d5c3] text-[#6F4E37] hover:bg-[#f8eee3]"}`}
          >
            {isCoolTheme ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <div className={`flex items-center gap-3 rounded-xl border bg-white px-2 py-1.5 shadow-sm ${isCoolTheme ? "border-[#cfe2ff]" : "border-[#e7d5c3]"}`}>
            <img
              src="https://i.pravatar.cc/80?img=1"
              alt="Admin profile"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <div className="hidden pr-2 sm:block">
              <p className={`text-sm font-semibold ${isCoolTheme ? "text-[#1f3652]" : "text-[#3E2723]"}`}>Admin</p>
              <p className={`text-xs ${isCoolTheme ? "text-[#5e7fa6]" : "text-[#8B6F47]"}`}>System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
