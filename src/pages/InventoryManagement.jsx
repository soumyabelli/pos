import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  Bell,
  MoreVertical,
  Search,
  Settings,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const INVENTORY_ROWS = [
  {
    id: "CR-SN-001",
    product: "Curator One Sneakers",
    sku: "CR-SN-001",
    store: "Main Street Flagship",
    category: "Footwear",
    stock: 142,
    status: "optimal",
  },
  {
    id: "CR-LS-042",
    product: "Artisan Linen Shirt",
    sku: "CR-LS-042",
    store: "Main Street Flagship",
    category: "Apparel",
    stock: 8,
    status: "critical",
  },
  {
    id: "CR-WT-109",
    product: "Curator Timepiece",
    sku: "CR-WT-109",
    store: "Uptown Concept Store",
    category: "Accessories",
    stock: 24,
    status: "reorder",
  },
  {
    id: "CR-SG-772",
    product: "Polarized Series X",
    sku: "CR-SG-772",
    store: "Main Street Flagship",
    category: "Accessories",
    stock: 67,
    status: "optimal",
  },
  {
    id: "CR-TT-889",
    product: "Minimalist Tote",
    sku: "CR-TT-889",
    store: "Concept Store",
    category: "Accessories",
    stock: 12,
    status: "critical",
  },
  {
    id: "CR-BT-335",
    product: "Canvas Belt (Khaki)",
    sku: "CR-BT-335",
    store: "Warehouse A",
    category: "Apparel",
    stock: 2,
    status: "critical",
  },
  {
    id: "CR-CP-120",
    product: "Studio Cap",
    sku: "CR-CP-120",
    store: "Main Street Flagship",
    category: "Apparel",
    stock: 0,
    status: "critical",
  },
];

const TABS = [
  { id: "all", label: "All Items" },
  { id: "low", label: "Low Stock" },
  { id: "out", label: "Out of Stock" },
  { id: "category", label: "By Category" },
];

function getDisplayName() {
  const token = localStorage.getItem("token");
  if (!token) return "Store Manager";

  try {
    const payload = token.split(".")[1];
    if (!payload) return "Store Manager";
    const decoded = JSON.parse(atob(payload));
    return decoded?.name || "Store Manager";
  } catch {
    return "Store Manager";
  }
}

function getBadgeLabel(status) {
  if (status === "optimal") return "Optimal";
  if (status === "reorder") return "Reorder Soon";
  return "Critical Low";
}

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const displayName = getDisplayName();

  const rows = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return INVENTORY_ROWS.filter((row) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        row.product.toLowerCase().includes(normalizedQuery) ||
        row.sku.toLowerCase().includes(normalizedQuery);

      if (!matchesSearch) return false;
      if (activeTab === "low") return row.stock > 0 && row.stock <= 15;
      if (activeTab === "out") return row.stock === 0;
      if (activeTab === "category") return row.category === "Accessories";
      return true;
    }).sort((a, b) => {
      if (activeTab === "category") {
        return a.category.localeCompare(b.category) || a.product.localeCompare(b.product);
      }
      return 0;
    });
  }, [activeTab, searchValue]);

  const criticalCount = useMemo(
    () => INVENTORY_ROWS.filter((item) => item.stock <= 10).length,
    []
  );

  const lowStockAlerts = useMemo(
    () =>
      INVENTORY_ROWS.filter((item) => item.stock <= 12).slice(0, 3),
    []
  );

  return (
    <div className="admin-layout inv-layout">
      <Sidebar />

      <div className="admin-main inv-main">
        <header className="admin-topbar inv-topbar">
          <label className="admin-searchbar" htmlFor="inventory-search">
            <Search size={16} />
            <input
              id="inventory-search"
              type="text"
              placeholder="Search inventory SKU or name..."
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
                <span>TERMINAL 04</span>
              </div>
              <img
                src="https://i.pravatar.cc/48?img=14"
                alt="Store manager avatar"
                className="admin-avatar"
              />
            </div>
          </div>
        </header>

        <main className="inv-content">
          <section className="inv-header">
            <div>
              <h1>Inventory Management</h1>
              <p>Manage stock levels and distribution across flagship locations.</p>
            </div>

            <div className="inv-header-actions">
              <button type="button" className="inv-action-btn soft">
                <ArrowRightLeft size={14} />
                <span>Transfer Stock</span>
              </button>
              <button type="button" className="inv-action-btn primary">
                <SlidersHorizontal size={14} />
                <span>Adjust Inventory</span>
              </button>
            </div>
          </section>

          <section className="inv-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`inv-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </section>

          <section className="inv-grid">
            <article className="inv-table-shell">
              <div className="inv-table-wrap">
                <table className="inv-table">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>STORE LOCATION</th>
                      <th>STOCK LEVEL</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="inv-product-cell">
                            <span className="inv-thumb" aria-hidden="true" />
                            <div>
                              <strong>{row.product}</strong>
                              <small>SKU: {row.sku}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="inv-store">{row.store}</span>
                        </td>
                        <td>
                          <div className="inv-stock-cell">
                            <strong>{row.stock}</strong>
                            <small>units</small>
                            {row.stock <= 10 ? <TriangleAlert size={12} /> : null}
                          </div>
                        </td>
                        <td>
                          <span className={`inv-status ${row.status}`}>
                            {getBadgeLabel(row.status)}
                          </span>
                        </td>
                        <td>
                          <button className="inv-row-menu" type="button" aria-label="Row actions">
                            <MoreVertical size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <footer className="inv-table-footer">
                <p>Showing {rows.length} of {INVENTORY_ROWS.length} products</p>
                <div className="inv-pagination">
                  <button type="button" aria-label="Previous page">{"<"}</button>
                  <button type="button" className="active">1</button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button" aria-label="Next page">{">"}</button>
                </div>
              </footer>
            </article>

            <aside className="inv-alerts">
              <article className="inv-critical-card">
                <p>CRITICAL ALERTS</p>
                <h2>{criticalCount}</h2>
                <span>
                  <strong>+2</strong> today
                </span>
                <small>Items requiring immediate restocking attention.</small>
              </article>

              <article className="inv-low-stock">
                <header>
                  <h3>Low Stock Alerts</h3>
                  <button type="button">VIEW ALL</button>
                </header>

                <div className="inv-alert-list">
                  {lowStockAlerts.map((item) => (
                    <div key={item.id} className="inv-alert-item">
                      <div>
                        <strong>{item.product}</strong>
                        <p>
                          {item.store} • {item.stock} left
                        </p>
                      </div>
                      <button type="button">
                        REORDER NOW
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
