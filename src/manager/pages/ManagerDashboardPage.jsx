import { Users, ReceiptText, AlertTriangle, ShieldAlert } from "lucide-react";

export default function ManagerDashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-black text-[#3E2723]">Branch Overview</h1>
        <p className="mt-1 text-sm text-[#8B6F47]">Monitor today's active shift and staff performance.</p>
      </section>

      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today's Sales", value: "Rs 42,500", icon: ReceiptText, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Active Employees", value: "8 / 12", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Pending Approvals", value: "3", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Low Stock Alerts", value: "14 Items", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-100" },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-[#e7d5c3] bg-white p-5 shadow-sm">
            <div className={`grid h-12 w-12 shrink-0 place-content-center rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-[#3E2723]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Activity */}
        <div className="col-span-2 rounded-2xl border border-[#e7d5c3] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#3E2723]">Recent Transactions</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 font-semibold">Bill No.</th>
                  <th className="p-3 font-semibold">Cashier</th>
                  <th className="p-3 font-semibold">Time</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 text-slate-900 font-medium whitespace-nowrap">#INV-001</td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">Rahul (Cashier)</td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">10:42 AM</td>
                  <td className="p-3 text-slate-900 font-medium whitespace-nowrap">Rs 1,250</td>
                  <td className="p-3"><span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Paid</span></td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-900 font-medium whitespace-nowrap">#INV-002</td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">Sarah (Service)</td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">10:55 AM</td>
                  <td className="p-3 text-slate-900 font-medium whitespace-nowrap">Rs 840</td>
                  <td className="p-3"><span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Mini modules */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e7d5c3] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#3E2723]">Requires Approval</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div>
                  <p className="text-sm font-semibold text-amber-900">15% Discount on #INV-004</p>
                  <p className="text-xs text-amber-700">Requested by Cashier</p>
                </div>
                <button className="rounded bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700">Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}