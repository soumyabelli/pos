import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { useAdminData } from "../context/useAdminData";

function badge(status) {
  if (status === "Completed") return "bg-emerald-500/20 text-emerald-300";
  if (status === "Pending") return "bg-amber-500/20 text-amber-300";
  return "bg-rose-500/20 text-rose-300";
}

export default function OrdersPage() {
  const { orders } = useAdminData();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Orders</h1>
        <p className="mt-1 text-base text-slate-300/85">Track omnichannel order processing and current status.</p>
      </section>

      <Card title="Orders Table" subtitle="Mock order data with status badges">
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
