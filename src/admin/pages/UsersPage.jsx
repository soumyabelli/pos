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
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Users</h1>
          <p className="mt-1 text-base text-[#8B6F47]">Manage role-based users for the admin panel.</p>
        </div>
        <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30">
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
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                  {row.status}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (row) => (
                <button type="button" onClick={() => removeUser(row.id)} className="rounded-lg border border-rose-300 p-1.5 text-rose-600 hover:bg-rose-50">
                  <Trash2 size={14} />
                </button>
              ),
            },
          ]}
        />
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add User">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-2xl border border-[#eadccf] bg-white p-4">
            <div className="grid gap-4">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Name</span>
                <input className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15" placeholder="Enter full name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Email</span>
                <input className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15" placeholder="name@company.com" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Role</span>
                  <select className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15" value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Cashier</option>
                    <option>Inventory</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Status</span>
                  <select className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#efdfd0] pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-[#e7d5c3] bg-white px-4 py-2 text-sm font-medium text-[#6F4E37] hover:bg-[#f8eee3]">Cancel</button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 hover:brightness-110">Save User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
