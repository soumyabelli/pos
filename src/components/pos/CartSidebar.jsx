import { Trash2, Plus, Minus, User, Phone } from "lucide-react";

export default function CartSidebar({
  cart,
  removeFromCart,
  updateQty,
  subtotal,
  tax,
  total,
  clearCart,
  setIsCheckoutOpen,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  handlePaymentSelect
}) {
  return (
    <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.03)] z-50 relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">Current Bill</h2>
        <button 
          onClick={clearCart}
          disabled={cart.length === 0}
          className="text-red-500 font-semibold text-sm px-3 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Bill (F7)
        </button>
      </div>

      {/* Cart Items Table */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <span className="text-4xl mb-4">🛒</span>
            <p>No items added yet</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-white sticky top-0 z-10">
              <tr className="text-slate-500 font-semibold border-b border-slate-200">
                <th className="pb-3 w-8">#</th>
                <th className="pb-3">Item Name</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-center w-24">Qty</th>
                <th className="pb-3 text-right">Total</th>
                <th className="pb-3 text-center w-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={item.sku} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-3 text-slate-500">{idx + 1}</td>
                  <td className="py-3 font-medium text-slate-800 line-clamp-1">{item.product}</td>
                  <td className="py-3 text-right text-slate-600">₹{Number(item.price).toFixed(2)}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-1 border border-slate-200 rounded p-0.5 bg-white">
                      <button 
                        onClick={() => updateQty(item.sku, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-[#3E2723] hover:bg-[#8B6F47]/10 rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.sku, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-[#3E2723] hover:bg-[#8B6F47]/10 rounded"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-slate-800">₹{(item.price * item.qty).toFixed(2)}</td>
                  <td className="py-3 text-center">
                    <button 
                      onClick={() => removeFromCart(item.sku)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary & Checkout */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
        {/* Totals */}
        <div className="space-y-1 text-sm pb-3 border-b border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Discount</span>
            <span className="font-semibold text-slate-800">- ₹0.00</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tax (GST 5%)</span>
            <span className="font-semibold text-slate-800">₹{tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-slate-800">TOTAL</span>
          <span className="text-3xl font-black text-[#3E2723]">₹{total.toFixed(2)}</span>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter name (optional)" 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-[#8B6F47]"
            />
          </div>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="tel" 
              placeholder="Enter phone number" 
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-[#8B6F47]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className="flex-1 py-3 bg-[#3E2723] hover:bg-[#2e1d1a] text-white rounded font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <User size={18} /> Checkout / Generate Bill (F2)
          </button>
          <button 
            disabled={cart.length === 0}
            className="px-4 py-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            🖨️ Print (F3)
          </button>
        </div>
      </div>
    </div>
  );
}
