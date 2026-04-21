import { ShoppingCart, Minus, Plus, X } from "lucide-react";

export default function CartSidebar({
  cart,
  removeFromCart,
  updateQty,
  subtotal,
  tax,
  total,
  clearCart,
  setIsCheckoutOpen
}) {
  return (
    <div className="w-[420px] bg-white backdrop-blur-2xl border-l border-slate-200 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-50 relative">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 drop-shadow-sm">
          <ShoppingCart size={22} className="text-slate-900" />
          Current Order
        </h2>
        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-black shadow-md shadow-slate-900/20">
          {cart.reduce((sum, item) => sum + item.qty, 0)} Items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-slate-50/30">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
            <ShoppingCart size={48} strokeWidth={1} />
            <p className="font-bold text-sm text-slate-500">Scan an item to start</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.sku} className="flex gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in group hover:border-slate-300 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-3xl shadow-inner">
                {item.image}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight">{item.product}</h4>
                    <p className="text-xs font-extrabold text-slate-500">₹{item.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.sku)}
                    className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 rounded-full shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                    <button onClick={() => updateQty(item.sku, -1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm rounded-md transition-all"><Minus size={14} /></button>
                    <span className="text-sm font-black w-5 text-center text-slate-800">{item.qty}</span>
                    <button onClick={() => updateQty(item.sku, 1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm rounded-md transition-all"><Plus size={14} /></button>
                  </div>
                  <span className="text-sm font-black text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-4 relative z-20">
        <div className="flex flex-col gap-2 text-sm font-extrabold text-slate-500">
          <div className="flex justify-between"><span>Subtotal</span><span className="text-slate-800">₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax (8%)</span><span className="text-slate-800">₹{tax.toFixed(2)}</span></div>
          <div className="flex justify-between items-end mt-2 pt-4 border-t border-slate-200">
            <span className="text-base text-slate-800 font-black tracking-wide">Total Pay</span>
            <span className="text-4xl font-black text-slate-900 drop-shadow-sm">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <button 
            onClick={clearCart}
            disabled={cart.length === 0}
            className="px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-black hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Clear
          </button>
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Charge ₹{(total).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
