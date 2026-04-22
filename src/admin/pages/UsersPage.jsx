import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { useAdminData } from "../context/useAdminData";

export default function UsersPage() {
  const { users, addUser, removeUser } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Cashier", status: "Active" });

  const onSubmit = (event) => {
    event.preventDefault();
    addUser(form);
    setForm({ name: "", email: "", role: "Cashier", status: "Active" });
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Users</h1>
          <p className="mt-1 text-base text-slate-300/85">Manage role-based users for the admin panel.</p>
        </div>
        <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white">
          <Plus size={16} />
          Add User
        </button>
      </section>

      <Card title="Users Table" subtitle="Add or remove users with dummy data">
        <DataTable
          rowKey="id"
          data={users}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.status === "Active" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"}`}>
                  {row.status}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (row) => (
                <button type="button" onClick={() => removeUser(row.id)} className="rounded-lg border border-rose-400/30 p-1.5 text-rose-300 hover:bg-rose-500/20">
                  <Trash2 size={14} />
                </button>
              ),
            },
          ]}
        />
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add User">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="grid gap-4">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Name</span>
                <input className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none focus:border-blue-400/70" placeholder="Enter full name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email</span>
                <input className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none focus:border-blue-400/70" placeholder="name@company.com" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Role</span>
                  <select className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none focus:border-blue-400/70" value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}>
                    <option className="bg-slate-900">Admin</option>
                    <option className="bg-slate-900">Manager</option>
                    <option className="bg-slate-900">Cashier</option>
                    <option className="bg-slate-900">Inventory</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Status</span>
                  <select className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none focus:border-blue-400/70" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
                    <option className="bg-slate-900">Active</option>
                    <option className="bg-slate-900">Inactive</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/[0.12]">Cancel</button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:brightness-110">Save User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
