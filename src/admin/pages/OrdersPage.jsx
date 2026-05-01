import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { useAdminData } from "../context/useAdminData";

function badge(status) {
  if (status === "Completed") return "bg-emerald-100 text-emerald-700";
  if (status === "Pending") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

export default function OrdersPage() {
  const { orders, error } = useAdminData();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Orders</h1>
        <p className="mt-1 text-base text-[#8B6F47]">Track omnichannel order processing and current status.</p>
      </section>

      <Card title="Orders Table" subtitle="Live order data with status badges">
        {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <DataTable
          rowKey="id"
          data={orders}
          columns={[
            { key: "id", header: "Order ID" },
            { key: "customer", header: "Customer" },
            { key: "amount", header: "Amount", render: (row) => `Rs ${row.amount.toFixed(2)}` },
            {
              key: "status",
              header: "Status",
              render: (row) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge(row.status)}`}>{row.status}</span>,
            },
            { key: "date", header: "Date" },
          ]}
        />
      </Card>
    </div>
  );
}
