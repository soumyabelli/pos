import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import "../index.css"; // Ensure styles are pulled in

const MOCK_PRODUCTS = [
  { id: 1, name: "Espresso", price: 3.5, category: "Coffee", emoji: "☕" },
  { id: 2, name: "Latte", price: 4.5, category: "Coffee", emoji: "🍵" },
  { id: 3, name: "Cappuccino", price: 4.5, category: "Coffee", emoji: "☕" },
  { id: 4, name: "Croissant", price: 2.5, category: "Food", emoji: "🥐" },
  { id: 5, name: "Blueberry Muffin", price: 3.0, category: "Food", emoji: "🧁" },
  { id: 6, name: "Sparkling Water", price: 2.0, category: "Drinks", emoji: "🥤" },
  { id: 7, name: "Iced Tea", price: 3.5, category: "Drinks", emoji: "🍹" },
  { id: 8, name: "Sandwich", price: 6.5, category: "Food", emoji: "🥪" },
  { id: 9, name: "Chocolate Cake", price: 5.0, category: "Dessert", emoji: "🍰" },
  { id: 10, name: "Macaron", price: 2.5, category: "Dessert", emoji: "🍪" },
];

const CATEGORIES = ["All", "Coffee", "Drinks", "Food", "Dessert"];

export default function POS() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);

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

  const clearCart = () => setCart([]);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

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
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                
                <div className="item-total">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="totals-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="totals-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="totals-row grand-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" disabled={cart.length === 0}>
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
    </div>
  );
}