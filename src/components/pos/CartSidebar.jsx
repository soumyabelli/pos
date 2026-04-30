import { ShoppingCart, Minus, Plus, X, Trash2 } from "lucide-react";

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
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="w-[420px] bg-gradient-to-b from-[#F5E6D3] to-[#FFFBF7] border-l-2 border-[#D9C4B3] flex flex-col shadow-[-20px_0_40px_rgba(76,54,36,0.15)] z-50 relative">
      {/* Header */}
      <div className="p-6 border-b-2 border-[#D9C4B3] flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4853D] to-[#6F4E37] flex items-center justify-center text-white text-sm font-black">
            🛒
          </div>
          <h2 className="text-lg font-black text-[#3E2723]">BILL</h2>
        </div>
        <span className="bg-[#D4853D] text-white px-3 py-1.5 rounded-full text-xs font-black shadow-md">
          {itemCount} items
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#8B6F47] gap-4 opacity-70">
            <div className="text-4xl">🛒</div>
            <p className="font-bold text-sm text-[#6F4E37]">No items ordered</p>
            <p className="text-xs text-[#8B6F47]">Scan or tap to add items</p>
          </div>
        ) : (
          cart.map((item) => (
            <div 
              key={item.sku} 
              className="flex gap-3 p-3.5 bg-white/60 backdrop-blur-sm rounded-lg border border-[#D9C4B3]/50 shadow-sm hover:border-[#D4853D]/50 hover:shadow-md transition-all group"
            >
              {/* Item Image */}
              <div className="w-12 h-12 bg-white rounded-lg border border-[#D9C4B3] flex items-center justify-center text-2xl flex-shrink-0">
                {item.image}
              </div>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#2C1810] leading-tight">{item.product}</h4>
                    <p className="text-xs font-semibold text-[#8B6F47]">₹{item.price.toFixed(0)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.sku)}
                    className="text-[#D9C4B3] hover:text-[#EF4444] p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-md"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 bg-white/60 border border-[#D9C4B3] rounded-lg p-1">
                    <button 
                      onClick={() => updateQty(item.sku, -1)}
                      className="w-6 h-6 flex items-center justify-center text-[#6F4E37] hover:text-[#3E2723] hover:bg-[#F5E6D3] rounded-md transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black text-[#2C1810] w-4 text-center">{item.qty}</span>
                    <button 
                      onClick={() => updateQty(item.sku, 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#6F4E37] hover:text-[#3E2723] hover:bg-[#F5E6D3] rounded-md transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs font-black text-[#D4853D]">₹{(item.price * item.qty).toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary & Checkout */}
      <div className="p-5 bg-white/60 backdrop-blur-sm border-t-2 border-[#D9C4B3] flex flex-col gap-4">
        {/* Summary */}
        <div className="space-y-2 pb-4 border-b border-[#D9C4B3]/50">
          <div className="flex justify-between text-xs font-semibold text-[#6F4E37]">
            <span>Subtotal</span>
            <span className="text-[#3E2723]">₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-[#6F4E37]">
            <span>Tax (8%)</span>
            <span className="text-[#3E2723]">₹{tax.toFixed(0)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-black text-[#6F4E37]">TOTAL DUE</span>
          <span className="text-3xl font-black text-[#D4853D]">₹{total.toFixed(0)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={clearCart}
            disabled={cart.length === 0}
            className="p-3 rounded-lg border-2 border-[#D9C4B3] bg-white/60 text-[#6F4E37] hover:text-[#EF4444] hover:border-[#EF4444] hover:bg-red-50/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className="flex-1 py-3 bg-gradient-to-r from-[#D4853D] to-[#6F4E37] hover:from-[#E59449] hover:to-[#8B6F47] text-white rounded-lg font-black text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            PROCEED
          </button>
        </div>
      </div>
    </div>
  );
}
