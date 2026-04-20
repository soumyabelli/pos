import { useMemo, useState } from "react";
import {
  Bell,
  Download,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const PRODUCTS = [
  { id: 1, name: "Premium Running Shoes", sku: "SHOE-001", category: "Footwear", price: 89.99, stock: 45, status: "Active" },
  { id: 2, name: "Minimalist Digital Watch", sku: "ACC-402", category: "Accessories", price: 129.5, stock: 12, status: "Active" },
  { id: 3, name: "Classic Cotton Tee", sku: "AP-1002", category: "Apparel", price: 24.0, stock: 210, status: "Inactive" },
  { id: 4, name: "Streetwear Hoodie", sku: "AP-1101", category: "Apparel", price: 59.0, stock: 92, status: "Active" },
  { id: 5, name: "Trail Backpack", sku: "ACC-118", category: "Accessories", price: 74.25, stock: 18, status: "Active" },
  { id: 6, name: "Urban Trainers", sku: "SHOE-188", category: "Footwear", price: 99.0, stock: 66, status: "Inactive" },
];

const CATEGORY_OPTIONS = ["All Categories", "Footwear", "Accessories", "Apparel"];
const STATUS_OPTIONS = ["All", "Active", "Inactive"];

function getDisplayName() {
  const token = localStorage.getItem("token");
  if (!token) return "Marcus Reed";

  try {
    const payload = token.split(".")[1];
    if (!payload) return "Marcus Reed";
    const decoded = JSON.parse(atob(payload));
    return decoded?.name || "Marcus Reed";
  } catch {
    return "Marcus Reed";
  }
}

export default function ProductManagement() {
  const displayName = getDisplayName();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchValue, selectedCategory, selectedStatus]);

  const inventoryValue = useMemo(() => {
    return PRODUCTS.reduce((sum, item) => sum + item.price * item.stock, 0);
  }, []);

  const lowStockCount = useMemo(() => {
    return PRODUCTS.filter((item) => item.stock < 20).length;
  }, []);

  const activeCount = useMemo(() => {
    return PRODUCTS.filter((item) => item.status === "Active").length;
  }, []);

  return (
    <div className="admin-layout pm-layout">
      <Sidebar />

      <div className="admin-main pm-main">
        <header className="admin-topbar pm-topbar">
          <label className="admin-searchbar" htmlFor="product-search">
            <Search size={17} />
            <input
              id="product-search"
              type="text"
              placeholder="Search products, SKUs..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <div className="admin-top-actions">
            <button className="icon-btn" type="button" aria-label="Notifications">
              <Bell size={16} />
            </button>
            <button className="icon-btn" type="button" aria-label="Settings">
              <Settings size={16} />
            </button>

            <div className="admin-profile">
              <div className="admin-profile-copy">
                <p>{displayName}</p>
                <span>FLAGSHIP STORE</span>
              </div>
              <img
                src="https://i.pravatar.cc/48?img=15"
                alt="Admin avatar"
                className="admin-avatar"
              />
            </div>
          </div>
        </header>

        <main className="pm-content">
          <section className="pm-page-header">
            <div>
              <h1>Product Management</h1>
              <p>Catalog oversight and inventory precision</p>
            </div>

            <button className="pm-add-btn" type="button">
              <Plus size={14} />
              <span>Add Product</span>
            </button>
          </section>

          <section className="pm-kpi-grid">
            <article className="pm-kpi-card">
              <p className="pm-kpi-label">TOTAL INVENTORY VALUE</p>
              <h2>${inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
              <span className="pm-chip positive">+12.5%</span>
            </article>

            <article className="pm-kpi-card">
              <p className="pm-kpi-label">LOW STOCK ALERTS</p>
              <h2>{lowStockCount}</h2>
              <small>Items below reorder point</small>
            </article>

            <article className="pm-kpi-card">
              <p className="pm-kpi-label">ACTIVE LISTINGS</p>
              <h2>{activeCount}</h2>
              <small>Across {CATEGORY_OPTIONS.length - 1} categories</small>
            </article>
          </section>

          <section className="pm-table-shell">
            <div className="pm-table-toolbar">
              <div className="pm-filter-group">
                <label className="pm-select-wrap" htmlFor="category-filter">
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="pm-select-wrap" htmlFor="status-filter">
                  <select
                    id="status-filter"
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        Status: {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="pm-table-tools">
                <p>Displaying {filteredProducts.length} of 1,240 products</p>
                <button type="button" aria-label="Sort">
                  <SlidersHorizontal size={14} />
                </button>
                <button type="button" aria-label="Download">
                  <Download size={14} />
                </button>
                <button type="button" aria-label="More options">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            <div className="pm-table-wrap">
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>PRODUCT NAME</th>
                    <th>SKU</th>
                    <th>CATEGORY</th>
                    <th>PRICE</th>
                    <th>STOCK LEVEL</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockPct = Math.min((product.stock / 220) * 100, 100);

                    return (
                      <tr key={product.id}>
                        <td className="pm-product-cell">
                          <div className="pm-product-thumb" />
                          <strong>{product.name}</strong>
                        </td>
                        <td>{product.sku}</td>
                        <td>{product.category}</td>
                        <td className="pm-price">${product.price.toFixed(2)}</td>
                        <td>
                          <div className="pm-stock-cell">
                            <div className="pm-stock-track">
                              <span
                                style={{ width: `${stockPct}%` }}
                                className={product.stock < 20 ? "low" : ""}
                              />
                            </div>
                            <strong>{product.stock}</strong>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`pm-chip ${product.status === "Active" ? "active" : "inactive"}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <button className="pm-row-action" type="button" aria-label="Edit product">
                            <Pencil size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pm-pagination">
              <div className="pm-page-numbers">
                <button className="active" type="button">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <span>...</span>
                <button type="button">25</button>
              </div>

              <div className="pm-page-steps">
                <button type="button">Previous</button>
                <button type="button">Next</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
