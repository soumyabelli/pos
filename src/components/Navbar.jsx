import { useState } from "react";
import { Search, Bell, Settings } from "lucide-react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search employees, roles, or stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-slate-400 shadow-inner"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <button className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer hover:shadow-sm hover:-translate-y-0.5">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          </button>

          {/* Settings */}
          <button className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer hover:shadow-sm hover:-translate-y-0.5">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-slate-200 ml-1 sm:ml-2 cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition-colors">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">Alex Rivera</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Store Manager</p>
            </div>
            <div className="w-10 h-10 rounded-xl border border-slate-200 group-hover:border-sky-500/50 transition-colors overflow-hidden shadow-sm group-hover:shadow-sky-500/10">
              <img
                src="https://i.pravatar.cc/40"
                alt="Alex Rivera"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}