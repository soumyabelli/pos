import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import "../index.css"; // Ensure styles are pulled in

const MOCK_PRODUCTS = [
  { id: 1, name: "Espresso", price: 3.5, category: "Coffee", emoji: "☕", barcode: "1001" },
  { id: 2, name: "Latte", price: 4.5, category: "Coffee", emoji: "🍵", barcode: "1002" },
  { id: 3, name: "Cappuccino", price: 4.5, category: "Coffee", emoji: "☕", barcode: "1003" },
  { id: 4, name: "Croissant", price: 2.5, category: "Food", emoji: "🥐", barcode: "1004" },
  { id: 5, name: "Blueberry Muffin", price: 3.0, category: "Food", emoji: "🧁", barcode: "1005" },
  { id: 6, name: "Sparkling Water", price: 2.0, category: "Drinks", emoji: "🥤", barcode: "1006" },
  { id: 7, name: "Iced Tea", price: 3.5, category: "Drinks", emoji: "🍹", barcode: "1007" },
  { id: 8, name: "Sandwich", price: 6.5, category: "Food", emoji: "🥪", barcode: "1008" },
  { id: 9, name: "Chocolate Cake", price: 5.0, category: "Dessert", emoji: "🍰", barcode: "1009" },
  { id: 10, name: "Macaron", price: 2.5, category: "Dessert", emoji: "🍪", barcode: "1010" },
];

const CATEGORIES = ["All", "Coffee", "Drinks", "Food", "Dessert"];

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  background: 'var(--bg-card, #1e1e2d)',
  padding: '32px',
  borderRadius: '16px',
  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
  color: 'var(--text-primary, #fff)',
  width: '400px',
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
};

export default function POS() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [discountType, setDiscountType] = useState("none"); // "none", "percent", "fixed"
  const [discountValue, setDiscountValue] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean); // Remove null items
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountType("none");
    setDiscountValue(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      const scannedProduct = MOCK_PRODUCTS.find(p => p.barcode === search.trim() || p.id.toString() === search.trim());
      if (scannedProduct) {
        addToCart(scannedProduct);
        setSearch("");
      }
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  let discountAmount = 0;
  if (discountType === "percent") {
    discountAmount = subtotal * (discountValue / 100);
  } else if (discountType === "fixed") {
    discountAmount = Math.min(discountValue, subtotal);
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.08; // 8% tax
  const total = discountedSubtotal + tax;

  const handleCheckoutClick = () => {
    setIsCheckoutOpen(true);
  };

  const handlePaymentSelect = (method) => {
    const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setReceiptData({
      orderId,
      date: new Date().toLocaleString(),
      items: [...cart],
      subtotal,
      discountAmount,
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
    <div className="pos-container">
      {/* We can hide NavBar or show a minimalist one since this is a POS Terminal */}
      
      {/* Left side: Main Products Area */}
      <div className="pos-main">
        <div className="pos-header">
          <div>
            <h1>New Order</h1>
            <p style={{ color: "var(--text-muted)" }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <input
            type="text"
            className="pos-search"
            placeholder="Search products or scan barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="products-wrapper">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => addToCart(product)}
              >
                <div className="product-emoji">{product.emoji}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-price">${product.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Cart / Receipt */}
      <div className="pos-sidebar">
        <div className="cart-header">
          <h2>Current Order</h2>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price.toFixed(2)} x {item.qty}</div>
                </div>
                
                <div className="item-controls">
                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                  <span className="item-qty">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                
                <div className="item-total" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ${(item.price * item.qty).toFixed(2)}
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontSize: '18px', padding: 0 }} title="Remove item">
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="discount-controls" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select 
              value={discountType} 
              onChange={(e) => setDiscountType(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <option value="none">No Discount</option>
              <option value="percent">% Off</option>
              <option value="fixed">$ Off</option>
            </select>
            {discountType !== "none" && (
              <input 
                type="number" 
                value={discountValue} 
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                placeholder="Value"
                style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                min="0"
              />
            )}
          </div>

          <div className="totals-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="totals-row" style={{ color: 'var(--success-color)' }}>
              <span>Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="totals-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="totals-row grand-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" disabled={cart.length === 0} onClick={handleCheckoutClick}>
            Charge ${total.toFixed(2)}
          </button>
          
          <button 
            onClick={clearCart} 
            disabled={cart.length === 0}
            style={{
              width: "100%", marginTop: "12px", padding: "12px", background: "transparent",
              color: "var(--danger-color)", border: "1px solid var(--danger-color)",
              borderRadius: "12px", cursor: cart.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Select Payment Method</h2>
            <h1 style={{ margin: '20px 0', color: 'var(--primary-color)' }}>${total.toFixed(2)}</h1>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => handlePaymentSelect('Cash')}
                style={{ padding: '12px 24px', borderRadius: '8px', background: 'var(--primary-color)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                💵 Cash
              </button>
              <button 
                onClick={() => handlePaymentSelect('Card')}
                style={{ padding: '12px 24px', borderRadius: '8px', background: 'var(--primary-color)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                💳 Card
              </button>
              <button 
                onClick={() => handlePaymentSelect('UPI')}
                style={{ padding: '12px 24px', borderRadius: '8px', background: 'var(--primary-color)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                📱 UPI
              </button>
            </div>
            <button 
              style={{ marginTop: '24px', width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }} 
              onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceOpen && receiptData && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, width: '350px'}}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
              <h2>Urban Crust</h2>
              <p style={{ color: 'var(--text-muted)' }}>Receipt {receiptData.orderId}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{receiptData.date}</p>
            </div>
            
            <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '16px', textAlign: 'left' }}>
              {receiptData.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>{item.qty}x {item.name}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '16px', fontSize: '0.9rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Subtotal</span><span>${receiptData.subtotal.toFixed(2)}</span>
              </div>
              {receiptData.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--success-color)' }}>
                  <span>Discount</span><span>-${receiptData.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Tax (8%)</span><span>${receiptData.tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '16px' }}>
                <span>Total</span><span>${receiptData.total.toFixed(2)}</span>
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '16px' }}>
                Paid via {receiptData.method}
              </div>
            </div>

            <button 
              className="btn-primary glow" 
              style={{ width: '100%', marginTop: '24px', padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={closeAndClear}>
              Done / Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}