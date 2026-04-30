import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../index.css";

import ProductGrid from "../components/pos/ProductGrid";
import CartSidebar from "../components/pos/CartSidebar";
import CheckoutOverlay from "../components/pos/CheckoutOverlay";

const API_BASE = "http://localhost:5000/api";
const DEFAULT_TAX_RATE = 0.08;

function toNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export default function POS() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [taxRate, setTaxRate] = useState(DEFAULT_TAX_RATE);
  const [inventoryError, setInventoryError] = useState("");
  const [loadingInventory, setLoadingInventory] = useState(true);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setInventory(Array.isArray(res.data) ? res.data : []);
      setInventoryError("");
    } catch (error) {
      setInventoryError(error.response?.data?.error || "Failed to load products.");
    } finally {
      setLoadingInventory(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const nextTaxRate = toNumber(res.data?.taxRate, 8.5) / 100;
      setTaxRate(nextTaxRate > 0 ? nextTaxRate : DEFAULT_TAX_RATE);
    } catch {
      setTaxRate(DEFAULT_TAX_RATE);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    fetchSettings();

    const interval = setInterval(fetchInventory, 15000);
    return () => clearInterval(interval);
  }, [fetchInventory, fetchSettings]);

  const categories = useMemo(() => {
    const categorySet = new Set(inventory.map((item) => item.category).filter(Boolean));
    return ["All", ...categorySet];
  }, [inventory]);

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory("All");
    }
  }, [categories, category]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return inventory.filter((product) => {
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
          item.sku === product.sku ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (sku, delta) => {
    const product = inventory.find((p) => p.sku === sku);
    if (!product) return;

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.sku !== sku) return item;
          const nextQty = item.qty + delta;
          if (nextQty > product.stock) return item;
          return nextQty > 0 ? { ...item, qty: nextQty } : null;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (sku) => setCart((prev) => prev.filter((item) => item.sku !== sku));
  const clearCart = () => setCart([]);

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" || search.trim() === "") return;
    const scannedProduct = inventory.find(
      (item) => (item.sku || "").toLowerCase() === search.trim().toLowerCase(),
    );
    if (scannedProduct && scannedProduct.stock > 0) {
      addToCart(scannedProduct);
      setSearch("");
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + toNumber(item.price) * item.qty, 0);
  const tax = subtotal * taxRate;
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
        product: item._id,
        sku: item.sku,
        productName: item.product,
        qty: item.qty,
        price: toNumber(item.price),
        total: item.qty * toNumber(item.price),
      })),
    };

    try {
      const res = await axios.post(`${API_BASE}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedOrder = res.data.order;
      await fetchInventory();

      setReceiptData({
        orderId: savedOrder?.orderId || `ORD-${Date.now()}`,
        date: new Date().toLocaleString(),
        items: [...cart],
        customerName: payload.customerName,
        subtotal,
        tax,
        total,
        method,
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
          categories={categories}
          category={category}
          setCategory={setCategory}
          filteredProducts={filteredProducts}
          addToCart={addToCart}
          loadingInventory={loadingInventory}
          inventoryError={inventoryError}
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
