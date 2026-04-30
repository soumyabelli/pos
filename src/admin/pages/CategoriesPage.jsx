import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { useAdminData } from "../context/useAdminData";

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory, loading, error } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitError, setSubmitError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    try {
      await addCategory(form);
      setForm({ name: "", description: "" });
      setIsOpen(false);
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Could not create category.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Categories</h1>
          <p className="mt-1 text-base text-[#8B6F47]">Create and organize product categories.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30"
        >
          <Plus size={16} />
          Add Category
        </button>
      </section>

      <Card title="Category Table" subtitle="Current product groups">
        {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
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
                  disabled={loading}
                  className="rounded-lg border border-rose-300 p-1.5 text-rose-600 hover:bg-rose-50"
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
          {submitError && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p>}
          <div className="rounded-2xl border border-[#eadccf] bg-white p-4">
            <div className="grid gap-4">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Category Name</span>
                <input
                  className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15"
                  placeholder="e.g. Beverages"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  required
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Description</span>
                <textarea
                  className="w-full rounded-xl border border-[#e7d5c3] bg-white px-3 py-2 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15"
                  rows={4}
                  placeholder="Short category description..."
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  required
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#efdfd0] pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-[#e7d5c3] bg-white px-4 py-2 text-sm font-medium text-[#6F4E37] hover:bg-[#f8eee3]">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
