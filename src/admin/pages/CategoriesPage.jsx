import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { useAdminData } from "../context/useAdminData";

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const submit = (event) => {
    event.preventDefault();
    addCategory(form);
    setForm({ name: "", description: "" });
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Categories</h1>
          <p className="mt-1 text-base text-slate-300/85">Create and organize product categories.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Add Category
        </button>
      </section>

      <Card title="Category Table" subtitle="Current product groups">
        <DataTable
          rowKey="id"
          data={categories}
          columns={[
            { key: "name", header: "Name" },
            { key: "description", header: "Description" },
            {
              key: "actions",
              header: "Actions",
              render: (row) => (
                <button
                  type="button"
                  onClick={() => deleteCategory(row.id)}
                  className="rounded-lg border border-rose-400/30 p-1.5 text-rose-300 hover:bg-rose-500/20"
                >
                  <Trash2 size={14} />
                </button>
              ),
            },
          ]}
        />
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Category">
        <form onSubmit={submit} className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="grid gap-4">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Category Name</span>
                <input
                  className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none focus:border-blue-400/70"
                  placeholder="e.g. Beverages"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  required
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Description</span>
                <textarea
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400/70"
                  rows={4}
                  placeholder="Short category description..."
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  required
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/[0.12]">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:brightness-110">
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
