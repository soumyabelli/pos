import { Search, ArrowLeft } from "lucide-react";
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

  return (
    <div className="flex-1 flex flex-col h-full bg-white/60 backdrop-blur-md p-6 overflow-hidden relative z-10 border-r border-slate-200/60 shadow-lg">
      {/* Header & Search */}
      <header className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="mt-1.5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm"
              title="Exit POS"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800 drop-shadow-sm">Urban Crust Terminal</h1>
              <p className="text-sm font-bold text-slate-500 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="relative w-96 group">
            {(!search || search.length === 0) && (
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
            )}
            <input
              type="text"
              placeholder="Scan barcode or search SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full pr-4 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 shadow-sm ${search ? 'pl-4' : 'pl-12'}`}
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-extrabold text-slate-500 uppercase shadow-sm">Enter</kbd>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pb-4 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-8 py-3 rounded-xl text-sm font-black tracking-wide transition-all shadow-sm ${
                category === cat 
                  ? "bg-slate-900 text-white shadow-slate-900/20 border border-transparent scale-105" 
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto pb-10 pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredProducts.map((product) => {
            const outOfStock = product.stock <= 0;
            return (
              <div
                key={product.sku}
                onClick={() => !outOfStock && addToCart(product)}
                className={`relative flex flex-col bg-white rounded-2xl border transition-all ${
                  outOfStock 
                    ? "border-rose-200 bg-rose-50/50 opacity-60 cursor-not-allowed grayscale-[0.5]" 
                    : "border-slate-200 shadow-sm hover:border-slate-900 hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 cursor-pointer"
                }`}
              >
                <div className="h-32 flex items-center justify-center text-7xl rounded-t-2xl bg-gradient-to-b from-slate-50 to-transparent group-hover:from-orange-50 transition-colors">
                  {product.image}
                </div>
                <div className="p-5 flex flex-col gap-2 border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest">{product.sku}</span>
                  <h3 className="text-sm font-extrabold text-slate-800 leading-tight line-clamp-2 min-h-[40px]">{product.product}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-lg font-black ${outOfStock ? 'text-rose-500' : 'text-slate-900'}`}>₹{product.price.toFixed(2)}</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                      outOfStock ? 'bg-rose-100 text-rose-600' : 
                      product.stock <= 5 ? 'bg-amber-100 text-amber-600' : 
                      'bg-slate-100 text-slate-600 shadow-sm border border-slate-200'
                    }`}>
                      {outOfStock ? 'OOS' : `${product.stock} left`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
