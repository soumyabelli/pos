import { useState } from "react";
import Card from "../components/Card";
import { useAdminData } from "../context/useAdminData";

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminData();
  const [form, setForm] = useState(settings);

  const submit = (event) => {
    event.preventDefault();
    updateSettings(form);
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Settings</h1>
        <p className="mt-1 text-base text-[#8B6F47]">Configure store-level defaults for your POS system.</p>
      </section>

      <Card title="Store Settings" subtitle="Frontend-only demo form">
        <form onSubmit={submit} className="grid gap-4 md:max-w-xl">
          <label className="space-y-1">
            <span className="text-sm text-[#8B6F47]">Store Name</span>
            <input className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15" value={form.storeName} onChange={(e) => setForm((s) => ({ ...s, storeName: e.target.value }))} />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-[#8B6F47]">Currency</span>
            <input className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15" value={form.currency} onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))} />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-[#8B6F47]">Tax Rate (%)</span>
            <input type="number" min="0" step="0.1" className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15" value={form.taxRate} onChange={(e) => setForm((s) => ({ ...s, taxRate: e.target.value }))} />
          </label>
          <div>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30">
              Save Settings
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
