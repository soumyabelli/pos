import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, ArrowRightLeft, EllipsisVertical, SlidersHorizontal } from "lucide-react";
import { useAdminData } from "../context/useAdminData";

function stockStatus(stock, threshold) {
  if (stock === 0) return { label: "OUT OF STOCK", className: "bg-rose-100 text-rose-700 border-rose-200" };
  if (stock <= threshold) return { label: "CRITICAL LOW", className: "bg-rose-100 text-rose-700 border-rose-200" };
  if (stock <= threshold + 6) return { label: "REORDER SOON", className: "bg-amber-100 text-amber-700 border-amber-200" };
  return { label: "OPTIMAL", className: "bg-emerald-100 text-emerald-700 border-emerald-200" };
}

const STORE_LOCATIONS = [
  { line1: "Main Street", line2: "Flagship" },
  { line1: "Uptown", line2: "Concept Store" },
  { line1: "Warehouse A", line2: "Zone 2" },
  { line1: "Market Square", line2: "Express" },
];

const FILTERS = [
  { id: "all", label: "All Items" },
  { id: "low", label: "Low Stock" },
  { id: "out", label: "Out of Stock" },
  { id: "category", label: "By Category" },
];

function matchesFilter(product, filterId) {
  if (filterId === "low") return product.stock > 0 && product.stock <= product.threshold + 6;
  if (filterId === "out") return product.stock === 0;
  if (filterId === "category") return product.category === "Snacks";
  return true;
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function InventoryPage() {
  const { products } = useAdminData();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(
    () => products.filter((product) => matchesFilter(product, activeFilter)),
    [products, activeFilter],
  );

  const criticalCount = products.filter((item) => item.stock <= item.threshold).length;
  const lowStockList = products
    .filter((item) => item.stock <= item.threshold + 6)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 4);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="rounded-3xl border border-[#e7d5c3] bg-white p-5 shadow-[0_14px_30px_rgba(76,54,36,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#3E2723]">Inventory Management</h1>
              <p className="mt-1 text-sm text-[#8B6F47]">Manage stock levels and distribution across flagship locations.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dcc9b5] bg-[#fff8f1] px-3 text-sm font-semibold text-[#6F4E37] hover:bg-[#f7ecde]">
                <ArrowRightLeft size={14} />
                Transfer Stock
              </button>
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-3 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 hover:brightness-110">
                <SlidersHorizontal size={14} />
                Adjust Inventory
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#6F4E37] text-white shadow-sm"
                      : "border border-[#e6d3bf] bg-[#fdf7ef] text-[#8B6F47] hover:bg-[#f6ecdf]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#eadccf] bg-white">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#faf3eb]">
                <tr>
                  <th className="px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#8B6F47]">Product</th>
                  <th className="px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#8B6F47]">Store Location</th>
                  <th className="px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#8B6F47]">Stock Level</th>
                  <th className="px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#8B6F47]">Status</th>
                  <th className="px-4 py-3 text-right text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#8B6F47]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const status = stockStatus(product.stock, product.threshold);
                  const store = STORE_LOCATIONS[index % STORE_LOCATIONS.length];

                  return (
                    <tr key={product.id} className="border-t border-[#f1e4d8] transition hover:bg-[#fff9f2]">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4853D] to-[#6F4E37] text-xs font-bold text-white">
                            {initials(product.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#3E2723]">{product.name}</p>
                            <p className="text-xs text-[#8B6F47]">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-[#3E2723]">{store.line1}</p>
                        <p className="text-xs text-[#8B6F47]">{store.line2}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-[#3E2723]">
                        {product.stock} <span className="text-xs font-medium text-[#8B6F47]">units</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.65rem] font-bold tracking-wide ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button type="button" className="rounded-lg p-1.5 text-[#8B6F47] hover:bg-[#f6ebdd]">
                          <EllipsisVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f1e4d8] px-4 py-3">
              <p className="text-xs font-medium text-[#8B6F47]">Showing {filteredProducts.length} of {products.length} products</p>
              <div className="flex items-center gap-2 text-xs">
                <button type="button" className="h-7 rounded-lg border border-[#e7d5c3] bg-white px-2 text-[#8B6F47] hover:bg-[#faf3eb]">{"<"}</button>
                <button type="button" className="h-7 min-w-7 rounded-lg bg-[#6F4E37] px-2 font-semibold text-white">1</button>
                <button type="button" className="h-7 min-w-7 rounded-lg border border-[#e7d5c3] bg-white px-2 text-[#8B6F47] hover:bg-[#faf3eb]">2</button>
                <button type="button" className="h-7 min-w-7 rounded-lg border border-[#e7d5c3] bg-white px-2 text-[#8B6F47] hover:bg-[#faf3eb]">3</button>
                <button type="button" className="h-7 rounded-lg border border-[#e7d5c3] bg-white px-2 text-[#8B6F47] hover:bg-[#faf3eb]">{">"}</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <section className="rounded-3xl border border-[#b63737] bg-gradient-to-br from-[#cd3f3f] to-[#9f2525] p-4 text-white shadow-lg shadow-[#9f2525]/35">
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-white/90">Critical Alerts</p>
            <p className="mt-2 text-4xl font-bold leading-none">{criticalCount}</p>
            <p className="mt-1 text-xs text-white/90">items require immediate restocking attention.</p>
          </section>

          <section className="rounded-3xl border border-[#e7d5c3] bg-white p-4 shadow-[0_14px_30px_rgba(76,54,36,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#3E2723]">Low Stock Alerts</h2>
              <button type="button" className="text-xs font-semibold uppercase tracking-wide text-[#8B6F47] hover:text-[#6F4E37]">View All</button>
            </div>
            <div className="space-y-2.5">
              {lowStockList.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#eddccc] bg-[#fffaf4] p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#D4853D]" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-[#3E2723]">{item.name}</p>
                      <p className="mt-0.5 text-xs text-[#8B6F47]">{item.stock} units left</p>
                    </div>
                  </div>
                  <button type="button" className="mt-2 inline-flex items-center gap-1 text-[0.66rem] font-bold uppercase tracking-wide text-[#6F4E37] hover:text-[#3E2723]">
                    Reorder Now <ArrowRight size={12} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
