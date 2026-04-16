import Sidebar from "../components/Sidebar";
import SalesChart from "../components/SalesChart";
import {
  Search,
  Bell,
  Settings,
  Calendar,
  Download,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";

const topSellingProducts = [
  { name: "Running Shoes", sold: 1240, progress: 88 },
  { name: "Cotton Hoodies", sold: 980, progress: 72 },
  { name: "Organic Tea", sold: 720, progress: 55 },
  { name: "Yoga Mats", sold: 540, progress: 42 },
];

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

export default function AdminDashboard() {
  const displayName = getDisplayName();

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <label className="admin-searchbar">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search orders, customers, SKUs..."
              aria-label="Search"
            />
          </label>

          <div className="admin-top-actions">
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={16} />
            </button>
            <button className="icon-btn" aria-label="Settings">
              <Settings size={16} />
            </button>

            <div className="admin-profile">
              <div className="admin-profile-copy">
                <p>{displayName}</p>
                <span>STORE MANAGER</span>
              </div>
              <img
                src="https://i.pravatar.cc/48?img=15"
                alt="Admin avatar"
                className="admin-avatar"
              />
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-overview-header">
            <div>
              <h1>Overview Dashboard</h1>
              <p>Welcome back, {displayName.split(" ")[0]}. Here&apos;s what&apos;s happening today.</p>
            </div>

            <div className="admin-header-actions">
              <button className="utility-btn">
                <Calendar size={14} />
                <span>This Week</span>
              </button>
              <button className="utility-btn">
                <Download size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <section className="admin-kpi-grid">
            <article className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon">
                  <DollarSign size={16} />
                </div>
                <span className="kpi-pill positive">+12%</span>
              </div>
              <p className="kpi-label">TOTAL SALES</p>
              <p className="kpi-value">$42,500</p>
              <div className="kpi-meter">
                <span />
              </div>
            </article>

            <article className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon kpi-icon-soft">
                  <DollarSign size={16} />
                </div>
                <span className="kpi-pill neutral">Goal: $10k</span>
              </div>
              <p className="kpi-label">TODAY&apos;S REVENUE</p>
              <p className="kpi-value">$8,200</p>
              <p className="kpi-footnote">Last updated 5m ago</p>
            </article>

            <article className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon">
                  <ShoppingCart size={16} />
                </div>
              </div>
              <p className="kpi-label">ORDERS TODAY</p>
              <p className="kpi-value">128</p>
              <div className="kpi-footnote order-trend">
                <span className="avatar-stack">
                  <i />
                  <i />
                  <i />
                </span>
                125 more
              </div>
            </article>

            <article className="kpi-card danger">
              <div className="kpi-top">
                <div className="kpi-icon danger-icon">
                  <AlertTriangle size={15} />
                </div>
              </div>
              <p className="kpi-label danger-copy">LOW STOCK ALERTS</p>
              <p className="kpi-value">5</p>
              <button className="inline-link-btn">REORDER NOW</button>
            </article>
          </section>

          <section className="admin-metrics-grid">
            <article className="panel chart-panel">
              <div className="panel-head">
                <div>
                  <h2>Sales Analytics</h2>
                  <p>Weekly performance tracking</p>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <i className="legend-dot current" />
                    Net Sales
                  </span>
                  <span className="legend-item">
                    <i className="legend-dot previous" />
                    Last Week
                  </span>
                </div>
              </div>
              <SalesChart />
            </article>

            <article className="panel products-panel">
              <h2>Top Selling Products</h2>
              <p>Ranked by volume</p>

              <div className="product-list">
                {topSellingProducts.map((item) => (
                  <div key={item.name} className="product-item">
                    <div className="product-line">
                      <span>{item.name}</span>
                      <strong>{item.sold.toLocaleString()} Sold</strong>
                    </div>
                    <div className="product-progress">
                      <span style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <button className="inventory-btn">VIEW DETAILED INVENTORY</button>
            </article>
          </section>

          <section className="live-feed-bar">
            <h3>Recent Live Store Feed</h3>
            <span>LIVE</span>
          </section>
        </main>
      </div>
    </div>
  );
}
