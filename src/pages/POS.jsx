import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../index.css";
import { getInventory, reduceStockForPurchase } from "../utils/mockInventory";

import ProductGrid from "../components/pos/ProductGrid";
import CartSidebar from "../components/pos/CartSidebar";
import CheckoutOverlay from "../components/pos/CheckoutOverlay";

const CATEGORIES = ["All", "Coffee", "Drinks", "Food", "Dessert"];
const TAX_RATE = 0.08;
const API_BASE = "http://localhost:5000/api";

export default function POS() {
  const [inventory, setInventory] = useState(getInventory);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    const handleUpdate = () => setInventory(getInventory());
    globalThis.addEventListener("inventory_updated", handleUpdate);
    return () => globalThis.removeEventListener("inventory_updated", handleUpdate);
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

  const handlePaymentSelect = async (method) => {
    setCheckoutError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setCheckoutError("Please login again.");
      return;
    }

    const payload = {
      customerName: customerName.trim() || "Walk-in Customer",
      paymentMethod: method,
      subtotal,
      tax,
      items: cart.map((item) => ({
        sku: item.sku,
        productName: item.product,
        qty: item.qty,
        price: item.price,
        total: item.qty * item.price
      }))
    };

    try {
      const res = await axios.post(`${API_BASE}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const savedOrder = res.data.order;
      reduceStockForPurchase(cart);

      setReceiptData({
        orderId: savedOrder?.orderId || `ORD-${Date.now()}`,
        date: new Date().toLocaleString(),
        items: [...cart],
        customerName: payload.customerName,
        subtotal,
        tax,
        total,
        method
      });
      
      setIsCheckoutOpen(false);
      setIsInvoiceOpen(true);
    } catch (error) {
      setCheckoutError(error.response?.data?.error || "Failed to save order to server.");
    }
  };

  const closeAndClear = () => {
    setIsInvoiceOpen(false);
    setCustomerName("");
    setCheckoutError("");
    clearCart();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8efe4] text-slate-900">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#d4853d]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[#6f4e37]/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
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
      </div>

      <CheckoutOverlay
        isCheckoutOpen={isCheckoutOpen}
        setIsCheckoutOpen={setIsCheckoutOpen}
        isInvoiceOpen={isInvoiceOpen}
        total={total}
        customerName={customerName}
        setCustomerName={setCustomerName}
        checkoutError={checkoutError}
        handlePaymentSelect={handlePaymentSelect}
        receiptData={receiptData}
        closeAndClear={closeAndClear}
      />
    </div>
  );
}