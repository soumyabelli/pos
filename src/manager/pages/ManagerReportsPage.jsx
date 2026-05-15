import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AlertTriangle, Download, Printer, AlertOctagon, PlusCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ManagerReportsPage() {
  const [outOfStock, setOutOfStock] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = useMemo(() => getAuthHeaders(), []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/admin/all`, { headers });
        const products = Array.isArray(res.data) ? res.data : [];
        
        // Split into "Out of Stock" (0 items) and "Low Stock" (1-15 items)
        const outStock = products.filter(p => Number(p.stock) === 0);
        const lowStock = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 15);
        
        setOutOfStock(outStock);
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [headers]);

  const handleRestockRequest = (productName) => {
    alert(`Restock request sent to Admin for: ${productName}`);
  };

  const handleExport = () => {
    alert("Downloading Inventory Report as CSV...");
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-[#3E2723]">Inventory Reports</h1>
          <p className="mt-1 text-sm text-[#8B6F47]">Monitor critical stock levels and trigger restock requests.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 rounded-xl border border-[#D4853D] bg-white px-4 py-2 text-sm font-semibold text-[#D4853D] transition hover:bg-[#f8eee3]">
            <Printer size={16} /> Print
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 transition hover:opacity-90">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </section>

      {/* Out of Stock Section */}
      <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-rose-100 text-rose-700">
              <AlertOctagon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3E2723]">Critical: Out of Stock</h2>
              <p className="text-xs text-slate-500">Items that are completely depleted (0 units)</p>
            </div>
          </div>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">{outOfStock.length} Items</span>
        </div>
        
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading reports...</p>
          ) : outOfStock.length === 0 ? (
            <p className="text-sm font-medium text-emerald-600">Excellent! No items are currently out of stock.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fff9f9] text-xs uppercase tracking-wider text-rose-800">
                  <tr>
                    <th className="p-3 font-semibold">SKU</th>
                    <th className="p-3 font-semibold">Product Name</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {outOfStock.map(product => (
                    <tr key={product._id} className="bg-white transition hover:bg-rose-50/50">
                      <td className="whitespace-nowrap p-3 text-xs text-slate-500">{product.sku}</td>
                      <td className="p-3 font-bold text-rose-700">{product.product || product.name}</td>
                      <td className="whitespace-nowrap p-3 text-slate-600">{product.category}</td>
                      <td className="whitespace-nowrap p-3 text-right">
                        <button onClick={() => handleRestockRequest(product.product || product.name)} className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200">
                          <PlusCircle size={14} /> Request Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Section */}
      <div className="rounded-2xl border border-[#e7d5c3] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e7d5c3] pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-amber-100 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3E2723]">Low Stock Warning</h2>
              <p className="text-xs text-slate-500">Items with 15 or fewer units remaining</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{lowStockProducts.length} Items</span>
        </div>
        
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading reports...</p>
          ) : lowStockProducts.length === 0 ? (
            <p className="text-sm font-medium text-emerald-600">All other items are sufficiently stocked.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8eee3] text-xs uppercase tracking-wider text-[#8B6F47]">
                  <tr>
                    <th className="p-3 font-semibold">SKU</th>
                    <th className="p-3 font-semibold">Product Name</th>
                    <th className="p-3 font-semibold">Stock Left</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7d5c3]">
                  {lowStockProducts.map(product => (
                    <tr key={product._id} className="transition hover:bg-[#fff9f2]">
                      <td className="whitespace-nowrap p-3 text-xs text-slate-500">{product.sku}</td>
                      <td className="p-3 font-medium text-[#3E2723]">{product.product || product.name}</td>
                      <td className="whitespace-nowrap p-3">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                          {product.stock} units
                        </span>
                      </td>
                      <td className="whitespace-nowrap p-3 text-right">
                        <button onClick={() => handleRestockRequest(product.product || product.name)} className="inline-flex items-center gap-1 rounded-lg border border-[#D4853D] px-3 py-1.5 text-xs font-semibold text-[#D4853D] transition hover:bg-[#f8eee3]">
                           Order More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
