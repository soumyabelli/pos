import { useMemo, useState, useEffect } from "react";
import {
  Bell,
  Search,
  Settings,
  Plus,
  Pencil,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const PRODUCTS = [
  { id: 1, name: "Big Mac", sku: "MCD-BM", category: "Food", price: 599, stock: 150, status: "Active", emoji: "🍔" },
  { id: 2, name: "Whopper", sku: "BK-WH", category: "Food", price: 649, stock: 120, status: "Active", emoji: "🍔" },
  { id: 3, name: "KFC Original Bucket", sku: "KFC-OB", category: "Food", price: 1499, stock: 50, status: "Active", emoji: "🍗" },
  { id: 4, name: "Subway B.M.T.", sku: "SUB-BMT", category: "Food", price: 799, stock: 80, status: "Active", emoji: "🥪" },
  { id: 5, name: "Caramel Frappuccino", sku: "SBUX-CF", category: "Coffee", price: 495, stock: 200, status: "Active", emoji: "☕" },
  { id: 6, name: "Domino's Pepperoni", sku: "DOM-PEP", category: "Food", price: 1199, stock: 90, status: "Active", emoji: "🍕" },
  { id: 7, name: "Taco Bell Crunchwrap", sku: "TB-CW", category: "Food", price: 459, stock: 110, status: "Active", emoji: "🌮" },
  { id: 8, name: "Dunkin' Glazed Donut", sku: "DNK-GD", category: "Dessert", price: 149, stock: 300, status: "Active", emoji: "🍩" },
  { id: 9, name: "Wendy's Frosty", sku: "WEN-FR", category: "Dessert", price: 229, stock: 180, status: "Active", emoji: "🍦" },
  { id: 10, name: "Pizza Hut Stuffed Crust", sku: "PH-SC", category: "Food", price: 1599, stock: 60, status: "Active", emoji: "🍕" },
  { id: 11, name: "Chipotle Burrito Bowl", sku: "CHP-BB", category: "Food", price: 985, stock: 140, status: "Active", emoji: "🥙" },
  { id: 12, name: "Panda Express Orange Chicken", sku: "PE-OC", category: "Food", price: 850, stock: 100, status: "Active", emoji: "🍱" },
  { id: 13, name: "Starbucks Pink Drink", sku: "SBUX-PD", category: "Drinks", price: 545, stock: 150, status: "Active", emoji: "🥤" },
  { id: 14, name: "McDonald's Fries", sku: "MCD-FR", category: "Food", price: 299, stock: 500, status: "Active", emoji: "🍟" },
  { id: 15, name: "Chick-fil-A Sandwich", sku: "CFA-CS", category: "Food", price: 519, stock: 85, status: "Active", emoji: "🥪" },
  { id: 16, name: "Panera Broccoli Soup", sku: "PNR-BS", category: "Food", price: 629, stock: 45, status: "Inactive", emoji: "🥣" },
  { id: 17, name: "Five Guys Cheeseburger", sku: "FG-CB", category: "Food", price: 949, stock: 55, status: "Active", emoji: "🍔" },
  { id: 18, name: "Shake Shack SmokeShack", sku: "SS-SS", category: "Food", price: 829, stock: 70, status: "Active", emoji: "🍔" },
  { id: 19, name: "Sonic Cherry Limeade", sku: "SNC-CL", category: "Drinks", price: 299, stock: 120, status: "Active", emoji: "🍹" },
  { id: 20, name: "Dairy Queen Blizzard", sku: "DQ-BZ", category: "Dessert", price: 499, stock: 210, status: "Active", emoji: "🍨" },
  { id: 21, name: "Papa John's Garlic Sauce", sku: "PJ-GS", category: "Food", price: 100, stock: 1000, status: "Active", emoji: "🧄" },
  { id: 22, name: "Krispy Kreme Original", sku: "KK-OG", category: "Dessert", price: 129, stock: 400, status: "Active", emoji: "🍩" },
  { id: 23, name: "Arby's Roast Beef", sku: "ARB-RB", category: "Food", price: 549, stock: 65, status: "Inactive", emoji: "🥪" },
  { id: 24, name: "Cinnabon Classic Roll", sku: "CIN-CR", category: "Dessert", price: 499, stock: 40, status: "Active", emoji: "🥐" },
  { id: 25, name: "In-N-Out Double-Double", sku: "INO-DD", category: "Food", price: 490, stock: 110, status: "Active", emoji: "🍔" },
  { id: 26, name: "Baskin Robbins Vanilla", sku: "BR-VN", category: "Dessert", price: 349, stock: 150, status: "Active", emoji: "🍦" }
];

const CATEGORY_OPTIONS = ["All", "Coffee", "Drinks", "Food", "Dessert"];

function getDisplayName() {
  const token = localStorage.getItem("token");
  if (!token) return "Soumya";
  try {
    const payload = token.split(".")[1];
    if (!payload) return "Soumya";
    const decoded = JSON.parse(atob(payload));
    return decoded?.name || "Soumya";
  } catch {
    return "Soumya";
  }
}

export default function ProductManagement() {
  const displayName = getDisplayName();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset to page 1 if filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchValue, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchValue, selectedCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gradient-to-br from-sky-50 to-emerald-50 text-slate-800 selection:bg-sky-500/30">
      <Sidebar />

      <div className="flex-1 overflow-y-auto relative pb-12">
        {/* Soft Background Orbs for Light Mode */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-300/30 blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-emerald-300/30 blur-[120px] pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          <div className="w-full bg-white/60 backdrop-blur-xl border-b border-sky-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products or scan barcode..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-sky-200 text-slate-800 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-400 shadow-inner"
                />
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3 sm:gap-5">
                <button className="relative p-3 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-all cursor-pointer">
                  <Bell size={22} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </button>
                <button className="p-3 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-all cursor-pointer">
                  <Settings size={22} />
                </button>
                <div className="flex items-center gap-3 pl-3 sm:pl-5 sm:border-l border-sky-200 ml-1 cursor-pointer group">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-black text-slate-800">{displayName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store Manager</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-sky-200 group-hover:border-sky-500/50 transition-colors overflow-hidden shadow-sm">
                    <img src="https://i.pravatar.cc/48" alt={displayName} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5">
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent tracking-tight mb-1">
                  Menu Management
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Add, edit, or remove items from your POS catalog.
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all text-sm font-bold shadow-[0_8px_20px_rgba(14,165,233,0.3)] cursor-pointer flex items-center gap-2 hover:-translate-y-0.5">
                <Plus size={18} strokeWidth={3} />
                Add Item
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 custom-scrollbar">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                    selectedCategory === cat 
                      ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-transparent shadow-lg shadow-sky-500/30" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-slate-100 hover:border-sky-300 hover:-translate-y-1 transition-all group relative shadow-xl shadow-slate-200/50">
                  <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-sky-100 transition-all shadow-inner border border-sky-100/50">
                    {product.emoji}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1 leading-tight">{product.name}</h3>
                  <p className="text-lg font-black text-emerald-600 mb-4">₹{product.price}</p>
                  
                  <button className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-sky-500 hover:text-white transition-colors flex items-center justify-center gap-2 border border-slate-100 group-hover:border-sky-200">
                    <Pencil size={14} />
                    Edit Item
                  </button>
                  
                  {product.status === 'Inactive' && (
                    <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 rounded-full bg-white text-slate-600 border border-slate-200 text-sm font-bold hover:bg-sky-50 hover:text-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-transparent"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 rounded-full bg-white text-slate-600 border border-slate-200 text-sm font-bold hover:bg-sky-50 hover:text-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Next
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Search size={48} className="mb-4 opacity-30 text-sky-500" />
                <p className="text-lg font-bold text-slate-600">No items found</p>
                <p className="text-sm">Try adjusting your filters or search.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
