import { useState, useMemo, useEffect } from "react";
import "../index.css";
import { getInventory, reduceStockForPurchase } from "../utils/mockInventory";

import ProductGrid from "../components/pos/ProductGrid";
import CartSidebar from "../components/pos/CartSidebar";
import CheckoutOverlay from "../components/pos/CheckoutOverlay";

const CATEGORIES = ["All", "Coffee", "Drinks", "Food", "Dessert"];
const TAX_RATE = 0.08;

export default function POS() {
  const [inventory, setInventory] = useState(getInventory);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setInventory(getInventory());
    window.addEventListener("inventory_updated", handleUpdate);
    return () => window.removeEventListener("inventory_updated", handleUpdate);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (inventory || []).filter((product) => {
      const matchesSearch = 
        (product.product || "").toLowerCase().includes(normalizedSearch) || 
        (product.sku || "").toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category, inventory]);

  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.sku === product.sku);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((item) =>
          item.sku === product.sku ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (sku, delta) => {
    const product = inventory.find(p => p.sku === sku);
    setCart((prev) => {
      return prev.map((item) => {
        if (item.sku === sku) {
          const newQty = item.qty + delta;
          if (newQty > product.stock) return item;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (sku) => setCart((prev) => prev.filter((item) => item.sku !== sku));
  const clearCart = () => setCart([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      const scannedProduct = inventory.find(p => (p.sku || "").toLowerCase() === search.trim().toLowerCase());
      if (scannedProduct && scannedProduct.stock > 0) {
        addToCart(scannedProduct);
        setSearch("");
      }
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handlePaymentSelect = (method) => {
    const orderId = `ORD-2026-${(total * 100).toFixed(0)}`;
    reduceStockForPurchase(cart);

    setReceiptData({
      orderId,
      date: new Date().toLocaleString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      method
    });
    
    setIsCheckoutOpen(false);
    setIsInvoiceOpen(true);
  };

  const closeAndClear = () => {
    setIsInvoiceOpen(false);
    clearCart();
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden text-slate-900 relative bg-slate-50">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-300/30 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[30%] w-[600px] h-[600px] rounded-full bg-rose-300/30 blur-[130px] pointer-events-none"></div>

      <ProductGrid 
        search={search}
        setSearch={setSearch}
        handleKeyDown={handleKeyDown}
        categories={CATEGORIES}
        category={category}
        setCategory={setCategory}
        filteredProducts={filteredProducts}
        addToCart={addToCart}
      />

      <CartSidebar 
        cart={cart}
        removeFromCart={removeFromCart}
        updateQty={updateQty}
        clearCart={clearCart}
        subtotal={subtotal}
        tax={tax}
        total={total}
        setIsCheckoutOpen={setIsCheckoutOpen}
      />

      <CheckoutOverlay 
        isCheckoutOpen={isCheckoutOpen}
        setIsCheckoutOpen={setIsCheckoutOpen}
        isInvoiceOpen={isInvoiceOpen}
        total={total}
        handlePaymentSelect={handlePaymentSelect}
        receiptData={receiptData}
        closeAndClear={closeAndClear}
      />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-up { animation: scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}