import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "../index.css";

import ProductGrid from "../components/pos/ProductGrid";
import CartSidebar from "../components/pos/CartSidebar";
import CheckoutOverlay from "../components/pos/CheckoutOverlay";
import BarcodeScannerModal from "../components/pos/BarcodeScannerModal";

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
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [scanNotice, setScanNotice] = useState({ type: "", message: "" });
  const scanNoticeTimerRef = useRef(null);

  const buildWhatsAppPhone = (rawPhone) => {
    const digits = String(rawPhone || "").replace(/\D/g, "");
    if (!digits) return "";

    // Default to India country code if cashier enters a 10-digit local number.
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const buildWhatsAppLink = (name, phone, amount) => {
    const whatsappPhone = buildWhatsAppPhone(phone);
    if (!whatsappPhone) return "";

    const message = `Hi ${name || "there"}, thanks for coming to Urban Crust. Your payment of Rs ${amount.toFixed(0)} is received.`;
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

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

    const inventoryInterval = setInterval(fetchInventory, 15000);
    const settingsInterval = setInterval(fetchSettings, 15000);
    return () => {
      clearInterval(inventoryInterval);
      clearInterval(settingsInterval);
    };
  }, [fetchInventory, fetchSettings]);

  useEffect(() => {
    if (isCheckoutOpen) {
      fetchSettings();
    }
  }, [isCheckoutOpen, fetchSettings]);

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
        (product.sku || "").toLowerCase().includes(normalizedSearch) ||
        (product.barcode || "").toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category, inventory]);

  const showScanNotice = useCallback((type, message) => {
    setScanNotice({ type, message });
    if (scanNoticeTimerRef.current) {
      clearTimeout(scanNoticeTimerRef.current);
    }
    scanNoticeTimerRef.current = setTimeout(() => {
      setScanNotice({ type: "", message: "" });
    }, 3500);
  }, []);

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
    const normalizedInput = search.trim().toLowerCase();
    const scannedProduct = inventory.find(
      (item) =>
        (item.sku || "").toLowerCase() === normalizedInput ||
        (item.barcode || "").toLowerCase() === normalizedInput,
    );
    if (scannedProduct && scannedProduct.stock > 0) {
      addToCart(scannedProduct);
      showScanNotice("success", `${scannedProduct.product} added to cart`);
      setSearch("");
    } else if (scannedProduct && scannedProduct.stock <= 0) {
      showScanNotice("error", `${scannedProduct.product} is out of stock`);
    } else {
      showScanNotice("error", `No product found for code: ${search.trim()}`);
    }
  };

  const handleCameraScan = useCallback(
    (codeValue) => {
      const normalizedInput = String(codeValue || "").trim().toLowerCase();
      if (!normalizedInput) return;

      const scannedProduct = inventory.find(
        (item) =>
          (item.sku || "").toLowerCase() === normalizedInput ||
          (item.barcode || "").toLowerCase() === normalizedInput,
      );

      if (!scannedProduct) {
        showScanNotice("error", `No product found for code: ${codeValue}`);
        return;
      }

      if (scannedProduct.stock <= 0) {
        showScanNotice("error", `${scannedProduct.product} is out of stock`);
        return;
      }

      addToCart(scannedProduct);
      setSearch("");
      showScanNotice("success", `${scannedProduct.product} added to cart`);
    },
    [inventory, showScanNotice],
  );

  useEffect(
    () => () => {
      if (scanNoticeTimerRef.current) {
        clearTimeout(scanNoticeTimerRef.current);
      }
    },
    [],
  );

  const subtotal = cart.reduce((acc, item) => acc + toNumber(item.price) * item.qty, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const taxRatePercent = Number((taxRate * 100).toFixed(2));

  const handlePaymentSelect = async (method) => {
    setCheckoutError("");

    const trimmedName = customerName.trim();
    const normalizedPhone = buildWhatsAppPhone(customerPhone);
    if (!trimmedName) {
      setCheckoutError("Customer name is required.");
      return;
    }
    if (!normalizedPhone || normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      setCheckoutError("Please enter a valid customer phone number.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCheckoutError("Please login again.");
      return;
    }

    const payload = {
      customerName: trimmedName,
      customerPhone: normalizedPhone,
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
        customerPhone: payload.customerPhone,
        subtotal,
        tax,
        total,
        method,
        whatsappLink: buildWhatsAppLink(payload.customerName, payload.customerPhone, total),
      });

      setIsCheckoutOpen(false);
      setIsInvoiceOpen(true);

      const whatsappLink = buildWhatsAppLink(payload.customerName, payload.customerPhone, total);
      if (whatsappLink) {
        window.open(whatsappLink, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setCheckoutError(error.response?.data?.error || "Failed to save order to server.");
    }
  };

  const closeAndClear = () => {
    setIsInvoiceOpen(false);
    setCustomerName("");
    setCustomerPhone("");
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
          onOpenScanner={() => setIsScannerOpen(true)}
          scanNotice={scanNotice}
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
        taxRatePercent={taxRatePercent}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        checkoutError={checkoutError}
        handlePaymentSelect={handlePaymentSelect}
        receiptData={receiptData}
        closeAndClear={closeAndClear}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDetected={handleCameraScan}
      />
    </div>
  );
}
