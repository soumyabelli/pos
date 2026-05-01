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

const ORDER_ROWS = Array.from({ length: 26 }).map((_, i) => {
  const statuses = ["Completed", "Pending", "Cancelled"];
  const customers = [
    "Ronald McDonald", "Colonel Sanders", "Wendy Thomas", "Howard Schultz", 
    "John Schnatter", "Glen Bell", "Dan Cathy", "Steve Ells"
  ];
  return {
    id: `#10${234 + i}`,
    customer: customers[i % customers.length],
    initials: customers[i % customers.length].split(" ").map((n) => n[0]).join(""),
    items: (i % 5) + 1,
    date: `Oct ${(i % 31) + 1}, 2023`,
    total: parseFloat((Math.random() * 50 + 10).toFixed(2)),
    status: statuses[i % statuses.length],
  };
});

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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredOrders = useMemo(() => {
    return ORDER_ROWS.filter((row) => {
      const matchesSearch =
        row.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.customer.toLowerCase().includes(searchValue.toLowerCase());
      const matchesTab = activeTab === "All" || row.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [searchValue, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
                  {currentOrders.map((order) => (
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
              <p>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders</p>
              <div className="ord-pagination">
                <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
