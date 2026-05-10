import { useState } from "react";
import { Outlet } from "react-router-dom";
import ManagerSidebar from "./ManagerSidebar";
import ManagerTopNavbar from "./ManagerTopNavbar";

export default function ManagerLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden text-slate-900 bg-[#f7efe5]">
      {/* Background aesthetics */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl bg-[#d4853d]/20" />
        <div className="absolute right-1/4 top-0 h-56 w-56 rounded-full blur-3xl bg-[#6f4e37]/15" />
      </div>

      <div className="relative z-10 flex h-full min-w-0">
        <ManagerSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <ManagerTopNavbar
            onOpenSidebar={() => setIsMobileOpen(true)}
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
