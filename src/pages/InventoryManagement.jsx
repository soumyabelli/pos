import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  Bell,
  MoreVertical,
  Search,
  Settings,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getInventory } from "../utils/mockInventory";

const TABS = [
  { id: "all", label: "All Items" },
  { id: "low", label: "Low Stock" },
  { id: "out", label: "Out of Stock" },
  { id: "category", label: "By Category" },
];

function getDisplayName() {
  const token = localStorage.getItem("token");
  if (!token) return "Store Manager";
  try {
    const payload = token.split(".")[1];
    if (!payload) return "Store Manager";
    const decoded = JSON.parse(atob(payload));
    return decoded?.name || "Store Manager";
  } catch {
    return "Store Manager";
  }
}

function getBadgeLabel(status) {
  if (status === "optimal") return "Optimal";
  if (status === "reorder") return "Reorder Soon";
  return "Critical Low";
}

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const displayName = getDisplayName();

  const rows = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return getInventory().filter((row) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        row.product.toLowerCase().includes(normalizedQuery) ||
        row.sku.toLowerCase().includes(normalizedQuery);

      if (!matchesSearch) return false;
      if (activeTab === "low") return row.stock > 0 && row.stock <= 15;
      if (activeTab === "out") return row.stock === 0;
      if (activeTab === "category") return row.category === "Beverages";
      return true;
    }).sort((a, b) => {
      if (activeTab === "category") {
        return a.category.localeCompare(b.category) || a.product.localeCompare(b.product);
      }
      return 0;
    });
  }, [activeTab, searchValue]);

  const criticalCount = useMemo(
    () => getInventory().filter((item) => item.stock <= 10).length,
    []
  );

  const lowStockAlerts = useMemo(
    () => getInventory().filter((item) => item.stock <= 12).slice(0, 3),
    []
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Light Aesthetic Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-orange-300/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-rose-300/20 blur-[130px] pointer-events-none z-0"></div>

      <div className="relative z-10 h-full">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white/60 backdrop-blur-md">
          <div className="relative w-96">
            {(!searchValue || searchValue.length === 0) && (
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            )}
            <input
              type="text"
              placeholder="Search Food Items SKU or name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                <Settings size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">{displayName}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">TERMINAL 04</p>
              </div>
              <img src="https://i.pravatar.cc/48?img=14" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Header section */}
            <section className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight drop-shadow-sm">Food Items Management</h1>
                <p className="text-slate-500 font-medium mt-1">Manage stock levels and distribution across flagship locations.</p>
              </div>

              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all text-sm font-bold shadow-sm flex items-center gap-2">
                  <ArrowRightLeft size={16} />
                  Transfer Stock
                </button>
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-bold shadow-lg shadow-slate-900/20 flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Adjust Inventory
                </button>
              </div>
            </section>

            {/* Tabs */}
            <section className="flex gap-2 border-b border-slate-200 pb-px">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-bold transition-all relative ${
                    activeTab === tab.id 
                      ? "text-slate-900" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-xl"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </section>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pb-12">
              
              {/* Table side */}
              <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Store Location</th>
                        <th className="py-4 px-6">Stock Level</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                <span className="text-xs">📦</span>
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{row.product}</p>
                                <p className="text-xs font-mono text-slate-400">{row.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-bold text-slate-600">{row.store}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900">{row.stock}</span>
                              <span className="text-xs text-slate-400 font-bold">units</span>
                              {row.stock <= 10 && <TriangleAlert size={14} className="text-rose-500" />}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              row.status === 'optimal' ? 'bg-emerald-100 text-emerald-600' :
                              row.status === 'reorder' ? 'bg-amber-100 text-amber-600' :
                              'bg-rose-100 text-rose-600'
                            }`}>
                              {getBadgeLabel(row.status)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm font-bold text-slate-500">
                  <p>Showing {rows.length} of {getInventory().length} products</p>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">{"<"}</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">3</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">{">"}</button>
                  </div>
                </div>
              </div>

              {/* Sidebar side */}
              <div className="flex flex-col gap-6">
                
                {/* Critical Alerts Card */}
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4">Critical Alerts</p>
                  <h2 className="text-6xl font-black text-rose-600 mb-2 drop-shadow-sm">{criticalCount}</h2>
                  <p className="text-sm font-bold text-rose-500 mb-2">
                    <strong className="text-rose-600">+2</strong> today
                  </p>
                  <p className="text-xs font-bold text-rose-400">Items requiring immediate restocking attention.</p>
                </div>

                {/* Low Stock List */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-900">Low Stock Alerts</h3>
                    <button className="text-[10px] font-black text-orange-500 hover:text-orange-600 uppercase tracking-widest transition-colors">View All</button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {lowStockAlerts.map((item) => (
                      <div key={item.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <p className="font-bold text-slate-900 text-sm leading-tight mb-1">{item.product}</p>
                        <p className="text-xs font-bold text-slate-500 mb-3">
                          {item.store} &bull; <span className="text-rose-500">{item.stock} left</span>
                        </p>
                        <button className="text-xs font-black text-slate-900 hover:text-orange-500 flex items-center gap-1 transition-colors group">
                          REORDER NOW
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
