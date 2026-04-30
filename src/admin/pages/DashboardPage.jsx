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

function statusClass(status) {
  if (status === "Completed") return "bg-emerald-100 text-emerald-700";
  if (status === "Pending") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

export default function DashboardPage() {
  const { dashboardStats, salesOverview, orders, products } = useAdminData();
  const recentOrders = orders.slice(0, 5);
  const topSelling = [...products].sort((a, b) => b.stock - a.stock).slice(0, 4);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Admin Dashboard</h1>
        <p className="mt-1 text-base text-[#8B6F47]">Here&apos;s what&apos;s happening with your store today.</p>
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
        <Card title="Sales Overview" subtitle="Online vs Store Sales" className="xl:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesOverview}>
                <defs>
                  <linearGradient id="onlineSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="storeSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eadccf" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="online" stroke="#60a5fa" fillOpacity={1} fill="url(#onlineSales)" />
                <Area type="monotone" dataKey="store" stroke="#a78bfa" fillOpacity={1} fill="url(#storeSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Orders" subtitle="Latest transactions">
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-[#eadccf] bg-[#fff9f2] p-3">
                <p className="text-sm font-semibold text-[#3E2723]">{order.id}</p>
                <p className="text-xs text-[#8B6F47]">{order.customer}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#3E2723]">Rs {order.amount.toFixed(2)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span>
                </div>
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
