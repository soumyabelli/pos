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
        <h1 className="text-4xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-base text-slate-300/85">Configure store-level defaults for your POS system.</p>
      </section>

      <Card title="Store Settings" subtitle="Frontend-only demo form">
        <form onSubmit={submit} className="grid gap-4 md:max-w-xl">
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Store Name</span>
            <input className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none" value={form.storeName} onChange={(e) => setForm((s) => ({ ...s, storeName: e.target.value }))} />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Currency</span>
            <input className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none" value={form.currency} onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))} />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Tax Rate (%)</span>
            <input type="number" min="0" step="0.1" className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none" value={form.taxRate} onChange={(e) => setForm((s) => ({ ...s, taxRate: e.target.value }))} />
          </label>
          <div>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white">
              Save Settings
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
