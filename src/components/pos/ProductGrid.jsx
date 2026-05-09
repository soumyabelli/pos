import { Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductGrid({
  search,
  setSearch,
  handleKeyDown,
  onOpenScanner,
  scanNotice,
  categories,
  category,
  setCategory,
  filteredProducts,
  addToCart,
  loadingInventory,
  inventoryError,
}) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col flex-[3] border-r border-slate-200 bg-white lg:h-full lg:overflow-hidden relative z-10">
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 text-[#3E2723]">
          <span className="font-black text-xl tracking-tighter">Urban<span className="text-[#8B6F47]"> Crust</span> POS</span>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold text-slate-700">
          <div className="border border-slate-200 rounded px-3 py-1.5 bg-slate-50">
            Cashier: <span className="text-slate-900">Ramesh</span>
          </div>
          <div className="border border-slate-200 rounded px-3 py-1.5 bg-slate-50">
            Terminal: <span className="text-slate-900">DM001</span>
          </div>
          <div className="hidden md:block">
            {new Date().toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"})} | {new Date().toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-slate-200 text-slate-700 font-semibold rounded bg-slate-50 hover:bg-slate-100 text-sm">
            Hold Bill (F6)
          </button>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-700 font-semibold rounded bg-slate-50 hover:bg-slate-100 text-sm">
            More (F12)
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate('/login');
            }}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition-colors flex items-center gap-2"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="p-4 flex flex-col h-full overflow-hidden">
        {/* Search */}
        <div className="flex gap-2 mb-4">
          <label className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-slate-800 outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47] text-lg shadow-sm"
              autoFocus
            />
          </label>
        </div>

        {scanNotice?.message && (
          <p className={`mb-4 rounded-lg px-3 py-2 text-sm font-semibold ${
            scanNotice.type === "success" ? "bg-[#8B6F47]/10 text-[#3E2723] border border-[#8B6F47]/20" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {scanNotice.message}
          </p>
        )}

        {/* Categories */}
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 mb-2">Quick Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  category === cat
                    ? "bg-[#3E2723] text-white border-[#3E2723] shadow-md"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat === 'All' ? 'All Items' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items List (Table format like mock) */}
        <div className="flex-1 overflow-hidden flex flex-col border border-slate-200 rounded-lg">
          <h3 className="font-bold text-slate-800 p-3 bg-slate-50 border-b border-slate-200">Recent Items</h3>
          
          {inventoryError && <div className="p-3 text-sm text-red-600">{inventoryError}</div>}
          {loadingInventory && <div className="p-3 text-sm text-slate-500">Loading products...</div>}

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white sticky top-0 border-b border-slate-200 shadow-sm">
                <tr className="text-slate-500 font-semibold">
                  <th className="py-3 px-4 font-semibold w-12">#</th>
                  <th className="py-3 px-4 font-semibold">Item Name</th>
                  <th className="py-3 px-4 font-semibold text-right">MRP</th>
                  <th className="py-3 px-4 font-semibold text-right">Price</th>
                  <th className="py-3 px-4 font-semibold text-center w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  const outOfStock = product.stock <= 0;
                  return (
                    <tr key={product._id || product.sku} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{product.product}</td>
                      <td className="py-3 px-4 text-right text-slate-500 line-through">₹{Number(product.price * 1.1).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">₹{Number(product.price).toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => !outOfStock && addToCart(product)}
                          disabled={outOfStock}
                          className={`w-8 h-8 rounded flex items-center justify-center border font-bold text-lg ${
                            outOfStock 
                              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                              : "bg-[#8B6F47]/10 text-[#8B6F47] border-[#8B6F47]/20 hover:bg-[#8B6F47]/20 hover:text-[#3E2723]"
                          }`}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
