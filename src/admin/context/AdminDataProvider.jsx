import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AdminDataContext } from "./adminDataContext";

const API_BASE = "http://localhost:5000/api";

function toNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function formatOrderDate(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function mapProduct(product) {
  return {
    id: product._id,
    name: product.product,
    category: product.category,
    price: toNumber(product.price),
    stock: toNumber(product.stock),
    threshold: toNumber(product.threshold, 10),
    sku: product.sku,
    description: product.description || "",
    status: product.isActive ? "Active" : "Inactive",
    imageUrl: typeof product.image === "string" && (product.image.startsWith("data:image") || product.image.startsWith("http"))
      ? product.image
      : "",
  };
}

function mapOrder(order) {
  return {
    id: order.orderId || order._id,
    customer: order.customerName || "Walk-in Customer",
    amount: toNumber(order.totalAmount),
    status: order.status || "Completed",
    date: formatOrderDate(order.createdAt),
  };
}

function mapRole(role) {
  if (role === "admin") return "Admin";
  if (role === "manager") return "Manager";
  return "Worker";
}

function mapUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: mapRole(user.role),
    status: user.isActive ? "Active" : "Inactive",
    store: user.store || "Main Store",
  };
}

function mapCategory(category) {
  return {
    id: category._id,
    name: category.name,
    description: category.description || "",
  };
}

function mapSettings(settings) {
  return {
    storeName: settings?.storeName || "Urban Crust Main Store",
    currency: settings?.currency || "Rs",
    taxRate: String(settings?.taxRate ?? "8.5"),
  };
}

function roleToApi(role) {
  if (!role) return "worker";
  const normalized = role.toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "manager") return "manager";
  return "worker";
}

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({
    storeName: "Urban Crust Main Store",
    currency: "Rs",
    taxRate: "8.5",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  const refreshAll = useCallback(async () => {
    if (!token) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [productsRes, categoriesRes, usersRes, ordersRes, settingsRes] = await Promise.all([
        axios.get(`${API_BASE}/products/admin/all`, { headers }),
        axios.get(`${API_BASE}/categories`, { headers }),
        axios.get(`${API_BASE}/users`, { headers }),
        axios.get(`${API_BASE}/orders`, { headers }),
        axios.get(`${API_BASE}/settings`, { headers }),
      ]);

      setProducts((productsRes.data || []).map(mapProduct));
      setCategories((categoriesRes.data || []).map(mapCategory));
      setUsers((usersRes.data || []).map(mapUser));
      setOrders((ordersRes.data || []).map(mapOrder));
      setSettings(mapSettings(settingsRes.data));
      return true;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load admin data.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [headers, token]);

  useEffect(() => {
    refreshAll().catch(() => {});
  }, [refreshAll]);

  const addProduct = async (payload) => {
    await axios.post(
      `${API_BASE}/products`,
      {
        product: payload.name,
        category: payload.category,
        price: toNumber(payload.price),
        stock: toNumber(payload.stock),
        threshold: toNumber(payload.threshold, 10),
        sku: payload.sku,
        status: payload.status,
        imageUrl: payload.imageUrl || "",
        description: payload.description || "",
      },
      { headers },
    );
    await refreshAll();
  };

  const updateProduct = async (productId, updates) => {
    await axios.put(
      `${API_BASE}/products/${productId}`,
      {
        product: updates.name,
        category: updates.category,
        price: toNumber(updates.price),
        stock: toNumber(updates.stock),
        threshold: toNumber(updates.threshold, 10),
        sku: updates.sku,
        status: updates.status,
        imageUrl: updates.imageUrl || "",
        description: updates.description || "",
      },
      { headers },
    );
    await refreshAll();
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`${API_BASE}/products/${productId}`, { headers });
    await refreshAll();
  };

  const addCategory = async (payload) => {
    await axios.post(
      `${API_BASE}/categories`,
      { name: payload.name, description: payload.description || "" },
      { headers },
    );
    await refreshAll();
  };

  const deleteCategory = async (categoryId) => {
    await axios.delete(`${API_BASE}/categories/${categoryId}`, { headers });
    await refreshAll();
  };

  const addUser = async (payload) => {
    await axios.post(
      `${API_BASE}/users`,
      {
        name: payload.name,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: roleToApi(payload.role),
        isActive: payload.status === "Active",
      },
      { headers },
    );
    await refreshAll();
  };

  const removeUser = async (userId) => {
    await axios.delete(`${API_BASE}/users/${userId}`, { headers });
    await refreshAll();
  };

  const updateSettings = async (nextSettings) => {
    const payload = {
      storeName: nextSettings.storeName,
      currency: nextSettings.currency,
      taxRate: toNumber(nextSettings.taxRate, 0),
    };
    const res = await axios.put(`${API_BASE}/settings`, payload, { headers });
    setSettings(mapSettings(res.data?.settings));
  };

  const value = useMemo(
    () => ({
      products,
      categories,
      users,
      settings,
      orders,
      loading,
      error,
      refreshAll,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      addUser,
      removeUser,
      updateSettings,
    }),
    [products, categories, users, settings, orders, loading, error, refreshAll],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}
