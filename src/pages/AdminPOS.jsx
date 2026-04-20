import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CreditCard,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
];

const FALLBACK_PRODUCTS = [
  { id: "p1", name: "Vortex Runner Pro", price: 129.99, category: "All Products", stock: 12 },
  { id: "p2", name: "Lunar Series Watch", price: 85.0, category: "Apparel", stock: 5 },
  { id: "p3", name: "Studio Bass Headsets", price: 159.2, category: "Electronics", stock: 16 },
  { id: "p4", name: "Classic Aviators", price: 45.0, category: "Accessories", stock: 21 },
  { id: "p5", name: "Urban Strike X", price: 110.0, category: "Footwear", stock: 8 },
  { id: "p6", name: "Luxe Tote Bag", price: 210.0, category: "Apparel", stock: 3 },
  { id: "p7", name: "Glass Brew Set", price: 34.5, category: "Home", stock: 15 },
  { id: "p8", name: "Retro 35mm Camera", price: 450.0, category: "Electronics", stock: 2 },
];

const STORAGE_KEYS = ["posProducts", "customerItems", "products"];

function getDisplayName() {
  const token = localStorage.getItem("token");
  if (!token) return "Alex Mercer";

  try {
    const payload = token.split(".")[1];
    if (!payload) return "Alex Mercer";
    const decoded = JSON.parse(atob(payload));
    return decoded?.name || "Alex Mercer";
  } catch {
    return "Alex Mercer";
  }
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeProduct(item, index) {
  const id = item?._id || item?.id || `fallback-${index}`;
  const price = toNumber(item?.price, 0);
  const quantity = Math.max(0, Math.floor(toNumber(item?.stock ?? item?.quantity, 0)));

  return {
    id,
    name: item?.name || `Item ${index + 1}`,
    category: item?.category || "All Products",
    price,
    stock: quantity,
    image: item?.image || IMAGE_POOL[index % IMAGE_POOL.length],
  };
}

function loadProductsFromStorage() {
  for (const key of STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) continue;
      return parsed.map((item, index) => normalizeProduct(item, index));
    } catch {
      // Ignore malformed local data and move to next key.
    }
  }

  return [];
}

export default function AdminPOS() {
  const displayName = getDisplayName();

  const [products, setProducts] = useState(() => FALLBACK_PRODUCTS.map((item, index) => normalizeProduct(item, index)));
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchValue, setSearchValue] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const localProducts = loadProductsFromStorage();

    if (localProducts.length > 0) {
      setProducts(localProducts);
    }

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      try {
        const productsResponse = await fetch(`${baseUrl}/api/products`, { headers });
        if (!productsResponse.ok) {
          throw new Error(`Unable to fetch products (${productsResponse.status})`);
        }

        const apiProducts = await productsResponse.json();
        if (!Array.isArray(apiProducts) || apiProducts.length === 0) {
          throw new Error("No products found");
        }

        let inventoryMap = {};

        try {
          const inventoryResponse = await fetch(`${baseUrl}/api/inventory`, { headers });
          if (inventoryResponse.ok) {
            const inventoryItems = await inventoryResponse.json();
            inventoryMap = Array.isArray(inventoryItems)
              ? inventoryItems.reduce((acc, entry) => {
                  const productId = entry?.product?._id || entry?.product;
                  if (productId) {
                    acc[productId] = toNumber(entry?.quantity, 0);
                  }
                  return acc;
                }, {})
              : {};
          }
        } catch {
          // Inventory endpoint may not be available yet; fallback to product fields.
        }

        const mergedProducts = apiProducts.map((item, index) => {
          const normalized = normalizeProduct(item, index);
          const quantity = inventoryMap[item?._id];
          return {
            ...normalized,
            stock: Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : normalized.stock,
          };
        });

        if (isMounted) {
          setProducts(mergedProducts);
        }
      } catch {
        if (isMounted && localProducts.length === 0) {
          setProducts(FALLBACK_PRODUCTS.map((item, index) => normalizeProduct(item, index)));
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const productCategories = new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    );

    return ["All Products", ...Array.from(productCategories).filter((category) => category !== "All Products")];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All Products" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchValue]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id !== id) return item;

          const nextQty = item.qty + delta;
          return nextQty > 0 ? { ...item, qty: nextQty } : null;
        })
        .filter(Boolean);
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="admin-layout admin-pos-layout">
      <Sidebar />

      <div className="admin-main admin-pos-main">
        <header className="admin-pos-topbar">
          <label className="admin-pos-searchbar" htmlFor="admin-pos-search">
            <Search size={16} />
            <input
              id="admin-pos-search"
              type="text"
              placeholder="Search products, SKU or barcode..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <div className="admin-pos-actions">
            <button className="icon-btn" type="button" aria-label="Filters">
              <SlidersHorizontal size={16} />
            </button>
            <button className="icon-btn" type="button" aria-label="Notifications">
              <Bell size={16} />
            </button>

            <div className="admin-profile">
              <div className="admin-profile-copy">
                <p>{displayName}</p>
                <span>TERMINAL 04</span>
              </div>
              <img
                src="https://i.pravatar.cc/48?img=13"
                alt="Admin avatar"
                className="admin-avatar"
              />
            </div>
          </div>
        </header>

        <main className="admin-pos-shell">
          <section className="admin-pos-catalog">
            <div className="admin-pos-filters">
              <div className="admin-pos-tabs">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`admin-pos-tab ${activeCategory === category ? "active" : ""}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <button className="admin-pos-sale-chip" type="button">
                <Tag size={14} />
                Sale
              </button>
            </div>

            <div className="admin-pos-products-grid">
              {isLoadingProducts && filteredProducts.length === 0 ? (
                <div className="admin-pos-empty-state">Loading items...</div>
              ) : null}

              {!isLoadingProducts && filteredProducts.length === 0 ? (
                <div className="admin-pos-empty-state">
                  No matching products found.
                </div>
              ) : null}

              {filteredProducts.map((product) => {
                const lowStock = product.stock > 0 && product.stock <= 5;
                const stockLabel = product.stock > 0 ? `IN STOCK: ${String(product.stock).padStart(2, "0")}` : "OUT OF STOCK";

                return (
                  <button
                    key={product.id}
                    type="button"
                    className="admin-pos-product-card"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <div className="admin-pos-product-media">
                      {lowStock ? <span className="admin-pos-card-badge">LOW</span> : null}
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </div>

                    <p className="admin-pos-stock-label">{stockLabel}</p>
                    <h3>{product.name}</h3>
                    <p className="admin-pos-card-price">${product.price.toFixed(2)}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="admin-pos-order-panel">
            <header className="admin-pos-order-header">
              <h2>
                <ShoppingCart size={18} />
                Current Order
              </h2>
              <button type="button" aria-label="Order options">
                <SlidersHorizontal size={15} />
              </button>
            </header>

            <div className="admin-pos-order-items">
              {cart.length === 0 ? (
                <div className="admin-pos-order-empty">Add items from the catalog to start billing.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="admin-pos-order-item">
                    <img src={item.image} alt={item.name} />

                    <div className="admin-pos-order-copy">
                      <h4>{item.name}</h4>
                      <p>${item.price.toFixed(2)}</p>
                    </div>

                    <div className="admin-pos-qty-control" role="group" aria-label={`Adjust quantity for ${item.name}`}>
                      <button type="button" onClick={() => updateQty(item.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="admin-pos-billing">
              <label className="admin-pos-discount" htmlFor="discount-code">
                <Tag size={14} />
                <input id="discount-code" type="text" placeholder="Promo code or discount code" />
              </label>

              <div className="admin-pos-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="admin-pos-total-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="admin-pos-total-row total">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="admin-pos-pay-methods">
                {["CASH", "CARD", "UPI"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={paymentMethod === method ? "active" : ""}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method === "CARD" ? <CreditCard size={15} /> : null}
                    <span>{method}</span>
                  </button>
                ))}
              </div>

              <button type="button" className="admin-pos-complete-btn" disabled={cart.length === 0}>
                Complete Payment
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}