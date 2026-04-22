import Card from "../components/Card";
import DataTable from "../components/DataTable";
import { useAdminData } from "../context/useAdminData";

function stockStatus(stock) {
  if (stock === 0) return { label: "Out of Stock", className: "bg-rose-500/20 text-rose-300" };
  if (stock <= 10) return { label: "Low Stock", className: "bg-amber-500/20 text-amber-300" };
  return { label: "In Stock", className: "bg-emerald-500/20 text-emerald-300" };
}

export default function InventoryPage() {
  const { products } = useAdminData();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Inventory</h1>
        <p className="mt-1 text-base text-slate-300/85">Monitor stock thresholds and availability across catalog.</p>
      </section>

      <Card title="Inventory Levels" subtitle="Auto status based on stock rules">
        <DataTable
          rowKey="id"
          data={products}
          columns={[
            { key: "name", header: "Product Name" },
            { key: "stock", header: "Stock" },
            { key: "threshold", header: "Threshold" },
            {
              key: "status",
              header: "Status",
              render: (row) => {
                const status = stockStatus(Number(row.stock));
                return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}>{status.label}</span>;
              },
            },
          ]}
        />
      </Card>
    </div>
  );
}
