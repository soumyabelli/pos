import Card from "../components/Card";
import { useAdminData } from "../context/useAdminData";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ReportsPage() {
  const { salesOverview, orders } = useAdminData();
  const totalRevenue = orders.reduce((sum, item) => sum + item.amount, 0);
  const avgOrder = totalRevenue / (orders.length || 1);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Reports</h1>
        <p className="mt-1 text-base text-[#8B6F47]">Sales and revenue trend overview with summary metrics.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#8B6F47]">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2723]">Rs {totalRevenue.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#8B6F47]">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2723]">{orders.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#8B6F47]">Avg Order Value</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2723]">Rs {avgOrder.toFixed(2)}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card title="Sales Report" subtitle="Monthly online sales">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesOverview}>
                <CartesianGrid stroke="#eadccf" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="online" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue Trends" subtitle="Store channel trendline">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesOverview}>
                <CartesianGrid stroke="#eadccf" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8B6F47", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="store" stroke="#a78bfa" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  );
}
