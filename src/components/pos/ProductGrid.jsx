import { Search, LogOut, Coffee, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductGrid({ 
  search, 
  setSearch, 
  handleKeyDown, 
  categories, 
  category, 
  setCategory, 
  filteredProducts, 
  addToCart 
}) {
  const navigate = useNavigate();

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Coffee': return '☕';
      case 'Drinks': return '🥤';
      case 'Food': return '🍔';
      case 'Dessert': return '🍰';
      default: return '✨';
    }
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-[#d9c4b3]/50 bg-gradient-to-b from-[#fffaf5] to-[#f4e6d6] p-4 sm:p-6 lg:h-full lg:overflow-hidden">
      <header className="mb-4 rounded-2xl border border-[#d9c4b3]/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate('/login');
              }}
              className="p-2.5 bg-white/50 border border-[#d9c4b3]/50 hover:bg-rose-50 text-[#8b6f47] hover:text-rose-600 rounded-xl transition-colors shadow-sm"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
            <div className="grid h-11 w-11 place-content-center rounded-xl bg-gradient-to-br from-[#d4853d] to-[#6f4e37] text-lg text-white shadow-sm">
              ☕
            </div>
            <div>
              <h1 className="text-2xl font-black leading-tight tracking-tight text-[#3e2723] sm:text-3xl">Urban Crust POS</h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8b6f47]">Counter Terminal</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-[#6f4e37]">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </p>
            <p className="text-xs font-medium text-[#8b6f47]">
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="relative block">
            {(!search || search.length === 0) && (
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f47]" />
            )}
            <input
              type="text"
              placeholder="Scan SKU or search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`h-11 w-full rounded-xl border border-[#d9c4b3] bg-white pr-4 text-sm font-semibold text-[#2c1810] outline-none transition focus:border-[#d4853d] focus:ring-4 focus:ring-[#d4853d]/20 placeholder:text-[#8b6f47] shadow-sm ${search ? 'pl-4' : 'pl-10'}`}
              autoFocus
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  category === cat
                    ? "border-[#d4853d] bg-[#d4853d] text-white"
                    : "border-[#d9c4b3] bg-white text-[#6f4e37] hover:border-[#d4853d]"
                }`}
              >
                <span className="mr-1">{getCategoryIcon(cat)}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-10 pr-1 lg:pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredProducts.map((product) => {
            const outOfStock = product.stock <= 0;
            return (
              <button
                key={product.sku}
                onClick={() => !outOfStock && addToCart(product)}
                disabled={outOfStock}
                className={`group rounded-2xl border bg-white p-3 text-left shadow-sm transition ${
                  outOfStock
                    ? "cursor-not-allowed border-[#e8d8cb] opacity-55"
                    : "cursor-pointer border-[#d9c4b3] hover:-translate-y-0.5 hover:border-[#d4853d] hover:shadow-md active:translate-y-0"
                }`}
              >
                <div className={`mb-3 grid h-20 place-content-center rounded-xl border text-4xl ${
                  outOfStock ? "border-[#e6d8cb] bg-[#fbf4ec]" : "border-[#e0cbb9] bg-[#fff8f2]"
                }`}>
                  {product.image}
                </div>

                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8b6f47]">{product.sku}</p>
                <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-tight text-[#2c1810]">{product.product}</h3>

                <div className="mt-3 flex items-center justify-between border-t border-[#e9d7c8] pt-2">
                  <span className={`text-lg font-black ${outOfStock ? "text-[#ef4444]" : "text-[#d4853d]"}`}>
                      ₹{product.price.toFixed(0)}
                  </span>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                      outOfStock
                        ? "bg-red-100 text-red-700"
                        : product.stock <= 3
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}>
                    {outOfStock ? "Out" : `${product.stock} left`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
