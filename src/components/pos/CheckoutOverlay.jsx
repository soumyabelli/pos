import { X, Receipt, CheckCircle, CreditCard, Banknote, Smartphone } from "lucide-react";

export default function CheckoutOverlay({
  isCheckoutOpen,
  setIsCheckoutOpen,
  isInvoiceOpen,
  total,
  handlePaymentSelect,
  receiptData,
  closeAndClear
}) {
  if (!isCheckoutOpen && !isInvoiceOpen) return null;

  return (
    <>
      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-100 relative z-10">
            <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 drop-shadow-sm">Select Payment</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 shadow-sm transition-colors border border-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 pb-10 text-center relative overflow-hidden bg-white">
              <div className="absolute top-[-50%] left-[50%] -translate-x-1/2 w-64 h-64 bg-orange-100 blur-[60px] rounded-full pointer-events-none"></div>
              
              <p className="text-slate-400 font-extrabold mb-1 tracking-widest uppercase text-xs">Total Amount</p>
              <h1 className="text-6xl font-black text-slate-900 mb-10 drop-shadow-sm">₹{total.toFixed(2)}</h1>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <button onClick={() => handlePaymentSelect('Cash')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-sm hover:border-slate-900 hover:bg-white group cursor-pointer transition-all hover:-translate-y-1">
                  <Banknote size={32} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="font-extrabold text-slate-600 group-hover:text-slate-900">Cash</span>
                </button>
                <button onClick={() => handlePaymentSelect('Card')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-sm hover:border-slate-900 hover:bg-white group cursor-pointer transition-all hover:-translate-y-1">
                  <CreditCard size={32} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="font-extrabold text-slate-600 group-hover:text-slate-900">Credit Card</span>
                </button>
                <button onClick={() => handlePaymentSelect('UPI')} className="col-span-2 flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-sm hover:border-slate-900 hover:bg-white group cursor-pointer transition-all hover:-translate-y-1">
                  <Smartphone size={24} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="font-extrabold text-slate-600 group-hover:text-slate-900">UPI / QR Scan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceOpen && receiptData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col relative z-10 animate-scale-up border border-slate-200">
            
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500"></div>

            <div className="p-8 flex flex-col items-center text-center pb-6 border-b border-slate-100 bg-slate-50/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 border border-green-300">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight drop-shadow-sm">Payment Successful</h2>
              <p className="text-slate-500 mt-1 font-bold">{receiptData.orderId}</p>
            </div>
            
            <div className="p-8 py-6 flex-1 overflow-y-auto bg-white relative">
              <div className="flex flex-col gap-3 relative z-10">
                {receiptData.items.map(item => (
                  <div key={item.sku} className="flex justify-between items-start text-sm">
                    <span className="font-extrabold text-slate-700 w-2/3 leading-tight"><span className="text-slate-400 mr-2">{item.qty}x</span> {item.product}</span>
                    <span className="font-black text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 pt-6 border-t border-dashed border-slate-200 bg-slate-50/50">
              <div className="flex flex-col gap-2 text-sm text-slate-500 mb-6 font-bold">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-slate-800">₹{receiptData.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span className="text-slate-800">₹{receiptData.tax.toFixed(2)}</span></div>
                <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-extrabold uppercase tracking-wide text-xs">Total Paid</span>
                  <span className="text-3xl font-black text-slate-900 drop-shadow-sm">₹{receiptData.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center text-xs font-black text-slate-500 mb-6 uppercase tracking-widest">
                Paid via {receiptData.method}
              </div>

              <button 
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                onClick={closeAndClear}>
                <Receipt size={18} /> Print Receipt & Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
