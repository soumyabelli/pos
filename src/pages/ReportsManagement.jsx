import { Bell, Download, Search, Settings, TrendingUp } from "lucide-react";
import Sidebar from "../components/Sidebar";

const monthlySales = [
  { month: "Jan", amount: 32 },
  { month: "Feb", amount: 40 },
  { month: "Mar", amount: 28 },
  { month: "Apr", amount: 56 },
  { month: "May", amount: 62 },
  { month: "Jun", amount: 48 },
  { month: "Jul", amount: 71 },
];

const storePerformance = [
  { name: "Central Flagship", revenue: 124500, orders: 1240, growth: "+8.2%" },
  { name: "Westside Boutique", revenue: 86220, orders: 870, growth: "+6.4%" },
  { name: "Downtown Express", revenue: 64580, orders: 622, growth: "+4.1%" },
];

function getDisplayName() {
  const token = localStorage.getItem("token");
  if (!token) return "Alex Rivera";

  try {
    const payload = token.split(".")[1];
    if (!payload) return "Alex Rivera";
    const decoded = JSON.parse(atob(payload));
    return decoded?.name || "Alex Rivera";
  } catch {
    return "Alex Rivera";
  }
}

export default function ReportsManagement() {
  const displayName = getDisplayName();

  return (
    <div className="admin-layout rpt-layout">
      <Sidebar />

      <div className="admin-main rpt-main">
        <header className="admin-topbar rpt-topbar">
          <label className="admin-searchbar" htmlFor="reports-search">
            <Search size={16} />
            <input id="reports-search" type="text" placeholder="Search reports, stores, metrics..." />
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
                <span>STORE MANAGER</span>
              </div>
              <img
                src="https://i.pravatar.cc/48?img=11"
                alt="Manager avatar"
                className="admin-avatar"
              />
            </div>
          </div>
        </header>

        <main className="rpt-content">
          <section className="rpt-header">
            <div>
              <h1>Reports & Analytics</h1>
              <p>Track performance, revenue patterns, and store efficiency across your network.</p>
            </div>
            <button type="button" className="rpt-export-btn">
              <Download size={14} />
              <span>Export Report</span>
            </button>
          </section>

          <section className="rpt-kpis">
            <article className="rpt-kpi-card">
              <p>NET REVENUE</p>
              <h2>$275,300</h2>
              <small>+9.4% vs last month</small>
            </article>
            <article className="rpt-kpi-card">
              <p>TOTAL ORDERS</p>
              <h2>2,732</h2>
              <small>+5.2% growth</small>
            </article>
            <article className="rpt-kpi-card">
              <p>AVG ORDER VALUE</p>
              <h2>$100.77</h2>
              <small>Stable performance</small>
            </article>
            <article className="rpt-kpi-card">
              <p>RETURN RATE</p>
              <h2>2.1%</h2>
              <small>-0.3% improvement</small>
            </article>
          </section>

          <section className="rpt-grid">
            <article className="rpt-panel chart">
              <div className="rpt-panel-head">
                <div>
                  <h3>Revenue Trend</h3>
                  <p>Monthly performance</p>
                </div>
                <span>
                  <TrendingUp size={14} />
                  +12.4%
                </span>
              </div>

              <div className="rpt-bars">
                {monthlySales.map((item) => (
                  <div key={item.month} className="rpt-bar-item">
                    <div className="rpt-bar-track">
                      <span style={{ height: `${item.amount}%` }} />
                    </div>
                    <small>{item.month}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="rpt-panel split">
              <h3>Sales Breakdown</h3>
              <p>Share by category</p>

              <div className="rpt-breakdown-list">
                <div>
                  <span>Footwear</span>
                  <strong>38%</strong>
                </div>
                <div>
                  <span>Apparel</span>
                  <strong>29%</strong>
                </div>
                <div>
                  <span>Accessories</span>
                  <strong>21%</strong>
                </div>
                <div>
                  <span>Other</span>
                  <strong>12%</strong>
                </div>
              </div>
            </article>
          </section>

          <section className="rpt-panel rpt-table-panel">
            <div className="rpt-panel-head">
              <div>
                <h3>Store Performance</h3>
                <p>Comparative branch output</p>
              </div>
            </div>

            <div className="rpt-table-wrap">
              <table className="rpt-table">
                <thead>
                  <tr>
                    <th>STORE</th>
                    <th>REVENUE</th>
                    <th>ORDERS</th>
                    <th>GROWTH</th>
                  </tr>
                </thead>
                <tbody>
                  {storePerformance.map((store) => (
                    <tr key={store.name}>
                      <td>{store.name}</td>
                      <td>${store.revenue.toLocaleString()}</td>
                      <td>{store.orders.toLocaleString()}</td>
                      <td className="up">{store.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
