import { useMemo, useState } from "react";
import { ImagePlus, PencilLine, Plus, Search, Trash2, X } from "lucide-react";
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
  barcode: "",
  status: "Active",
  imageUrl: "",
};

const MAX_IMAGE_SIZE_MB = 2;

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, loading, error } = useAdminData();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const filteredProducts = useMemo(() => {
    const lower = query.toLowerCase();
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.sku.toLowerCase().includes(lower) ||
        (item.barcode || "").toLowerCase().includes(lower),
    );
  }, [products, query]);

  const openForCreate = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm, category: categories[0]?.name || "General" });
    setImageError("");
    setSubmitError("");
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
      barcode: product.barcode || "",
      status: product.status,
      imageUrl: product.imageUrl || "",
    });
    setImageError("");
    setSubmitError("");
    setIsModalOpen(true);
  };

  const onImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setImageError(`Image is too large. Please keep it under ${MAX_IMAGE_SIZE_MB}MB.`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
        setImageError("");
      }
    };
    reader.onerror = () => {
      setImageError("Could not read this image file. Try another one.");
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setImageError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
      } else {
        await addProduct(form);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Could not save product.");
    }
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
        {error && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <label className="relative block max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6F47]" />
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#e7d5c3] bg-white pl-9 pr-3 text-sm text-[#3E2723] outline-none transition placeholder:text-[#8B6F47] focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15"
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
                  row.imageUrl ? (
                    <img src={row.imageUrl} alt={row.name} className="h-10 w-10 rounded-lg border border-[#e7d5c3] object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/40 to-violet-500/40 text-xs font-semibold grid place-content-center">
                      {row.name.slice(0, 2).toUpperCase()}
                    </div>
                  )
                ),
              },
              { key: "name", header: "Name" },
              { key: "category", header: "Category" },
              { key: "sku", header: "SKU" },
              { key: "barcode", header: "Barcode", render: (row) => row.barcode || "-" },
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
                    <button type="button" onClick={() => deleteProduct(row.id)} className="rounded-lg border border-rose-300 p-1.5 text-rose-600 hover:bg-rose-50" disabled={loading}>
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
        description="Manage your live catalog data."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {submitError && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p>}
          <div className="rounded-2xl border border-[#eadccf] bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Product Name</span>
                <input className={inputClass} placeholder="Enter product name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Category</span>
                <select className={inputClass} value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} required>
                  {categories.length === 0 && <option value="General">General</option>}
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
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Barcode</span>
                <input className={inputClass} placeholder="8901234567890" value={form.barcode} onChange={(e) => setForm((s) => ({ ...s, barcode: e.target.value }))} />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Status</span>
                <select className={inputClass} value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F47]">Product Image (Optional)</span>
                  {form.imageUrl && (
                    <button type="button" onClick={clearImage} className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50">
                      <X size={12} />
                      Remove
                    </button>
                  )}
                </div>
                <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#d9c4b3] bg-[#fff8ef] px-3 text-sm font-medium text-[#6F4E37] hover:bg-[#f9eddc]">
                  <ImagePlus size={16} />
                  Upload Image
                  <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
                </label>
                {imageError && <p className="text-xs font-medium text-rose-600">{imageError}</p>}
                {form.imageUrl && (
                  <div className="rounded-xl border border-[#e7d5c3] bg-white p-2">
                    <img src={form.imageUrl} alt="Preview" className="h-28 w-28 rounded-lg border border-[#e7d5c3] object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#efdfd0] pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-[#e7d5c3] bg-white px-4 py-2 text-sm font-medium text-[#6F4E37] hover:bg-[#f8eee3]">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Saving..." : editingProduct ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
