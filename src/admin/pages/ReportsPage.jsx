import { useMemo, useState } from "react";
import Card from "../components/Card";
import { useAdminData } from "../context/useAdminData";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PERIOD_OPTIONS = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "sixMonths", label: "6 Months" },
  { id: "year", label: "Year" },
];

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

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

function getRange(period, now, selectedYear) {
  const currentYear = now.getFullYear();

  if (period === "day") {
    return { start: startOfDay(now), end: endOfDay(now), label: `Today (${now.toLocaleDateString("en-IN")})` };
  }

  if (period === "week") {
    const end = endOfDay(now);
    const start = startOfDay(addDays(now, -6));
    return { start, end, label: `${start.toLocaleDateString("en-IN")} - ${end.toLocaleDateString("en-IN")}` };
  }

  if (period === "month") {
    const start = new Date(currentYear, now.getMonth(), 1);
    const end = endOfDay(now);
    return { start, end, label: now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }) };
  }

  if (period === "sixMonths") {
    const start = new Date(currentYear, now.getMonth() - 5, 1);
    const end = endOfDay(now);
    return { start, end, label: `Last 6 Months` };
  }

  const start = new Date(selectedYear, 0, 1);
  const end = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
  return { start, end, label: `Year ${selectedYear}` };
}

function buildChartData(period, ordersInRange, range) {
  if (period === "day") {
    const rows = Array.from({ length: 24 }, (_, hour) => ({ label: `${String(hour).padStart(2, "0")}:00`, revenue: 0, orders: 0 }));
    ordersInRange.forEach((order) => {
      const hour = parseOrderDate(order.date).getHours();
      rows[hour].revenue += Number(order.amount);
      rows[hour].orders += 1;
    });
    return rows;
  }

  if (period === "week" || period === "month") {
    const rows = [];
    const indexByKey = new Map();
    for (let cursor = startOfDay(range.start), i = 0; cursor <= range.end; cursor = addDays(cursor, 1), i += 1) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
      indexByKey.set(key, i);
      rows.push({
        label: cursor.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        revenue: 0,
        orders: 0,
      });
    }

    ordersInRange.forEach((order) => {
      const date = parseOrderDate(order.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const index = indexByKey.get(key);
      if (index !== undefined) {
        rows[index].revenue += Number(order.amount);
        rows[index].orders += 1;
      }
    });

    return rows;
  }

  if (period === "sixMonths") {
    const rows = [];
    const indexByKey = new Map();

    for (let i = 0; i < 6; i += 1) {
      const monthDate = new Date(range.start.getFullYear(), range.start.getMonth() + i, 1);
      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      indexByKey.set(key, i);
      rows.push({
        label: monthDate.toLocaleDateString("en-IN", { month: "short" }),
        revenue: 0,
        orders: 0,
      });
    }

    ordersInRange.forEach((order) => {
      const date = parseOrderDate(order.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const index = indexByKey.get(key);
      if (index !== undefined) {
        rows[index].revenue += Number(order.amount);
        rows[index].orders += 1;
      }
    });

    return rows;
  }

  const rows = Array.from({ length: 12 }, (_, monthIndex) => ({
    label: new Date(range.start.getFullYear(), monthIndex, 1).toLocaleDateString("en-IN", { month: "short" }),
    revenue: 0,
    orders: 0,
  }));

  ordersInRange.forEach((order) => {
    const date = parseOrderDate(order.date);
    rows[date.getMonth()].revenue += Number(order.amount);
    rows[date.getMonth()].orders += 1;
  });

  return rows;
}

export default function ReportsPage() {
  const { orders } = useAdminData();
  const [period, setPeriod] = useState("day");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const now = useMemo(() => new Date(), []);

  const yearOptions = useMemo(() => {
    const set = new Set([now.getFullYear(), ...orders.map((order) => parseOrderDate(order.date).getFullYear())]);
    return [...set].sort((a, b) => b - a);
  }, [orders, now]);

  const range = useMemo(() => getRange(period, now, selectedYear), [period, now, selectedYear]);

  const ordersInRange = useMemo(
    () =>
      orders.filter((order) => {
        const date = parseOrderDate(order.date);
        return date >= range.start && date <= range.end;
      }),
    [orders, range],
  );

  const totalRevenue = ordersInRange.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const avgOrder = totalRevenue / (ordersInRange.length || 1);
  const chartData = useMemo(() => buildChartData(period, ordersInRange, range), [period, ordersInRange, range]);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Reports</h1>
          <p className="mt-1 text-base text-[#8B6F47]">Sales and revenue trend overview with summary metrics.</p>
          <p className="mt-1 text-xs font-medium text-[#8B6F47]">{range.label}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e7d5c3] bg-white p-2 shadow-sm">
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

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#8B6F47]">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2723]">Rs {formatMoney(totalRevenue)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#8B6F47]">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2723]">{ordersInRange.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#8B6F47]">Avg Order Value</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2723]">Rs {avgOrder.toFixed(2)}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card title="Sales Report" subtitle={`Revenue trend for ${range.label}`}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="#eadccf" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`Rs ${Number(value).toFixed(2)}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue Trends" subtitle={`Orders trend for ${range.label}`}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#eadccf" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [value, "Orders"]} />
                <Line type="monotone" dataKey="orders" stroke="#a78bfa" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  );
}
