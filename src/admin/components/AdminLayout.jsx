import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("adminThemeMode") || "warm");

  useEffect(() => {
    localStorage.setItem("adminThemeMode", themeMode);
  }, [themeMode]);

  const isCoolTheme = themeMode === "cool";

  return (
    <div className={`relative h-screen overflow-hidden text-slate-900 ${isCoolTheme ? "bg-[#ecf3ff]" : "bg-[#f7efe5]"}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl ${isCoolTheme ? "bg-sky-300/25" : "bg-[#d4853d]/20"}`} />
        <div className={`absolute right-1/4 top-0 h-56 w-56 rounded-full blur-3xl ${isCoolTheme ? "bg-blue-400/15" : "bg-[#6f4e37]/15"}`} />
        <div className={`absolute bottom-10 right-10 h-80 w-80 rounded-full blur-3xl ${isCoolTheme ? "bg-cyan-200/30" : "bg-amber-200/30"}`} />
      </div>

      <div className="relative z-10 flex h-full min-w-0">
        <Sidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          isCoolTheme={isCoolTheme}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar
            onOpenSidebar={() => setIsMobileOpen(true)}
            isCoolTheme={isCoolTheme}
            toggleTheme={() => setThemeMode((prev) => (prev === "warm" ? "cool" : "warm"))}
          />
          <main className="flex-1 overflow-auto px-4 pb-8 pt-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
