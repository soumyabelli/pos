import { useMemo, useState } from "react";
import { PencilLine, Plus, Search, Trash2 } from "lucide-react";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { useAdminData } from "../context/useAdminData";

const inputClass =
  "h-11 w-full rounded-xl border border-[#e7d5c3] bg-white px-3 text-sm text-[#3E2723] outline-none transition placeholder:text-[#8B6F47] focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  threshold: "10",
  sku: "",
  status: "Active",
};

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredProducts = useMemo(() => {
    const lower = query.toLowerCase();
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.sku.toLowerCase().includes(lower),
    );
  }, [products, query]);

  const openForCreate = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm, category: categories[0]?.name || "" });
    setIsModalOpen(true);
  };

  const openForEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      threshold: String(product.threshold),
      sku: product.sku,
      status: product.status,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">Products</h1>
          <p className="mt-1 text-base text-[#8B6F47]">Manage catalog, pricing, and stock status.</p>
        </div>
        <button
          type="button"
          onClick={openForCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 transition hover:brightness-110"
        >
          <Plus size={16} />
          Add Product
        </button>
      </section>

      <Card>
        <label className="relative block max-w-md">
          {(!query || query.length === 0) && (
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6F47]" />
          )}
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`h-11 w-full rounded-xl border border-[#e7d5c3] bg-white pr-3 text-sm text-[#3E2723] outline-none transition placeholder:text-[#8B6F47] focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15 ${query ? 'pl-4' : 'pl-9'}`}
          />
        </label>
        <div className="mt-4">
          <DataTable
            rowKey="id"
            data={filteredProducts}
            columns={[
              {
                key: "image",
                header: "Image",
                render: (row) => (
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/40 to-violet-500/40 text-xs font-semibold grid place-content-center">
                    {row.name.slice(0, 2).toUpperCase()}
                  </div>
                ),
              },
              { key: "name", header: "Name" },
              { key: "category", header: "Category" },
              { key: "price", header: "Price", render: (row) => `Rs ${Number(row.price).toFixed(2)}` },
              { key: "stock", header: "Stock" },
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
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => openForEdit(row)} className="rounded-lg border border-[#e7d5c3] p-1.5 text-[#6F4E37] hover:bg-[#f8eee3]">
                      <PencilLine size={14} />
                    </button>
                    <button type="button" onClick={() => deleteProduct(row.id)} className="rounded-lg border border-rose-300 p-1.5 text-rose-600 hover:bg-rose-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
        description="Use dummy data to maintain the product catalog."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-2xl border border-[#eadccf] bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Product Name</span>
                <input className={inputClass} placeholder="Enter product name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Category</span>
                <select className={inputClass} value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} required>
                  {categories.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Price (Rs)</span>
                <input className={inputClass} placeholder="0.00" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} required />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Stock</span>
                <input className={inputClass} placeholder="0" type="number" min="0" value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} required />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Threshold</span>
                <input className={inputClass} placeholder="10" type="number" min="0" value={form.threshold} onChange={(e) => setForm((s) => ({ ...s, threshold: e.target.value }))} required />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">SKU</span>
                <input className={inputClass} placeholder="PRD-001" value={form.sku} onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))} required />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Status</span>
                <select className={inputClass} value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#efdfd0] pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-[#e7d5c3] bg-white px-4 py-2 text-sm font-medium text-[#6F4E37] hover:bg-[#f8eee3]">Cancel</button>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 hover:brightness-110">
              {editingProduct ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
