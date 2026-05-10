import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function ManagerInventoryPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/products/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((p) => {
      const name = String(p.product || p.name || "").toLowerCase();
      const sku = String(p.sku || "").toLowerCase();
      const category = String(p.category || "").toLowerCase();
      return name.includes(needle) || sku.includes(needle) || category.includes(needle);
    });
  }, [products, query]);

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Inventory</h1>
          <p className="mt-1 text-base text-[#8B6F47]">Track stock levels and product availability.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProducts}
            className="rounded-2xl border border-[#e7d5c3] bg-white px-4 py-2.5 text-sm font-semibold text-[#3E2723] shadow-sm hover:bg-[#fffaf4]"
          >
            Refresh
          </button>
        </div>
      </section>

      <div className="rounded-2xl border border-[#e7d5c3] bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#e7d5c3] bg-[#fffaf4] p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-medium text-[#3E2723]">Products</h2>
          <div className="w-full sm:max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU, category…"
              className="h-11 w-full rounded-full border border-[#D9C4B3] bg-white px-4 text-sm text-[#3E2723] placeholder:text-[#8B6F47] outline-none transition focus:border-[#D4853D] focus:ring-2 focus:ring-[#D4853D]/20"
            />
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#3E2723]">
            <thead className="bg-[#f8eee3] text-xs uppercase tracking-wider text-[#8B6F47]">
              <tr>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7d5c3]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8B6F47]">
                    Loading inventory…
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-[#fff9f2] transition">
                    <td className="p-4 font-medium">{p.product || p.name}</td>
                    <td className="p-4">{p.sku || "—"}</td>
                    <td className="p-4">{p.category || "—"}</td>
                    <td className="p-4">{typeof p.price === "number" ? `₹${p.price.toFixed(2)}` : "—"}</td>
                    <td className="p-4">{typeof p.stock === "number" ? p.stock : "—"}</td>
                    <td className="p-4">
                      <span
                        className={
                          p.isActive
                            ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                        }
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8B6F47]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
