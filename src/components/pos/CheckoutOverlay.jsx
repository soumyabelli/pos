import { X, Receipt, CheckCircle, CreditCard, Banknote, Smartphone } from "lucide-react";

export default function CheckoutOverlay({
  isCheckoutOpen,
  setIsCheckoutOpen,
  isInvoiceOpen,
  total,
  taxRatePercent,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  checkoutError,
  handlePaymentSelect,
  receiptData,
  closeAndClear
}) {
  if (!isCheckoutOpen && !isInvoiceOpen) return null;

  return (
    <>
      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close payment modal"
            className="absolute inset-0 bg-[#3E2723]/50 backdrop-blur-sm"
            onClick={() => setIsCheckoutOpen(false)}
          />
          <div className="bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D3] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-[#D9C4B3] relative z-10">
            {/* Header */}
            <div className="p-6 pb-4 border-b-2 border-[#D9C4B3] flex justify-between items-center bg-white/40">
              <h2 className="text-xl font-black text-[#3E2723]">Select Payment</h2>
              <button 
                onClick={() => setIsCheckoutOpen(false)} 
                className="w-8 h-8 rounded-full bg-white text-[#8B6F47] flex items-center justify-center hover:bg-red-50 hover:text-[#EF4444] shadow-sm transition-colors border border-[#D9C4B3]"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Amount Display */}
            <div className="p-8 pb-10 text-center relative overflow-hidden bg-white/30">
              <p className="text-[#8B6F47] font-extrabold mb-2 tracking-widest uppercase text-xs">Total Due</p>
              <h1 className="text-5xl font-black text-[#D4853D] mb-8">₹{total.toFixed(0)}</h1>

              <div className="mb-4 text-left">
                <label htmlFor="customer-name" className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#8B6F47]">
                  Customer Name
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                  className="h-11 w-full rounded-lg border border-[#D9C4B3] bg-white px-3 text-sm font-semibold text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/30"
                />
              </div>
              <div className="mb-6 text-left">
                <label htmlFor="customer-phone" className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-[#8B6F47]">
                  Customer Phone
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="h-11 w-full rounded-lg border border-[#D9C4B3] bg-white px-3 text-sm font-semibold text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/30"
                />
              </div>

              {checkoutError && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-xs font-semibold text-red-600">
                  {checkoutError}
                </p>
              )}
              
              {/* Payment Options */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handlePaymentSelect('Cash')} 
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-[#D9C4B3]/60 bg-white/50 hover:bg-white hover:border-[#D4853D] group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <Banknote size={28} className="text-[#8B6F47] group-hover:text-[#D4853D] transition-colors" />
                  <span className="font-bold text-[#6F4E37] group-hover:text-[#D4853D] text-sm">Cash</span>
                </button>
                <button 
                  onClick={() => handlePaymentSelect('Card')} 
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-[#D9C4B3]/60 bg-white/50 hover:bg-white hover:border-[#D4853D] group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <CreditCard size={28} className="text-[#8B6F47] group-hover:text-[#D4853D] transition-colors" />
                  <span className="font-bold text-[#6F4E37] group-hover:text-[#D4853D] text-sm">Card</span>
                </button>
                <button 
                  onClick={() => handlePaymentSelect('UPI')} 
                  className="col-span-2 flex items-center justify-center gap-3 p-5 rounded-xl border-2 border-[#D9C4B3]/60 bg-white/50 hover:bg-white hover:border-[#D4853D] group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <Smartphone size={24} className="text-[#8B6F47] group-hover:text-[#D4853D] transition-colors" />
                  <span className="font-bold text-[#6F4E37] group-hover:text-[#D4853D] text-sm">UPI / QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceOpen && receiptData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/60 backdrop-blur-md"></div>
          <div className="bg-gradient-to-b from-white to-[#F5E6D3] rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col relative z-10 border-2 border-[#D9C4B3]">
            
            {/* Header Bar */}
            <div className="h-1 bg-gradient-to-r from-[#D4853D] via-[#6F4E37] to-[#D4853D]"></div>

            {/* Success Message */}
            <div className="p-8 flex flex-col items-center text-center pb-6 border-b-2 border-[#D9C4B3] bg-white/60">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-[#3E2723]">Payment Done!</h2>
              <p className="text-[#8B6F47] mt-1 font-bold text-sm">{receiptData.orderId}</p>
              <p className="mt-1 text-xs font-semibold text-[#6F4E37]">Customer: {receiptData.customerName || 'Walk-in Customer'}</p>
              {receiptData.customerPhone && (
                <p className="text-xs font-semibold text-[#6F4E37]">Phone: +{receiptData.customerPhone}</p>
              )}
            </div>
            
            {/* Items List */}
            <div className="p-6 flex-1 overflow-y-auto bg-white/30">
              <div className="flex flex-col gap-2.5">
                {receiptData.items.map(item => (
                  <div key={item.sku} className="flex justify-between items-start text-sm py-2 border-b border-[#D9C4B3]/40">
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#8B6F47] mb-0.5">{item.qty}x {item.product}</div>
                      <div className="text-[10px] text-[#8B6F47]/70">₹{item.price.toFixed(0)} each</div>
                    </div>
                    <span className="font-black text-[#D4853D]">₹{(item.price * item.qty).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 border-t-2 border-[#D9C4B3] bg-white/50">
              <div className="flex flex-col gap-2.5 text-sm text-[#6F4E37] mb-5 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#3E2723]">₹{receiptData.subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRatePercent}%)</span>
                  <span className="text-[#3E2723]">₹{receiptData.tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-[#D9C4B3]/60">
                  <span className="text-[#6F4E37] font-black uppercase text-xs">Total Paid</span>
                  <span className="text-2xl font-black text-[#D4853D]">₹{receiptData.total.toFixed(0)}</span>
                </div>
              </div>
              
              <div className="bg-[#D4853D]/15 border-2 border-[#D4853D]/40 rounded-lg p-2.5 text-center text-xs font-black text-[#D4853D] mb-5 uppercase tracking-wide">
                💳 Paid via {receiptData.method}
              </div>

              {receiptData.whatsappLink && (
                <a
                  href={receiptData.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-3 flex w-full items-center justify-center rounded-lg border-2 border-[#25D366]/40 bg-[#25D366]/10 py-2.5 text-xs font-black uppercase tracking-wide text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
                >
                  Send WhatsApp Thank You
                </a>
              )}

              <button 
                className="w-full py-3.5 bg-gradient-to-r from-[#D4853D] to-[#6F4E37] hover:from-[#E59449] hover:to-[#8B6F47] text-white rounded-lg font-black shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                onClick={closeAndClear}
              >
                <Receipt size={18} /> New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
