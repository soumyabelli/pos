import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function formatMoney(value) {
  const amount = Number(value || 0);
  if (Number.isNaN(amount)) return "—";
  return `₹${amount.toFixed(2)}`;
}

export default function ManagerBillingPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setOrders(list.slice(0, 50));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load billings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter((o) => {
      const orderId = String(o.orderId || "").toLowerCase();
      const customer = String(o.customerName || "").toLowerCase();
      const phone = String(o.customerPhone || "").toLowerCase();
      const store = String(o.store || "").toLowerCase();
      return (
        orderId.includes(needle) ||
        customer.includes(needle) ||
        phone.includes(needle) ||
        store.includes(needle)
      );
    });
  }, [orders, query]);

  const addRandomBilling = async () => {
    setCreating(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      const productsRes = await axios.get(`${API_BASE_URL}/api/products/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const products = Array.isArray(productsRes.data) ? productsRes.data : [];
      const activeProducts = products.filter((p) => p?.isActive && (p.stock || 0) > 0);
      if (activeProducts.length === 0) {
        setError("No active products with stock available.");
        return;
      }

      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const itemsCount = Math.min(3, Math.max(1, Math.floor(Math.random() * 3) + 1));

      const items = Array.from({ length: itemsCount }).map(() => {
        const p = pick(activeProducts);
        const qty = Math.min(p.stock || 1, Math.floor(Math.random() * 2) + 1);
        const price = Number(p.price || 0);
        return {
          product: p._id,
          sku: p.sku,
          productName: p.product,
          qty,
          price,
          total: qty * price,
        };
      });

      const subtotal = items.reduce((sum, it) => sum + Number(it.total || 0), 0);
      const tax = Math.round(subtotal * 0.05 * 100) / 100;

      const firstNames = ["Aarav", "Vivaan", "Aditya", "Ishaan", "Diya", "Ananya", "Kiara", "Meera"];
      const lastNames = ["Sharma", "Patel", "Singh", "Iyer", "Nair", "Gupta", "Khan", "Reddy"];
      const customerName = `${pick(firstNames)} ${pick(lastNames)}`;
      const customerPhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

      await axios.post(
        `${API_BASE_URL}/api/orders`,
        {
          items,
          subtotal,
          tax,
          paymentMethod: "Cash",
          customerName,
          customerPhone,
          store: "Main Store",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create billing.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Billing</h1>
          <p className="mt-1 text-base text-[#8B6F47]">Review recent billings and transactions.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOrders}
            className="rounded-2xl border border-[#e7d5c3] bg-white px-4 py-2.5 text-sm font-semibold text-[#3E2723] shadow-sm hover:bg-[#fffaf4]"
            disabled={creating}
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={addRandomBilling}
            className="rounded-2xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 hover:opacity-90 disabled:opacity-60"
            disabled={creating}
          >
            {creating ? "Creating…" : "Add Random Billing"}
          </button>
        </div>
      </section>

      <div className="rounded-2xl border border-[#e7d5c3] bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#e7d5c3] bg-[#fffaf4] p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-medium text-[#3E2723]">Recent Billings</h2>
          <div className="w-full sm:max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order ID, customer, phone, store…"
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
                <th className="p-4 font-semibold">Order</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Store</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7d5c3]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8B6F47]">
                    Loading billings…
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o._id} className="hover:bg-[#fff9f2] transition">
                    <td className="p-4 font-medium">{o.orderId || "—"}</td>
                    <td className="p-4">{o.customerName || "—"}</td>
                    <td className="p-4">{o.paymentMethod || "—"}</td>
                    <td className="p-4">{formatMoney(o.totalAmount)}</td>
                    <td className="p-4">{o.store || "—"}</td>
                    <td className="p-4">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                ))
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8B6F47]">
                    No billings found.
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
