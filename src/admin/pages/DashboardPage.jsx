import { useMemo, useState } from "react";
import { DollarSign, Package, ShoppingCart, TriangleAlert } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { useAdminData } from "../context/useAdminData";

const iconByType = {
  orders: ShoppingCart,
  revenue: DollarSign,
  products: Package,
  danger: TriangleAlert,
};

const PERIOD_OPTIONS = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "sixMonths", label: "6 Months" },
  { id: "year", label: "Year" },
];

const REPORT_OPTIONS = [
  { id: "overall", label: "Overall" },
  { id: "orders", label: "Orders" },
  { id: "sales", label: "Sales" },
];

function statusClass(status) {
  if (status === "Completed") return "bg-emerald-100 text-emerald-700";
  if (status === "Pending") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function parseOrderDate(input) {
  const [datePart, timePart = "00:00"] = input.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour || 0, minute || 0, 0, 0);
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

function getRange(period, now, selectedYear) {
  const currentYear = now.getFullYear();

  if (period === "day") {
    const start = startOfDay(now);
    const end = endOfDay(now);
    return {
      start,
      end,
      label: `Today (${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })})`,
    };
  }

  if (period === "week") {
    const end = endOfDay(now);
    const start = startOfDay(addDays(now, -6));
    return {
      start,
      end,
      label: `${start.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`,
    };
  }

  if (period === "month") {
    const start = new Date(currentYear, now.getMonth(), 1);
    const end = endOfDay(now);
    return {
      start,
      end,
      label: now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    };
  }

  if (period === "sixMonths") {
    const start = new Date(currentYear, now.getMonth() - 5, 1);
    const end = endOfDay(now);
    return {
      start,
      end,
      label: `Last 6 Months (till ${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })})`,
    };
  }

  const start = new Date(selectedYear, 0, 1);
  const end = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
  return {
    start,
    end,
    label: `Year ${selectedYear}`,
  };
}

function buildChartData(period, filteredOrders, range) {
  if (period === "day") {
    const rows = Array.from({ length: 24 }, (_, hour) => ({
      label: `${String(hour).padStart(2, "0")}:00`,
      orders: 0,
      revenue: 0,
    }));

    filteredOrders.forEach((order) => {
      const date = parseOrderDate(order.date);
      const hour = date.getHours();
      rows[hour].orders += 1;
      rows[hour].revenue += order.amount;
    });

    return rows;
  }

  if (period === "week" || period === "month") {
    const rows = [];
    const indexByDateKey = new Map();

    for (let cursor = startOfDay(range.start), i = 0; cursor <= range.end; cursor = addDays(cursor, 1), i += 1) {
      const key = toDateKey(cursor);
      indexByDateKey.set(key, i);
      rows.push({
        label: cursor.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        orders: 0,
        revenue: 0,
      });
    }

    filteredOrders.forEach((order) => {
      const date = parseOrderDate(order.date);
      const key = toDateKey(date);
      const index = indexByDateKey.get(key);
      if (index !== undefined) {
        rows[index].orders += 1;
        rows[index].revenue += order.amount;
      }
    });

    return rows;
  }

  if (period === "sixMonths") {
    const rows = [];
    const indexByMonth = new Map();

    for (let i = 0; i < 6; i += 1) {
      const monthDate = new Date(range.start.getFullYear(), range.start.getMonth() + i, 1);
      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      indexByMonth.set(key, i);
      rows.push({
        label: monthDate.toLocaleDateString("en-IN", { month: "short" }),
        orders: 0,
        revenue: 0,
      });
    }

    filteredOrders.forEach((order) => {
      const date = parseOrderDate(order.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const index = indexByMonth.get(key);
      if (index !== undefined) {
        rows[index].orders += 1;
        rows[index].revenue += order.amount;
      }
    });

    return rows;
  }

  const rows = Array.from({ length: 12 }, (_, monthIndex) => ({
    label: new Date(range.start.getFullYear(), monthIndex, 1).toLocaleDateString("en-IN", { month: "short" }),
    orders: 0,
    revenue: 0,
  }));

  filteredOrders.forEach((order) => {
    const date = parseOrderDate(order.date);
    const monthIndex = date.getMonth();
    rows[monthIndex].orders += 1;
    rows[monthIndex].revenue += order.amount;
  });

  return rows;
}

export default function DashboardPage() {
  const { orders, products } = useAdminData();
  const [period, setPeriod] = useState("day");
  const [reportType, setReportType] = useState("overall");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const now = useMemo(() => new Date(), []);
  const yearOptions = useMemo(() => {
    const set = new Set([now.getFullYear(), ...orders.map((order) => parseOrderDate(order.date).getFullYear())]);
    return [...set].sort((a, b) => b - a);
  }, [orders, now]);

  const range = useMemo(() => getRange(period, now, selectedYear), [period, now, selectedYear]);

  const ordersInRange = useMemo(() => {
    return orders
      .filter((order) => {
        const date = parseOrderDate(order.date);
        return date >= range.start && date <= range.end;
      })
      .sort((a, b) => parseOrderDate(b.date) - parseOrderDate(a.date));
  }, [orders, range]);

  const revenueInRange = useMemo(
    () => ordersInRange.reduce((sum, order) => sum + Number(order.amount || 0), 0),
    [ordersInRange],
  );

  const lowStockCount = useMemo(
    () => products.filter((item) => Number(item.stock) <= Number(item.threshold)).length,
    [products],
  );

  const dashboardStats = useMemo(
    () => [
      { label: "Total Orders", value: ordersInRange.length.toLocaleString(), footnote: range.label, type: "orders" },
      { label: "Revenue", value: `Rs ${formatMoney(revenueInRange)}`, footnote: range.label, type: "revenue" },
      { label: "Total Products", value: products.length.toLocaleString(), footnote: "Active catalog", type: "products" },
      { label: "Low Stock Alerts", value: lowStockCount.toLocaleString(), footnote: "Needs action", type: "danger" },
    ],
    [ordersInRange.length, revenueInRange, products.length, lowStockCount, range.label],
  );

  const recentOrders = useMemo(() => ordersInRange.slice(0, 5), [ordersInRange]);
  const topSelling = [...products].sort((a, b) => b.stock - a.stock).slice(0, 4);

  const chartData = useMemo(() => buildChartData(period, ordersInRange, range), [period, ordersInRange, range]);

  const chartTitle = reportType === "orders" ? "Order History" : reportType === "sales" ? "Sales History" : "Orders & Revenue";
  const chartSubtitle =
    reportType === "orders"
      ? `Order count trend for ${range.label}`
      : reportType === "sales"
        ? `Revenue trend for ${range.label}`
        : `Orders and revenue trend for ${range.label}`;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Admin Dashboard</h1>
          <p className="mt-1 text-base text-[#8B6F47]">
            Here&apos;s what&apos;s happening {period === "day" ? "today" : `for ${range.label}`}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e7d5c3] bg-white p-2 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">
            Report
            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              className="ml-2 h-9 rounded-lg border border-[#e7d5c3] bg-[#fff9f2] px-2.5 text-sm font-semibold text-[#3E2723] outline-none focus:border-[#D4853D]"
            >
              {REPORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">
            Period
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="ml-2 h-9 rounded-lg border border-[#e7d5c3] bg-[#fff9f2] px-2.5 text-sm font-semibold text-[#3E2723] outline-none focus:border-[#D4853D]"
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {period === "year" && (
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">
              Year
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="ml-2 h-9 rounded-lg border border-[#e7d5c3] bg-[#fff9f2] px-2.5 text-sm font-semibold text-[#3E2723] outline-none focus:border-[#D4853D]"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => {
          const Icon = iconByType[item.type] || ShoppingCart;
          return (
            <Card key={item.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">{item.label}</p>
                  <h3 className="mt-2 text-3xl font-semibold text-[#3E2723]">{item.value}</h3>
                  <p className="mt-1 text-xs text-[#8B6F47]">{item.footnote}</p>
                </div>
                <span className="rounded-xl bg-[#f8eee3] p-2 text-[#6F4E37]">
                  <Icon size={16} />
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card title={chartTitle} subtitle={chartSubtitle} className="xl:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordersArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eadccf" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                {(reportType === "sales" || reportType === "overall") && (
                  <YAxis
                    yAxisId="revenue"
                    tick={{ fill: "#8B6F47", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `Rs ${formatMoney(value)}`}
                  />
                )}
                {(reportType === "orders" || reportType === "overall") && (
                  <YAxis
                    yAxisId="orders"
                    orientation={reportType === "overall" ? "right" : "left"}
                    tick={{ fill: "#8B6F47", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                )}
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") return [`Rs ${Number(value).toFixed(2)}`, "Revenue"];
                    return [value, "Orders"];
                  }}
                />
                {(reportType === "sales" || reportType === "overall") && (
                  <Area type="monotone" yAxisId="revenue" dataKey="revenue" stroke="#60a5fa" fillOpacity={1} fill="url(#revenueArea)" />
                )}
                {(reportType === "orders" || reportType === "overall") && (
                  <Area type="monotone" yAxisId="orders" dataKey="orders" stroke="#a78bfa" fillOpacity={1} fill="url(#ordersArea)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Orders" subtitle={`Latest transactions for ${range.label}`}>
          <div className="space-y-2">
            {recentOrders.length === 0 && (
              <div className="rounded-2xl border border-[#eadccf] bg-[#fff9f2] p-3 text-sm text-[#8B6F47]">
                No orders found for this selection.
              </div>
            )}
            {recentOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-[#eadccf] bg-[#fff9f2] p-3">
                <p className="text-sm font-semibold text-[#3E2723]">{order.id}</p>
                <p className="text-xs text-[#8B6F47]">{order.customer}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#3E2723]">Rs {order.amount.toFixed(2)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#8B6F47]">{parseOrderDate(order.date).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card title="Top Products Snapshot" subtitle="Current stock leaders">
        <DataTable
          rowKey="id"
          data={topSelling}
          columns={[
            { key: "name", header: "Name" },
            { key: "category", header: "Category" },
            { key: "price", header: "Price", render: (row) => `Rs ${Number(row.price).toFixed(2)}` },
            { key: "stock", header: "Stock" },
          ]}
        />
      </Card>
    </div>
  );
}
