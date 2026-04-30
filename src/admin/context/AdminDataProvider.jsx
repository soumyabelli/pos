import { useMemo, useState } from "react";
import { AdminDataContext } from "./adminDataContext";
import { initialCategories, initialProducts, initialUsers, orders, salesOverview } from "../data/mockData";

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [users, setUsers] = useState(initialUsers);
  const [settings, setSettings] = useState({
    storeName: "NovaRetail Downtown",
    currency: "Rs",
    taxRate: "8.5",
  });

  const addProduct = (payload) => {
    const product = {
      ...payload,
      id: `prd-${Date.now()}`,
      price: Number(payload.price),
      stock: Number(payload.stock),
      threshold: Number(payload.threshold || 10),
      status: payload.status || "Active",
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              ...updates,
              price: Number(updates.price),
              stock: Number(updates.stock),
              threshold: Number(updates.threshold || item.threshold),
            }
          : item,
      ),
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  const addCategory = (payload) => {
    setCategories((prev) => [{ id: `cat-${Date.now()}`, ...payload }, ...prev]);
  };

  const deleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((item) => item.id !== categoryId));
  };

  const addUser = (payload) => {
    setUsers((prev) => [{ id: `usr-${Date.now()}`, ...payload }, ...prev]);
  };

  const removeUser = (userId) => {
    setUsers((prev) => prev.filter((item) => item.id !== userId));
  };

  const updateSettings = (nextSettings) => {
    setSettings(nextSettings);
  };

  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, item) => sum + item.amount, 0);
    const lowStockCount = products.filter((item) => item.stock <= 10).length;
    return [
      { label: "Total Orders", value: orders.length.toLocaleString(), footnote: "All channels", type: "orders" },
      { label: "Revenue", value: `Rs ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, footnote: "Current period", type: "revenue" },
      { label: "Total Products", value: products.length.toLocaleString(), footnote: "Active catalog", type: "products" },
      { label: "Low Stock Alerts", value: lowStockCount.toLocaleString(), footnote: "Needs action", type: "danger" },
    ];
  }, [products]);

  const value = useMemo(
    () => ({
      products,
      categories,
      users,
      settings,
      orders,
      salesOverview,
      dashboardStats,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      addUser,
      removeUser,
      updateSettings,
    }),
    [products, categories, users, settings, dashboardStats],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}
