import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Download,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const ORDER_ROWS = [
  { id: "#10234", customer: "Jane Doe", initials: "JD", items: 3, date: "Oct 12, 2023", total: 156.0, status: "Completed" },
  { id: "#10235", customer: "Mark Smith", initials: "MS", items: 1, date: "Oct 12, 2023", total: 42.5, status: "Pending" },
  { id: "#10236", customer: "Ana Lopez", initials: "AL", items: 5, date: "Oct 11, 2023", total: 892.1, status: "Cancelled" },
  { id: "#10237", customer: "Robert White", initials: "RW", items: 2, date: "Oct 11, 2023", total: 210.0, status: "Completed" },
  { id: "#10238", customer: "Kelly Miller", initials: "KM", items: 12, date: "Oct 10, 2023", total: 1420.5, status: "Completed" },
];

const STATUS_TABS = ["All", "Pending", "Completed", "Cancelled"];

function getDisplayName() {
  const token = localStorage.getItem("token");
  if (!token) return "Soumya";

  try {
    const payload = token.split(".")[1];
    if (!payload) return "Soumya";
    const decoded = JSON.parse(atob(payload));
    return decoded?.name || "Soumya";
  } catch {
    return "Soumya";
  }
}

export default function OrderManagement() {
  const displayName = getDisplayName();
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = useMemo(() => {
    return ORDER_ROWS.filter((row) => {
      const matchesSearch =
        row.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.customer.toLowerCase().includes(searchValue.toLowerCase());
      const matchesTab = activeTab === "All" || row.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [searchValue, activeTab]);

  const completedCount = ORDER_ROWS.filter((item) => item.status === "Completed").length;
  const pendingCount = ORDER_ROWS.filter((item) => item.status === "Pending").length;
  const dailyRevenue = ORDER_ROWS.reduce((sum, item) => sum + item.total, 0);
  const avgValue = dailyRevenue / ORDER_ROWS.length;

  return (
    <div className="admin-layout ord-layout">
      <Sidebar />

      <div className="admin-main ord-main">
        <header className="admin-topbar ord-topbar">
          <label className="admin-searchbar" htmlFor="orders-search">
            {(!searchValue || searchValue.length === 0) && <Search size={16} />}
            <input
              id="orders-search"
              type="text"
              placeholder="Search orders, customers, or IDs..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              style={{ paddingLeft: searchValue ? '1rem' : undefined }}
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
                <span>STORE MANAGER</span>
              </div>
              <img
                src="https://i.pravatar.cc/48?img=12"
                alt="Manager avatar"
                className="admin-avatar"
              />
            </div>
          </div>
        </header>

        <main className="ord-content">
          <section className="ord-header">
            <div>
              <span>MANAGEMENT</span>
              <h1>Order Management</h1>
            </div>

            <div className="ord-header-actions">
              <button type="button" className="ord-btn soft">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button type="button" className="ord-btn primary">
                <Plus size={14} />
                <span>Manual Entry</span>
              </button>
            </div>
          </section>

          <section className="ord-kpis">
            <article className="ord-kpi-card">
              <p>DAILY REVENUE</p>
              <h2>₹{dailyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <small>+14%</small>
            </article>
            <article className="ord-kpi-card">
              <p>OPEN ORDERS</p>
              <h2>{pendingCount}</h2>
              <small>{pendingCount} orders need attention</small>
            </article>
            <article className="ord-kpi-card">
              <p>AVG ORDER VALUE</p>
              <h2>₹{avgValue.toFixed(2)}</h2>
              <small>+₹12.00 from last month</small>
            </article>
            <article className="ord-kpi-card">
              <p>COMPLETION RATE</p>
              <h2>{Math.round((completedCount / ORDER_ROWS.length) * 100)}%</h2>
              <small>+0.5%</small>
            </article>
          </section>

          <section className="ord-panel">
            <div className="ord-panel-head">
              <div className="ord-panel-title">
                <h3>Recent Orders</h3>
                <div className="ord-tabs">
                  {STATUS_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={activeTab === tab ? "active" : ""}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" className="ord-date-btn">
                <CalendarDays size={14} />
                <span>Oct 1, 2023 - Oct 31, 2023</span>
              </button>
            </div>

            <div className="ord-table-wrap">
              <table className="ord-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>ITEMS</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="ord-id">{order.id}</td>
                      <td>
                        <div className="ord-customer">
                          <span>{order.initials}</span>
                          <strong>{order.customer}</strong>
                        </div>
                      </td>
                      <td>{order.items} Items</td>
                      <td>{order.date}</td>
                      <td className="ord-total">₹{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span className={`ord-status ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="ord-footer">
              <p>Showing 1-{filteredOrders.length} of 1,240 orders</p>
              <div className="ord-pagination">
                <button type="button" className="active">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
